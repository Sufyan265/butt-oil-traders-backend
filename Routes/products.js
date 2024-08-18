const express = require('express');
const router = express.Router();
const ProductsModel = require('../Models/ProductsModel')

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await ProductsModel.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single product by ID
router.get('/find/:id', async (req, res) => {
    try {
        const product = await ProductsModel.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET best-selling products
router.get('/best-selling', async (req, res) => {
    try {
        const bestSellingProducts = await ProductsModel.find({ isBestSelling: true });
        res.json(bestSellingProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET popular products
router.get('/popular', async (req, res) => {
    try {
        const bestSellingProducts = await ProductsModel.find({ isPopular: true });
        res.json(bestSellingProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;