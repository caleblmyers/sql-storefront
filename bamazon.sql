DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(33) NOT NULL,
  department_name VARCHAR(33) NOT NULL,
  price FLOAT(11) NOT NULL,
  stock_quantity INT(11) NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
("USB Keyboard", "Electronics", 49.99, 300),
("Coffee Maker", "Appliances", 49.99, 550),
("iPod Nano", "Electronics", 99.99, 4),
("The Witcher 3", "Video Games", 29.99, 500),
("Cyberpunk 2077", "Video Games", 59.99, 2500),
("Blender", "Appliances", 69.99, 250),
("Mario Kart X", "Video Games", 59.99, 1500),
("Waffle Maker", "Appliances", 39.99, 350),
("CD Player", "Electronics", 29.99, 6),
("The Legend of Dragoon", "Video Games", 9.99, 3);