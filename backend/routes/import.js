const express = require('express');
const Import = require('../models/Import');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const imports = await Import.getAll();
        res.json(imports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { product_id, warehouse_id, quantity } = req.body;
    try {
        const importRecord = await Import.create(product_id, warehouse_id, quantity);
        res.status(201).json(importRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { product_id, warehouse_id, quantity } = req.body;
    try {
        const importRecord = await Import.update(id, product_id, warehouse_id, quantity);
        res.json(importRecord);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Import.delete(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;