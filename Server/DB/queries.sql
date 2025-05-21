DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS payment_card;
DROP TABLE IF EXISTS access_logs;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS order_product;
DROP TABLE IF EXISTS order_payment;
DROP TABLE IF EXISTS address_book;
DROP TABLE IF EXISTS supplier;

CREATE TABLE user (
    userid INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone int NOT NULL DEFAULT 123456789,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    address VARCHAR(100),
    activate boolean NOT NULL DEFAULT true,
    role varchar(8) NOT NULL Check (role in ('customer','admin' ,'manager', 'staff', 'owner')) DEFAULT 'customer'
); 

CREATE TABLE payment_card (
    cardid INTEGER PRIMARY KEY,
    cardNumber VARCHAR(16) NOT NULL UNIQUE,
    cardholderName VARCHAR(100) NOT NULL,
    expiryDate DATE NOT NULL,
    cvv int NOT NULL,
    userid INTEGER,
    FOREIGN KEY (userid) REFERENCES user(userid)
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
    image VARCHAR(256) DEFAULT 'default_image',
    supplier  DEFAULT -- maybe delete 
    available boolean DEFAULT true
);

-- new area ... maybe add feild for list of items they supply?
CREATE TABLE supplier (
    supplierid INTEGER PRIMARY KEY,
    contactName VARCHAR(20) NOT NULL,
    companyName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(100) NOT NULL,
    activate boolean NOT NULL DEFAULT true
);

CREATE TABLE orders(
    orderid INTEGER PRIMARY KEY,
    address VARCHAR(100) NOT NULL DEFAULT '1 The Street Ultimo',
    amount float NOT NULL check(amount >= 0),
    status varchar(10) NOT NULL Check (status IN ('fulfilled', 'pending', 'cancelled', 'delivered', 'paid')) DEFAULT 'pending',
    orderDate date DEFAULT CURRENT_DATE,
    userid INTEGER,
    FOREIGN KEY (userid) REFERENCES user(userid),
    CHECK (
        (status IN ('paid', 'fulfilled', 'delivered'))
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

CREATE TABLE order_payment (
    paymentid INTEGER PRIMARY KEY,
    paymentDate DATE DEFAULT CURRENT_DATE,
    amount float NOT NULL check(amount >= 0),
    userid INTEGER,
    cardNumber VARCHAR(16) NOT NULL,
    orderid INTEGER NOT NULL,
    FOREIGN KEY (orderid) REFERENCES orders(orderid)
);

CREATE TABLE address_book (
    addressid INTEGER PRIMARY KEY,
    userid INTEGER,
    recipient VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone int NOT NULL DEFAULT 123456789,
    is_default boolean NOT NULL DEFAULT false,
    FOREIGN KEY (userid) REFERENCES user(userid)
);

UPDATE user SET activate = 1; 

INSERT INTO user (name, phone, email, password, role) VALUES
('Yasir Test', 0420555666, 'yasir@test.com', '$2b$12$AQDnbnawQkAeeQmKFhjNpe.eoDuoVLyDRhJEvRRwYF4j9wEzbk6wW', 'admin'),
('AdminUser',420764361,'admin@test.com','$2b$12$442c4CjxhkckV3CBIuFEXOV/tWufO.bCcjNv/vF4Cen5pCPmOknLm','admin'),
('Jeff Test', 0420222333, 'jeff@test.com', '$2b$12$yTgqJX5rr9KafAU2aDDJQuTpuqW0RN.ubNNroElpXaOLYjf.y00Ze', 'manager'),
('Customer Test', 0420111222, 'random@test.com', '$2b$12$7we9rbwYFCwnHmI0as757Ol4bBam2lzA/ICKP4pYUgQs1I5A8oh9O', 'customer'),
('John Test', 0420111000, 'john@test.com', '$2b$12$v7q4jwss4Ory6pO/ILhnhOr4QfzzR/BDQQ12EUUq8I/3XJxv4a9.6', 'staff');

INSERT INTO payment_card (cardNumber, cardHolderName, expiryDate, cvv, userid) VALUES
('1234567812345678', 'Yasir Test', '10/25', 123, (SELECT userid FROM user WHERE email = 'yasir@test.com')),
('1111222233334444', 'Customer Test', '01/23', 789, (SELECT userid FROM user WHERE email = 'random@test.com')),
('4444333322221111', 'John Test', '05/26', 321, (SELECT userid FROM user WHERE email = 'john@test.com')),
('2222333344445555', 'Jeff Test', '12/24', 456, (SELECT userid FROM user WHERE email = 'jeff@test.com')),
('5555666677778888', 'Jeff Test', '11/25', 654, (SELECT userid FROM user WHERE email = 'jeff@test.com'));

INSERT INTO product (name, price, quantity, description, image) VALUES
('Raspberry Pi 4 Model B', 85, 10, 'A small computer that can be used for a variety of projects', 'https://core-electronics.com.au/media/catalog/product/cache/d5cf359726a1656c2b36f3682d3bbc67/p/i/pi-4-6.jpg'),
('Raspberry Pi 3', 65, 10, 'A small computer that can be used for a variety of projects', 'https://m.media-amazon.com/images/I/71xW3XMkbwL.jpg'),
('Arduino Uno', 13, 5, 'A microcontroller that can be used for a variety of projects', 'Aduino'),
('ESP32', 7, 87, 'A microcontroller that can be used for a variety of projects', 'https://m.media-amazon.com/images/I/61o2ZUzB4XL.jpg'),
('LoRaWAN Gateway', 70, 87, 'A long range wireless communication gateway', 'https://eu.mouser.com/images/marketingid/2019/img/142462271.png?v=070223.0400'),
('Switch', 20, 87, 'A network switch', 'Network'),
('WROOM-32', 3, 87, 'A microcontroller that can be used for a variety of projects', 'https://au.mouser.com/images/marketingid/2018/img/199600425.png?v=121124.1217'),
('LED Strip', 15, 87, 'A flexible circuit board with LEDs', 'https://res.cloudinary.com/rsc/image/upload/b_rgb:FFFFFF,c_pad,dpr_2.625,f_auto,h_214,q_auto,w_380/c_pad,h_214,w_380/R8904391-01?pgw=1'),
('Breadboard', 5, 87, 'A board for prototyping electronic circuits', 'https://raspberry.piaustralia.com.au/cdn/shop/products/s50-5439p01wl.jpg?v=1573624909'),
('Resistor Pack', 2, 87, 'A pack of resistors for electronic circuits', 'https://m.media-amazon.com/images/I/517sCkbv+nL._AC_UF894,1000_QL80_.jpg'),
('Capacitor Pack', 3, 87, 'A pack of capacitors for electronic circuits', 'https://www.voltaat.com/cdn/shop/products/voltaat-voltaat-capacitor-kit-12-values-120-pack-15535211020390.jpg?v=1628440386'),
('Transistor Pack', 4, 87, 'A pack of transistors for electronic circuits', 'https://core-electronics.com.au/media/catalog/product/cache/d5cf359726a1656c2b36f3682d3bbc67/f/i/fit0322.jpg'),
('Diode Pack', 5, 87, 'A pack of diodes for electronic circuits', 'https://media.jaycar.com.au/product/images/ZR1005_economical-diode-pack_33248.jpg'),
('LED Pack', 6, 87, 'A pack of LEDs for electronic circuits', 'https://www.makerstore.com.au/wp-content/uploads/2017/09/ELEC-LED-300PACK-02.jpg'),
('Sensor Pack', 7, 87, 'A pack of assorted sensors for electronic circuits', 'https://www.makerstore.com.au/wp-content/uploads/2017/09/ELEC-SENSOR-37PACK-10.jpg'),
('5V DC Motor', 8, 87, 'A 5 volt DC motor', 'https://au.element14.com/productimages/large/en_GB/599104-40.jpg'),
('18650 Lithium Battery', 9, 87, 'A 18650 lithium battery for electronic circuits', 'https://monocure3d.com.au/wp-content/uploads/2021/10/INCREDAFILL_LOGO_BATT.jpg'),
('Adjustable Variable Benchtop Power Supply', 120, 87, 'A power supply for electronic circuits', 'https://media.jaycar.com.au/product/images/MP3840_0-to-30vdc-0-to-5a-regulated-power-supply_70546.jpg');

INSERT INTO orders (amount, status, orderDate, userid) VALUES
(109.98, 'paid', '2025-03-14', (SELECT userid FROM user WHERE email = 'random@test.com')),
(45.50, 'fulfilled', '2025-03-14', (SELECT userid FROM user WHERE email = 'jeff@test.com')),
(79.99, 'delivered', '2025-03-13', (SELECT userid FROM user WHERE email = 'random@test.com')),
(120.00, 'paid', '2025-03-16', (SELECT userid FROM user WHERE email = 'jeff@test.com')),
(75.25, 'delivered', '2025-03-17', (SELECT userid FROM user WHERE email = 'jeff@test.com')),
(50.00, 'fulfilled', '2025-03-18', (SELECT userid FROM user WHERE email = 'jeff@test.com')),
(145.50, 'pending', '2025-03-15', null);

INSERT INTO orders ( amount, status, orderDate, userid) VALUES
( 145.50, 'pending', '2025-03-15', (SELECT userid FROM user WHERE email = 'yasir@test.com'));

-- New supplier table
INSERT INTO supplier (contactName, companyName, email, address) VALUES
('Kirby Pie', 'Raspberry Pi', 'raspberry@gmail.com', '255 Pitt St, Sydney NSW 2000, Australia'),
('David Park', 'Arduino', 'David.Arduino@gmail.com', '201 Kent St, Sydney NSW 2000, Australia');

INSERT INTO order_product (orderid, productid, quantity) VALUES
(1, (SELECT productid FROM product WHERE name = 'Raspberry Pi 4 Model B'), 1),
(1, (SELECT productid FROM product WHERE name = 'Raspberry Pi 3'), 2),
(2, (SELECT productid FROM product WHERE name = 'Arduino Uno'), 1),
(3, (SELECT productid FROM product WHERE name = 'ESP32'), 3),
(4, (SELECT productid FROM product WHERE name = 'LoRaWAN Gateway'), 1),
(5, (SELECT productid FROM product WHERE name = 'Switch'), 2),
(6, (SELECT productid FROM product WHERE name = 'WROOM-32'), 5),
(7, (SELECT productid FROM product WHERE name = 'Test Product'), 1);

INSERT INTO order_payment (paymentDate, amount, userid, cardNumber, orderid) VALUES
('2025-03-14', 109.98, (SELECT userid FROM user WHERE email = 'random@test.com'), '1111222233334444', 1),
('2025-03-14', 45.50, (SELECT userid FROM user WHERE email = 'jeff@test.com'), '2222333344445555', 2),
('2025-03-13', 79.99, (SELECT userid FROM user WHERE email = 'random@test.com'), '1111222233334444', 3),
('2025-03-16', 120.00, (SELECT userid FROM user WHERE email = 'jeff@test.com'), '5555666677778888', 4),
('2025-03-17', 75.25, (SELECT userid FROM user WHERE email = 'jeff@test.com'), '2222333344445555', 5),
('2025-03-18', 50.00, (SELECT userid FROM user WHERE email = 'jeff@test.com'), '5555666677778888', 6),
('2025-03-15', 145.50, (SELECT userid FROM user WHERE email = 'yasir@test.com'), '1234567812345678', 7),
('2025-03-19', 60.00, (SELECT userid FROM user WHERE email = 'john@test.com'), '4444333322221111', 1),
('2025-03-20', 80.00, (SELECT userid FROM user WHERE email = 'random@test.com'), '1111222233334444', 2),
('2025-03-21', 95.00, (SELECT userid FROM user WHERE email = 'jeff@test.com'), '2222333344445555', 3),
('2025-03-22', 110.00, (SELECT userid FROM user WHERE email = 'yasir@test.com'), '1234567812345678', 4),
('2025-03-23', 130.00, (SELECT userid FROM user WHERE email = 'john@test.com'), '4444333322221111', 5),
('2025-03-24', 70.00, (SELECT userid FROM user WHERE email = 'random@test.com'), '1111222233334444', 6),
('2025-03-25', 85.00, (SELECT userid FROM user WHERE email = 'jeff@test.com'), '5555666677778888', 7),
('2025-03-26', 100.00, (SELECT userid FROM user WHERE email = 'yasir@test.com'), '1234567812345678', 1),
('2025-03-27', 115.00, (SELECT userid FROM user WHERE email = 'john@test.com'), '4444333322221111', 2),
('2025-03-28', 125.00, (SELECT userid FROM user WHERE email = 'random@test.com'), '1111222233334444', 3),
('2025-03-29', 140.00, (SELECT userid FROM user WHERE email = 'jeff@test.com'), '2222333344445555', 4),
('2025-03-30', 155.00, (SELECT userid FROM user WHERE email = 'yasir@test.com'), '1234567812345678', 5),
('2025-03-31', 165.00, (SELECT userid FROM user WHERE email = 'john@test.com'), '4444333322221111', 6),
('2025-03-31', 20.00, NULL, '4444333322225549', 7);

INSERT INTO address_book (userid, recipient, address, phone, is_default) VALUES
  ((SELECT userid FROM user WHERE email = 'jeff@test.com'), 'Jeff R', '2B/123 King St, Sydney NSW 2000', 0412345678, true),
  ((SELECT userid FROM user WHERE email = 'jeff@test.com'), 'Jeff R', '10 George St, Parramatta NSW 2150', 0412345678, false),
  ((SELECT userid FROM user WHERE email = 'random@test.com'), 'Bob Customer', '88 Queen St, Melbourne VIC 3000', 0423456789, true),
  ((SELECT userid FROM user WHERE email = 'random@test.com'), 'Charlie Lee', '5 High St, Brisbane VIC 4000', 0434567890, false),
  ((SELECT userid FROM user WHERE email = 'yasir@test.com'), 'Yasir M', 'Unit 12, 20 Pacific Hwy, Hornsby NSW 2077', 0434567890, true);

SELECT * FROM user;
SELECT * FROM product;
SELECT * FROM orders;
SELECT * FROM order_product;
SELECT * FROM address_book;
SELECT * FROM supplier;

-- SELECT o.orderid,address,amount,status, op.quantity, p.productid, p.name FROM orders o
-- JOIN order_product op ON op.orderid = o.orderid
-- JOIN product p ON op.productid = p.productid
-- WHERE o.orderid = 1;


-- SELECT * FROM order_product op
-- WHERE orderid = 1;