const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            name: String,
            price: Number,
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'beklemede'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);