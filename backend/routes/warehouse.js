const express = require('express');
const Warehouse = require('../models/Warehouse');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const warehouses = await Warehouse.getAll();
        res.json(warehouses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { name, location, capacity } = req.body;
    try {
        const warehouse = await Warehouse.create(name, location, capacity);
        res.status(201).json(warehouse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, location, capacity } = req.body;
    try {
        const warehouse = await Warehouse.update(id, name, location, capacity);
        res.json(warehouse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Warehouse.delete(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;