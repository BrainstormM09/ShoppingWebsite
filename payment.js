const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Database configuration
const mongodbUrl = 'mongodb://127.0.0.1:27017/online_marketplace'; // Update with your MongoDB URL
mongoose.connect(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create a Payment schema
const paymentSchema = new mongoose.Schema({
    username: String,
    phone_no: String,
    address: String,
    payment_method: String
});
const Payment = mongoose.model('Payment', paymentSchema);

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle form submission
app.post('/placeOrder', (req, res) => {
    const { username, phone_no, address, payment_method } = req.body;

    // Perform data validation
    const errors = [];
    if (!username) {
        errors.push("Username is required.");
    }
    if (!phone_no) {
        errors.push("Phone No. is required.");
    }
    if (!address) {
        errors.push("Address is required.");
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        // Create a new payment record and save it to the MongoDB database
        const newPayment = new Payment({ username, phone_no, address, payment_method });
        newPayment.save()
            .then(() => {
                res.status(200).json({ message: "Payment successful. Order placed" });
            })
            .catch(error => {
                res.status(500).json({ error: "Error in placing order: " + error.message });
            });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
