const pool = require('../config/db');

class Export {
    static async getAll() {
        const result = await pool.query('SELECT * FROM export');
        return result.rows;
    }

    static async create(product_id, warehouse_id, quantity) {
        const result = await pool.query(
            'INSERT INTO export (product_id, warehouse_id, quantity) VALUES ($1, $2, $3) RETURNING *',
            [product_id, warehouse_id, quantity]
        );
        return result.rows[0];
    }

    static async update(id, product_id, warehouse_id, quantity) {
        const result = await pool.query(
            'UPDATE export SET product_id = $1, warehouse_id = $2, quantity = $3 WHERE export_id = $4 RETURNING *',
            [product_id, warehouse_id, quantity, id]
        );
        if (result.rows.length === 0) throw new Error('Bản ghi xuất kho không tồn tại');
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM export WHERE export_id = $1', [id]);
    }
}

module.exports = Export;