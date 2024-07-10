const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

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

const uri = "mongodb+srv://6420015:afterfallSP1@clusteraf.lcvf3mb.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAF"; 
const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
    connectTimeoutMS: 10000
});

async function main() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('afterfall');
        console.log('Connected to database');
        const usersCollection = db.collection('users');
        console.log('Connected to Users collection');

        // // TEST USER DATA
        // const simulatedUsers = {
        //     'user1@gmail.com': { password: 'password1' },
        //     'user2@gmail.com': { password: 'password2' }
        // };

        // // Insert simulated users into the database
        // Object.entries(simulatedUsers).forEach(([email, userData]) => {
        //     usersCollection.updateOne(
        //         { email: email },
        //         { $set: userData },
        //         { upsert: true }
        //     );
        // });

        // Login route
        app.post('/loginform', async (req, res) => {
            const { userEmail, userPassword } = req.body;
            console.log('Login attempt:', { userEmail, userPassword })
            try {
                const user = await usersCollection.findOne({ email: userEmail });
                if (user && user.password === userPassword) {
                    console.log('Login successful for:', userEmail);
                    req.session.user = userEmail;
                    res.redirect('/profile');
                } else {
                    console.log('Login failed for:', userEmail);
                    res.redirect('/login');
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                res.status(500).send('Internal Server Error');
            }
        });

        // Logout route
        app.get('/logout', (req, res) => {
            req.session.destroy(err => {
                if (err) {
                    console.error('Error destroying session:', err);
                    res.status(500).send('Error logging out');
                } else {
                    res.redirect('/');
                }
            });
        });

        // Profile check route
        app.get('/check-session', (req, res) => {
            if (req.session.user) {
                res.json({ loggedIn: true });
            } else {
                res.json({ loggedIn: false });
            }
        });

        // Serve static files from the 'assets' directory
        app.use('/assets', express.static(path.join(__dirname, 'assets')));

        // Serve HTML files from their respective directories
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'home/'));
        });

        app.get('/profile', (req, res) => {
            res.sendFile(path.join(__dirname, 'userprofile/'));
        });

        app.get('/login', (req, res) => {
            res.sendFile(path.join(__dirname, 'login/'));
        });

        app.get('/signup', (req, res) => {
            res.sendFile(path.join(__dirname, 'signup/'));
        });

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

main().catch(console.error);
