const pool = require('../config/db');

class Supplier {
    static async getAll() {
        const result = await pool.query('SELECT * FROM suppliers');
        return result.rows;
    }

    static async create(name, contact_info, address) {
        const result = await pool.query(
            'INSERT INTO suppliers (supplier_name, contact_info, address) VALUES ($1, $2, $3) RETURNING *',
            [name, contact_info, address]
        );
        return result.rows[0];
    }

    static async update(id, name, contact_info, address) {
        const result = await pool.query(
            'UPDATE suppliers SET supplier_name = $1, contact_info = $2, address = $3 WHERE supplier_id = $4 RETURNING *',
            [name, contact_info, address, id]
        );
        if (result.rows.length === 0) throw new Error('Nhà cung cấp không tồn tại');
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM suppliers WHERE supplier_id = $1', [id]);
    }
}

module.exports = Supplier;