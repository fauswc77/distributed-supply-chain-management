DROP DATABASE IF EXISTS supply_chain_north;
CREATE DATABASE supply_chain_north;

DROP DATABASE IF EXISTS supply_chain_west;
CREATE DATABASE supply_chain_west;

DROP DATABASE IF EXISTS supply_chain_south;
CREATE DATABASE supply_chain_south;

DROP DATABASE IF EXISTS supply_chain_centralized;
CREATE DATABASE supply_chain_centralized;


USE supply_chain_north;

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

INSERT INTO product VALUES (1, 'Laptop Pro', 'Electronics', 85000.0, 'High performance laptop');
INSERT INTO product VALUES (2, 'Smartphone X', 'Electronics', 60000.0, 'Latest smartphone');
INSERT INTO product VALUES (3, 'Wireless Mouse', 'Accessories', 1500.0, 'Ergonomic mouse');
INSERT INTO product VALUES (4, 'Mechanical Keyboard', 'Accessories', 4500.0, 'RGB mechanical keyboard');
INSERT INTO product VALUES (5, '27-inch Monitor', 'Electronics', 25000.0, '4K IPS display');
INSERT INTO product VALUES (6, 'Office Chair', 'Furniture', 8000.0, 'Ergonomic office chair');
INSERT INTO product VALUES (7, 'Standing Desk', 'Furniture', 22000.0, 'Motorized standing desk');
INSERT INTO product VALUES (8, 'Bluetooth Headphones', 'Audio', 5500.0, 'Noise cancelling headphones');
INSERT INTO product VALUES (9, 'Smartwatch Gen 5', 'Electronics', 15000.0, 'Fitness tracking smartwatch');
INSERT INTO product VALUES (10, 'External SSD 1TB', 'Storage', 12000.0, 'Fast portable storage');
INSERT INTO product VALUES (11, 'USB-C Hub', 'Accessories', 2500.0, 'Multi-port adapter');
INSERT INTO product VALUES (12, 'Webcam 1080p', 'Accessories', 3500.0, 'HD web camera');
INSERT INTO product VALUES (13, 'Printer Laser', 'Electronics', 18000.0, 'Wireless laser printer');
INSERT INTO product VALUES (14, 'Router WiFi 6', 'Networking', 6000.0, 'High speed router');
INSERT INTO product VALUES (15, 'Desk Lamp', 'Furniture', 1200.0, 'LED adjustable lamp');

INSERT INTO supplier VALUES (100, 'North Supplies 1 Pvt Ltd', 'Lucknow', '+91 9800063627', 'contact@northsupplies1.com', 4.11, 'North');
INSERT INTO supplier VALUES (101, 'North Supplies 2 Pvt Ltd', 'Jaipur', '+91 9800090828', 'contact@northsupplies2.com', 4.52, 'North');
INSERT INTO supplier VALUES (102, 'North Supplies 3 Pvt Ltd', 'Delhi', '+91 9800099599', 'contact@northsupplies3.com', 4.07, 'North');
INSERT INTO supplier VALUES (103, 'North Supplies 4 Pvt Ltd', 'Lucknow', '+91 9800060606', 'contact@northsupplies4.com', 3.99, 'North');
INSERT INTO supplier VALUES (104, 'North Supplies 5 Pvt Ltd', 'Jaipur', '+91 9800016995', 'contact@northsupplies5.com', 4.57, 'North');
INSERT INTO supplier VALUES (105, 'North Supplies 6 Pvt Ltd', 'Delhi', '+91 9800071224', 'contact@northsupplies6.com', 4.06, 'North');

INSERT INTO warehouse VALUES (10, 'WH_North_1', 'Delhi', 8187, 'North');
INSERT INTO warehouse VALUES (11, 'WH_North_2', 'Delhi', 10140, 'North');
INSERT INTO warehouse VALUES (12, 'WH_North_3', 'Chandigarh', 14039, 'North');

INSERT INTO retailer VALUES (1000, 'North Retail Mart 1', 'Chandigarh', '+91 9900076629', 'North');
INSERT INTO retailer VALUES (1001, 'North Retail Mart 2', 'Lucknow', '+91 9900035958', 'North');
INSERT INTO retailer VALUES (1002, 'North Retail Mart 3', 'Delhi', '+91 9900045358', 'North');
INSERT INTO retailer VALUES (1003, 'North Retail Mart 4', 'Chandigarh', '+91 9900068339', 'North');
INSERT INTO retailer VALUES (1004, 'North Retail Mart 5', 'Lucknow', '+91 9900045428', 'North');

INSERT INTO inventory VALUES (10000, 10, 9, 401, 83, '2026-08-21');
INSERT INTO inventory VALUES (10001, 10, 12, 351, 64, '2026-08-28');
INSERT INTO inventory VALUES (10002, 10, 15, 206, 76, '2026-08-31');
INSERT INTO inventory VALUES (10003, 10, 8, 300, 22, '2026-08-14');
INSERT INTO inventory VALUES (10004, 10, 13, 466, 84, '2026-08-16');
INSERT INTO inventory VALUES (10005, 10, 10, 492, 70, '2026-09-01');
INSERT INTO inventory VALUES (10006, 10, 3, 135, 90, '2026-08-31');
INSERT INTO inventory VALUES (10007, 10, 1, 264, 40, '2026-08-12');
INSERT INTO inventory VALUES (10008, 10, 4, 475, 46, '2026-08-27');
INSERT INTO inventory VALUES (10009, 10, 6, 176, 36, '2026-08-31');
INSERT INTO inventory VALUES (10010, 10, 2, 375, 71, '2026-09-06');
INSERT INTO inventory VALUES (10011, 10, 7, 222, 65, '2026-08-13');
INSERT INTO inventory VALUES (10012, 10, 14, 459, 76, '2026-08-12');
INSERT INTO inventory VALUES (10013, 10, 5, 336, 91, '2026-09-06');
INSERT INTO inventory VALUES (10014, 10, 11, 241, 51, '2026-09-05');
INSERT INTO inventory VALUES (10015, 11, 4, 367, 58, '2026-09-05');
INSERT INTO inventory VALUES (10016, 11, 3, 191, 75, '2026-08-12');
INSERT INTO inventory VALUES (10017, 11, 10, 366, 20, '2026-09-05');
INSERT INTO inventory VALUES (10018, 11, 7, 261, 20, '2026-09-05');
INSERT INTO inventory VALUES (10019, 11, 1, 471, 96, '2026-08-12');
INSERT INTO inventory VALUES (10020, 11, 8, 147, 93, '2026-08-30');
INSERT INTO inventory VALUES (10021, 11, 5, 468, 20, '2026-08-22');
INSERT INTO inventory VALUES (10022, 11, 12, 107, 98, '2026-09-06');
INSERT INTO inventory VALUES (10023, 11, 13, 169, 45, '2026-08-27');
INSERT INTO inventory VALUES (10024, 11, 11, 212, 97, '2026-09-07');
INSERT INTO inventory VALUES (10025, 11, 2, 281, 84, '2026-08-29');
INSERT INTO inventory VALUES (10026, 11, 6, 326, 66, '2026-09-08');
INSERT INTO inventory VALUES (10027, 12, 4, 387, 78, '2026-08-13');
INSERT INTO inventory VALUES (10028, 12, 11, 265, 86, '2026-08-20');
INSERT INTO inventory VALUES (10029, 12, 2, 302, 57, '2026-08-11');
INSERT INTO inventory VALUES (10030, 12, 5, 338, 33, '2026-09-01');
INSERT INTO inventory VALUES (10031, 12, 3, 404, 86, '2026-08-12');
INSERT INTO inventory VALUES (10032, 12, 1, 191, 52, '2026-08-20');
INSERT INTO inventory VALUES (10033, 12, 7, 319, 62, '2026-08-29');
INSERT INTO inventory VALUES (10034, 12, 10, 370, 27, '2026-08-21');
INSERT INTO inventory VALUES (10035, 12, 9, 138, 63, '2026-09-08');
INSERT INTO inventory VALUES (10036, 12, 8, 323, 78, '2026-08-21');
INSERT INTO inventory VALUES (10037, 12, 6, 91, 80, '2026-08-18');
INSERT INTO inventory VALUES (10038, 12, 15, 226, 38, '2026-08-09');
INSERT INTO inventory VALUES (10039, 12, 14, 463, 29, '2026-09-02');

INSERT INTO orders VALUES (5000, 105, 12, '2026-08-03', 'Processing', 4068000.0);
INSERT INTO order_item VALUES (40000, 5000, 10, 39, 12000.0);
INSERT INTO order_item VALUES (40001, 5000, 5, 48, 25000.0);
INSERT INTO order_item VALUES (40002, 5000, 2, 40, 60000.0);
INSERT INTO orders VALUES (5001, 104, 12, '2026-08-29', 'Shipped', 1803600.0);
INSERT INTO order_item VALUES (40003, 5001, 8, 48, 5500.0);
INSERT INTO order_item VALUES (40004, 5001, 2, 25, 60000.0);
INSERT INTO order_item VALUES (40005, 5001, 15, 33, 1200.0);
INSERT INTO shipment VALUES (8000, 5001, 'Chandigarh', 'Chandigarh', '2026-08-31', '2026-09-03', NULL, 'Shipped');
INSERT INTO orders VALUES (5002, 100, 11, '2026-08-29', 'Delivered', 198000.0);
INSERT INTO order_item VALUES (40006, 5002, 11, 44, 2500.0);
INSERT INTO order_item VALUES (40007, 5002, 6, 11, 8000.0);
INSERT INTO shipment VALUES (8001, 5002, 'Delhi', 'Lucknow', '2026-08-31', '2026-09-06', '2026-09-08', 'Delivered');
INSERT INTO orders VALUES (5003, 105, 10, '2026-07-29', 'Delivered', 1586000.0);
INSERT INTO order_item VALUES (40008, 5003, 7, 49, 22000.0);
INSERT INTO order_item VALUES (40009, 5003, 4, 24, 4500.0);
INSERT INTO order_item VALUES (40010, 5003, 5, 16, 25000.0);
INSERT INTO shipment VALUES (8002, 5003, 'Delhi', 'Lucknow', '2026-07-30', '2026-08-04', '2026-08-06', 'Delivered');
INSERT INTO orders VALUES (5004, 102, 12, '2026-08-03', 'Shipped', 1023000.0);
INSERT INTO order_item VALUES (40011, 5004, 8, 38, 5500.0);
INSERT INTO order_item VALUES (40012, 5004, 7, 37, 22000.0);
INSERT INTO shipment VALUES (8003, 5004, 'Chandigarh', 'Lucknow', '2026-08-05', '2026-08-12', NULL, 'Shipped');
INSERT INTO orders VALUES (5005, 101, 11, '2026-07-26', 'Delivered', 122500.0);
INSERT INTO order_item VALUES (40013, 5005, 11, 49, 2500.0);
INSERT INTO shipment VALUES (8004, 5005, 'Delhi', 'Delhi', '2026-07-27', '2026-07-31', '2026-07-31', 'Delivered');
INSERT INTO orders VALUES (5006, 102, 12, '2026-08-13', 'Processing', 1780300.0);
INSERT INTO order_item VALUES (40014, 5006, 13, 16, 18000.0);
INSERT INTO order_item VALUES (40015, 5006, 8, 21, 5500.0);
INSERT INTO order_item VALUES (40016, 5006, 15, 14, 1200.0);
INSERT INTO order_item VALUES (40017, 5006, 1, 16, 85000.0);
INSERT INTO orders VALUES (5007, 103, 10, '2026-07-29', 'Processing', 553000.0);
INSERT INTO order_item VALUES (40018, 5007, 11, 44, 2500.0);
INSERT INTO order_item VALUES (40019, 5007, 14, 14, 6000.0);
INSERT INTO order_item VALUES (40020, 5007, 9, 10, 15000.0);
INSERT INTO order_item VALUES (40021, 5007, 8, 38, 5500.0);


USE supply_chain_west;

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

INSERT INTO product VALUES (1, 'Laptop Pro', 'Electronics', 85000.0, 'High performance laptop');
INSERT INTO product VALUES (2, 'Smartphone X', 'Electronics', 60000.0, 'Latest smartphone');
INSERT INTO product VALUES (3, 'Wireless Mouse', 'Accessories', 1500.0, 'Ergonomic mouse');
INSERT INTO product VALUES (4, 'Mechanical Keyboard', 'Accessories', 4500.0, 'RGB mechanical keyboard');
INSERT INTO product VALUES (5, '27-inch Monitor', 'Electronics', 25000.0, '4K IPS display');
INSERT INTO product VALUES (6, 'Office Chair', 'Furniture', 8000.0, 'Ergonomic office chair');
INSERT INTO product VALUES (7, 'Standing Desk', 'Furniture', 22000.0, 'Motorized standing desk');
INSERT INTO product VALUES (8, 'Bluetooth Headphones', 'Audio', 5500.0, 'Noise cancelling headphones');
INSERT INTO product VALUES (9, 'Smartwatch Gen 5', 'Electronics', 15000.0, 'Fitness tracking smartwatch');
INSERT INTO product VALUES (10, 'External SSD 1TB', 'Storage', 12000.0, 'Fast portable storage');
INSERT INTO product VALUES (11, 'USB-C Hub', 'Accessories', 2500.0, 'Multi-port adapter');
INSERT INTO product VALUES (12, 'Webcam 1080p', 'Accessories', 3500.0, 'HD web camera');
INSERT INTO product VALUES (13, 'Printer Laser', 'Electronics', 18000.0, 'Wireless laser printer');
INSERT INTO product VALUES (14, 'Router WiFi 6', 'Networking', 6000.0, 'High speed router');
INSERT INTO product VALUES (15, 'Desk Lamp', 'Furniture', 1200.0, 'LED adjustable lamp');

INSERT INTO supplier VALUES (200, 'West Supplies 1 Pvt Ltd', 'Ahmedabad', '+91 9800091412', 'contact@westsupplies1.com', 4.97, 'West');
INSERT INTO supplier VALUES (201, 'West Supplies 2 Pvt Ltd', 'Mumbai', '+91 9800065362', 'contact@westsupplies2.com', 3.76, 'West');
INSERT INTO supplier VALUES (202, 'West Supplies 3 Pvt Ltd', 'Pune', '+91 9800086470', 'contact@westsupplies3.com', 4.72, 'West');
INSERT INTO supplier VALUES (203, 'West Supplies 4 Pvt Ltd', 'Pune', '+91 9800072954', 'contact@westsupplies4.com', 3.86, 'West');

INSERT INTO warehouse VALUES (20, 'WH_West_1', 'Ahmedabad', 7972, 'West');
INSERT INTO warehouse VALUES (21, 'WH_West_2', 'Surat', 12448, 'West');

INSERT INTO retailer VALUES (2000, 'West Retail Mart 1', 'Ahmedabad', '+91 9900063191', 'West');
INSERT INTO retailer VALUES (2001, 'West Retail Mart 2', 'Ahmedabad', '+91 9900033843', 'West');
INSERT INTO retailer VALUES (2002, 'West Retail Mart 3', 'Surat', '+91 9900092464', 'West');

INSERT INTO inventory VALUES (20000, 20, 2, 84, 62, '2026-08-18');
INSERT INTO inventory VALUES (20001, 20, 15, 266, 92, '2026-08-19');
INSERT INTO inventory VALUES (20002, 20, 6, 467, 27, '2026-09-01');
INSERT INTO inventory VALUES (20003, 20, 4, 415, 69, '2026-09-04');
INSERT INTO inventory VALUES (20004, 20, 7, 168, 60, '2026-08-21');
INSERT INTO inventory VALUES (20005, 20, 8, 221, 28, '2026-08-23');
INSERT INTO inventory VALUES (20006, 20, 5, 231, 53, '2026-08-16');
INSERT INTO inventory VALUES (20007, 20, 10, 224, 66, '2026-09-06');
INSERT INTO inventory VALUES (20008, 20, 3, 439, 68, '2026-09-06');
INSERT INTO inventory VALUES (20009, 20, 14, 346, 56, '2026-08-10');
INSERT INTO inventory VALUES (20010, 20, 13, 417, 56, '2026-08-10');
INSERT INTO inventory VALUES (20011, 20, 11, 215, 95, '2026-09-04');
INSERT INTO inventory VALUES (20012, 21, 15, 312, 37, '2026-08-17');
INSERT INTO inventory VALUES (20013, 21, 9, 116, 43, '2026-08-18');
INSERT INTO inventory VALUES (20014, 21, 8, 145, 87, '2026-08-14');
INSERT INTO inventory VALUES (20015, 21, 7, 344, 85, '2026-09-06');
INSERT INTO inventory VALUES (20016, 21, 13, 453, 73, '2026-09-04');
INSERT INTO inventory VALUES (20017, 21, 12, 105, 46, '2026-08-20');
INSERT INTO inventory VALUES (20018, 21, 3, 173, 86, '2026-08-25');
INSERT INTO inventory VALUES (20019, 21, 2, 118, 45, '2026-09-08');
INSERT INTO inventory VALUES (20020, 21, 14, 275, 79, '2026-08-27');
INSERT INTO inventory VALUES (20021, 21, 6, 161, 49, '2026-08-18');
INSERT INTO inventory VALUES (20022, 21, 10, 297, 62, '2026-08-17');
INSERT INTO inventory VALUES (20023, 21, 4, 156, 87, '2026-08-26');

INSERT INTO orders VALUES (6000, 201, 21, '2026-07-28', 'Delivered', 38500.0);
INSERT INTO order_item VALUES (50000, 6000, 12, 11, 3500.0);
INSERT INTO shipment VALUES (9000, 6000, 'Surat', 'Surat', '2026-07-29', '2026-08-03', '2026-08-05', 'Delivered');
INSERT INTO orders VALUES (6001, 202, 21, '2026-08-24', 'Processing', 738000.0);
INSERT INTO order_item VALUES (50001, 6001, 13, 41, 18000.0);
INSERT INTO orders VALUES (6002, 200, 21, '2026-08-27', 'Delivered', 4232500.0);
INSERT INTO order_item VALUES (50002, 6002, 1, 49, 85000.0);
INSERT INTO order_item VALUES (50003, 6002, 4, 15, 4500.0);
INSERT INTO shipment VALUES (9001, 6002, 'Surat', 'Ahmedabad', '2026-08-30', '2026-09-02', '2026-09-04', 'Delivered');
INSERT INTO orders VALUES (6003, 200, 20, '2026-08-18', 'Shipped', 69000.0);
INSERT INTO order_item VALUES (50004, 6003, 3, 46, 1500.0);
INSERT INTO shipment VALUES (9002, 6003, 'Ahmedabad', 'Ahmedabad', '2026-08-21', '2026-08-26', NULL, 'Shipped');
INSERT INTO orders VALUES (6004, 201, 21, '2026-07-26', 'Shipped', 2643700.0);
INSERT INTO order_item VALUES (50005, 6004, 6, 41, 8000.0);
INSERT INTO order_item VALUES (50006, 6004, 8, 29, 5500.0);
INSERT INTO order_item VALUES (50007, 6004, 15, 26, 1200.0);
INSERT INTO order_item VALUES (50008, 6004, 1, 25, 85000.0);
INSERT INTO shipment VALUES (9003, 6004, 'Surat', 'Ahmedabad', '2026-07-28', '2026-08-03', NULL, 'Shipped');
INSERT INTO orders VALUES (6005, 202, 20, '2026-08-13', 'Delivered', 13200.0);
INSERT INTO order_item VALUES (50009, 6005, 15, 11, 1200.0);
INSERT INTO shipment VALUES (9004, 6005, 'Ahmedabad', 'Ahmedabad', '2026-08-15', '2026-08-22', '2026-08-21', 'Delivered');
INSERT INTO orders VALUES (6006, 200, 20, '2026-08-27', 'Shipped', 2768500.0);
INSERT INTO order_item VALUES (50010, 6006, 11, 25, 2500.0);
INSERT INTO order_item VALUES (50011, 6006, 10, 13, 12000.0);
INSERT INTO order_item VALUES (50012, 6006, 1, 30, 85000.0);
INSERT INTO shipment VALUES (9005, 6006, 'Ahmedabad', 'Surat', '2026-08-28', '2026-08-31', NULL, 'Shipped');


USE supply_chain_south;

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

INSERT INTO product VALUES (1, 'Laptop Pro', 'Electronics', 85000.0, 'High performance laptop');
INSERT INTO product VALUES (2, 'Smartphone X', 'Electronics', 60000.0, 'Latest smartphone');
INSERT INTO product VALUES (3, 'Wireless Mouse', 'Accessories', 1500.0, 'Ergonomic mouse');
INSERT INTO product VALUES (4, 'Mechanical Keyboard', 'Accessories', 4500.0, 'RGB mechanical keyboard');
INSERT INTO product VALUES (5, '27-inch Monitor', 'Electronics', 25000.0, '4K IPS display');
INSERT INTO product VALUES (6, 'Office Chair', 'Furniture', 8000.0, 'Ergonomic office chair');
INSERT INTO product VALUES (7, 'Standing Desk', 'Furniture', 22000.0, 'Motorized standing desk');
INSERT INTO product VALUES (8, 'Bluetooth Headphones', 'Audio', 5500.0, 'Noise cancelling headphones');
INSERT INTO product VALUES (9, 'Smartwatch Gen 5', 'Electronics', 15000.0, 'Fitness tracking smartwatch');
INSERT INTO product VALUES (10, 'External SSD 1TB', 'Storage', 12000.0, 'Fast portable storage');
INSERT INTO product VALUES (11, 'USB-C Hub', 'Accessories', 2500.0, 'Multi-port adapter');
INSERT INTO product VALUES (12, 'Webcam 1080p', 'Accessories', 3500.0, 'HD web camera');
INSERT INTO product VALUES (13, 'Printer Laser', 'Electronics', 18000.0, 'Wireless laser printer');
INSERT INTO product VALUES (14, 'Router WiFi 6', 'Networking', 6000.0, 'High speed router');
INSERT INTO product VALUES (15, 'Desk Lamp', 'Furniture', 1200.0, 'LED adjustable lamp');

INSERT INTO supplier VALUES (300, 'South Supplies 1 Pvt Ltd', 'Chennai', '+91 9800033145', 'contact@southsupplies1.com', 4.21, 'South');
INSERT INTO supplier VALUES (301, 'South Supplies 2 Pvt Ltd', 'Bengaluru', '+91 9800012190', 'contact@southsupplies2.com', 4.68, 'South');
INSERT INTO supplier VALUES (302, 'South Supplies 3 Pvt Ltd', 'Chennai', '+91 9800018995', 'contact@southsupplies3.com', 3.7, 'South');
INSERT INTO supplier VALUES (303, 'South Supplies 4 Pvt Ltd', 'Chennai', '+91 9800021109', 'contact@southsupplies4.com', 4.74, 'South');
INSERT INTO supplier VALUES (304, 'South Supplies 5 Pvt Ltd', 'Hyderabad', '+91 9800086283', 'contact@southsupplies5.com', 4.32, 'South');
INSERT INTO supplier VALUES (305, 'South Supplies 6 Pvt Ltd', 'Chennai', '+91 9800034626', 'contact@southsupplies6.com', 3.71, 'South');

INSERT INTO warehouse VALUES (30, 'WH_South_1', 'Chennai', 10113, 'South');
INSERT INTO warehouse VALUES (31, 'WH_South_2', 'Bengaluru', 10425, 'South');

INSERT INTO retailer VALUES (3000, 'South Retail Mart 1', 'Chennai', '+91 9900065020', 'South');
INSERT INTO retailer VALUES (3001, 'South Retail Mart 2', 'Hyderabad', '+91 9900068908', 'South');
INSERT INTO retailer VALUES (3002, 'South Retail Mart 3', 'Chennai', '+91 9900073760', 'South');
INSERT INTO retailer VALUES (3003, 'South Retail Mart 4', 'Bengaluru', '+91 9900077451', 'South');

INSERT INTO inventory VALUES (30000, 30, 3, 172, 70, '2026-08-14');
INSERT INTO inventory VALUES (30001, 30, 2, 302, 78, '2026-08-23');
INSERT INTO inventory VALUES (30002, 30, 1, 130, 68, '2026-08-28');
INSERT INTO inventory VALUES (30003, 30, 6, 75, 92, '2026-08-16');
INSERT INTO inventory VALUES (30004, 30, 11, 421, 30, '2026-08-21');
INSERT INTO inventory VALUES (30005, 30, 10, 280, 43, '2026-08-26');
INSERT INTO inventory VALUES (30006, 30, 14, 147, 22, '2026-09-08');
INSERT INTO inventory VALUES (30007, 30, 9, 244, 52, '2026-09-03');
INSERT INTO inventory VALUES (30008, 30, 5, 88, 27, '2026-08-10');
INSERT INTO inventory VALUES (30009, 30, 12, 374, 39, '2026-08-28');
INSERT INTO inventory VALUES (30010, 31, 11, 258, 47, '2026-08-22');
INSERT INTO inventory VALUES (30011, 31, 9, 455, 75, '2026-08-26');
INSERT INTO inventory VALUES (30012, 31, 2, 372, 60, '2026-09-04');
INSERT INTO inventory VALUES (30013, 31, 14, 431, 40, '2026-08-13');
INSERT INTO inventory VALUES (30014, 31, 4, 394, 40, '2026-08-27');
INSERT INTO inventory VALUES (30015, 31, 7, 384, 67, '2026-08-29');
INSERT INTO inventory VALUES (30016, 31, 5, 229, 88, '2026-09-06');
INSERT INTO inventory VALUES (30017, 31, 12, 435, 86, '2026-09-06');
INSERT INTO inventory VALUES (30018, 31, 3, 101, 41, '2026-08-27');
INSERT INTO inventory VALUES (30019, 31, 10, 92, 59, '2026-08-29');
INSERT INTO inventory VALUES (30020, 31, 1, 55, 43, '2026-08-21');

INSERT INTO orders VALUES (7000, 301, 30, '2026-08-01', 'Shipped', 1197000.0);
INSERT INTO order_item VALUES (60000, 7000, 4, 16, 4500.0);
INSERT INTO order_item VALUES (60001, 7000, 5, 45, 25000.0);
INSERT INTO shipment VALUES (10000, 7000, 'Chennai', 'Chennai', '2026-08-04', '2026-08-09', NULL, 'Shipped');
INSERT INTO orders VALUES (7001, 300, 31, '2026-08-03', 'Delivered', 340000.0);
INSERT INTO order_item VALUES (60002, 7001, 14, 31, 6000.0);
INSERT INTO order_item VALUES (60003, 7001, 8, 28, 5500.0);
INSERT INTO shipment VALUES (10001, 7001, 'Bengaluru', 'Bengaluru', '2026-08-06', '2026-08-11', '2026-08-12', 'Delivered');
INSERT INTO orders VALUES (7002, 300, 30, '2026-07-10', 'Shipped', 1131500.0);
INSERT INTO order_item VALUES (60004, 7002, 3, 44, 1500.0);
INSERT INTO order_item VALUES (60005, 7002, 6, 39, 8000.0);
INSERT INTO order_item VALUES (60006, 7002, 8, 37, 5500.0);
INSERT INTO order_item VALUES (60007, 7002, 5, 22, 25000.0);
INSERT INTO shipment VALUES (10002, 7002, 'Chennai', 'Chennai', '2026-07-11', '2026-07-18', NULL, 'Shipped');
INSERT INTO orders VALUES (7003, 304, 31, '2026-08-14', 'Delivered', 903000.0);
INSERT INTO order_item VALUES (60008, 7003, 10, 29, 12000.0);
INSERT INTO order_item VALUES (60009, 7003, 9, 37, 15000.0);
INSERT INTO shipment VALUES (10003, 7003, 'Bengaluru', 'Chennai', '2026-08-16', '2026-08-20', '2026-08-19', 'Delivered');
INSERT INTO orders VALUES (7004, 300, 30, '2026-07-20', 'Processing', 2869500.0);
INSERT INTO order_item VALUES (60010, 7004, 3, 41, 1500.0);
INSERT INTO order_item VALUES (60011, 7004, 13, 16, 18000.0);
INSERT INTO order_item VALUES (60012, 7004, 2, 42, 60000.0);
INSERT INTO orders VALUES (7005, 302, 31, '2026-08-25', 'Delivered', 3706000.0);
INSERT INTO order_item VALUES (60013, 7005, 6, 38, 8000.0);
INSERT INTO order_item VALUES (60014, 7005, 13, 31, 18000.0);
INSERT INTO order_item VALUES (60015, 7005, 1, 30, 85000.0);
INSERT INTO order_item VALUES (60016, 7005, 14, 49, 6000.0);
INSERT INTO shipment VALUES (10004, 7005, 'Bengaluru', 'Chennai', '2026-08-27', '2026-08-31', '2026-08-31', 'Delivered');
INSERT INTO orders VALUES (7006, 305, 31, '2026-07-13', 'Processing', 5077600.0);
INSERT INTO order_item VALUES (60017, 7006, 15, 23, 1200.0);
INSERT INTO order_item VALUES (60018, 7006, 1, 46, 85000.0);
INSERT INTO order_item VALUES (60019, 7006, 10, 29, 12000.0);
INSERT INTO order_item VALUES (60020, 7006, 13, 44, 18000.0);
INSERT INTO orders VALUES (7007, 304, 31, '2026-07-25', 'Delivered', 1137000.0);
INSERT INTO order_item VALUES (60021, 7007, 4, 30, 4500.0);
INSERT INTO order_item VALUES (60022, 7007, 6, 30, 8000.0);
INSERT INTO order_item VALUES (60023, 7007, 9, 34, 15000.0);
INSERT INTO order_item VALUES (60024, 7007, 10, 21, 12000.0);
INSERT INTO shipment VALUES (10005, 7007, 'Bengaluru', 'Hyderabad', '2026-07-28', '2026-08-01', '2026-08-01', 'Delivered');
INSERT INTO orders VALUES (7008, 303, 31, '2026-07-18', 'Processing', 56400.0);
INSERT INTO order_item VALUES (60025, 7008, 15, 47, 1200.0);
INSERT INTO orders VALUES (7009, 305, 31, '2026-08-06', 'Processing', 341500.0);
INSERT INTO order_item VALUES (60026, 7009, 6, 35, 8000.0);
INSERT INTO order_item VALUES (60027, 7009, 3, 41, 1500.0);


USE supply_chain_centralized;

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

-- Insert product
INSERT INTO product VALUES (1, 'Laptop Pro', 'Electronics', 85000.0, 'High performance laptop');
INSERT INTO product VALUES (2, 'Smartphone X', 'Electronics', 60000.0, 'Latest smartphone');
INSERT INTO product VALUES (3, 'Wireless Mouse', 'Accessories', 1500.0, 'Ergonomic mouse');
INSERT INTO product VALUES (4, 'Mechanical Keyboard', 'Accessories', 4500.0, 'RGB mechanical keyboard');
INSERT INTO product VALUES (5, '27-inch Monitor', 'Electronics', 25000.0, '4K IPS display');
INSERT INTO product VALUES (6, 'Office Chair', 'Furniture', 8000.0, 'Ergonomic office chair');
INSERT INTO product VALUES (7, 'Standing Desk', 'Furniture', 22000.0, 'Motorized standing desk');
INSERT INTO product VALUES (8, 'Bluetooth Headphones', 'Audio', 5500.0, 'Noise cancelling headphones');
INSERT INTO product VALUES (9, 'Smartwatch Gen 5', 'Electronics', 15000.0, 'Fitness tracking smartwatch');
INSERT INTO product VALUES (10, 'External SSD 1TB', 'Storage', 12000.0, 'Fast portable storage');
INSERT INTO product VALUES (11, 'USB-C Hub', 'Accessories', 2500.0, 'Multi-port adapter');
INSERT INTO product VALUES (12, 'Webcam 1080p', 'Accessories', 3500.0, 'HD web camera');
INSERT INTO product VALUES (13, 'Printer Laser', 'Electronics', 18000.0, 'Wireless laser printer');
INSERT INTO product VALUES (14, 'Router WiFi 6', 'Networking', 6000.0, 'High speed router');
INSERT INTO product VALUES (15, 'Desk Lamp', 'Furniture', 1200.0, 'LED adjustable lamp');

-- Insert supplier
INSERT INTO supplier VALUES (100, 'North Supplies 1 Pvt Ltd', 'Lucknow', '+91 9800063627', 'contact@northsupplies1.com', 4.11, 'North');
INSERT INTO supplier VALUES (101, 'North Supplies 2 Pvt Ltd', 'Jaipur', '+91 9800090828', 'contact@northsupplies2.com', 4.52, 'North');
INSERT INTO supplier VALUES (102, 'North Supplies 3 Pvt Ltd', 'Delhi', '+91 9800099599', 'contact@northsupplies3.com', 4.07, 'North');
INSERT INTO supplier VALUES (103, 'North Supplies 4 Pvt Ltd', 'Lucknow', '+91 9800060606', 'contact@northsupplies4.com', 3.99, 'North');
INSERT INTO supplier VALUES (104, 'North Supplies 5 Pvt Ltd', 'Jaipur', '+91 9800016995', 'contact@northsupplies5.com', 4.57, 'North');
INSERT INTO supplier VALUES (105, 'North Supplies 6 Pvt Ltd', 'Delhi', '+91 9800071224', 'contact@northsupplies6.com', 4.06, 'North');
INSERT INTO supplier VALUES (200, 'West Supplies 1 Pvt Ltd', 'Ahmedabad', '+91 9800091412', 'contact@westsupplies1.com', 4.97, 'West');
INSERT INTO supplier VALUES (201, 'West Supplies 2 Pvt Ltd', 'Mumbai', '+91 9800065362', 'contact@westsupplies2.com', 3.76, 'West');
INSERT INTO supplier VALUES (202, 'West Supplies 3 Pvt Ltd', 'Pune', '+91 9800086470', 'contact@westsupplies3.com', 4.72, 'West');
INSERT INTO supplier VALUES (203, 'West Supplies 4 Pvt Ltd', 'Pune', '+91 9800072954', 'contact@westsupplies4.com', 3.86, 'West');
INSERT INTO supplier VALUES (300, 'South Supplies 1 Pvt Ltd', 'Chennai', '+91 9800033145', 'contact@southsupplies1.com', 4.21, 'South');
INSERT INTO supplier VALUES (301, 'South Supplies 2 Pvt Ltd', 'Bengaluru', '+91 9800012190', 'contact@southsupplies2.com', 4.68, 'South');
INSERT INTO supplier VALUES (302, 'South Supplies 3 Pvt Ltd', 'Chennai', '+91 9800018995', 'contact@southsupplies3.com', 3.7, 'South');
INSERT INTO supplier VALUES (303, 'South Supplies 4 Pvt Ltd', 'Chennai', '+91 9800021109', 'contact@southsupplies4.com', 4.74, 'South');
INSERT INTO supplier VALUES (304, 'South Supplies 5 Pvt Ltd', 'Hyderabad', '+91 9800086283', 'contact@southsupplies5.com', 4.32, 'South');
INSERT INTO supplier VALUES (305, 'South Supplies 6 Pvt Ltd', 'Chennai', '+91 9800034626', 'contact@southsupplies6.com', 3.71, 'South');

-- Insert warehouse
INSERT INTO warehouse VALUES (10, 'WH_North_1', 'Delhi', 8187, 'North');
INSERT INTO warehouse VALUES (11, 'WH_North_2', 'Delhi', 10140, 'North');
INSERT INTO warehouse VALUES (12, 'WH_North_3', 'Chandigarh', 14039, 'North');
INSERT INTO warehouse VALUES (20, 'WH_West_1', 'Ahmedabad', 7972, 'West');
INSERT INTO warehouse VALUES (21, 'WH_West_2', 'Surat', 12448, 'West');
INSERT INTO warehouse VALUES (30, 'WH_South_1', 'Chennai', 10113, 'South');
INSERT INTO warehouse VALUES (31, 'WH_South_2', 'Bengaluru', 10425, 'South');

-- Insert retailer
INSERT INTO retailer VALUES (1000, 'North Retail Mart 1', 'Chandigarh', '+91 9900076629', 'North');
INSERT INTO retailer VALUES (1001, 'North Retail Mart 2', 'Lucknow', '+91 9900035958', 'North');
INSERT INTO retailer VALUES (1002, 'North Retail Mart 3', 'Delhi', '+91 9900045358', 'North');
INSERT INTO retailer VALUES (1003, 'North Retail Mart 4', 'Chandigarh', '+91 9900068339', 'North');
INSERT INTO retailer VALUES (1004, 'North Retail Mart 5', 'Lucknow', '+91 9900045428', 'North');
INSERT INTO retailer VALUES (2000, 'West Retail Mart 1', 'Ahmedabad', '+91 9900063191', 'West');
INSERT INTO retailer VALUES (2001, 'West Retail Mart 2', 'Ahmedabad', '+91 9900033843', 'West');
INSERT INTO retailer VALUES (2002, 'West Retail Mart 3', 'Surat', '+91 9900092464', 'West');
INSERT INTO retailer VALUES (3000, 'South Retail Mart 1', 'Chennai', '+91 9900065020', 'South');
INSERT INTO retailer VALUES (3001, 'South Retail Mart 2', 'Hyderabad', '+91 9900068908', 'South');
INSERT INTO retailer VALUES (3002, 'South Retail Mart 3', 'Chennai', '+91 9900073760', 'South');
INSERT INTO retailer VALUES (3003, 'South Retail Mart 4', 'Bengaluru', '+91 9900077451', 'South');

-- Insert inventory
INSERT INTO inventory VALUES (10000, 10, 9, 401, 83, '2026-08-21');
INSERT INTO inventory VALUES (10001, 10, 12, 351, 64, '2026-08-28');
INSERT INTO inventory VALUES (10002, 10, 15, 206, 76, '2026-08-31');
INSERT INTO inventory VALUES (10003, 10, 8, 300, 22, '2026-08-14');
INSERT INTO inventory VALUES (10004, 10, 13, 466, 84, '2026-08-16');
INSERT INTO inventory VALUES (10005, 10, 10, 492, 70, '2026-09-01');
INSERT INTO inventory VALUES (10006, 10, 3, 135, 90, '2026-08-31');
INSERT INTO inventory VALUES (10007, 10, 1, 264, 40, '2026-08-12');
INSERT INTO inventory VALUES (10008, 10, 4, 475, 46, '2026-08-27');
INSERT INTO inventory VALUES (10009, 10, 6, 176, 36, '2026-08-31');
INSERT INTO inventory VALUES (10010, 10, 2, 375, 71, '2026-09-06');
INSERT INTO inventory VALUES (10011, 10, 7, 222, 65, '2026-08-13');
INSERT INTO inventory VALUES (10012, 10, 14, 459, 76, '2026-08-12');
INSERT INTO inventory VALUES (10013, 10, 5, 336, 91, '2026-09-06');
INSERT INTO inventory VALUES (10014, 10, 11, 241, 51, '2026-09-05');
INSERT INTO inventory VALUES (10015, 11, 4, 367, 58, '2026-09-05');
INSERT INTO inventory VALUES (10016, 11, 3, 191, 75, '2026-08-12');
INSERT INTO inventory VALUES (10017, 11, 10, 366, 20, '2026-09-05');
INSERT INTO inventory VALUES (10018, 11, 7, 261, 20, '2026-09-05');
INSERT INTO inventory VALUES (10019, 11, 1, 471, 96, '2026-08-12');
INSERT INTO inventory VALUES (10020, 11, 8, 147, 93, '2026-08-30');
INSERT INTO inventory VALUES (10021, 11, 5, 468, 20, '2026-08-22');
INSERT INTO inventory VALUES (10022, 11, 12, 107, 98, '2026-09-06');
INSERT INTO inventory VALUES (10023, 11, 13, 169, 45, '2026-08-27');
INSERT INTO inventory VALUES (10024, 11, 11, 212, 97, '2026-09-07');
INSERT INTO inventory VALUES (10025, 11, 2, 281, 84, '2026-08-29');
INSERT INTO inventory VALUES (10026, 11, 6, 326, 66, '2026-09-08');
INSERT INTO inventory VALUES (10027, 12, 4, 387, 78, '2026-08-13');
INSERT INTO inventory VALUES (10028, 12, 11, 265, 86, '2026-08-20');
INSERT INTO inventory VALUES (10029, 12, 2, 302, 57, '2026-08-11');
INSERT INTO inventory VALUES (10030, 12, 5, 338, 33, '2026-09-01');
INSERT INTO inventory VALUES (10031, 12, 3, 404, 86, '2026-08-12');
INSERT INTO inventory VALUES (10032, 12, 1, 191, 52, '2026-08-20');
INSERT INTO inventory VALUES (10033, 12, 7, 319, 62, '2026-08-29');
INSERT INTO inventory VALUES (10034, 12, 10, 370, 27, '2026-08-21');
INSERT INTO inventory VALUES (10035, 12, 9, 138, 63, '2026-09-08');
INSERT INTO inventory VALUES (10036, 12, 8, 323, 78, '2026-08-21');
INSERT INTO inventory VALUES (10037, 12, 6, 91, 80, '2026-08-18');
INSERT INTO inventory VALUES (10038, 12, 15, 226, 38, '2026-08-09');
INSERT INTO inventory VALUES (10039, 12, 14, 463, 29, '2026-09-02');
INSERT INTO inventory VALUES (20000, 20, 2, 84, 62, '2026-08-18');
INSERT INTO inventory VALUES (20001, 20, 15, 266, 92, '2026-08-19');
INSERT INTO inventory VALUES (20002, 20, 6, 467, 27, '2026-09-01');
INSERT INTO inventory VALUES (20003, 20, 4, 415, 69, '2026-09-04');
INSERT INTO inventory VALUES (20004, 20, 7, 168, 60, '2026-08-21');
INSERT INTO inventory VALUES (20005, 20, 8, 221, 28, '2026-08-23');
INSERT INTO inventory VALUES (20006, 20, 5, 231, 53, '2026-08-16');
INSERT INTO inventory VALUES (20007, 20, 10, 224, 66, '2026-09-06');
INSERT INTO inventory VALUES (20008, 20, 3, 439, 68, '2026-09-06');
INSERT INTO inventory VALUES (20009, 20, 14, 346, 56, '2026-08-10');
INSERT INTO inventory VALUES (20010, 20, 13, 417, 56, '2026-08-10');
INSERT INTO inventory VALUES (20011, 20, 11, 215, 95, '2026-09-04');
INSERT INTO inventory VALUES (20012, 21, 15, 312, 37, '2026-08-17');
INSERT INTO inventory VALUES (20013, 21, 9, 116, 43, '2026-08-18');
INSERT INTO inventory VALUES (20014, 21, 8, 145, 87, '2026-08-14');
INSERT INTO inventory VALUES (20015, 21, 7, 344, 85, '2026-09-06');
INSERT INTO inventory VALUES (20016, 21, 13, 453, 73, '2026-09-04');
INSERT INTO inventory VALUES (20017, 21, 12, 105, 46, '2026-08-20');
INSERT INTO inventory VALUES (20018, 21, 3, 173, 86, '2026-08-25');
INSERT INTO inventory VALUES (20019, 21, 2, 118, 45, '2026-09-08');
INSERT INTO inventory VALUES (20020, 21, 14, 275, 79, '2026-08-27');
INSERT INTO inventory VALUES (20021, 21, 6, 161, 49, '2026-08-18');
INSERT INTO inventory VALUES (20022, 21, 10, 297, 62, '2026-08-17');
INSERT INTO inventory VALUES (20023, 21, 4, 156, 87, '2026-08-26');
INSERT INTO inventory VALUES (30000, 30, 3, 172, 70, '2026-08-14');
INSERT INTO inventory VALUES (30001, 30, 2, 302, 78, '2026-08-23');
INSERT INTO inventory VALUES (30002, 30, 1, 130, 68, '2026-08-28');
INSERT INTO inventory VALUES (30003, 30, 6, 75, 92, '2026-08-16');
INSERT INTO inventory VALUES (30004, 30, 11, 421, 30, '2026-08-21');
INSERT INTO inventory VALUES (30005, 30, 10, 280, 43, '2026-08-26');
INSERT INTO inventory VALUES (30006, 30, 14, 147, 22, '2026-09-08');
INSERT INTO inventory VALUES (30007, 30, 9, 244, 52, '2026-09-03');
INSERT INTO inventory VALUES (30008, 30, 5, 88, 27, '2026-08-10');
INSERT INTO inventory VALUES (30009, 30, 12, 374, 39, '2026-08-28');
INSERT INTO inventory VALUES (30010, 31, 11, 258, 47, '2026-08-22');
INSERT INTO inventory VALUES (30011, 31, 9, 455, 75, '2026-08-26');
INSERT INTO inventory VALUES (30012, 31, 2, 372, 60, '2026-09-04');
INSERT INTO inventory VALUES (30013, 31, 14, 431, 40, '2026-08-13');
INSERT INTO inventory VALUES (30014, 31, 4, 394, 40, '2026-08-27');
INSERT INTO inventory VALUES (30015, 31, 7, 384, 67, '2026-08-29');
INSERT INTO inventory VALUES (30016, 31, 5, 229, 88, '2026-09-06');
INSERT INTO inventory VALUES (30017, 31, 12, 435, 86, '2026-09-06');
INSERT INTO inventory VALUES (30018, 31, 3, 101, 41, '2026-08-27');
INSERT INTO inventory VALUES (30019, 31, 10, 92, 59, '2026-08-29');
INSERT INTO inventory VALUES (30020, 31, 1, 55, 43, '2026-08-21');

-- Insert orders
INSERT INTO orders VALUES (5000, 105, 12, '2026-08-03', 'Processing', 4068000.0);
INSERT INTO orders VALUES (5001, 104, 12, '2026-08-29', 'Shipped', 1803600.0);
INSERT INTO orders VALUES (5002, 100, 11, '2026-08-29', 'Delivered', 198000.0);
INSERT INTO orders VALUES (5003, 105, 10, '2026-07-29', 'Delivered', 1586000.0);
INSERT INTO orders VALUES (5004, 102, 12, '2026-08-03', 'Shipped', 1023000.0);
INSERT INTO orders VALUES (5005, 101, 11, '2026-07-26', 'Delivered', 122500.0);
INSERT INTO orders VALUES (5006, 102, 12, '2026-08-13', 'Processing', 1780300.0);
INSERT INTO orders VALUES (5007, 103, 10, '2026-07-29', 'Processing', 553000.0);
INSERT INTO orders VALUES (6000, 201, 21, '2026-07-28', 'Delivered', 38500.0);
INSERT INTO orders VALUES (6001, 202, 21, '2026-08-24', 'Processing', 738000.0);
INSERT INTO orders VALUES (6002, 200, 21, '2026-08-27', 'Delivered', 4232500.0);
INSERT INTO orders VALUES (6003, 200, 20, '2026-08-18', 'Shipped', 69000.0);
INSERT INTO orders VALUES (6004, 201, 21, '2026-07-26', 'Shipped', 2643700.0);
INSERT INTO orders VALUES (6005, 202, 20, '2026-08-13', 'Delivered', 13200.0);
INSERT INTO orders VALUES (6006, 200, 20, '2026-08-27', 'Shipped', 2768500.0);
INSERT INTO orders VALUES (7000, 301, 30, '2026-08-01', 'Shipped', 1197000.0);
INSERT INTO orders VALUES (7001, 300, 31, '2026-08-03', 'Delivered', 340000.0);
INSERT INTO orders VALUES (7002, 300, 30, '2026-07-10', 'Shipped', 1131500.0);
INSERT INTO orders VALUES (7003, 304, 31, '2026-08-14', 'Delivered', 903000.0);
INSERT INTO orders VALUES (7004, 300, 30, '2026-07-20', 'Processing', 2869500.0);
INSERT INTO orders VALUES (7005, 302, 31, '2026-08-25', 'Delivered', 3706000.0);
INSERT INTO orders VALUES (7006, 305, 31, '2026-07-13', 'Processing', 5077600.0);
INSERT INTO orders VALUES (7007, 304, 31, '2026-07-25', 'Delivered', 1137000.0);
INSERT INTO orders VALUES (7008, 303, 31, '2026-07-18', 'Processing', 56400.0);
INSERT INTO orders VALUES (7009, 305, 31, '2026-08-06', 'Processing', 341500.0);

-- Insert order_item
INSERT INTO order_item VALUES (40000, 5000, 10, 39, 12000.0);
INSERT INTO order_item VALUES (40001, 5000, 5, 48, 25000.0);
INSERT INTO order_item VALUES (40002, 5000, 2, 40, 60000.0);
INSERT INTO order_item VALUES (40003, 5001, 8, 48, 5500.0);
INSERT INTO order_item VALUES (40004, 5001, 2, 25, 60000.0);
INSERT INTO order_item VALUES (40005, 5001, 15, 33, 1200.0);
INSERT INTO order_item VALUES (40006, 5002, 11, 44, 2500.0);
INSERT INTO order_item VALUES (40007, 5002, 6, 11, 8000.0);
INSERT INTO order_item VALUES (40008, 5003, 7, 49, 22000.0);
INSERT INTO order_item VALUES (40009, 5003, 4, 24, 4500.0);
INSERT INTO order_item VALUES (40010, 5003, 5, 16, 25000.0);
INSERT INTO order_item VALUES (40011, 5004, 8, 38, 5500.0);
INSERT INTO order_item VALUES (40012, 5004, 7, 37, 22000.0);
INSERT INTO order_item VALUES (40013, 5005, 11, 49, 2500.0);
INSERT INTO order_item VALUES (40014, 5006, 13, 16, 18000.0);
INSERT INTO order_item VALUES (40015, 5006, 8, 21, 5500.0);
INSERT INTO order_item VALUES (40016, 5006, 15, 14, 1200.0);
INSERT INTO order_item VALUES (40017, 5006, 1, 16, 85000.0);
INSERT INTO order_item VALUES (40018, 5007, 11, 44, 2500.0);
INSERT INTO order_item VALUES (40019, 5007, 14, 14, 6000.0);
INSERT INTO order_item VALUES (40020, 5007, 9, 10, 15000.0);
INSERT INTO order_item VALUES (40021, 5007, 8, 38, 5500.0);
INSERT INTO order_item VALUES (50000, 6000, 12, 11, 3500.0);
INSERT INTO order_item VALUES (50001, 6001, 13, 41, 18000.0);
INSERT INTO order_item VALUES (50002, 6002, 1, 49, 85000.0);
INSERT INTO order_item VALUES (50003, 6002, 4, 15, 4500.0);
INSERT INTO order_item VALUES (50004, 6003, 3, 46, 1500.0);
INSERT INTO order_item VALUES (50005, 6004, 6, 41, 8000.0);
INSERT INTO order_item VALUES (50006, 6004, 8, 29, 5500.0);
INSERT INTO order_item VALUES (50007, 6004, 15, 26, 1200.0);
INSERT INTO order_item VALUES (50008, 6004, 1, 25, 85000.0);
INSERT INTO order_item VALUES (50009, 6005, 15, 11, 1200.0);
INSERT INTO order_item VALUES (50010, 6006, 11, 25, 2500.0);
INSERT INTO order_item VALUES (50011, 6006, 10, 13, 12000.0);
INSERT INTO order_item VALUES (50012, 6006, 1, 30, 85000.0);
INSERT INTO order_item VALUES (60000, 7000, 4, 16, 4500.0);
INSERT INTO order_item VALUES (60001, 7000, 5, 45, 25000.0);
INSERT INTO order_item VALUES (60002, 7001, 14, 31, 6000.0);
INSERT INTO order_item VALUES (60003, 7001, 8, 28, 5500.0);
INSERT INTO order_item VALUES (60004, 7002, 3, 44, 1500.0);
INSERT INTO order_item VALUES (60005, 7002, 6, 39, 8000.0);
INSERT INTO order_item VALUES (60006, 7002, 8, 37, 5500.0);
INSERT INTO order_item VALUES (60007, 7002, 5, 22, 25000.0);
INSERT INTO order_item VALUES (60008, 7003, 10, 29, 12000.0);
INSERT INTO order_item VALUES (60009, 7003, 9, 37, 15000.0);
INSERT INTO order_item VALUES (60010, 7004, 3, 41, 1500.0);
INSERT INTO order_item VALUES (60011, 7004, 13, 16, 18000.0);
INSERT INTO order_item VALUES (60012, 7004, 2, 42, 60000.0);
INSERT INTO order_item VALUES (60013, 7005, 6, 38, 8000.0);
INSERT INTO order_item VALUES (60014, 7005, 13, 31, 18000.0);
INSERT INTO order_item VALUES (60015, 7005, 1, 30, 85000.0);
INSERT INTO order_item VALUES (60016, 7005, 14, 49, 6000.0);
INSERT INTO order_item VALUES (60017, 7006, 15, 23, 1200.0);
INSERT INTO order_item VALUES (60018, 7006, 1, 46, 85000.0);
INSERT INTO order_item VALUES (60019, 7006, 10, 29, 12000.0);
INSERT INTO order_item VALUES (60020, 7006, 13, 44, 18000.0);
INSERT INTO order_item VALUES (60021, 7007, 4, 30, 4500.0);
INSERT INTO order_item VALUES (60022, 7007, 6, 30, 8000.0);
INSERT INTO order_item VALUES (60023, 7007, 9, 34, 15000.0);
INSERT INTO order_item VALUES (60024, 7007, 10, 21, 12000.0);
INSERT INTO order_item VALUES (60025, 7008, 15, 47, 1200.0);
INSERT INTO order_item VALUES (60026, 7009, 6, 35, 8000.0);
INSERT INTO order_item VALUES (60027, 7009, 3, 41, 1500.0);

-- Insert shipment
INSERT INTO shipment VALUES (8000, 5001, 'Chandigarh', 'Chandigarh', '2026-08-31', '2026-09-03', NULL, 'Shipped');
INSERT INTO shipment VALUES (8001, 5002, 'Delhi', 'Lucknow', '2026-08-31', '2026-09-06', '2026-09-08', 'Delivered');
INSERT INTO shipment VALUES (8002, 5003, 'Delhi', 'Lucknow', '2026-07-30', '2026-08-04', '2026-08-06', 'Delivered');
INSERT INTO shipment VALUES (8003, 5004, 'Chandigarh', 'Lucknow', '2026-08-05', '2026-08-12', NULL, 'Shipped');
INSERT INTO shipment VALUES (8004, 5005, 'Delhi', 'Delhi', '2026-07-27', '2026-07-31', '2026-07-31', 'Delivered');
INSERT INTO shipment VALUES (9000, 6000, 'Surat', 'Surat', '2026-07-29', '2026-08-03', '2026-08-05', 'Delivered');
INSERT INTO shipment VALUES (9001, 6002, 'Surat', 'Ahmedabad', '2026-08-30', '2026-09-02', '2026-09-04', 'Delivered');
INSERT INTO shipment VALUES (9002, 6003, 'Ahmedabad', 'Ahmedabad', '2026-08-21', '2026-08-26', NULL, 'Shipped');
INSERT INTO shipment VALUES (9003, 6004, 'Surat', 'Ahmedabad', '2026-07-28', '2026-08-03', NULL, 'Shipped');
INSERT INTO shipment VALUES (9004, 6005, 'Ahmedabad', 'Ahmedabad', '2026-08-15', '2026-08-22', '2026-08-21', 'Delivered');
INSERT INTO shipment VALUES (9005, 6006, 'Ahmedabad', 'Surat', '2026-08-28', '2026-08-31', NULL, 'Shipped');
INSERT INTO shipment VALUES (10000, 7000, 'Chennai', 'Chennai', '2026-08-04', '2026-08-09', NULL, 'Shipped');
INSERT INTO shipment VALUES (10001, 7001, 'Bengaluru', 'Bengaluru', '2026-08-06', '2026-08-11', '2026-08-12', 'Delivered');
INSERT INTO shipment VALUES (10002, 7002, 'Chennai', 'Chennai', '2026-07-11', '2026-07-18', NULL, 'Shipped');
INSERT INTO shipment VALUES (10003, 7003, 'Bengaluru', 'Chennai', '2026-08-16', '2026-08-20', '2026-08-19', 'Delivered');
INSERT INTO shipment VALUES (10004, 7005, 'Bengaluru', 'Chennai', '2026-08-27', '2026-08-31', '2026-08-31', 'Delivered');
INSERT INTO shipment VALUES (10005, 7007, 'Bengaluru', 'Hyderabad', '2026-07-28', '2026-08-01', '2026-08-01', 'Delivered');

