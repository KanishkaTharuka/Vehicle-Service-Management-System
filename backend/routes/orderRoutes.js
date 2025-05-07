const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');
const { sendOrderStatusEmail } = require('../utils/emailService');

// Create a new order
router.post('/', async (req, res) => {
    try {
        const { items, customerDetails, totalAmount, paymentMethod } = req.body;

        // Validate items and update stock
        for (const item of items) {
            const dbItem = await Item.findById(item.itemId);
            if (!dbItem) {
                return res.status(400).json({ message: `Item ${item.name} not found` });
            }
            if (dbItem.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
            }
        }

        // Create the order
        const order = new Order({
            items: items.map(item => ({
                itemId: item.itemId,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            customerDetails,
            totalAmount,
            paymentMethod
        });

        // Update item quantities
        for (const item of items) {
            await Item.findByIdAndUpdate(
                item.itemId,
                { $inc: { quantity: -item.quantity } }
            );
        }

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Send email notification for status update
        try {
            await sendOrderStatusEmail(order, status);
        } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
            // Continue with the response even if email fails
        }

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Accept an order
router.patch('/:id/accept', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending' && order.status !== 'processing') {
            return res.status(400).json({
                message: `Cannot accept order with status: ${order.status}. Only pending or processing orders can be accepted.`
            });
        }

        order.status = 'accepted';
        await order.save();

        // Send email notification
        try {
            await sendOrderStatusEmail(order, 'accepted');
        } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
            // Continue with the response even if email fails
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Decline an order
router.patch('/:id/decline', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'pending' && order.status !== 'processing') {
            return res.status(400).json({
                message: `Cannot decline order with status: ${order.status}. Only pending or processing orders can be declined.`
            });
        }

        // Restore item quantities
        for (const item of order.items) {
            await Item.findByIdAndUpdate(
                item.itemId,
                { $inc: { quantity: item.quantity } }
            );
        }

        order.status = 'declined';
        await order.save();

        // Send email notification
        try {
            await sendOrderStatusEmail(order, 'declined');
        } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
            // Continue with the response even if email fails
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { paymentStatus },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an order
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // If the order is already delivered or shipped, don't allow deletion
        if (order.status === 'delivered' || order.status === 'shipped') {
            return res.status(400).json({
                message: 'Cannot delete orders that have been shipped or delivered'
            });
        }

        // If the order is in processing or pending state, restore the item quantities
        if (order.status === 'pending' || order.status === 'processing') {
            for (const item of order.items) {
                await Item.findByIdAndUpdate(
                    item.itemId,
                    { $inc: { quantity: item.quantity } }
                );
            }
        }

        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;