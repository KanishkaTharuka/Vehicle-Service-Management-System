const router = require("express").Router();
const Employee = require('../models/employeeModel');


// Get employees with position 'Driver'
router.get('/', async (req, res) => {
  try {
    const { position } = req.query;
    const employees = await Employee.find(position ? { position } : {});
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});

module.exports = router;
