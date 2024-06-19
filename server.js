const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: 'your_secret_key', // Change this to a secure random key
    resave: false,
    saveUninitialized: true
}));

// Test user data
const users = {
    'user1@gmail.com': { password: 'password1' },
    'user2@gmail.com': { password: 'password2' }
};

// Login route
app.post('/login', (req, res) => {
    const { userEmail, password } = req.body;
    if (users[userEmail] && users[userEmail].password === password) {
        req.session.user = userEmail;
        res.redirect('/profile.html');
    } else {
        res.redirect('/login.html');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/index.html');
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

// Serve HTML files from the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/profile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'profile.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
