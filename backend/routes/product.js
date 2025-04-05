const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const { name, supplier_id, price, description } = req.body;
    try {
        const product = await Product.create(name, supplier_id, price, description);
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, supplier_id, price, description } = req.body;
    try {
        const product = await Product.update(id, name, supplier_id, price, description);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Product.delete(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;