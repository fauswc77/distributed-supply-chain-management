package com.adbms.backend.controller;

import com.adbms.backend.service.DistributedQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/distributed")
public class DistributedController {

    @Autowired
    private DistributedQueryService distributedQueryService;

    @GetMapping("/suppliers")
    public ResponseEntity<List<Map<String, Object>>> getSuppliers() {
        return ResponseEntity.ok(distributedQueryService.getSuppliersFromAllRegions());
    }

    @PostMapping("/suppliers")
    public ResponseEntity<Map<String, Object>> createSupplier(@RequestBody Map<String, Object> supplier) {
        return ResponseEntity.ok(distributedQueryService.createSupplier(supplier));
    }

    @PutMapping("/suppliers/{id}")
    public ResponseEntity<Map<String, Object>> updateSupplier(@PathVariable int id, @RequestBody Map<String, Object> supplier) {
        return ResponseEntity.ok(distributedQueryService.updateSupplier(id, supplier));
    }

    @DeleteMapping("/suppliers/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable int id) {
        distributedQueryService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/products")
    public ResponseEntity<List<Map<String, Object>>> getProducts() {
        return ResponseEntity.ok(distributedQueryService.getProducts());
    }

    @PostMapping("/products")
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody Map<String, Object> product) {
        return ResponseEntity.ok(distributedQueryService.createProduct(product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable int id, @RequestBody Map<String, Object> product) {
        return ResponseEntity.ok(distributedQueryService.updateProduct(id, product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
        distributedQueryService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/warehouses")
    public ResponseEntity<List<Map<String, Object>>> getWarehouses() {
        return ResponseEntity.ok(distributedQueryService.getWarehousesFromAllRegions());
    }

    @PostMapping("/warehouses")
    public ResponseEntity<Map<String, Object>> createWarehouse(@RequestBody Map<String, Object> warehouse) {
        return ResponseEntity.ok(distributedQueryService.createWarehouse(warehouse));
    }

    @PutMapping("/warehouses/{id}")
    public ResponseEntity<Map<String, Object>> updateWarehouse(@PathVariable int id, @RequestBody Map<String, Object> warehouse) {
        return ResponseEntity.ok(distributedQueryService.updateWarehouse(id, warehouse));
    }

    @DeleteMapping("/warehouses/{id}")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable int id) {
        distributedQueryService.deleteWarehouse(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/inventory")
    public ResponseEntity<List<Map<String, Object>>> getInventory() {
        return ResponseEntity.ok(distributedQueryService.getInventoryFromAllRegions());
    }

    @PostMapping("/inventory")
    public ResponseEntity<Map<String, Object>> createInventory(@RequestBody Map<String, Object> inventory) {
        return ResponseEntity.ok(distributedQueryService.createInventory(inventory));
    }

    @PutMapping("/inventory/{id}")
    public ResponseEntity<Map<String, Object>> updateInventory(@PathVariable int id, @RequestBody Map<String, Object> inventory) {
        return ResponseEntity.ok(distributedQueryService.updateInventory(id, inventory));
    }

    @DeleteMapping("/inventory/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable int id) {
        distributedQueryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/inventory/aggregate")
    public ResponseEntity<List<Map<String, Object>>> getInventoryByRegion() {
        return ResponseEntity.ok(distributedQueryService.getInventoryByRegion());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Map<String, Object>>> getOrders() {
        return ResponseEntity.ok(distributedQueryService.getOrdersFromAllRegions());
    }

    @PostMapping("/orders")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> order) {
        return ResponseEntity.ok(distributedQueryService.createOrder(order));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(@PathVariable int id, @RequestBody Map<String, String> status) {
        return ResponseEntity.ok(distributedQueryService.updateOrderStatus(id, status));
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable int id) {
        distributedQueryService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/orders/aggregate")
    public ResponseEntity<List<Map<String, Object>>> getOrdersByRegion() {
        return ResponseEntity.ok(distributedQueryService.getOrdersByRegion());
    }

    @GetMapping("/shipments")
    public ResponseEntity<List<Map<String, Object>>> getShipments() {
        return ResponseEntity.ok(distributedQueryService.getShipmentsFromAllRegions());
    }

    @PostMapping("/shipments")
    public ResponseEntity<Map<String, Object>> createShipment(@RequestBody Map<String, Object> shipment) {
        return ResponseEntity.ok(distributedQueryService.createShipment(shipment));
    }

    @PutMapping("/shipments/{id}")
    public ResponseEntity<Map<String, Object>> updateShipment(@PathVariable int id, @RequestBody Map<String, Object> shipment) {
        return ResponseEntity.ok(distributedQueryService.updateShipment(id, shipment));
    }

    @DeleteMapping("/shipments/{id}")
    public ResponseEntity<Void> deleteShipment(@PathVariable int id) {
        distributedQueryService.deleteShipment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        return ResponseEntity.ok(distributedQueryService.getSystemHealth());
    }

    @PostMapping("/query")
    public ResponseEntity<List<Map<String, Object>>> executeQuery(@RequestBody Map<String, String> payload) {
        String sql = payload.get("sql");
        if (sql == null || sql.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(distributedQueryService.executeDistributedQuery(sql));
    }

    // --- Region-Specific Endpoints ---
    @GetMapping("/region/{region}/suppliers")
    public ResponseEntity<List<Map<String, Object>>> getSuppliersForRegion(@PathVariable String region) {
        return ResponseEntity.ok(distributedQueryService.getSuppliersForRegion(region));
    }

    @GetMapping("/region/{region}/warehouses")
    public ResponseEntity<List<Map<String, Object>>> getWarehousesForRegion(@PathVariable String region) {
        return ResponseEntity.ok(distributedQueryService.getWarehousesForRegion(region));
    }

    @GetMapping("/region/{region}/inventory")
    public ResponseEntity<List<Map<String, Object>>> getInventoryForRegion(@PathVariable String region) {
        return ResponseEntity.ok(distributedQueryService.getInventoryForRegion(region));
    }

    @GetMapping("/region/{region}/orders")
    public ResponseEntity<List<Map<String, Object>>> getOrdersForRegion(@PathVariable String region) {
        return ResponseEntity.ok(distributedQueryService.getOrdersForRegion(region));
    }

    @GetMapping("/region/{region}/shipments")
    public ResponseEntity<List<Map<String, Object>>> getShipmentsForRegion(@PathVariable String region) {
        return ResponseEntity.ok(distributedQueryService.getShipmentsForRegion(region));
    }
}
