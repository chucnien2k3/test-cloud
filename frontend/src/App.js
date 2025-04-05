import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import SupplierList from './components/SupplierList';
import ImportList from './components/ImportList';
import ExportList from './components/ExportList';
import WarehouseList from './components/WarehouseList';
import Login from './components/Login';
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route 
                    path="/dashboard/*" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    );
};

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
};

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={styles.appContainer}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}>Dashboard</h2>
                <ul style={styles.sidebarList}>
                    <li style={styles.sidebarItem}>
                        <Link to="/dashboard/products" style={styles.sidebarLink}>Sản phẩm</Link>
                    </li>
                    <li style={styles.sidebarItem}>
                        <Link to="/dashboard/suppliers" style={styles.sidebarLink}>Nhà cung cấp</Link>
                    </li>
                    <li style={styles.sidebarItem}>
                        <Link to="/dashboard/imports" style={styles.sidebarLink}>Nhập kho</Link>
                    </li>
                    <li style={styles.sidebarItem}>
                        <Link to="/dashboard/exports" style={styles.sidebarLink}>Xuất kho</Link>
                    </li>
                    <li style={styles.sidebarItem}>
                        <Link to="/dashboard/warehouses" style={styles.sidebarLink}>Kho</Link>
                    </li>
                    <li style={styles.sidebarItem}>
                        <button onClick={handleLogout} style={styles.logoutButton}>Đăng xuất</button>
                    </li>
                </ul>
            </div>

            {/* Nội dung chính */}
            <div style={styles.content}>
                <Routes>
                    <Route path="products" element={<ProductList />} />
                    <Route path="suppliers" element={<SupplierList />} />
                    <Route path="imports" element={<ImportList />} />
                    <Route path="exports" element={<ExportList />} />
                    <Route path="warehouses" element={<WarehouseList />} />
                    <Route path="/" element={<Navigate to="/dashboard/products" />} />
                </Routes>
            </div>
        </div>
    );
};

const styles = {
    appContainer: { display: 'flex', minHeight: '100vh' },
    sidebar: { 
        width: '250px', 
        backgroundColor: '#343a40', 
        color: '#fff', 
        padding: '20px', 
        position: 'fixed', 
        height: '100vh' 
    },
    sidebarTitle: { fontSize: '24px', marginBottom: '30px', textAlign: 'center' },
    sidebarList: { listStyle: 'none', padding: 0 },
    sidebarItem: { marginBottom: '20px' },
    sidebarLink: { 
        color: '#fff', 
        textDecoration: 'none', 
        fontSize: '18px', 
        display: 'block', 
        padding: '10px', 
        borderRadius: '5px' 
    },
    content: { 
        marginLeft: '250px', 
        padding: '20px', 
        flexGrow: 1, 
        backgroundColor: '#f0f2f5' 
    },
    logoutButton: { 
        width: '100%', 
        padding: '10px', 
        backgroundColor: '#dc3545', 
        color: '#fff', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        fontSize: '18px' 
    }
};

export default App;