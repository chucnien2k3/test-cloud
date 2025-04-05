const express = require('express');
const Supplier = require('../models/Supplier');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const suppliers = await Supplier.getAll();
        res.json(suppliers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { name, contact_info, address } = req.body;
    try {
        const supplier = await Supplier.create(name, contact_info, address);
        res.status(201).json(supplier);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, contact_info, address } = req.body;
    try {
        const supplier = await Supplier.update(id, name, contact_info, address);
        res.json(supplier);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Supplier.delete(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;