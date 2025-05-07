const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 8070;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(cors());
app.use(bodyParser.json());

// Test API Route
app.get('/api/hello', (req, res) => {
    res.json({ message: "Hello from backend!" });
});

// Check if MongoDB URL is loaded correctly
if (!MONGODB_URL) {
    console.error("Error: MONGODB_URL is not defined. Check your .env file.");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
});

// Confirm MongoDB connection
const connect = mongoose.connection;
connect.once("open", () => {
    console.log("🔗 MongoDB Database Connected");
});

//access Routes file
const breakdownRouter = require("./routes/breakdownRoute");
const employeeRouter = require('./routes/employeeRoute');
const emailRouter = require('./routes/emailRoute');

app.use("/breakdown" , breakdownRouter);
app.use('/employees', employeeRouter);
app.use('/email', emailRouter);


// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
