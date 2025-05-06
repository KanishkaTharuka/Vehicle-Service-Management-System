const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    action: {
        type: String,
        required: false,
        enum: ['income', 'expense'] // Ensures action is either 'income' or 'expense'
    }
});

const Finance = mongoose.model('Finance', financeSchema);

module.exports = Finance;
