const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const AccountModel = require('./models/models-account');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/my_databas?retryWrites=true&loadBalanced=false&connectTimeoutMS=10000', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res, next) => {
    res.json("hi");
});

app.get('/login', (req, res, next) => {
    res.render('login');
});

app.get('/about_us', (req, res, next) => {
    res.render('about_us');
});

app.get('/fees', (req, res) => {
    res.render('fees');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

// Register user
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    AccountModel.findOne({ username: username })
        .then(user => {
            if (user) {
                return res.status(409).json('Username already exists');
            }
            return AccountModel.create({ username, password });
        })
        .then(user => {
            res.json('User created successfully');
        })
        .catch(err => {
            console.error('Error during registration:', err);
            res.status(500).json('Registration failed');
        });
});

// User login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    AccountModel.findOne({ username: username, password: password })
        .then(user => {
            if (user) {
                res.json('Login successful');
            } else {
                res.status(400).json('Incorrect username or password');
            }
        })
        .catch(err => {
            console.error('Error during login:', err);
            res.status(500).json('Server error');
        });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
