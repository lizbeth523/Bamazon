DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE inventory (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(100),
    department_name VARCHAR(100),
	price FLOAT,
	stock_quantity INTEGER(11),
    PRIMARY KEY (item_id)
);

INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("Dog Food", "Pet Supplies", 14.99, 250);

INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("Dog Bowl", "Pet Supplies", 2.75, 10);

INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("Women's Jeans", "Clothing", 189.00, 14);

INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("T-Shirt", "Clothing", 19.99, 8);

INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("Blu-Ray Player", "Electronics", 99.99, 13);

INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("X-Box", "Electronics", 300.00, 98);

INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("Television", "Electronics", 349.99, 42);

INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("Table", "Furniture", 429.95, 2);

INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("Granola Bar", "Food", 1.97, 100);

INSERT INTO inventory (product_name, department_name, price, stock_quantity)
VALUES ("Louis Vuitton Handbag", "Accessories", 1300.00, 3);

SELECT * FROM inventory;


