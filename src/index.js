const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating a random reset token
const multer = require('multer'); // For handling file uploads
const session = require('express-session'); // For managing user sessions

const collection = require("./acc");

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

//use EJS as the view engine
app.set("view engine", "ejs");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Set up sessions with a securely generated secret key
app.use(session({
    secret: 'a_very_long_random_string_generated_for_security', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/copy", (req, res) => {
    res.render("copy");
});

app.get("/ToS", (req, res) => {
    res.render("ToS");
});

app.get("/privacy_policy", (req, res) => {
    res.render("privacy_policy");
});

app.get('/copyright', (req, res, next) => {
    res.render('copyright');
});

app.get('/faq', (req, res, next) => {
    res.render('faq');
});
app.get('/contact', (req, res, next) => {
    res.render('contact');
});
app.get('/detail', (req, res, next) => {
    res.render('detail');
});
app.get('/home', (req, res, next) => {
    res.render('home');
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
app.get('/shopping', (req, res) => {
    res.render('shopping');
});

app.get('/cart', (req, res) => {
    res.render('cart');
});

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Register User
app.post("/signup", upload.single('profilePicture'), async (req, res) => {
    try {
        console.log("Received registration request");
        const {
            email, phone, password, confirmPassword, firstName, lastName,
            address, city, zipcode, country, accountType, businessName, storeName, storeCategory
        } = req.body;

        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return res.send('Passwords do not match.');
        }

        const data = {
            email,
            phone,
            password,
            firstName,
            lastName,
            address,
            city,
            zipcode,
            country,
            accountType,
            profilePicture: `/uploads/${req.file.filename}`
        };

        if (accountType === 'storeOwner') {
            data.businessName = businessName;
            data.storeName = storeName;
            data.storeCategory = storeCategory;
        }

        console.log("Checking for existing user");
        const existingUser = await collection.findOne({ email: data.email });

        if (existingUser) {
            console.error("User already exists");
            return res.send('User already exists. Please choose a different email.');
        } else {
            const saltRounds = 10; // Number of salt rounds for bcrypt
            console.log("Hashing password");
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword; // Replace the original password with the hashed one

            console.log("Inserting new user into database");
            const userdata = await collection.insertMany(data);
            console.log("User registered successfully");
            res.render("login");
        }
    } catch (error) {
        console.error("Error during user registration:", error); // Log the error for debugging
        res.status(500).send('Something went wrong!');
    }
});

// Login user 
app.post("/login", async (req, res) => {
    try {
        console.log("Received login request");
        const check = await collection.findOne({ email: req.body.username });
        if (!check) {
            console.error("User not found");
            res.send("User not found");
        } else {
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if (!isPasswordMatch) {
                console.error("Wrong password");
                res.send("Wrong password");
            } else {
                req.session.user = check;
                console.log("User logged in successfully");
                res.redirect("/my_account");
            }
        }
    } catch (error) {
        console.error("Error during user login:", error); // Log the error for debugging
        res.status(500).send('Something went wrong!');
    }
});

// Route to render the forgot password page
app.get('/forgot-password', (req, res) => {
    res.render('forgotPassword', { message: null });
});

// Route to handle the forgot password form submission
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await collection.findOne({ email: email });

        if (!user) {
            return res.render('forgotPassword', { message: 'No account associated with that email.' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetLink = `http://localhost:5000/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        const emailMessage = `
            <p>Dear User,</p>
            <p>You requested to reset your password. Please click the link below to reset your password:</p>
            <a style="color: orange;" href="${resetLink}">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Thank you,<br>The Mall Team</p>
        `;

        res.render('emailSent', { email, emailMessage });
    } catch (error) {
        console.error("Error during forgot password process:", error); // Log the error for debugging
        res.status(500).send('Something went wrong!');
    }
});

// My Account route
app.get('/my_account', isAuthenticated, (req, res) => {
    const user = req.session.user;
    res.render('my_account', { user });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.error("Error during logout:", err);
        }
        res.redirect('/login');
    });
});

// Error handling middleware...
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
