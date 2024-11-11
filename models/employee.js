const { name } = require("ejs");
const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emoployeeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    email: String,
    mobile: Number,
    designation: String,
    gender: String,
    course: String,
    createDate :{
        type: Date,
        default: Date.now()
    }
}) ;

const Employee = mongoose.model("Employee", emoployeeSchema);
module.exports = Employee;