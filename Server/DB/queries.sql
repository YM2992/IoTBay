DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_product;
DROP TABLE IF EXISTS access_logs;


CREATE TABLE user (
    userid INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone int NOT NULL DEFAULT 123456789,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    address VARCHAR(100),
    activate boolean NOT NULL DEFAULT true,
    role varchar(8) NOT NULL Check (role in ('customer', 'manager', 'staff', 'owner')) DEFAULT 'customer'
);

CREATE TABLE access_logs (
    logid INTEGER PRIMARY KEY,
    userid INTEGER NOT NULL,
    login_time DATETIME,
    logout_time DATETIME,
    FOREIGN KEY (userid) REFERENCES user(userid)
);

CREATE TABLE product (
    productid INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price float NOT NULL check(price >= 0),
    quantity int NOT NULL check(quantity >= 0),
    description VARCHAR(100),
    image VARCHAR(100) DEFAULT 'default_image',
    available boolean DEFAULT true
);

CREATE TABLE orders(
    orderid INTEGER PRIMARY KEY,
    paymentID VARCHAR(100),
    address VARCHAR(100) NOT NULL DEFAULT '1 The Street Ultimo',
    amount float NOT NULL check(amount >= 0),
    status varchar(10) NOT NULL Check (status IN ('fulfilled', 'pending', 'cancelled', 'delivered', 'paid')) DEFAULT 'pending',
    orderDate date DEFAULT CURRENT_DATE,
    userid INTEGER,
    FOREIGN KEY (userid) REFERENCES user(userid),
    CHECK (
        (status IN ('paid', 'fulfilled', 'delivered') AND paymentID IS NOT NULL)
        OR
        (status IN ('pending', 'cancelled'))
    )
);

CREATE TABLE order_product (
    orderid INTEGER,
    productid INTEGER,
    quantity int NOT NULL check(quantity > 0),
    PRIMARY KEY (orderid, productid),
    FOREIGN KEY (orderid) REFERENCES orders(orderid),
    FOREIGN KEY (productid) REFERENCES product(productid)
);

UPDATE user SET activate = 1; 
INSERT INTO user (name, phone, email, password, role) VALUES
('Yasir Test', 0420555666, 'yasir@test.com', '$2b$12$AQDnbnawQkAeeQmKFhjNpe.eoDuoVLyDRhJEvRRwYF4j9wEzbk6wW', 'manager'),
('Jeff Test', 0420222333, 'jeff@test.com', '$2b$12$yTgqJX5rr9KafAU2aDDJQuTpuqW0RN.ubNNroElpXaOLYjf.y00Ze', 'manager'),
('Customer Test', 0420111222, 'random@test.com', '$2b$12$7we9rbwYFCwnHmI0as757Ol4bBam2lzA/ICKP4pYUgQs1I5A8oh9O', 'customer'),
('John Test', 0420111000, 'john@test.com', '$2b$12$v7q4jwss4Ory6pO/ILhnhOr4QfzzR/BDQQ12EUUq8I/3XJxv4a9.6', 'staff');


INSERT INTO product (name, price, quantity, description, image) VALUES
('Raspberry Pi 4 Model B', 85, 10, 'A small computer that can be used for a variety of projects', 'Rash'),
('Raspberry Pi 3', 65, 10, 'A small computer that can be used for a variety of projects', 'Rash'),
('Arduino Uno', 13, 5, 'A microcontroller that can be used for a variety of projects', 'Aduino'),
('ESP32', 7, 87, 'A microcontroller that can be used for a variety of projects', 'Wifi'),
('LoRaWAN Gateway', 70, 87, 'A long range wireless communication gateway', 'Wifi'),
('Switch', 20, 87, 'A network switch', 'Network'),
('WROOM-32', 3, 87, 'A microcontroller that can be used for a variety of projects', 'Wifi');

INSERT INTO product (name, price, quantity, description) VALUES('Test Product', 10, 87, 'A test product making non sense');

INSERT INTO orders (paymentID, amount, status, orderDate, userid) VALUES
('PAY12345', 109.98, 'paid', '2025-03-14', (SELECT userid FROM user WHERE email = 'random@test.com')),
('PAY67890', 45.50, 'fulfilled', '2025-03-14', (SELECT userid FROM user WHERE email = 'jeff@test.com')),
('PAY54321', 79.99, 'delivered', '2025-03-13', (SELECT userid FROM user WHERE email = 'random@test.com'));

INSERT INTO orders ( amount, status, orderDate, userid) VALUES
( 145.50, 'pending', '2025-03-15', (SELECT userid FROM user WHERE email = 'yasir@test.com'));

INSERT INTO order_product (orderid, productid, quantity) VALUES
((SELECT orderid FROM orders WHERE paymentID = 'PAY12345'), 
 (SELECT productid FROM product WHERE name = 'Raspberry Pi 3'), 1),

((SELECT orderid FROM orders WHERE paymentID = 'PAY12345'), 
 (SELECT productid FROM product WHERE name = 'Arduino Uno'), 1),

((SELECT orderid FROM orders WHERE paymentID = 'PAY67890'), 
 (SELECT productid FROM product WHERE name = 'LoRaWAN Gateway'), 1),

((SELECT orderid FROM orders WHERE paymentID = 'PAY54321'), 
 (SELECT productid FROM product WHERE name = 'Switch'), 2);



SELECT * FROM user;
SELECT * FROM product;
SELECT * FROM orders;
SELECT * FROM order_product;