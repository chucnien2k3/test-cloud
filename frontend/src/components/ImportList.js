import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '' // Relative URL cho Render
    : 'http://localhost:5000';

const ImportList = () => {
    const [imports, setImports] = useState([]);
    const [newImport, setNewImport] = useState({ product_id: '', warehouse_id: '', quantity: '' });
    const [editImport, setEditImport] = useState(null);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchImports();
        fetchProducts();
        fetchWarehouses();
    }, []);

    const fetchImports = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/imports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setImports(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/warehouses`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWarehouses(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddImport = async () => {
        if (!newImport.product_id || !newImport.warehouse_id || !newImport.quantity) {
            setError('Vui lòng điền đầy đủ ID Sản phẩm, ID Kho và Số lượng.');
            return;
        }

        const productId = parseInt(newImport.product_id);
        const warehouseId = parseInt(newImport.warehouse_id);
        if (!products.some(p => p.product_id === productId)) {
            setError(`Sản phẩm ID ${productId} không tồn tại.`);
            return;
        }
        if (!warehouses.some(w => w.warehouse_id === warehouseId)) {
            setError(`Kho ID ${warehouseId} không tồn tại.`);
            return;
        }

        const importData = {
            product_id: productId,
            warehouse_id: warehouseId,
            quantity: parseInt(newImport.quantity)
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/imports`, importData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchImports();
            setNewImport({ product_id: '', warehouse_id: '', quantity: '' });
            setError('');
        } catch (err) {
            setError('Lỗi khi thêm nhập kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleEditImport = async () => {
        if (!editImport.product_id || !editImport.warehouse_id || !editImport.quantity) {
            setError('Vui lòng điền đầy đủ ID Sản phẩm, ID Kho và Số lượng.');
            return;
        }

        const productId = parseInt(editImport.product_id);
        const warehouseId = parseInt(editImport.warehouse_id);
        if (!products.some(p => p.product_id === productId)) {
            setError(`Sản phẩm ID ${productId} không tồn tại.`);
            return;
        }
        if (!warehouses.some(w => w.warehouse_id === warehouseId)) {
            setError(`Kho ID ${warehouseId} không tồn tại.`);
            return;
        }

        const importData = {
            product_id: productId,
            warehouse_id: warehouseId,
            quantity: parseInt(editImport.quantity)
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/imports/${editImport.import_id}`, importData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchImports();
            setEditImport(null);
            setError('');
        } catch (err) {
            setError('Lỗi khi sửa nhập kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleDeleteImport = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa nhập kho này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/imports/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchImports();
        } catch (err) {
            setError('Lỗi khi xóa nhập kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const filteredImports = imports.filter(item =>
        String(item.product_id).includes(searchTerm) || String(item.warehouse_id).includes(searchTerm)
    );

    return (
        <div style={styles.section}>
            <h2 style={styles.title}>Danh sách nhập kho</h2>
            <input
                type="text"
                placeholder="Tìm kiếm theo ID sản phẩm hoặc kho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
            />
            {filteredImports.length === 0 ? (
                <p style={styles.noData}>Không có dữ liệu</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Sản Phẩm ID</th>
                            <th style={styles.th}>Kho ID</th>
                            <th style={styles.th}>Số Lượng Container</th>
                            <th style={styles.th}>Ngày Nhập</th>
                            <th style={styles.th}>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredImports.map(item => (
                            <tr key={item.import_id} style={styles.tr}>
                                <td style={styles.td}>{item.product_id}</td>
                                <td style={styles.td}>{item.warehouse_id}</td>
                                <td style={styles.td}>{item.quantity}</td>
                                <td style={styles.td}>{item.import_date}</td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => setEditImport(item)}
                                        style={styles.editButton}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteImport(item.import_id)}
                                        style={styles.deleteButton}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div style={styles.form}>
                <h3 style={styles.subtitle}>{editImport ? 'Sửa nhập kho' : 'Thêm nhập kho'}</h3>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type="number"
                    placeholder="ID Sản phẩm *"
                    value={editImport ? editImport.product_id : newImport.product_id}
                    onChange={(e) => editImport
                        ? setEditImport({ ...editImport, product_id: e.target.value })
                        : setNewImport({ ...newImport, product_id: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="ID Kho *"
                    value={editImport ? editImport.warehouse_id : newImport.warehouse_id}
                    onChange={(e) => editImport
                        ? setEditImport({ ...editImport, warehouse_id: e.target.value })
                        : setNewImport({ ...newImport, warehouse_id: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Số lượng container *"
                    value={editImport ? editImport.quantity : newImport.quantity}
                    onChange={(e) => editImport
                        ? setEditImport({ ...editImport, quantity: e.target.value })
                        : setNewImport({ ...newImport, quantity: e.target.value })}
                    style={styles.input}
                />
                <button
                    onClick={editImport ? handleEditImport : handleAddImport}
                    style={styles.button}
                >
                    {editImport ? 'Cập nhật' : 'Thêm'}
                </button>
                {editImport && (
                    <button
                        onClick={() => setEditImport(null)}
                        style={styles.cancelButton}
                    >
                        Hủy
                    </button>
                )}
            </div>
        </div>
    );
};

const styles = {
    section: { marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    title: { color: '#333', fontSize: '24px', marginBottom: '15px' },
    noData: { color: '#888', fontStyle: 'italic' },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' },
    th: { padding: '12px', backgroundColor: '#007bff', color: '#fff', textAlign: 'left', borderBottom: '2px solid #ddd' },
    tr: { borderBottom: '1px solid #ddd' },
    td: { padding: '12px', textAlign: 'left' },
    form: { marginTop: '20px' },
    subtitle: { color: '#555', fontSize: '18px', marginBottom: '10px' },
    input: { padding: '8px', marginRight: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', width: '200px' },
    button: { padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    editButton: { padding: '5px 10px', backgroundColor: '#ffc107', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
    deleteButton: { padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    cancelButton: { padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' },
    error: { color: 'red', marginBottom: '10px' },
    searchInput: { padding: '8px', width: '300px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #ccc' }
};

export default ImportList;