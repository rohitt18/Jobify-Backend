// // to check for the errors in the controllers
// const {name,email,password} = req.body;
// if( !name || !email || !password ){
//     throw new BadRequestError('Please provide name,email & password');
// }
// But in this project we'll just use mongoose validators quite a bit bec mongoose can also send meaningful errors

// FOR Hashing the password - apply bcrypt.genSalt(10) & bcrypt.hash()

const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });  // instead of dumping the entire req.body, we wanna spread them out therefore we'll use ...tempUser
  // so once we create a user ofc we have that instance method 
  const token = user.createJWT(); 
  res.status(StatusCodes.CREATED).json({ user:{name:user.name}, token });
};
// In this process we learned about hashing the passwords, setting up the mongoose middleware as well as the instance methods on the schema

const login = async (req, res) => {
  res.send("login user");
};

module.exports = {
  register,
  login,
};
