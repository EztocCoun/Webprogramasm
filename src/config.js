const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/youandmedb");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
});

// Create Schema
const Loginschema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: { type: String, required: true },
    country: { type: String, required: true },
    accountType: { type: String, required: true },
    profilePicture: { type: String, required: true },
    businessName: { type: String },
    storeName: { type: String },
    storeCategory: { type: String }
});

// Collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;
