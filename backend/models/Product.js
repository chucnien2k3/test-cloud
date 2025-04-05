const pool = require('../config/db');

class Product {
    static async getAll() {
        const result = await pool.query('SELECT * FROM products');
        return result.rows;
    }

    static async create(name, supplier_id, price, description) {
        const result = await pool.query(
            'INSERT INTO products (product_name, supplier_id, price, description) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, supplier_id, price, description]
        );
        return result.rows[0];
    }

    static async update(id, name, supplier_id, price, description) {
        const result = await pool.query(
            'UPDATE products SET product_name = $1, supplier_id = $2, price = $3, description = $4 WHERE product_id = $5 RETURNING *',
            [name, supplier_id, price, description, id]
        );
        if (result.rows.length === 0) throw new Error('Sản phẩm không tồn tại');
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM products WHERE product_id = $1', [id]);
    }
}

module.exports = Product;