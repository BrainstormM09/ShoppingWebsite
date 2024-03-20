// Import necessary modules
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

// Create a User schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle form submission
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Perform data validation
    const errors = [];
    if (!username) {
        errors.push("Username is required.");
    }
    if (!email) {
        errors.push("Email is required.");
    } else if (!validateEmail(email)) {
        errors.push("Invalid email format.");
    }
    if (!password) {
        errors.push("Password is required.");
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
    } else {
        // Create a new user and save it to the MongoDB database
        const newUser = new User({ username, email, password });
        newUser.save()
            .then(() => {
                res.status(200).json({ message: `Signup successful. Welcome, ${username}!` });
            })
            .catch(error => {
                res.status(500).json({ error: "Error signing up: " + error.message });
            });
    }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Function to validate email format
function validateEmail(email) {
    // You can use a regular expression for more robust email validation
    return email.includes('@');
}
