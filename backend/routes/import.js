const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

class Import {
    static async getAll() {
        const result = await pool.query('SELECT * FROM import');
        return result.rows;
    }

    static async create(product_id, warehouse_id, quantity) {
        if (!product_id || !warehouse_id || !quantity || quantity <= 0) {
            throw new Error('Vui lòng cung cấp đầy đủ product_id, warehouse_id và quantity hợp lệ');
        }

        try {
            await pool.query('BEGIN');
            // Thêm bản ghi nhập kho
            const importResult = await pool.query(
                'INSERT INTO import (product_id, warehouse_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                [product_id, warehouse_id, quantity]
            );
            // Cập nhật tồn kho
            await pool.query(
                'INSERT INTO inventory (product_id, warehouse_id, quantity) VALUES ($1, $2, $3) ' +
                'ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = inventory.quantity + $3',
                [product_id, warehouse_id, quantity]
            );
            await pool.query('COMMIT');
            return importResult.rows[0];
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }
    }

    static async update(id, product_id, warehouse_id, quantity) {
        if (!product_id || !warehouse_id || !quantity || quantity <= 0) {
            throw new Error('Vui lòng cung cấp đầy đủ product_id, warehouse_id và quantity hợp lệ');
        }

        try {
            await pool.query('BEGIN');
            // Lấy bản ghi cũ
            const oldImport = await pool.query('SELECT * FROM import WHERE import_id = $1', [id]);
            if (oldImport.rows.length === 0) {
                throw new Error('Bản ghi nhập kho không tồn tại');
            }
            const old = oldImport.rows[0];
            // Cập nhật bản ghi nhập kho
            const importResult = await pool.query(
                'UPDATE import SET product_id = $1, warehouse_id = $2, quantity = $3 WHERE import_id = $4 RETURNING *',
                [product_id, warehouse_id, quantity, id]
            );
            // Điều chỉnh tồn kho
            await pool.query(
                'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2 AND warehouse_id = $3',
                [old.quantity, old.product_id, old.warehouse_id]
            );
            await pool.query(
                'INSERT INTO inventory (product_id, warehouse_id, quantity) VALUES ($1, $2, $3) ' +
                'ON CONFLICT (product_id, warehouse_id) DO UPDATE SET quantity = inventory.quantity + $3',
                [product_id, warehouse_id, quantity]
            );
            await pool.query('COMMIT');
            return importResult.rows[0];
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }
    }

    static async delete(id) {
        try {
            await pool.query('BEGIN');
            // Lấy bản ghi để xóa
            const importResult = await pool.query('SELECT * FROM import WHERE import_id = $1', [id]);
            if (importResult.rows.length === 0) {
                throw new Error('Bản ghi nhập kho không tồn tại');
            }
            const { product_id, warehouse_id, quantity } = importResult.rows[0];
            // Xóa bản ghi
            await pool.query('DELETE FROM import WHERE import_id = $1', [id]);
            // Giảm tồn kho
            await pool.query(
                'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2 AND warehouse_id = $3',
                [quantity, product_id, warehouse_id]
            );
            await pool.query('COMMIT');
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }
    }
}

module.exports = Import;