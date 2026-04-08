// ================= BACKEND V1: MOCK DATA (KHÔNG DÙNG MYSQL) =================
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const SECRET_KEY = 'khoa_bao_mat_cua_quan_cafe';

// 1. KHO DỮ LIỆU TẠM THỜI (Tắt server là mất)
let users = [
  { id: 1, username: 'admin', password: '123', role: 'staff', theme: 'spring', createdAt: '10/04/2026' }
];

let products = [
  { id: 1, name: 'Cà phê đen đá', price: 20000, imageUrl: 'http://localhost:3000/1.png' },
  { id: 2, name: 'Bạc xỉu', price: 25000, imageUrl: 'http://localhost:3000/2.png' },
  { id: 3, name: 'Trà đào cam sả', price: 45000, imageUrl: 'http://localhost:3000/3.png' },
  { id: 4, name: 'Trà chanh', price: 30000, imageUrl: 'http://localhost:3000/4.png' },
  { id: 5, name: 'Sữa chua xoài', price: 45000, imageUrl: 'http://localhost:3000/5.png' },
  { id: 6, name: 'Tà tưa', price: 28000, imageUrl: 'http://localhost:3000/6.png' }
];

let orders = [];
let notifications = [];

// 2. BẢO VỆ API
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Chưa đăng nhập!' });
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token lỗi' });
    req.user = decoded; next();
  });
};

const isStaff = (req, res, next) => {
  if (req.user.role !== 'staff') return res.status(403).json({ error: 'Không có quyền' });
  next();
};

// 3. API ĐĂNG NHẬP / ĐĂNG KÝ
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) return res.status(400).json({ error: 'Trùng tên!' });
  users.push({ id: users.length + 1, username, password, role: 'customer', theme: 'spring', createdAt: new Date().toLocaleDateString() });
  res.json({ message: 'Đăng ký OK' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(400).json({ error: 'Sai thông tin' });
  const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, SECRET_KEY);
  res.json({ message: 'OK', token, role: user.role, theme: user.theme, createdAt: user.createdAt });
});

// 4. API LẤY MÓN & ĐẶT HÀNG
app.get('/api/products', (req, res) => {
  const { search } = req.query;
  if (search) return res.json(products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())));
  res.json(products);
});

app.post('/api/orders', authenticate, (req, res) => {
  orders.push({ id: orders.length + 1, userId: req.user.id, items: req.body.items, total: req.body.total, status: 'Chờ duyệt', createdAt: new Date().toLocaleString() });
  res.json({ message: 'Đặt hàng OK' });
});

app.get('/api/orders/history', authenticate, (req, res) => res.json(orders.filter(o => o.userId === req.user.id)));

// 5. API ADMIN
app.get('/api/admin/orders', authenticate, isStaff, (req, res) => res.json(orders));
app.put('/api/admin/orders/:id/status', authenticate, isStaff, (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (order) { order.status = req.body.status; notifications.push({ userId: order.userId, message: `Đơn #${order.id} hiện: ${req.body.status}` }); }
  res.json({ message: 'Cập nhật OK' });
});

app.get('/api/notifications', authenticate, (req, res) => res.json(notifications.filter(n => n.userId === req.user.id)));

app.listen(3000, () => console.log(' đang chạy tại port 3000'));