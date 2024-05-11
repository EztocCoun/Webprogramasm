var MenuItems = document.getElementById("MenuItems");

MenuItems.style.maxHeight = "0px";

function menutoggle() {
    if (MenuItems.style.maxHeight == "0px") {
        MenuItems.style.maxHeight = "200px";
    }
    else {
        MenuItems.style.maxHeight = "0px";
    }
}


var RegForm = document.getElementById("RegForm");
var LoginForm = document.getElementById("LoginForm");
var Indicator = document.getElementById("Indicator");
function register() {
    RegForm.style.transform = "translateX(300px)";
    LoginForm.style.transform = "translateX(300px)";
    Indicator.style.transform = "translateX(0px)";
}
function login() {
    RegForm.style.transform = "translateX(0px)";
    LoginForm.style.transform = "translateX(0px)";
    Indicator.style.transform = "translateX(100px)";
}



function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    fetch('/login', {
        method: 'POST',
        body: data
    })
    .then(response => response.text())  // Handling plain text response
    .then(message => {
        alert(message);  // Displaying the message in an alert
        window.location.href = "http://localhost:3000/home_page";
    })
    .catch(error => {
        alert('Error logging in: ' + error.message);
    });
}

function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);

    fetch('/register', {
        method: 'POST',
        body: data
    })
    .then(response => response.text())  // Handling plain text response
    .then(message => {
        alert(message);  // Displaying the message in an alert
        if (message === 'Registration successful') {
            window.location.href = "http://localhost:3000/home_page";  // Optionally reset form on successful registration
        }
    })
    .catch(error => {
        alert('Error registering: ' + error.message);
    });
}
