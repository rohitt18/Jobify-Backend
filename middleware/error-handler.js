// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  // to handle the duplicate email wala error
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later',
  }

  // if (err instanceof CustomAPIError) {  // we can comment this out bec we dont need to use this anymore bec of our above new setup
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  // Validation Errors (mongoose)
  if(err.name === "ValidationError"){
    // console.log(Object.values(err.errors)); // just for better understanding
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(","); // array method(map) and dono ke msg ko join
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Duplicate errors (mongoose)
  if(err.code && err.code === 11000){  // 2 err objects hote hai isliye
    // jab obj ka key bhi ek obj rehta hai tab Object.keys() use karneka
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Cast Errors thats when the id syntax doesn't match
  if(err.name === "CastError"){
    customError.msg = `No item found with id: ${err.value._id}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })   
  return res.status(customError.statusCode).json({ msg: customError.msg })

  

}

module.exports = errorHandlerMiddleware
