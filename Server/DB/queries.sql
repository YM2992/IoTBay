DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_product;


CREATE TABLE IF NOT EXISTS user (
    userid INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone int NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role varchar(8) Check (role in ('customer', 'manager', 'staff', 'owner')AND NOT NULL) DEFAULT 'customer'
);

CREATE TABLE IF NOT EXISTS product (
    productid INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price float NOT NULL check(price >= 0),
    quantity int NOT NULL check(quantity >= 0),
    description VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS orders(
    orderid INTEGER PRIMARY KEY,
    paymentID VARCHAR(100),
    amount float NOT NULL check(amount >= 0),
    status varchar(10) Check (status in ('fulfilled', 'pending', 'cancelled', 'delivered', 'paid')AND NOT NULL) DEFAULT 'pending',
    orderDate date DEFAULT CURRENT_DATE,
    userid INTEGER,
    FOREIGN KEY (userid) REFERENCES user(user)
);

CREATE TABLE IF NOT EXISTS order_product (
    orderid INTEGER,
    productid INTEGER,
    quantity int NOT NULL check(quantity > 0),
    PRIMARY KEY (orderid, productid),
    FOREIGN KEY (orderid) REFERENCES orders(orderid),
    FOREIGN KEY (productid) REFERENCES product(productid)
);




INSERT INTO user (name, phone, email, password, role) VALUES
('Alice Johnson', 1234567890, 'alice@example.com', 'password123', 'customer'),
('Bob Smith', 9876543210, 'bob@example.com', 'securepass456', 'manager'),
('Charlie Brown', 5556667777, 'charlie@example.com', 'charliepass789', 'staff');

INSERT INTO product (name, price, quantity, description) VALUES
('Mechanical Keyboard', 79.99, 50, 'RGB backlit mechanical keyboard'),
('Wireless Mouse', 29.99, 100, 'Ergonomic wireless mouse'),
('USB-C Hub', 45.50, 30, '5-in-1 USB-C hub with HDMI and USB 3.0');

INSERT INTO orders (paymentID, amount, status, orderDate, userid) VALUES
('PAY12345', 109.98, 'paid', '2025-03-14', (SELECT userid FROM user WHERE email = 'alice@example.com')),
('PAY67890', 45.50, 'pending', '2025-03-14', (SELECT userid FROM user WHERE email = 'bob@example.com')),
('PAY54321', 79.99, 'delivered', '2025-03-13', (SELECT userid FROM user WHERE email = 'alice@example.com'));

INSERT INTO order_product (orderid, productid, quantity) VALUES
((SELECT orderid FROM orders WHERE paymentID = 'PAY12345'), 
 (SELECT productid FROM product WHERE name = 'Mechanical Keyboard'), 1),

((SELECT orderid FROM orders WHERE paymentID = 'PAY12345'), 
 (SELECT productid FROM product WHERE name = 'Wireless Mouse'), 1),

((SELECT orderid FROM orders WHERE paymentID = 'PAY67890'), 
 (SELECT productid FROM product WHERE name = 'USB-C Hub'), 1),

((SELECT orderid FROM orders WHERE paymentID = 'PAY54321'), 
 (SELECT productid FROM product WHERE name = 'Mechanical Keyboard'), 1);



SELECT * FROM user;
SELECT * FROM product;
SELECT * FROM orders;
SELECT * FROM order_product;