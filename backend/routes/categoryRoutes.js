const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Create a new category
router.post('/', async (req, res) => {
    try {
        const { categoryCode, name, description } = req.body;
        
        // Check if category code already exists
        const existingCategory = await Category.findOne({ categoryCode });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category code already exists' });
        }

        const category = new Category({
            categoryCode,
            name,
            description
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single category
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a category
router.put('/:id', async (req, res) => {
    try {
        const { categoryCode, name, description } = req.body;
        
        // Check if the new category code already exists (excluding current category)
        if (categoryCode) {
            const existingCategory = await Category.findOne({
                categoryCode,
                _id: { $ne: req.params.id }
            });
            if (existingCategory) {
                return res.status(400).json({ message: 'Category code already exists' });
            }
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { categoryCode, name, description },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 