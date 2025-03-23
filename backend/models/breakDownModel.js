const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const breakdownSchema = new Schema({
    vehicleRegistrationNumber: {
        type: String,
        required: true,
        trim: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerContactNumber:{
        type: Number,
        required: true,
        trim: true
    },
    vehicleMakeModel: {
        type: String,
        required: true,
        trim: true
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['Car', 'Truck', 'Motorcycle', 'Other'],
        trim: true
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Address', 'Point'],
            required: true
        },
        address: {
            type: String,
            required: function() {
                return this.currentLocation.type === 'Address';
            }
        },
        coordinates: {
            type: [Number],
            required: function() {
                return this.currentLocation.type === 'Point';
            }
        }
    },
    breakdownType: {
        type: String,
        required: true,
        enum: ['Mechanical', 'Electrical', 'Flat Tire', 'Fuel Issue', 'Other'],
        trim: true
    },
    emergencyLevel: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High'],
        trim: true
    },
    isAccepted: { type: Boolean, default: false }

}, {
    timestamps: true
});

const Breakdown = mongoose.model('Breakdown', breakdownSchema);
module.exports = Breakdown;
