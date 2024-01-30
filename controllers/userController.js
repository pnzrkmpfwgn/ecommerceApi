const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
    try {
        // Get user data from request body
        const { username, name, surname, dob, msisdn, email, password } = req.body;

        // Create a new user instance
        const newUser = new User({
            username,
            name,
            surname,
            dob,
            msisdn,
            email,
            password,
        });

        // Save the user to the database
        await newUser.save();

        // TO DO: Send a welcome email to the user
        // TO DO: Send a welcome SMS to the user
        const user = await User.findOne({ email })
        const token = user.token;
        res.status(201).json({ message: 'User registered successfully',token:token});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        
        // Get user credentials from request body
        const { email, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the password is correct
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate and return a JWT token for authentication
        const token = user.token;

        res.status(200).json({ msg: 'User logged in successfully',token:token});
    } catch (error) {
        res.status(500).json({ error: 'Failed to login', msg: error.message,details:error});
    }
};

// Logout user
const logoutUser = (req, res) => {
    // TODO : Delete the JWT token from the database for the session for the user.
    // Implement your logout logic here
    res.status(200).json({ message: 'User logged out successfully' });
};

// Get user by ID
const getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user in the database by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user' });
    }
};

// Update user by ID
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        // Find the user in the database by ID and update the data
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    updateUser,
};
