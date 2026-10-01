package com.adbms.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class DistributedQueryService {

    @Autowired
    @Qualifier("northJdbcTemplate")
    private JdbcTemplate northJdbcTemplate;

    @Autowired
    @Qualifier("westJdbcTemplate")
    private JdbcTemplate westJdbcTemplate;

    @Autowired
    @Qualifier("southJdbcTemplate")
    private JdbcTemplate southJdbcTemplate;

    @Autowired
    @Qualifier("centralizedJdbcTemplate")
    private JdbcTemplate centralizedJdbcTemplate;

    // --- Distributed Queries ---

    public List<Map<String, Object>> getSuppliersFromAllRegions() {
        return executeDistributedQuery("SELECT * FROM supplier");
    }

    public List<Map<String, Object>> getInventoryFromAllRegions() {
        return executeDistributedQuery(
                "SELECT i.inventory_id, i.quantity, i.reorder_level, i.last_updated, " +
                "p.product_name, p.category, w.warehouse_name, w.region " +
                "FROM inventory i " +
                "JOIN product p ON i.product_id = p.product_id " +
                "JOIN warehouse w ON i.warehouse_id = w.warehouse_id"
        );
    }

    public List<Map<String, Object>> getOrdersFromAllRegions() {
        return executeDistributedQuery(
                "SELECT o.order_id, o.order_date, o.status, o.total_amount, " +
                "s.supplier_name, w.warehouse_name, w.region " +
                "FROM orders o " +
                "JOIN supplier s ON o.supplier_id = s.supplier_id " +
                "JOIN warehouse w ON o.warehouse_id = w.warehouse_id"
        );
    }

    public List<Map<String, Object>> getProducts() {
        return executeDistributedQuery("SELECT * FROM product"); // Products should be aggregated or queried from one if fully replicated. In init.sql, products are identical across DBs, but to be safe, querying centralized or one node is fine. Wait, let's just query centralized for products as they are replicated.
    }

    // --- CRUD Operations for Supplier ---

    private JdbcTemplate getJdbcTemplateForRegion(String region) {
        if (region == null) return centralizedJdbcTemplate;
        switch (region.toLowerCase()) {
            case "north": return northJdbcTemplate;
            case "west": return westJdbcTemplate;
            case "south": return southJdbcTemplate;
            default: return centralizedJdbcTemplate;
        }
    }

    public Map<String, Object> createSupplier(Map<String, Object> supplier) {
        String region = (String) supplier.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        // Get next ID from centralized
        Integer maxId = centralizedJdbcTemplate.queryForObject("SELECT MAX(supplier_id) FROM supplier", Integer.class);
        int newId = (maxId != null ? maxId : 0) + 1;

        String sql = "INSERT INTO supplier (supplier_id, supplier_name, location, contact, email, rating, region) VALUES (?, ?, ?, ?, ?, ?, ?)";
        Object[] params = new Object[]{
                newId, supplier.get("supplier_name"), supplier.get("location"),
                supplier.get("contact"), supplier.get("email"), supplier.get("rating"), region
        };

        // Insert into Centralized
        centralizedJdbcTemplate.update(sql, params);
        
        // Insert into Regional
        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(sql, params);
        }

        supplier.put("supplier_id", newId);
        return supplier;
    }

    public Map<String, Object> updateSupplier(int id, Map<String, Object> supplier) {
        // First find existing region to know where to update/delete if region changed
        Map<String, Object> existing = centralizedJdbcTemplate.queryForMap("SELECT * FROM supplier WHERE supplier_id = ?", id);
        String oldRegion = (String) existing.get("region");
        String newRegion = (String) supplier.get("region");

        String sql = "UPDATE supplier SET supplier_name = ?, location = ?, contact = ?, email = ?, rating = ?, region = ? WHERE supplier_id = ?";
        Object[] params = new Object[]{
                supplier.get("supplier_name"), supplier.get("location"),
                supplier.get("contact"), supplier.get("email"), supplier.get("rating"), newRegion, id
        };

        centralizedJdbcTemplate.update(sql, params);

        JdbcTemplate oldRegionalTemplate = getJdbcTemplateForRegion(oldRegion);
        JdbcTemplate newRegionalTemplate = getJdbcTemplateForRegion(newRegion);

        if (oldRegion.equalsIgnoreCase(newRegion)) {
            if (oldRegionalTemplate != centralizedJdbcTemplate) {
                oldRegionalTemplate.update(sql, params);
            }
        } else {
            if (oldRegionalTemplate != centralizedJdbcTemplate) {
                oldRegionalTemplate.update("DELETE FROM supplier WHERE supplier_id = ?", id);
            }
            if (newRegionalTemplate != centralizedJdbcTemplate) {
                newRegionalTemplate.update("INSERT INTO supplier (supplier_id, supplier_name, location, contact, email, rating, region) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        id, supplier.get("supplier_name"), supplier.get("location"), supplier.get("contact"), supplier.get("email"), supplier.get("rating"), newRegion);
            }
        }
        
        supplier.put("supplier_id", id);
        return supplier;
    }

    public void deleteSupplier(int id) {
        Map<String, Object> existing = centralizedJdbcTemplate.queryForMap("SELECT * FROM supplier WHERE supplier_id = ?", id);
        String region = (String) existing.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        String sql = "DELETE FROM supplier WHERE supplier_id = ?";
        centralizedJdbcTemplate.update(sql, id);
        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(sql, id);
        }
    }

    // --- CRUD Operations for Product ---
    // Products are fully replicated to all nodes

    public Map<String, Object> createProduct(Map<String, Object> product) {
        Integer maxId = centralizedJdbcTemplate.queryForObject("SELECT MAX(product_id) FROM product", Integer.class);
        int newId = (maxId != null ? maxId : 0) + 1;

        String sql = "INSERT INTO product (product_id, product_name, category, price, description) VALUES (?, ?, ?, ?, ?)";
        Object[] params = new Object[]{
                newId, product.get("product_name"), product.get("category"), product.get("price"), product.get("description")
        };

        centralizedJdbcTemplate.update(sql, params);
        northJdbcTemplate.update(sql, params);
        westJdbcTemplate.update(sql, params);
        southJdbcTemplate.update(sql, params);

        product.put("product_id", newId);
        return product;
    }

    public Map<String, Object> updateProduct(int id, Map<String, Object> product) {
        String sql = "UPDATE product SET product_name = ?, category = ?, price = ?, description = ? WHERE product_id = ?";
        Object[] params = new Object[]{
                product.get("product_name"), product.get("category"), product.get("price"), product.get("description"), id
        };

        centralizedJdbcTemplate.update(sql, params);
        northJdbcTemplate.update(sql, params);
        westJdbcTemplate.update(sql, params);
        southJdbcTemplate.update(sql, params);

        product.put("product_id", id);
        return product;
    }

    public void deleteProduct(int id) {
        String sql = "DELETE FROM product WHERE product_id = ?";
        centralizedJdbcTemplate.update(sql, id);
        northJdbcTemplate.update(sql, id);
        westJdbcTemplate.update(sql, id);
        southJdbcTemplate.update(sql, id);
    }

    public List<Map<String, Object>> getWarehousesFromAllRegions() {
        return executeDistributedQuery("SELECT * FROM warehouse");
    }

    // --- CRUD Operations for Warehouse ---
    
    public Map<String, Object> createWarehouse(Map<String, Object> warehouse) {
        String region = (String) warehouse.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        Integer maxId = centralizedJdbcTemplate.queryForObject("SELECT MAX(warehouse_id) FROM warehouse", Integer.class);
        int newId = (maxId != null ? maxId : 0) + 1;

        String sql = "INSERT INTO warehouse (warehouse_id, warehouse_name, location, capacity, region) VALUES (?, ?, ?, ?, ?)";
        Object[] params = new Object[]{
                newId, warehouse.get("warehouse_name"), warehouse.get("location"), warehouse.get("capacity"), region
        };

        centralizedJdbcTemplate.update(sql, params);
        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(sql, params);
        }

        warehouse.put("warehouse_id", newId);
        return warehouse;
    }

    public Map<String, Object> updateWarehouse(int id, Map<String, Object> warehouse) {
        Map<String, Object> existing = centralizedJdbcTemplate.queryForMap("SELECT * FROM warehouse WHERE warehouse_id = ?", id);
        String oldRegion = (String) existing.get("region");
        String newRegion = (String) warehouse.get("region");

        String sql = "UPDATE warehouse SET warehouse_name = ?, location = ?, capacity = ?, region = ? WHERE warehouse_id = ?";
        Object[] params = new Object[]{
                warehouse.get("warehouse_name"), warehouse.get("location"), warehouse.get("capacity"), newRegion, id
        };

        centralizedJdbcTemplate.update(sql, params);

        JdbcTemplate oldRegionalTemplate = getJdbcTemplateForRegion(oldRegion);
        JdbcTemplate newRegionalTemplate = getJdbcTemplateForRegion(newRegion);

        if (oldRegion.equalsIgnoreCase(newRegion)) {
            if (oldRegionalTemplate != centralizedJdbcTemplate) {
                oldRegionalTemplate.update(sql, params);
            }
        } else {
            if (oldRegionalTemplate != centralizedJdbcTemplate) {
                oldRegionalTemplate.update("DELETE FROM warehouse WHERE warehouse_id = ?", id);
            }
            if (newRegionalTemplate != centralizedJdbcTemplate) {
                newRegionalTemplate.update("INSERT INTO warehouse (warehouse_id, warehouse_name, location, capacity, region) VALUES (?, ?, ?, ?, ?)",
                        id, warehouse.get("warehouse_name"), warehouse.get("location"), warehouse.get("capacity"), newRegion);
            }
        }
        
        warehouse.put("warehouse_id", id);
        return warehouse;
    }

    public void deleteWarehouse(int id) {
        Map<String, Object> existing = centralizedJdbcTemplate.queryForMap("SELECT * FROM warehouse WHERE warehouse_id = ?", id);
        String region = (String) existing.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        String sql = "DELETE FROM warehouse WHERE warehouse_id = ?";
        centralizedJdbcTemplate.update(sql, id);
        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(sql, id);
        }
    }

    public List<Map<String, Object>> getShipmentsFromAllRegions() {
        return executeDistributedQuery(
                "SELECT s.shipment_id, s.order_id, s.shipment_date, s.expected_delivery, s.actual_delivery, s.status, " +
                "o.total_amount, sup.supplier_name, w.warehouse_name, w.region " +
                "FROM shipment s " +
                "JOIN orders o ON s.order_id = o.order_id " +
                "JOIN warehouse w ON o.warehouse_id = w.warehouse_id " +
                "JOIN supplier sup ON o.supplier_id = sup.supplier_id"
        );
    }

    public List<Map<String, Object>> getInventoryByRegion() {
        return executeDistributedQuery(
                "SELECT w.region, SUM(i.quantity) as total_inventory " +
                "FROM inventory i JOIN warehouse w ON i.warehouse_id = w.warehouse_id " +
                "GROUP BY w.region"
        );
    }

    // --- CRUD Operations for Inventory ---
    
    public Map<String, Object> createInventory(Map<String, Object> inventory) {
        Integer warehouseId = (Integer) inventory.get("warehouse_id");
        Map<String, Object> warehouse = centralizedJdbcTemplate.queryForMap("SELECT region FROM warehouse WHERE warehouse_id = ?", warehouseId);
        String region = (String) warehouse.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        Integer maxId = centralizedJdbcTemplate.queryForObject("SELECT MAX(inventory_id) FROM inventory", Integer.class);
        int newId = (maxId != null ? maxId : 0) + 1;

        String sql = "INSERT INTO inventory (inventory_id, warehouse_id, product_id, quantity, reorder_level, last_updated) VALUES (?, ?, ?, ?, ?, ?)";
        Object[] params = new Object[]{
                newId, warehouseId, inventory.get("product_id"), inventory.get("quantity"), inventory.get("reorder_level"), inventory.get("last_updated")
        };

        centralizedJdbcTemplate.update(sql, params);
        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(sql, params);
        }

        inventory.put("inventory_id", newId);
        return inventory;
    }

    public Map<String, Object> updateInventory(int id, Map<String, Object> inventory) {
        // Need to check if warehouse_id changed
        Map<String, Object> existing = centralizedJdbcTemplate.queryForMap("SELECT i.*, w.region FROM inventory i JOIN warehouse w ON i.warehouse_id = w.warehouse_id WHERE i.inventory_id = ?", id);
        String oldRegion = (String) existing.get("region");
        
        Integer newWarehouseId = (Integer) inventory.get("warehouse_id");
        Map<String, Object> newWarehouse = centralizedJdbcTemplate.queryForMap("SELECT region FROM warehouse WHERE warehouse_id = ?", newWarehouseId);
        String newRegion = (String) newWarehouse.get("region");

        String sql = "UPDATE inventory SET warehouse_id = ?, product_id = ?, quantity = ?, reorder_level = ?, last_updated = ? WHERE inventory_id = ?";
        Object[] params = new Object[]{
                newWarehouseId, inventory.get("product_id"), inventory.get("quantity"), inventory.get("reorder_level"), inventory.get("last_updated"), id
        };

        centralizedJdbcTemplate.update(sql, params);

        JdbcTemplate oldRegionalTemplate = getJdbcTemplateForRegion(oldRegion);
        JdbcTemplate newRegionalTemplate = getJdbcTemplateForRegion(newRegion);

        if (oldRegion.equalsIgnoreCase(newRegion)) {
            if (oldRegionalTemplate != centralizedJdbcTemplate) {
                oldRegionalTemplate.update(sql, params);
            }
        } else {
            if (oldRegionalTemplate != centralizedJdbcTemplate) {
                oldRegionalTemplate.update("DELETE FROM inventory WHERE inventory_id = ?", id);
            }
            if (newRegionalTemplate != centralizedJdbcTemplate) {
                newRegionalTemplate.update("INSERT INTO inventory (inventory_id, warehouse_id, product_id, quantity, reorder_level, last_updated) VALUES (?, ?, ?, ?, ?, ?)",
                        id, newWarehouseId, inventory.get("product_id"), inventory.get("quantity"), inventory.get("reorder_level"), inventory.get("last_updated"));
            }
        }
        
        inventory.put("inventory_id", id);
        return inventory;
    }

    public void deleteInventory(int id) {
        Map<String, Object> existing = centralizedJdbcTemplate.queryForMap("SELECT i.*, w.region FROM inventory i JOIN warehouse w ON i.warehouse_id = w.warehouse_id WHERE i.inventory_id = ?", id);
        String region = (String) existing.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        String sql = "DELETE FROM inventory WHERE inventory_id = ?";
        centralizedJdbcTemplate.update(sql, id);
        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(sql, id);
        }
    }

    public List<Map<String, Object>> getOrdersByRegion() {
        return executeDistributedQuery(
                "SELECT w.region, COUNT(o.order_id) as total_orders " +
                "FROM orders o JOIN warehouse w ON o.warehouse_id = w.warehouse_id " +
                "GROUP BY w.region"
        );
    }

    // --- CRUD Operations for Orders & Shipments ---

    public Map<String, Object> createOrder(Map<String, Object> orderData) {
        Integer warehouseId = (Integer) orderData.get("warehouse_id");
        Map<String, Object> warehouse = centralizedJdbcTemplate.queryForMap("SELECT region FROM warehouse WHERE warehouse_id = ?", warehouseId);
        String region = (String) warehouse.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        Integer maxOrderId = centralizedJdbcTemplate.queryForObject("SELECT MAX(order_id) FROM orders", Integer.class);
        int newOrderId = (maxOrderId != null ? maxOrderId : 0) + 1;

        String sqlOrder = "INSERT INTO orders (order_id, supplier_id, warehouse_id, order_date, status, total_amount) VALUES (?, ?, ?, ?, ?, ?)";
        Object[] paramsOrder = new Object[]{
                newOrderId, orderData.get("supplier_id"), warehouseId, orderData.get("order_date"), orderData.get("status"), orderData.get("total_amount")
        };

        centralizedJdbcTemplate.update(sqlOrder, paramsOrder);
        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(sqlOrder, paramsOrder);
        }

        // Handle order items
        if (orderData.containsKey("items")) {
            List<Map<String, Object>> items = (List<Map<String, Object>>) orderData.get("items");
            for (Map<String, Object> item : items) {
                Integer maxOrderItemId = centralizedJdbcTemplate.queryForObject("SELECT MAX(order_item_id) FROM order_item", Integer.class);
                int newOrderItemId = (maxOrderItemId != null ? maxOrderItemId : 0) + 1;

                String sqlItem = "INSERT INTO order_item (order_item_id, order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)";
                Object[] paramsItem = new Object[]{
                        newOrderItemId, newOrderId, item.get("product_id"), item.get("quantity"), item.get("unit_price")
                };

                centralizedJdbcTemplate.update(sqlItem, paramsItem);
                if (regionalTemplate != centralizedJdbcTemplate) {
                    regionalTemplate.update(sqlItem, paramsItem);
                }
            }
        }

        orderData.put("order_id", newOrderId);
        return orderData;
    }

    public Map<String, Object> updateOrderStatus(int id, Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        
        Map<String, Object> existingOrder = centralizedJdbcTemplate.queryForMap("SELECT o.*, w.region FROM orders o JOIN warehouse w ON o.warehouse_id = w.warehouse_id WHERE o.order_id = ?", id);
        String region = (String) existingOrder.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        String sql = "UPDATE orders SET status = ? WHERE order_id = ?";
        centralizedJdbcTemplate.update(sql, newStatus, id);
        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(sql, newStatus, id);
        }

        existingOrder.put("status", newStatus);
        return existingOrder;
    }

    public void deleteOrder(int id) {
        Map<String, Object> existingOrder = centralizedJdbcTemplate.queryForMap("SELECT o.*, w.region FROM orders o JOIN warehouse w ON o.warehouse_id = w.warehouse_id WHERE o.order_id = ?", id);
        String region = (String) existingOrder.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        // Delete dependencies first (shipments, order items)
        String delShip = "DELETE FROM shipment WHERE order_id = ?";
        String delItems = "DELETE FROM order_item WHERE order_id = ?";
        String delOrder = "DELETE FROM orders WHERE order_id = ?";

        centralizedJdbcTemplate.update(delShip, id);
        centralizedJdbcTemplate.update(delItems, id);
        centralizedJdbcTemplate.update(delOrder, id);

        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(delShip, id);
            regionalTemplate.update(delItems, id);
            regionalTemplate.update(delOrder, id);
        }
    }

    public Map<String, Object> createShipment(Map<String, Object> shipment) {
        Integer orderId = (Integer) shipment.get("order_id");
        Map<String, Object> existingOrder = centralizedJdbcTemplate.queryForMap("SELECT o.*, w.region FROM orders o JOIN warehouse w ON o.warehouse_id = w.warehouse_id WHERE o.order_id = ?", orderId);
        String region = (String) existingOrder.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        Integer maxId = centralizedJdbcTemplate.queryForObject("SELECT MAX(shipment_id) FROM shipment", Integer.class);
        int newId = (maxId != null ? maxId : 0) + 1;

        String sql = "INSERT INTO shipment (shipment_id, order_id, source, destination, shipment_date, expected_delivery, actual_delivery, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        Object[] params = new Object[]{
                newId, orderId, shipment.get("source"), shipment.get("destination"), shipment.get("shipment_date"), 
                shipment.get("expected_delivery"), shipment.get("actual_delivery"), shipment.get("status")
        };

        centralizedJdbcTemplate.update(sql, params);
        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(sql, params);
        }

        shipment.put("shipment_id", newId);
        return shipment;
    }

    public Map<String, Object> updateShipment(int id, Map<String, Object> shipment) {
        Map<String, Object> existingShipment = centralizedJdbcTemplate.queryForMap(
                "SELECT s.*, w.region FROM shipment s JOIN orders o ON s.order_id = o.order_id JOIN warehouse w ON o.warehouse_id = w.warehouse_id WHERE s.shipment_id = ?", id);
        String region = (String) existingShipment.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        String sql = "UPDATE shipment SET source = ?, destination = ?, shipment_date = ?, expected_delivery = ?, actual_delivery = ?, status = ? WHERE shipment_id = ?";
        Object[] params = new Object[]{
                shipment.get("source"), shipment.get("destination"), shipment.get("shipment_date"), 
                shipment.get("expected_delivery"), shipment.get("actual_delivery"), shipment.get("status"), id
        };

        centralizedJdbcTemplate.update(sql, params);
        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(sql, params);
        }

        shipment.put("shipment_id", id);
        return shipment;
    }

    public void deleteShipment(int id) {
        Map<String, Object> existingShipment = centralizedJdbcTemplate.queryForMap(
                "SELECT s.*, w.region FROM shipment s JOIN orders o ON s.order_id = o.order_id JOIN warehouse w ON o.warehouse_id = w.warehouse_id WHERE s.shipment_id = ?", id);
        String region = (String) existingShipment.get("region");
        JdbcTemplate regionalTemplate = getJdbcTemplateForRegion(region);

        String sql = "DELETE FROM shipment WHERE shipment_id = ?";
        centralizedJdbcTemplate.update(sql, id);
        if (regionalTemplate != centralizedJdbcTemplate) {
            regionalTemplate.update(sql, id);
        }
    }

    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("backend", "Online");
        
        try {
            northJdbcTemplate.queryForObject("SELECT 1", Integer.class);
            health.put("north_db", "Online");
        } catch (Exception e) {
            health.put("north_db", "Offline");
        }
        
        try {
            westJdbcTemplate.queryForObject("SELECT 1", Integer.class);
            health.put("west_db", "Online");
        } catch (Exception e) {
            health.put("west_db", "Offline");
        }
        
        try {
            southJdbcTemplate.queryForObject("SELECT 1", Integer.class);
            health.put("south_db", "Online");
        } catch (Exception e) {
            health.put("south_db", "Offline");
        }
        
        try {
            centralizedJdbcTemplate.queryForObject("SELECT 1", Integer.class);
            health.put("central_db", "Online");
        } catch (Exception e) {
            health.put("central_db", "Offline");
        }
        
        return health;
    }

    // --- Aggregation logic ---
    
    public List<Map<String, Object>> executeDistributedQuery(String sql) {
        // Simulate distributed query by querying all sites and aggregating
        long startTime = System.currentTimeMillis();
        
        CompletableFuture<List<Map<String, Object>>> northFuture = CompletableFuture.supplyAsync(() -> northJdbcTemplate.queryForList(sql));
        CompletableFuture<List<Map<String, Object>>> westFuture = CompletableFuture.supplyAsync(() -> westJdbcTemplate.queryForList(sql));
        CompletableFuture<List<Map<String, Object>>> southFuture = CompletableFuture.supplyAsync(() -> southJdbcTemplate.queryForList(sql));
        
        List<Map<String, Object>> allResults = new ArrayList<>();
        
        try {
            CompletableFuture.allOf(northFuture, westFuture, southFuture).join();
            
            List<Map<String, Object>> northRes = northFuture.get();
            northRes.forEach(row -> row.put("_source_node", "North DB"));
            
            List<Map<String, Object>> westRes = westFuture.get();
            westRes.forEach(row -> row.put("_source_node", "West DB"));
            
            List<Map<String, Object>> southRes = southFuture.get();
            southRes.forEach(row -> row.put("_source_node", "South DB"));
            
            allResults.addAll(northRes);
            allResults.addAll(westRes);
            allResults.addAll(southRes);
            
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Distributed query failed", e);
        }
        
        return allResults;
    }

    // --- Centralized Queries ---

    public List<Map<String, Object>> getSuppliersCentralized() {
        return centralizedJdbcTemplate.queryForList("SELECT * FROM supplier");
    }

    public List<Map<String, Object>> getInventoryCentralized() {
        return centralizedJdbcTemplate.queryForList(
                "SELECT i.inventory_id, i.quantity, i.reorder_level, i.last_updated, " +
                "p.product_name, p.category, w.warehouse_name, w.region " +
                "FROM inventory i " +
                "JOIN product p ON i.product_id = p.product_id " +
                "JOIN warehouse w ON i.warehouse_id = w.warehouse_id"
        );
    }
    
    public List<Map<String, Object>> getOrdersCentralized() {
        return centralizedJdbcTemplate.queryForList(
                "SELECT o.order_id, o.order_date, o.status, o.total_amount, " +
                "s.supplier_name, w.warehouse_name, w.region " +
                "FROM orders o " +
                "JOIN supplier s ON o.supplier_id = s.supplier_id " +
                "JOIN warehouse w ON o.warehouse_id = w.warehouse_id"
        );
    }

    // --- Performance Comparison Metrics ---

    public Map<String, Object> comparePerformance() {
        String sql = "SELECT COUNT(*) FROM orders o JOIN order_item oi ON o.order_id = oi.order_id JOIN product p ON oi.product_id = p.product_id";
        
        // Centralized
        long startCentral = System.currentTimeMillis();
        centralizedJdbcTemplate.queryForList(sql);
        long endCentral = System.currentTimeMillis();
        
        // Distributed
        long startDist = System.currentTimeMillis();
        CompletableFuture<List<Map<String, Object>>> n = CompletableFuture.supplyAsync(() -> northJdbcTemplate.queryForList(sql));
        CompletableFuture<List<Map<String, Object>>> w = CompletableFuture.supplyAsync(() -> westJdbcTemplate.queryForList(sql));
        CompletableFuture<List<Map<String, Object>>> s = CompletableFuture.supplyAsync(() -> southJdbcTemplate.queryForList(sql));
        CompletableFuture.allOf(n, w, s).join();
        long endDist = System.currentTimeMillis();
        
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("centralized_time_ms", (endCentral - startCentral));
        metrics.put("distributed_time_ms", (endDist - startDist));
        return metrics;
    }
    
    // --- Fragmentation Specific Examples ---
    
    public Map<String, Object> getPrimaryHorizontalFragmentation() {
        Map<String, Object> fragments = new HashMap<>();
        fragments.put("North_Fragment", northJdbcTemplate.queryForList("SELECT * FROM supplier WHERE region = 'North'"));
        fragments.put("West_Fragment", westJdbcTemplate.queryForList("SELECT * FROM supplier WHERE region = 'West'"));
        fragments.put("South_Fragment", southJdbcTemplate.queryForList("SELECT * FROM supplier WHERE region = 'South'"));
        return fragments;
    }

    public Map<String, Object> getDerivedHorizontalFragmentation() {
        // Warehouse is horizontally fragmented. Inventory is derived from Warehouse.
        Map<String, Object> fragments = new HashMap<>();
        
        String sql = "SELECT i.* FROM inventory i JOIN warehouse w ON i.warehouse_id = w.warehouse_id WHERE w.region = ?";
        fragments.put("Inventory_North_Derived", northJdbcTemplate.queryForList(sql, "North"));
        fragments.put("Inventory_West_Derived", westJdbcTemplate.queryForList(sql, "West"));
        fragments.put("Inventory_South_Derived", southJdbcTemplate.queryForList(sql, "South"));
        return fragments;
    }
    
    public Map<String, Object> getVerticalFragmentation() {
        // Supplier split into SUPPLIER_CORE and SUPPLIER_CONTACT
        // Since we didn't actually split the physical tables for simplicity, we simulate it in the query
        Map<String, Object> vf = new HashMap<>();
        
        vf.put("SUPPLIER_CORE", northJdbcTemplate.queryForList("SELECT supplier_id, supplier_name, region FROM supplier LIMIT 5"));
        vf.put("SUPPLIER_CONTACT", northJdbcTemplate.queryForList("SELECT supplier_id, contact, email FROM supplier LIMIT 5"));
        
        return vf;
    }
    // --- Explorer Features ---
    public List<String> getTablesForRegion(String region) {
        JdbcTemplate template = getJdbcTemplateForRegion(region);
        return template.queryForList("SHOW TABLES", String.class);
    }

    public List<Map<String, Object>> getTableDataForRegion(String region, String tableName) {
        // Basic protection against SQL injection for table name
        if (!tableName.matches("^[a-zA-Z0-9_]+$")) {
            throw new IllegalArgumentException("Invalid table name");
        }
        JdbcTemplate template = getJdbcTemplateForRegion(region);
        return template.queryForList("SELECT * FROM " + tableName + " LIMIT 50");
    }

    // --- Region-Specific Queries ---
    public List<Map<String, Object>> getSuppliersForRegion(String region) {
        return getJdbcTemplateForRegion(region).queryForList("SELECT * FROM supplier");
    }
    
    public List<Map<String, Object>> getWarehousesForRegion(String region) {
        return getJdbcTemplateForRegion(region).queryForList("SELECT * FROM warehouse");
    }
    
    public List<Map<String, Object>> getInventoryForRegion(String region) {
        return getJdbcTemplateForRegion(region).queryForList(
            "SELECT i.inventory_id, i.quantity, i.reorder_level, i.last_updated, " +
            "p.product_name, p.category, w.warehouse_name, w.region " +
            "FROM inventory i " +
            "JOIN product p ON i.product_id = p.product_id " +
            "JOIN warehouse w ON i.warehouse_id = w.warehouse_id"
        );
    }
    
    public List<Map<String, Object>> getOrdersForRegion(String region) {
        return getJdbcTemplateForRegion(region).queryForList(
            "SELECT o.order_id, o.order_date, o.status, o.total_amount, " +
            "s.supplier_name, w.warehouse_name, w.region " +
            "FROM orders o " +
            "JOIN supplier s ON o.supplier_id = s.supplier_id " +
            "JOIN warehouse w ON o.warehouse_id = w.warehouse_id"
        );
    }
    
    public List<Map<String, Object>> getShipmentsForRegion(String region) {
        return getJdbcTemplateForRegion(region).queryForList(
            "SELECT s.shipment_id, s.order_id, s.shipment_date, s.expected_delivery, s.actual_delivery, s.status, " +
            "o.total_amount, sup.supplier_name, w.warehouse_name, w.region " +
            "FROM shipment s " +
            "JOIN orders o ON s.order_id = o.order_id " +
            "JOIN warehouse w ON o.warehouse_id = w.warehouse_id " +
            "JOIN supplier sup ON o.supplier_id = sup.supplier_id"
        );
    }
}
