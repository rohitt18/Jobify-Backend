const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authMiddleware = async (req,res,next) => {
    // check header
    const authHeader = req.headers.authorization;
    // here i wanna check if there is no header or if it doesn't start with 'Bearer ' we'll throw the error.
    if(!authHeader || !authHeader.startsWith('Bearer')){  // startsWith() => Javascript method which we can use on a string
        throw new UnauthenticatedError("Authentication invalid");
    }

    const token = authHeader.split(" ")[1];
    // verify token
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(payload);

        // attach the user to the jobs routes
        // const user = User.findById(payload.id).select('-password');
        // req.user = user;    
        // OR
        req.user = { userId: payload.userId, name: payload.name }; // if successful, it will have some kind of value & in that case ill just setup req.user = to the object in which id & username is there 
        next(); // imp to pass onto next middleware
    } catch (error) {
        throw new UnauthenticatedError("Authentication invalid");
    }
}

module.exports = authMiddleware;