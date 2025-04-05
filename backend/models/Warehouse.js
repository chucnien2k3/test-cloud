const pool = require('../config/db');

class Warehouse {
    static async getAll() {
        const result = await pool.query('SELECT * FROM warehouse');
        return result.rows;
    }

    static async create(name, location, capacity) {
        const result = await pool.query(
            'INSERT INTO warehouse (warehouse_name, location, capacity) VALUES ($1, $2, $3) RETURNING *',
            [name, location, capacity]
        );
        return result.rows[0];
    }

    static async update(id, name, location, capacity) {
        const result = await pool.query(
            'UPDATE warehouse SET warehouse_name = $1, location = $2, capacity = $3 WHERE warehouse_id = $4 RETURNING *',
            [name, location, capacity, id]
        );
        if (result.rows.length === 0) throw new Error('Kho không tồn tại');
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM warehouse WHERE warehouse_id = $1', [id]);
    }
}

module.exports = Warehouse;