const express = require('express');
const Finance = require('../models/finacemodle');
const Breakdown = require('../models/breakDownModel');
const Employee = require('../models/employeeModel');
const multer = require('multer');
const path = require('path');
const Appointment = require('../models/appointmentModel');

const router = express.Router();

//  add a new finance 
router.post('/input', async (req, res) => {
    try {
        const { title, description, amount, action } = req.body;

       
        if (!title || !description || !amount || !action) {
            return res.status(400).json({ message: 'All fields are required' });
        }

       
        const newFinance = new Finance({
            title,
            description,
            amount,
            action,
            date: new Date(), 
        });

        
        await newFinance.save();

        
        res.status(201).json({ message: 'Finance entry added successfully', data: newFinance });
    } catch (error) {
       
        res.status(500).json({ message: 'Error adding finance entry', error: error.message });
    }
});

//  view all finance 
router.get('/expense', async (req, res) => {
    try {
        const incomeTransactions = await Finance.find({ action: 'expense' }); // Fetch only income transactions
        res.status(200).json(incomeTransactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income transactions', error: error.message });
    }
});

// view all income
router.get('/income', async (req, res) => {
    try {
        const incomeTransactions = await Finance.find({ action: 'income' }); // Fetch only income transactions
        res.status(200).json(incomeTransactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching income transactions', error: error.message });
    }
});

//  get a specific finance entry by ID
router.get('/getbyid/:id', async (req, res) => {
    try {
        const finance = await Finance.findById(req.params.id);
        if (!finance) {
            return res.status(404).json({ message: 'Finance entry not found' });
        }
        res.status(200).json(finance);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving finance entry', error: error.message });
    }
});

//  update a finance entry by ID
router.put('/update/:id', async (req, res) => {
    try {
        const { title, description, amount, action } = req.body;

       
        if (!title || !description || !amount || !action) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const updatedFinance = await Finance.findByIdAndUpdate(
            req.params.id,
            { title, description, amount, action },
            { new: true } 
        );

        if (!updatedFinance) {
            return res.status(404).json({ message: 'Finance entry not found' });
        }

        res.status(200).json({ message: 'Finance entry updated successfully', data: updatedFinance });
    } catch (error) {
        res.status(500).json({ message: 'Error updating finance entry', error: error.message });
    }
});

// delete a finance entry by ID
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedFinance = await Finance.findByIdAndDelete(req.params.id);
        if (!deletedFinance) {
            return res.status(404).json({ message: 'Finance entry not found' });
        }
        res.status(200).json({ message: 'Finance entry deleted successfully', data: deletedFinance });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting finance entry', error: error.message });
    }
});

//Get all accepted breakdown requests
router.get('/accepted', async (req, res) => {
    try {
        const acceptedBreakdowns = await Breakdown.find({ isAccepted: true });
        res.status(200).json({ status: "Accepted Breakdown Requests Fetched", breakdowns: acceptedBreakdowns });
    } catch (error) {
        console.error("Error fetching accepted breakdown requests:", error);
        res.status(500).json({ 
            message: "Error fetching accepted breakdown requests", 
            error: error.message,
            stack: error.stack
        });
    }
});

//get all employees
router.get('/allEmployees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);  
        res.status(500).json({
            message: "Error fetching employees",
            error: error.message,
            stack: error.stack
        });
    }
});

// Get all appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json({
            status: "Success",
            message: "Appointments fetched successfully",
            data: appointments
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({
            status: "Error",
            message: "Error fetching appointments",
            error: error.message
        });
    }
});

module.exports = router;