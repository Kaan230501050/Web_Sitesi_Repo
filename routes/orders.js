const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Middleware
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

// Sipariş oluştur (checkout)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Sepet boş' });
        }

        let total = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: 'Ürün bulunamadı' });
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `${product.name} için yeterli stok yok` });
            }

            // Stoku düşür
            product.stock -= item.quantity;
            await product.save();

            total += product.price * item.quantity;
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });
        }

        const order = new Order({
            user: req.userId,
            items: orderItems,
            total
        });
        await order.save();

        res.status(201).json({ message: 'Sipariş oluşturuldu', order });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Kullanıcının siparişlerini listele
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router;