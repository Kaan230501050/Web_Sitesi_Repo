const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Middleware - token kontrolü
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token gerekli' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ message: 'Geçersiz token' });
    }
}

// Tüm ürünleri listele
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Tekil ürün detayı
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Ürün ekle (admin)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, price, stock, category, description } = req.body;
        const product = new Product({ name, price, stock, category, description });
        await product.save();
        res.status(201).json({ message: 'Ürün eklendi', product });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Ürün güncelle (admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
        res.json({ message: 'Ürün güncellendi', product });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router;