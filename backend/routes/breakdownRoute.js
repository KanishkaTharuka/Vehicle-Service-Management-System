const router = require("express").Router();
let Breakdown = require("../models/breakDownModel");

//create breakdown
router.route("/add").post(async (req, res) => {
    try {
        const { 
            vehicleRegistrationNumber, 
            customerName, 
            customerContactNumber,
            vehicleMakeModel, 
            vehicleType, 
            currentLocation,
            breakdownType, 
            emergencyLevel 
        } = req.body;
        
        if (!vehicleRegistrationNumber || !customerName || !customerContactNumber || !vehicleMakeModel || !vehicleType || !breakdownType || !emergencyLevel || !currentLocation) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newBreakdown = new Breakdown({
            vehicleRegistrationNumber,
            customerName,
            customerContactNumber,
            vehicleMakeModel,
            vehicleType,
            currentLocation: {
                type: 'Address',
                address: currentLocation
            },
            breakdownType,
            emergencyLevel
        });

        await newBreakdown.save();
        res.status(201).json({ message: "Breakdown Added Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding breakdown", error: error.message });
    }
});


//view breakdown
router.route("/view").get((req, res) => {

    Breakdown.find().then((breakdowns) => {
        res.json(breakdowns)
    }).catch((err) => {
        console.log(err);
    })
})

//update breakdown
router.route("/update/:id").put(async(req, res) => {
    try {
        let id = req.params.id;
        const { vehicleRegistrationNumber, customerName, customerContactNumber, vehicleMakeModel, vehicleType, currentLocation, breakdownType, emergencyLevel } = req.body;

        const updateBreakdown = {
            vehicleRegistrationNumber,
            customerName,
            customerContactNumber,
            vehicleMakeModel,
            vehicleType,
            currentLocation,
            breakdownType,
            emergencyLevel
        }

        const updatedBreakdown = await Breakdown.findByIdAndUpdate(id, updateBreakdown);
        res.status(200).json({ status: "Breakdown Updated", breakdown: updatedBreakdown });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "Error updating breakdown", error: error.message });
    }
});

//delete breakdown
router.route("/delete/:id").delete(async (req, res) => {
    let id = req.params.id;
    await Breakdown.findByIdAndDelete(id).then(() => {
        res.status(200).send({status: "Breakdown Deleted"})
    }).catch((err) => {
        console.log(err);
    })

})

//get breakdown by id
router.route("/get/:id").get(async (req, res) => {
    let id = req.params.id;
    
    const breakdown = await Breakdown.findById(id).then((breakdown) => {
        res.status(200).send({status: "Breakdown Fetched", breakdown})
    }).catch((err) => {
        console.log(err);
    })
})

//get breakdown by vehicle registration number
router.route("/get/vehicle/:vehicleRegistrationNumber").get(async (req, res) => {
    let vehicleRegistrationNumber = req.params.vehicleRegistrationNumber;
    await Breakdown.find({vehicleRegistrationNumber}).then((breakdown) => {
        res.status(200).send({status: "Breakdown Fetched", breakdown})
    })
})

// Accept a breakdown request
router.route("/accept/:id").put(async (req, res) => {
    try {
        const breakdown = await Breakdown.findById(req.params.id);
        if (!breakdown) {
            return res.status(404).json({ message: "Breakdown request not found" });
        }

        // Mark the request as accepted
        breakdown.isAccepted = true;
        breakdown.acceptedAt = new Date();
        await breakdown.save();

        res.status(200).json({ message: "Request accepted successfully", data: breakdown });
    } catch (error) {
        console.error("Error accepting request:", error);
        res.status(500).json({ message: "Error accepting request", error: error.message });
    }
});


// Get breakdown by vehicle registration number
router.route("/get/vehicle/:vehicleRegistrationNumber").get(async (req, res) => {
    let vehicleRegistrationNumber = req.params.vehicleRegistrationNumber;
    await Breakdown.find({ vehicleRegistrationNumber }).then((breakdown) => {
        res.status(200).send({ status: "Breakdown Fetched", breakdown });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ message: "Error fetching breakdown", error: err.message });
    });
});

module.exports = router;