import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [newSupplier, setNewSupplier] = useState({ name: '', contact_info: '', address: '' });
    const [editSupplier, setEditSupplier] = useState(null);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/suppliers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuppliers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddSupplier = async () => {
        if (!newSupplier.name) {
            setError('Vui lòng điền Tên nhà cung cấp.');
            return;
        }

        const supplierData = {
            name: newSupplier.name,
            contact_info: newSupplier.contact_info || null,
            address: newSupplier.address || null
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/suppliers', supplierData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSuppliers();
            setNewSupplier({ name: '', contact_info: '', address: '' });
            setError('');
        } catch (err) {
            setError('Lỗi khi thêm nhà cung cấp: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleEditSupplier = async () => {
        if (!editSupplier.name) {
            setError('Vui lòng điền Tên nhà cung cấp.');
            return;
        }

        const supplierData = {
            name: editSupplier.name,
            contact_info: editSupplier.contact_info || null,
            address: editSupplier.address || null
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/suppliers/${editSupplier.supplier_id}`, supplierData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSuppliers();
            setEditSupplier(null);
            setError('');
        } catch (err) {
            setError('Lỗi khi sửa nhà cung cấp: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleDeleteSupplier = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/suppliers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSuppliers();
        } catch (err) {
            setError('Lỗi khi xóa nhà cung cấp: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.section}>
            <h2 style={styles.title}>Danh sách nhà cung cấp</h2>
            <input
                type="text"
                placeholder="Tìm kiếm nhà cung cấp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
            />
            {filteredSuppliers.length === 0 ? (
                <p style={styles.noData}>Không có dữ liệu</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Tên Nhà Cung Cấp</th>
                            <th style={styles.th}>Thông Tin Liên Hệ</th>
                            <th style={styles.th}>Địa Chỉ</th>
                            <th style={styles.th}>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.map(supplier => (
                            <tr key={supplier.supplier_id} style={styles.tr}>
                                <td style={styles.td}>{supplier.supplier_id}</td>
                                <td style={styles.td}>{supplier.supplier_name}</td>
                                <td style={styles.td}>{supplier.contact_info || 'N/A'}</td>
                                <td style={styles.td}>{supplier.address || 'N/A'}</td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => setEditSupplier(supplier)}
                                        style={styles.editButton}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSupplier(supplier.supplier_id)}
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
                <h3 style={styles.subtitle}>{editSupplier ? 'Sửa nhà cung cấp' : 'Thêm nhà cung cấp'}</h3>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type="text"
                    placeholder="Tên *"
                    value={editSupplier ? editSupplier.name : newSupplier.name}
                    onChange={(e) => editSupplier
                        ? setEditSupplier({ ...editSupplier, name: e.target.value })
                        : setNewSupplier({ ...newSupplier, name: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Thông tin liên hệ"
                    value={editSupplier ? editSupplier.contact_info : newSupplier.contact_info}
                    onChange={(e) => editSupplier
                        ? setEditSupplier({ ...editSupplier, contact_info: e.target.value })
                        : setNewSupplier({ ...newSupplier, contact_info: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={editSupplier ? editSupplier.address : newSupplier.address}
                    onChange={(e) => editSupplier
                        ? setEditSupplier({ ...editSupplier, address: e.target.value })
                        : setNewSupplier({ ...newSupplier, address: e.target.value })}
                    style={styles.input}
                />
                <button
                    onClick={editSupplier ? handleEditSupplier : handleAddSupplier}
                    style={styles.button}
                >
                    {editSupplier ? 'Cập nhật' : 'Thêm'}
                </button>
                {editSupplier && (
                    <button
                        onClick={() => setEditSupplier(null)}
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

export default SupplierList;