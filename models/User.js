const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    // to check for the valid email
    // RegExp, creates a validator that checks if the value matches the given regular expression
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true, // its not a validator it just creates a unique index
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: 6,
  },
});


// Save user using mongoose midddleware [refer mongoose docs] bina next() ke bhi chalta hai
UserSchema.pre("save", async function () {
  // suggestion - use good old function() instead of arrow function
  // generate the salt & get the password

  const salt = await bcrypt.genSalt(10);
  // as far as the password, well this is where the callback func comes into play
  // here this will point to the document
  this.password = await bcrypt.hash(this.password, salt);
});


// instance method to generate the token (JWT) [refer mongoose docs]
UserSchema.methods.createJWT = function () { 
    // in the function we can access the document by using 'this' matlab user._id ke badle this._id
  return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  // we want to pass in the data we wanna send back so we'll go with id & name
}; // ab ja ke sirf user.createJWT() karde and token will be generated.


UserSchema.methods.comparePassword = async function(userPassword){ 
  // this func is going to be looking for one argument & that ofc is going to be the password that's coming with a request
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
} // now we go to the auth.js & if we see that we have the user then we also wanna setup one more if() where we'll check the password
// & if there is a user then check if the password matches by calling the method comparePassword() on user => await user.comparePassword()



module.exports = mongoose.model("User", UserSchema);
