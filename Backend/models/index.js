require("dotenv").config();
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;


function main() {
    mongoose.connect(uri).then(() => {
        console.log("Succesfull")
    
    }).catch((err) => {
        console.log("Error: ", err)
    })
}

module.exports = { main };  