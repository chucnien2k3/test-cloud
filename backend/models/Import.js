const pool = require('../config/db');

class Import {
    static async getAll() {
        const result = await pool.query('SELECT * FROM import');
        return result.rows;
    }

    static async create(product_id, warehouse_id, quantity) {
        const result = await pool.query(
            'INSERT INTO import (product_id, warehouse_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [product_id, warehouse_id, quantity]
        );
        return result.rows[0];
    }

    static async update(id, product_id, warehouse_id, quantity) {
        const result = await pool.query(
            'UPDATE import SET product_id = $1, warehouse_id = $2, quantity = $3 WHERE import_id = $4 RETURNING *',
            [product_id, warehouse_id, quantity, id]
        );
        if (result.rows.length === 0) throw new Error('Bản ghi nhập kho không tồn tại');
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM import WHERE import_id = $1', [id]);
    }
}

module.exports = Import;