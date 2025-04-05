import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard/products');
        } catch (err) {
            setError(err.response?.data?.error || 'Đã có lỗi xảy ra');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Đăng nhập</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleLogin} style={styles.form}>
                <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Đăng nhập</button>
            </form>
        </div>
    );
};

const styles = {
    container: { maxWidth: '400px', margin: '100px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
    title: { textAlign: 'center', color: '#333', fontSize: '24px', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' },
    button: { padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    error: { color: 'red', textAlign: 'center', marginBottom: '10px' }
};

export default Login;