// // to check for the errors in the controllers
// const {name,email,password} = req.body;
// if( !name || !email || !password ){
//     throw new BadRequestError('Please provide name,email & password');
// }
// But in this project we'll just use mongoose validators quite a bit bec mongoose can also send meaningful errors

// FOR Hashing the password - apply bcrypt.genSalt(10) & bcrypt.hash()

const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body }); // instead of dumping the entire req.body, we wanna spread them out therefore we'll use ...tempUser
  // so once we create a user ofc we have that instance method
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};
// In this process we learned about hashing the passwords, setting up the mongoose middleware as well as the instance methods on the schema

// Setup - the users just need to provide the email & the password (not the name)
// & if they dont, we send back the bad request error
// After that we'll check for the user in our database so basically we'll go with our user & findById and we'll pass in the email
// If we can see that we have the user,we wanna check whether the password matches 
// & we also want to set up 1 more if() where we'll check the password
// compare password functionality
// create jwt token
// And if we can findById then ofc we'll send back the user with username and token & if not we'll send back another error
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { 
    throw new BadRequestError("Please provide email & password");
  }
  const user = await User.findOne({ email });

  if (!user) { // if not, then straight away send back invalid credentials 
    throw new UnauthenticatedError(`Invalid Credentials`); 
  }
  // compare password using the library bcryptjs { there is a func named compare(), it compares the hashedPassword } 
  // we can set it up right here but its better to use the instance method so refer User to see how we set up the functionality.
  const isPasswordCorrect = await user.comparePassword(password); 
  if(!isPasswordCorrect){ // if the password is not correct
    throw new UnauthenticatedError('Invalid Credentials');
  }
  // if we go past this error that means user is there & the password is correct therefore we need to invoke the createJWT method
  // and essentially wanna send back the same response 
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};
// explaination for the BadRequestError() in the login controller unlike the register one
// Now lastly, youre probably wondering but why did you check this time in the controllers and didnt use mongoose validators
// bec its better to set this 3 lines right here in login instead of chasing it in error handler
// so i'll just use this setup for login in any further projects 



// As far as auth, the last thing we need is auth middleware where we can verify the token
// & if everything is correct, we get the userId & name it along to the job routes 
// iska matlab ki agar sab credentials sahi nikle toh jwt login kardega uss user ka account & will show the content accordingly



module.exports = {
  register,
  login,
};
