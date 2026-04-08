DROP DATABASE IF EXISTS QuanCafeNho;
CREATE DATABASE QuanCafeNho;
USE QuanCafeNho;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    theme VARCHAR(20) DEFAULT 'spring',
    createdAt VARCHAR(50)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    imageUrl VARCHAR(255)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    items TEXT, -- Lưu nguyên mảng giỏ hàng dạng chuỗi JSON
    total INT NOT NULL,
    status VARCHAR(50) DEFAULT 'Chờ duyệt',
    createdAt VARCHAR(50)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    message VARCHAR(255),
    isRead BOOLEAN DEFAULT false
);

-- Bơm dữ liệu mẫu
INSERT INTO users (username, password, role, theme, createdAt) VALUES 
('admin', '123', 'staff', 'spring', '19/03/2026'),
('khach', '123', 'customer', 'autumn', '19/03/2026');

INSERT INTO products (name, price, imageUrl) VALUES 
('Cà phê đen đá', 20000, 'http://localhost:3000/1.png'),
('Bạc xỉu', 25000, 'http://localhost:3000/2.png'),
('Trà đào cam sả', 45000, 'http://localhost:3000/3.png'),
('Trà chanh', 30000, 'http://localhost:3000/4.png'),
('Sữa chua xoài', 45000, 'http://localhost:3000/5.png'),
('Tà tưa', 28000, 'http://localhost:3000/6.png');