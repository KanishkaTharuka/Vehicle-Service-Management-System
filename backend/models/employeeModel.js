const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true 
    },
    job: {
        type: String,
        required: true
    },  
    YrsOfExperience: {
        type: Number,
        required: true
    }
});

const Employee = mongoose.model('employee', employeeSchema);

module.exports = Employee;