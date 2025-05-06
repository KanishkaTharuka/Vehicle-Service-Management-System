const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Category = require('../models/Category');

// Create a new item
router.post('/', async (req, res) => {
    try {
        const {
            itemCode,
            name,
            companyName,
            description,
            quantity,
            buyingPrice,
            sellingPrice,
            category,
            imageUrl
        } = req.body;

        // Check if item code already exists
        const existingItem = await Item.findOne({ itemCode });
        if (existingItem) {
            return res.status(400).json({ message: 'Item code already exists' });
        }

        // Check if category exists
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Category not found' });
        }

        const item = new Item({
            itemCode,
            name,
            companyName,
            description,
            quantity,
            buyingPrice,
            sellingPrice,
            category,
            imageUrl
        });

        await item.save();
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all items with category details
router.get('/', async (req, res) => {
    try {
        const items = await Item.find()
            .populate('category', 'name categoryCode')
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single item
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('category', 'name categoryCode');
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an item
router.put('/:id', async (req, res) => {
    try {
        const {
            itemCode,
            name,
            companyName,
            description,
            quantity,
            buyingPrice,
            sellingPrice,
            category,
            imageUrl
        } = req.body;

        // Check if the new item code already exists (excluding current item)
        if (itemCode) {
            const existingItem = await Item.findOne({
                itemCode,
                _id: { $ne: req.params.id }
            });
            if (existingItem) {
                return res.status(400).json({ message: 'Item code already exists' });
            }
        }

        // Check if category exists
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ message: 'Category not found' });
            }
        }

        const item = await Item.findByIdAndUpdate(
            req.params.id,
            {
                itemCode,
                name,
                companyName,
                description,
                quantity,
                buyingPrice,
                sellingPrice,
                category,
                imageUrl
            },
            { new: true, runValidators: true }
        ).populate('category', 'name categoryCode');

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an item
router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 