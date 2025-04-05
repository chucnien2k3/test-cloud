import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WarehouseList = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '', capacity: '' });
    const [editWarehouse, setEditWarehouse] = useState(null);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/warehouses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWarehouses(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddWarehouse = async () => {
        if (!newWarehouse.name || !newWarehouse.capacity) {
            setError('Vui lòng điền Tên kho và Dung lượng.');
            return;
        }

        const warehouseData = {
            name: newWarehouse.name,
            location: newWarehouse.location || null,
            capacity: parseInt(newWarehouse.capacity)
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/warehouses', warehouseData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWarehouses();
            setNewWarehouse({ name: '', location: '', capacity: '' });
            setError('');
        } catch (err) {
            setError('Lỗi khi thêm kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleEditWarehouse = async () => {
        if (!editWarehouse.name || !editWarehouse.capacity) {
            setError('Vui lòng điền Tên kho và Dung lượng.');
            return;
        }

        const warehouseData = {
            name: editWarehouse.name,
            location: editWarehouse.location || null,
            capacity: parseInt(editWarehouse.capacity)
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/warehouses/${editWarehouse.warehouse_id}`, warehouseData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWarehouses();
            setEditWarehouse(null);
            setError('');
        } catch (err) {
            setError('Lỗi khi sửa kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleDeleteWarehouse = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa kho này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/warehouses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchWarehouses();
        } catch (err) {
            setError('Lỗi khi xóa kho: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const filteredWarehouses = warehouses.filter(warehouse =>
        warehouse.warehouse_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.section}>
            <h2 style={styles.title}>Danh sách kho</h2>
            <input
                type="text"
                placeholder="Tìm kiếm kho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
            />
            {filteredWarehouses.length === 0 ? (
                <p style={styles.noData}>Không có dữ liệu</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Tên Kho</th>
                            <th style={styles.th}>Vị Trí</th>
                            <th style={styles.th}>Tối Đa Số Lượng Container</th>
                            <th style={styles.th}>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWarehouses.map(warehouse => (
                            <tr key={warehouse.warehouse_id} style={styles.tr}>
                                <td style={styles.td}>{warehouse.warehouse_id}</td>
                                <td style={styles.td}>{warehouse.warehouse_name}</td>
                                <td style={styles.td}>{warehouse.location || 'N/A'}</td>
                                <td style={styles.td}>{warehouse.capacity}</td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => setEditWarehouse(warehouse)}
                                        style={styles.editButton}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteWarehouse(warehouse.warehouse_id)}
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
                <h3 style={styles.subtitle}>{editWarehouse ? 'Sửa kho' : 'Thêm kho'}</h3>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type="text"
                    placeholder="Tên kho *"
                    value={editWarehouse ? editWarehouse.name : newWarehouse.name}
                    onChange={(e) => editWarehouse
                        ? setEditWarehouse({ ...editWarehouse, name: e.target.value })
                        : setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Vị trí"
                    value={editWarehouse ? editWarehouse.location : newWarehouse.location}
                    onChange={(e) => editWarehouse
                        ? setEditWarehouse({ ...editWarehouse, location: e.target.value })
                        : setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Tối đa số lượng container *"
                    value={editWarehouse ? editWarehouse.capacity : newWarehouse.capacity}
                    onChange={(e) => editWarehouse
                        ? setEditWarehouse({ ...editWarehouse, capacity: e.target.value })
                        : setNewWarehouse({ ...newWarehouse, capacity: e.target.value })}
                    style={styles.input}
                />
                <button
                    onClick={editWarehouse ? handleEditWarehouse : handleAddWarehouse}
                    style={styles.button}
                >
                    {editWarehouse ? 'Cập nhật' : 'Thêm'}
                </button>
                {editWarehouse && (
                    <button
                        onClick={() => setEditWarehouse(null)}
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

export default WarehouseList;