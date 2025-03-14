CREATE TABLE IF NOT EXISTS user (
    userid INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone int NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

INSERT INTO user(name, phone, email, password)
VALUES('Jeff', 0424123456, 'test@gmail.co', '1234');

SELECT * FROM user;