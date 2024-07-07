const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'your_secret_key', // Change to Secure KEY
    resave: false,
    saveUninitialized: true
}));

// MongoDB connection
const uri = "mongodb+srv://6420015:afterfallSP1@clusteraf.lcvf3mb.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAF"; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
    console.log('Connected to MongoDB');

    const db = client.db('afterfall');
    const usersCollection = db.collection('users');

    // Simulated user data with emails (for demonstration purposes)
    const simulatedUsers = {
        'user1@example.com': { password: 'password1' },
        'user2@example.com': { password: 'password2' }
    };

    // Insert simulated users into the database
    Object.entries(simulatedUsers).forEach(([email, userData]) => {
        usersCollection.updateOne(
            { email: email },
            { $set: userData },
            { upsert: true }
        );
    });

    // Login route
    app.post('/login', (req, res) => {
        const { userEmail, password } = req.body;
        usersCollection.findOne({ email: userEmail }, (err, user) => {
            if (err) {
                console.error('Error fetching user:', err);
                res.redirect('/login/');
                return;
            }

            if (user && user.password === password) {
                req.session.user = userEmail;
                res.redirect('/profile/');
            } else {
                res.redirect('/login/');
            }
        });
    });

    // Logout route
    app.get('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });

    // Profile check route
    app.get('/check-session', (req, res) => {
        if (req.session.user) {
            res.json({ loggedIn: true });
        } else {
            res.json({ loggedIn: false });
        }
    });

    // Serve static files from the 'Assets' directory
    app.use('/assets', express.static(path.join(__dirname, 'assets')));

    // Serve HTML files from their respective directories
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'index/index.html'));
    });

    app.get('/profile/', (req, res) => {
        res.sendFile(path.join(__dirname, 'profile/index.html'));
    });

    app.get('/login/', (req, res) => {
        res.sendFile(path.join(__dirname, 'login/index.html'));
    });

    app.get('/signup/', (req, res) => {
        res.sendFile(path.join(__dirname, 'signup/index.html'));
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
