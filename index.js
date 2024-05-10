const express = require("express");
const app = express();
const port = 3000;
const path = require("path");



app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render("home_page")
})
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/about_us', (req, res) => {
    res.render('about_us');
});
app.get('/fees', (req, res) => {
    res.render('fees');
} );
app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/cart', (req, res) => {
    res.render('cart');
});

app.get('/   99  7   56')

app.listen(port, () => { console.log(`Port running at http://localhost:${port}`) })
