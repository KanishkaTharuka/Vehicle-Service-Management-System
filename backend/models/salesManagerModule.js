const mongoose = require('mongoose');

const serviceItemSchema = new mongoose.Schema({
    serviceName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: ["Car Wash", "Oil Change", "Tire Service", "General Repair"] },  
    duration: { type: Number, required: true },
    vehicleType: { type: [String], enum: ["Sedan", "SUV", "Truck", "Motorcycle"] },
    isAvailable: { type: Boolean, required: true },
    requiresAppointment: { type: Boolean, required: true }
});

const ServiceItem = mongoose.model('ServiceItem', serviceItemSchema);
module.exports = ServiceItem;
