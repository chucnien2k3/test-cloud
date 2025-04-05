import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '' // Relative URL cho Render
    : 'http://localhost:5000';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', supplier_id: '', price: '', description: '' });
    const [editProduct, setEditProduct] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchSuppliers();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu:', err.response ? err.response.data : err.message);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/api/suppliers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuppliers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error('Lỗi khi lấy nhà cung cấp:', err);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.supplier_id || !newProduct.price) {
            setError('Vui lòng điền đầy đủ Tên sản phẩm, Nhà cung cấp ID và Giá.');
            return;
        }

        const supplierId = parseInt(newProduct.supplier_id);
        if (!suppliers.some(s => s.supplier_id === supplierId)) {
            setError(`Nhà cung cấp ID ${supplierId} không tồn tại.`);
            return;
        }

        const productData = {
            name: newProduct.name,
            supplier_id: supplierId,
            price: parseFloat(newProduct.price),
            description: newProduct.description || null
        };

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/products`, productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
            setNewProduct({ name: '', supplier_id: '', price: '', description: '' });
            setError('');
        } catch (err) {
            setError('Lỗi khi thêm sản phẩm: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleEditProduct = async () => {
        if (!editProduct.name || !editProduct.supplier_id || !editProduct.price) {
            setError('Vui lòng điền đầy đủ các trường bắt buộc.');
            return;
        }

        const supplierId = parseInt(editProduct.supplier_id);
        if (!suppliers.some(s => s.supplier_id === supplierId)) {
            setError(`Nhà cung cấp ID ${supplierId} không tồn tại.`);
            return;
        }

        const productData = {
            name: editProduct.name,
            supplier_id: supplierId,
            price: parseFloat(editProduct.price),
            description: editProduct.description || null
        };

        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/products/${editProduct.product_id}`, productData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
            setEditProduct(null);
            setError('');
        } catch (err) {
            setError('Lỗi khi sửa sản phẩm: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts();
        } catch (err) {
            setError('Lỗi khi xóa sản phẩm: ' + (err.response ? err.response.data.error : err.message));
        }
    };

    const filteredProducts = products.filter(product =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.section}>
            <h2 style={styles.title}>Danh sách sản phẩm</h2>
            <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
            />
            {filteredProducts.length === 0 ? (
                <p style={styles.noData}>Không có dữ liệu</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>ID</th>
                            <th style={styles.th}>Tên Sản Phẩm</th>
                            <th style={styles.th}>Nhà Cung Cấp ID</th>
                            <th style={styles.th}>Giá</th>
                            <th style={styles.th}>Mô Tả</th>
                            <th style={styles.th}>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.product_id} style={styles.tr}>
                                <td style={styles.td}>{product.product_id}</td>
                                <td style={styles.td}>{product.product_name}</td>
                                <td style={styles.td}>{product.supplier_id}</td>
                                <td style={styles.td}>{parseFloat(product.price).toLocaleString('vi-VN')} VNĐ</td>
                                <td style={styles.td}>{product.description}</td>
                                <td style={styles.td}>
                                    <button
                                        onClick={() => setEditProduct(product)}
                                        style={styles.editButton}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.product_id)}
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
                <h3 style={styles.subtitle}>{editProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h3>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type="text"
                    placeholder="Tên sản phẩm *"
                    value={editProduct ? editProduct.name : newProduct.name}
                    onChange={(e) => editProduct
                        ? setEditProduct({ ...editProduct, name: e.target.value })
                        : setNewProduct({ ...newProduct, name: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="ID Nhà cung cấp *"
                    value={editProduct ? editProduct.supplier_id : newProduct.supplier_id}
                    onChange={(e) => editProduct
                        ? setEditProduct({ ...editProduct, supplier_id: e.target.value })
                        : setNewProduct({ ...newProduct, supplier_id: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Giá *"
                    value={editProduct ? editProduct.price : newProduct.price}
                    onChange={(e) => editProduct
                        ? setEditProduct({ ...editProduct, price: e.target.value })
                        : setNewProduct({ ...newProduct, price: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Mô tả"
                    value={editProduct ? editProduct.description : newProduct.description}
                    onChange={(e) => editProduct
                        ? setEditProduct({ ...editProduct, description: e.target.value })
                        : setNewProduct({ ...newProduct, description: e.target.value })}
                    style={styles.input}
                />
                <button
                    onClick={editProduct ? handleEditProduct : handleAddProduct}
                    style={styles.button}
                >
                    {editProduct ? 'Cập nhật' : 'Thêm'}
                </button>
                {editProduct && (
                    <button
                        onClick={() => setEditProduct(null)}
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

export default ProductList;