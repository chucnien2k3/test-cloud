const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

class Export {
    static async getAll() {
        const result = await pool.query('SELECT * FROM export');
        return result.rows;
    }

    static async create(product_id, warehouse_id, quantity) {
        if (!product_id || !warehouse_id || !quantity || quantity <= 0) {
            throw new Error('Vui lòng cung cấp đầy đủ product_id, warehouse_id và quantity hợp lệ');
        }

        try {
            await pool.query('BEGIN');
            // Kiểm tra tồn kho
            const inventory = await pool.query(
                'SELECT quantity FROM inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE',
                [product_id, warehouse_id]
            );
            if (inventory.rows.length === 0 || inventory.rows[0].quantity < quantity) {
                throw new Error('Không đủ hàng trong kho để xuất');
            }
            // Thêm bản ghi xuất kho
            const exportResult = await pool.query(
                'INSERT INTO export (product_id, warehouse_id, quantity) VALUES ($1, $2, $3) RETURNING *',
                [product_id, warehouse_id, quantity]
            );
            // Giảm tồn kho
            await pool.query(
                'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2 AND warehouse_id = $3',
                [quantity, product_id, warehouse_id]
            );
            await pool.query('COMMIT');
            return exportResult.rows[0];
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
            const oldExport = await pool.query('SELECT * FROM export WHERE export_id = $1', [id]);
            if (oldExport.rows.length === 0) {
                throw new Error('Bản ghi xuất kho không tồn tại');
            }
            const old = oldExport.rows[0];
            // Kiểm tra tồn kho sau khi hoàn lại số lượng cũ
            const inventory = await pool.query(
                'SELECT quantity FROM inventory WHERE product_id = $1 AND warehouse_id = $2 FOR UPDATE',
                [product_id, warehouse_id]
            );
            const availableQuantity = inventory.rows.length === 0 
                ? 0 
                : inventory.rows[0].quantity + old.quantity;
            if (availableQuantity < quantity) {
                throw new Error('Không đủ hàng trong kho để cập nhật xuất kho');
            }
            // Cập nhật bản ghi xuất kho
            const exportResult = await pool.query(
                'UPDATE export SET product_id = $1, warehouse_id = $2, quantity = $3 WHERE export_id = $4 RETURNING *',
                [product_id, warehouse_id, quantity, id]
            );
            // Hoàn lại tồn kho cũ
            await pool.query(
                'UPDATE inventory SET quantity = quantity + $1 WHERE product_id = $2 AND warehouse_id = $3',
                [old.quantity, old.product_id, old.warehouse_id]
            );
            // Giảm tồn kho mới
            await pool.query(
                'UPDATE inventory SET quantity = quantity - $1 WHERE product_id = $2 AND warehouse_id = $3',
                [quantity, product_id, warehouse_id]
            );
            await pool.query('COMMIT');
            return exportResult.rows[0];
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }
    }

    static async delete(id) {
        try {
            await pool.query('BEGIN');
            // Lấy bản ghi để xóa
            const exportResult = await pool.query('SELECT * FROM export WHERE export_id = $1', [id]);
            if (exportResult.rows.length === 0) {
                throw new Error('Bản ghi xuất kho không tồn tại');
            }
            const { product_id, warehouse_id, quantity } = exportResult.rows[0];
            // Xóa bản ghi
            await pool.query('DELETE FROM export WHERE export_id = $1', [id]);
            // Hoàn lại tồn kho
            await pool.query(
                'UPDATE inventory SET quantity = quantity + $1 WHERE product_id = $2 AND warehouse_id = $3',
                [quantity, product_id, warehouse_id]
            );
            await pool.query('COMMIT');
        } catch (err) {
            await pool.query('ROLLBACK');
            throw err;
        }
    }
}

module.exports = Export;