const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    company:{
        type: String,
        required:[true,"Please provide company name"],
        maxLength:50,
    },
    position:{
        type:String,
        required:[true,"Please provide position"],
        maxLength:100,
    },
    status:{
        type:String,
        enum:['interview','declined','pending'],
        default:'pending',
    },
    createdBy:{   // most imp property bec here we'll tie our job to the actual user
        type:mongoose.Types.ObjectId,
        ref: 'User',   // the model which we are referencing in this case we'll go w User ofc
        required:[true,"Please provide user"] // bec we dont wanna create a job without a user
    }
},{timestamps:true})

module.exports = mongoose.model("Job",JobSchema);