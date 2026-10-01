import random
import datetime

regions = ['North', 'West', 'South']
locations = {
    'North': ['Delhi', 'Chandigarh', 'Jaipur', 'Lucknow'],
    'West': ['Mumbai', 'Pune', 'Ahmedabad', 'Surat'],
    'South': ['Bengaluru', 'Chennai', 'Hyderabad', 'Kochi']
}

products = [
    (1, 'Laptop Pro', 'Electronics', 85000.00, 'High performance laptop'),
    (2, 'Smartphone X', 'Electronics', 60000.00, 'Latest smartphone'),
    (3, 'Wireless Mouse', 'Accessories', 1500.00, 'Ergonomic mouse'),
    (4, 'Mechanical Keyboard', 'Accessories', 4500.00, 'RGB mechanical keyboard'),
    (5, '27-inch Monitor', 'Electronics', 25000.00, '4K IPS display'),
    (6, 'Office Chair', 'Furniture', 8000.00, 'Ergonomic office chair'),
    (7, 'Standing Desk', 'Furniture', 22000.00, 'Motorized standing desk'),
    (8, 'Bluetooth Headphones', 'Audio', 5500.00, 'Noise cancelling headphones'),
    (9, 'Smartwatch Gen 5', 'Electronics', 15000.00, 'Fitness tracking smartwatch'),
    (10, 'External SSD 1TB', 'Storage', 12000.00, 'Fast portable storage'),
    (11, 'USB-C Hub', 'Accessories', 2500.00, 'Multi-port adapter'),
    (12, 'Webcam 1080p', 'Accessories', 3500.00, 'HD web camera'),
    (13, 'Printer Laser', 'Electronics', 18000.00, 'Wireless laser printer'),
    (14, 'Router WiFi 6', 'Networking', 6000.00, 'High speed router'),
    (15, 'Desk Lamp', 'Furniture', 1200.00, 'LED adjustable lamp')
]

# ID counters
supplier_id_start = {'North': 100, 'West': 200, 'South': 300}
warehouse_id_start = {'North': 10, 'West': 20, 'South': 30}
retailer_id_start = {'North': 1000, 'West': 2000, 'South': 3000}
order_id_start = {'North': 5000, 'West': 6000, 'South': 7000}
inventory_id_start = {'North': 10000, 'West': 20000, 'South': 30000}
shipment_id_start = {'North': 8000, 'West': 9000, 'South': 10000}
order_item_id_start = {'North': 40000, 'West': 50000, 'South': 60000}

sql = ""

# Drop schemas if exist and create
schemas = ['supply_chain_north', 'supply_chain_west', 'supply_chain_south', 'supply_chain_centralized']
for s in schemas:
    sql += f"DROP DATABASE IF EXISTS {s};\n"
    sql += f"CREATE DATABASE {s};\n\n"

# Helper to generate table DDL
table_ddl = """
CREATE TABLE product (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10, 2),
    description TEXT
);

CREATE TABLE supplier (
    supplier_id INT PRIMARY KEY,
    supplier_name VARCHAR(100),
    location VARCHAR(100),
    contact VARCHAR(50),
    email VARCHAR(100),
    rating DECIMAL(3, 2),
    region VARCHAR(50)
);

CREATE TABLE warehouse (
    warehouse_id INT PRIMARY KEY,
    warehouse_name VARCHAR(100),
    location VARCHAR(100),
    capacity INT,
    region VARCHAR(50)
);

CREATE TABLE inventory (
    inventory_id INT PRIMARY KEY,
    warehouse_id INT,
    product_id INT,
    quantity INT,
    reorder_level INT,
    last_updated DATE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(warehouse_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE retailer (
    retailer_id INT PRIMARY KEY,
    retailer_name VARCHAR(100),
    location VARCHAR(100),
    contact VARCHAR(50),
    region VARCHAR(50)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    supplier_id INT,
    warehouse_id INT,
    order_date DATE,
    status VARCHAR(50),
    total_amount DECIMAL(12, 2),
    FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(warehouse_id)
);

CREATE TABLE order_item (
    order_item_id INT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT,
    unit_price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE shipment (
    shipment_id INT PRIMARY KEY,
    order_id INT,
    source VARCHAR(100),
    destination VARCHAR(100),
    shipment_date DATE,
    expected_delivery DATE,
    actual_delivery DATE,
    status VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
"""

# Global collections to feed centralized db
centralized_data = {
    'product': [], 'supplier': [], 'warehouse': [], 'inventory': [],
    'retailer': [], 'orders': [], 'order_item': [], 'shipment': []
}

for r in regions:
    sql += f"\nUSE supply_chain_{r.lower()};\n"
    sql += table_ddl + "\n"
    
    # Insert Products (Replicated)
    for p in products:
        q = f"INSERT INTO product VALUES ({p[0]}, '{p[1]}', '{p[2]}', {p[3]}, '{p[4]}');"
        sql += q + "\n"
        if r == 'North': centralized_data['product'].append(q)
    
    sql += "\n"
    
    # Generate Suppliers
    num_suppliers = random.randint(4, 6)
    suppliers_in_region = []
    for i in range(num_suppliers):
        s_id = supplier_id_start[r] + i
        s_name = f"{r} Supplies {i+1} Pvt Ltd"
        loc = random.choice(locations[r])
        contact = f"+91 98000{random.randint(10000, 99999)}"
        email = f"contact@{r.lower()}supplies{i+1}.com"
        rating = round(random.uniform(3.5, 5.0), 2)
        suppliers_in_region.append(s_id)
        q = f"INSERT INTO supplier VALUES ({s_id}, '{s_name}', '{loc}', '{contact}', '{email}', {rating}, '{r}');"
        sql += q + "\n"
        centralized_data['supplier'].append(q)
        
    sql += "\n"
    
    # Generate Warehouses
    num_warehouses = random.randint(2, 3)
    warehouses_in_region = []
    for i in range(num_warehouses):
        w_id = warehouse_id_start[r] + i
        w_name = f"WH_{r}_{i+1}"
        loc = random.choice(locations[r])
        capacity = random.randint(5000, 15000)
        warehouses_in_region.append((w_id, loc))
        q = f"INSERT INTO warehouse VALUES ({w_id}, '{w_name}', '{loc}', {capacity}, '{r}');"
        sql += q + "\n"
        centralized_data['warehouse'].append(q)
        
    sql += "\n"
    
    # Generate Retailers
    num_retailers = random.randint(3, 5)
    retailers_in_region = []
    for i in range(num_retailers):
        ret_id = retailer_id_start[r] + i
        ret_name = f"{r} Retail Mart {i+1}"
        loc = random.choice(locations[r])
        contact = f"+91 99000{random.randint(10000, 99999)}"
        retailers_in_region.append((ret_id, loc))
        q = f"INSERT INTO retailer VALUES ({ret_id}, '{ret_name}', '{loc}', '{contact}', '{r}');"
        sql += q + "\n"
        centralized_data['retailer'].append(q)
        
    sql += "\n"
    
    # Generate Inventory
    inv_id_curr = inventory_id_start[r]
    for w_id, w_loc in warehouses_in_region:
        num_items = random.randint(10, 15)
        selected_products = random.sample(products, num_items)
        for p in selected_products:
            qty = random.randint(50, 500)
            reorder = random.randint(20, 100)
            date_str = (datetime.date.today() - datetime.timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d')
            q = f"INSERT INTO inventory VALUES ({inv_id_curr}, {w_id}, {p[0]}, {qty}, {reorder}, '{date_str}');"
            sql += q + "\n"
            centralized_data['inventory'].append(q)
            inv_id_curr += 1
            
    sql += "\n"
    
    # Generate Orders, Order Items, Shipments
    num_orders = random.randint(7, 10)
    o_id_curr = order_id_start[r]
    oi_id_curr = order_item_id_start[r]
    sh_id_curr = shipment_id_start[r]
    
    for i in range(num_orders):
        s_id = random.choice(suppliers_in_region)
        w_id, w_loc = random.choice(warehouses_in_region)
        o_date = datetime.date.today() - datetime.timedelta(days=random.randint(5, 60))
        status_opts = ['Delivered', 'Shipped', 'Processing']
        o_status = random.choice(status_opts)
        
        # order items
        num_items = random.randint(1, 4)
        order_products = random.sample(products, num_items)
        total_amount = 0
        order_item_queries = []
        for p in order_products:
            qty = random.randint(10, 50)
            unit_price = p[3]
            total_amount += qty * unit_price
            q = f"INSERT INTO order_item VALUES ({oi_id_curr}, {o_id_curr}, {p[0]}, {qty}, {unit_price});"
            order_item_queries.append(q)
            oi_id_curr += 1
            
        q = f"INSERT INTO orders VALUES ({o_id_curr}, {s_id}, {w_id}, '{o_date.strftime('%Y-%m-%d')}', '{o_status}', {total_amount});"
        sql += q + "\n"
        centralized_data['orders'].append(q)
        
        for q in order_item_queries:
            sql += q + "\n"
            centralized_data['order_item'].append(q)
        
        # Shipments
        if o_status in ['Shipped', 'Delivered']:
            ret_id, dest_loc = random.choice(retailers_in_region)
            s_date = o_date + datetime.timedelta(days=random.randint(1, 3))
            exp_date = s_date + datetime.timedelta(days=random.randint(3, 7))
            act_date = "NULL"
            if o_status == 'Delivered':
                act_date = "'" + (exp_date + datetime.timedelta(days=random.randint(-1, 2))).strftime('%Y-%m-%d') + "'"
            
            q = f"INSERT INTO shipment VALUES ({sh_id_curr}, {o_id_curr}, '{w_loc}', '{dest_loc}', '{s_date.strftime('%Y-%m-%d')}', '{exp_date.strftime('%Y-%m-%d')}', {act_date}, '{o_status}');"
            sql += q + "\n"
            centralized_data['shipment'].append(q)
            sh_id_curr += 1
            
        o_id_curr += 1
        
    sql += "\n"

# Centralized Schema
sql += "\nUSE supply_chain_centralized;\n"
sql += table_ddl + "\n"

for t in ['product', 'supplier', 'warehouse', 'retailer', 'inventory', 'orders', 'order_item', 'shipment']:
    sql += f"-- Insert {t}\n"
    for q in centralized_data[t]:
        # move orders to orders_centralized to avoid issue? no, just use supply_chain_centralized database
        sql += q + "\n"
    sql += "\n"

with open('database/init.sql', 'w') as f:
    f.write(sql)

print("SQL script generated.")
