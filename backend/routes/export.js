const express = require('express');
const Export = require('../models/Export');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const exports = await Export.getAll();
        res.json(exports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { product_id, warehouse_id, quantity } = req.body;
    try {
        const exportRecord = await Export.create(product_id, warehouse_id, quantity);
        res.status(201).json(exportRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { product_id, warehouse_id, quantity } = req.body;
    try {
        const exportRecord = await Export.update(id, product_id, warehouse_id, quantity);
        res.json(exportRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Export.delete(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;