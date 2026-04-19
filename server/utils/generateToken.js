const jwt = require("jsonwebtoken");

//generates a JWT token for the authenticated user
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      country: user.country,
    },
    process.env.JWT_SECRET,//secret key for signing the token, read from .env file
    {
      expiresIn: "7d",//after this time user needs to login again to get a new token
    }
  );
};

module.exports = generateToken;