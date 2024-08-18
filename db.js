const mongoose = require("mongoose");
require('dotenv').config();

const mongooseURI = process.env.MONGODB_CONNECT_URI;
// console.log(mongooseURI2)
// for fix "MongooseServerSelectionError" change "localhost" into "127.0.0.1" ↓ 
// const mongooseURI = "mongodb://127.0.0.1:27017/butt-oil-traders";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongooseURI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

module.exports = connectToMongo;
