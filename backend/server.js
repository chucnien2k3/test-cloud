const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/product');
const supplierRoutes = require('./routes/supplier');
const importRoutes = require('./routes/import');
const exportRoutes = require('./routes/export');
const warehouseRoutes = require('./routes/warehouse');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh từ thư mục frontend/build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// Danh sách user cứng
const users = [{ username: 'admin', password: 'admin' }];

// Route đăng nhập
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Yêu cầu token xác thực' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token không hợp lệ' });
        }
        req.user = user;
        next();
    });
};

// Các route API với xác thực
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/suppliers', authenticateToken, supplierRoutes);
app.use('/api/imports', authenticateToken, importRoutes);
app.use('/api/exports', authenticateToken, exportRoutes);
app.use('/api/warehouses', authenticateToken, warehouseRoutes);

// Định tuyến tất cả request không phải API về index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));