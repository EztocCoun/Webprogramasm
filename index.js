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
    res.redirect("login");
});

app.get('/login', (req, res, next) => {
    res.render('login');
});
app.get('/home_page', (req, res, next) => {
    res.render('home_page');
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

app.get('/register', (req, res) => res.render('login'));

// User login
// Handle Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    AccountModel.findOne({ username: username, password: password })
        .then(user => {
            if (user) {
                res.send('success');  // Plain text response
            } else {
                res.send('Incorrect password');  // Plain text response
            }
        })
        .catch(err => {
            console.error('Error during login:', err);
            res.status(500).send('Server error');  // Plain text response
        });
});

// Handle Registration
app.post('/register', (req, res) => {
    const { username, email, password, purpose } = req.body;
    AccountModel.findOne({ username: username, email: email })
        .then(user => {
            if (user) {
                res.send('Username already exists');  // Plain text response
            } else {
                return AccountModel.create({ username, email, password, purpose });
            }
        })
        .then(newUser => {
            if (newUser) {
                res.send('Registration successful');  // Plain text response
            }
        })
        .catch(err => {
            console.error('Error during registration:', err);
            res.status(500).send('Registration failed');  // Plain text response
        });
});



// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
