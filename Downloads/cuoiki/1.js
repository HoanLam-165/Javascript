// ================= BACKEND CAFE APP (PHIÊN BẢN MYSQL XỊN) =================

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mysql = require('mysql2'); 
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const SECRET_KEY = 'khoa_bao_mat_cua_quan_cafe';

// Kết nối Database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           
  password: '',           
  database: 'QuanCafeNho' 
});

db.connect((err) => {
  if (err) {
    console.log("❌ Lỗi cắm điện tủ đông: ", err);
    return;
  }
  console.log("✅ Đã kết nối thành công với Database MySQL!");
});

// Hàm lột dấu tiếng Việt
const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

// ================= MIDDLEWARE =================
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Chưa đăng nhập!' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token thiếu!' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ!' });
    req.user = decoded;
    next();
  });
};

const isStaff = (req, res, next) => {
  if (req.user.role !== 'staff') return res.status(403).json({ error: 'Không có quyền!' });
  next();
};

// ================= ROOT =================
app.get('/', (req, res) => {
  res.send('Backend Cafe App (MySQL Version) đang chạy 🚀');
});

// ================= AUTH (SQL ĐÃ XỬ LÝ) =================
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (results.length > 0) return res.status(400).json({ error: 'Username đã tồn tại!' });
    
    const formattedDate = new Date().toLocaleDateString('vi-VN');
    
    db.query('INSERT INTO users (username, password, role, theme, createdAt) VALUES (?, ?, ?, ?, ?)', 
      [username, password, 'customer', 'spring', formattedDate], 
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Lỗi Database' });
        res.json({ message: 'Đăng ký thành công!' });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'Sai tài khoản hoặc mật khẩu!' });

    const user = results[0];
    const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, SECRET_KEY);

    res.json({ message: 'Đăng nhập thành công', token, role: user.role, theme: user.theme, createdAt: user.createdAt });
  });
});

app.put('/api/profile/theme', authenticate, (req, res) => {
  const { theme } = req.body;
  
  db.query('UPDATE users SET theme = ? WHERE id = ?', [theme, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi cập nhật Theme' });
    res.json({ message: 'Đã đổi theme', theme });
  });
});

// ================= PRODUCTS (SQL ĐÃ XỬ LÝ) =================
app.get('/api/products', (req, res) => {
  const { search } = req.query;

  db.query('SELECT * FROM products', (err, products) => {
    if (err) return res.status(500).json({ error: 'Lỗi Database' });

    if (search) {
      const normalizedSearch = removeAccents(search.toLowerCase());
      const filtered = products.filter(p => removeAccents(p.name.toLowerCase()).includes(normalizedSearch));
      return res.json(filtered);
    }
    res.json(products);
  });
});

// ================= ORDERS (SQL ĐÃ XỬ LÝ) =================
app.post('/api/orders', authenticate, (req, res) => {
  const { items, total } = req.body;
  const timeString = new Date().toLocaleString('vi-VN');
  
  // Ép mảng items thành chữ để lưu vào SQL cho dễ
  const itemsJson = JSON.stringify(items); 

  db.query('INSERT INTO orders (userId, items, total, status, createdAt) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, itemsJson, total, 'Chờ duyệt', timeString], 
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Lỗi tạo đơn hàng' });
      res.json({ message: 'Đặt hàng thành công!' });
  });
});

app.get('/api/orders/history', authenticate, (req, res) => {
  db.query('SELECT * FROM orders WHERE userId = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi DB' });
    
    // Dịch ngược chuỗi JSON thành mảng items trả cho Frontend
    const myOrders = results.map(o => ({ ...o, items: JSON.parse(o.items) }));
    res.json(myOrders);
  });
});

// ================= ADMIN (SQL ĐÃ XỬ LÝ) =================
app.get('/api/admin/orders', authenticate, isStaff, (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi DB' });
    
    const allOrders = results.map(o => ({ ...o, items: JSON.parse(o.items) }));
    res.json(allOrders);
  });
});

app.put('/api/admin/orders/:id/status', authenticate, isStaff, (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi DB' });

    // Lấy userId của cái đơn vừa sửa để gửi thông báo
    db.query('SELECT userId FROM orders WHERE id = ?', [orderId], (err, orderRes) => {
      if (orderRes.length > 0) {
        const userId = orderRes[0].userId;
        const msg = `Đơn #${orderId} hiện: ${status}`;
        db.query('INSERT INTO notifications (userId, message, isRead) VALUES (?, ?, ?)', [userId, msg, false]);
      }
      res.json({ message: 'Cập nhật thành công' });
    });
  });
});

// ================= NOTIFICATION (SQL ĐÃ XỬ LÝ) =================
app.get('/api/notifications', authenticate, (req, res) => {
  db.query('SELECT * FROM notifications WHERE userId = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi DB' });
    
    // Biến isRead (0/1) trong SQL về lại boolean (true/false) cho Frontend
    const myNotis = results.map(n => ({ ...n, isRead: n.isRead === 1 }));
    res.json(myNotis);
  });
});

// ================= START =================
app.listen(3000, () => {
  console.log('Server MySQL đang cháy rực tại http://localhost:3000 🔥');
});