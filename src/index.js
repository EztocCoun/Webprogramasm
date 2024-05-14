const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // For generating a random reset token

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



app.get('/copyright', (req, res, next) => {
    res.render('copyright');
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

// Register User
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        
        data.password = hashedPassword; // Replace the original password with the hashed one
        
        const userdata = await collection.insertMany(data);
        res.render("login");
        // console.log(userdata);
    }

});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});

// Route to render the forgot password page
app.get('/forgot-password', (req, res) => {
    res.render('forgotPassword');
});

// Route to handle the forgot password form submission
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetLink = `http://localhost:5000/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    // Simulate the email content
    const emailMessage = `
        <p>Dear User,</p>
        <p>You requested to reset your password. Please click the link below to reset your password:</p>
        <a style="color: orange;" href="${resetLink}">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you,<br>The Mall Team</p>
    `;
    
    // Display the email message
    res.render('emailSent', { email, emailMessage });
});

// Error handling middleware...
app.use((err, req, res, next) => {
    res.status(500).send('Something went wrong!');
});

// Define Port for Application
const port = 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});
