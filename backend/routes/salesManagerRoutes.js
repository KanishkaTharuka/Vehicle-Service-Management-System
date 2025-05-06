const express = require('express');
const router = express.Router();
const ServiceItem = require('../models/salesManagerModule');

// Add new service item
router.route('/addItem').post(async (req, res) => {
    const { serviceName, description, price, category, duration, vehicleType, isAvailable, requiresAppointment } = req.body;

    const newService = new ServiceItem({
        serviceName,
        description,
        price,
        category,
        duration,
        vehicleType,
        isAvailable,
        requiresAppointment
    });

    try {
        await newService.save();
        res.status(201).json({ message: 'Service item added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding service item', error: error.message });
    }
});

//view all service items
router.route('/view').get(async (req, res) => {
    try {
        const services = await ServiceItem.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching service items', error: error.message });
    }
});

//delete service item
router.route('/delete/:id').delete(async (req, res) => {
    try {
        await ServiceItem.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Service item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service item', error: error.message });
    }   
});

//update service item
router.route('/update/:id').put(async (req, res) => {
    try {
        const { serviceName, description, price, category, duration, vehicleType, isAvailable, requiresAppointment } = req.body;

        const updatedService = await ServiceItem.findByIdAndUpdate(req.params.id, {
            serviceName,
            description,
            price,
            category,
            duration,
            vehicleType,
            isAvailable,
            requiresAppointment
        }); 

        if (!updatedService) {
            return res.status(404).json({ message: 'Service item not found' });
        }

        res.status(200).json({ message: 'Service item updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating service item', error: error.message });
    }
});







module.exports = router;


