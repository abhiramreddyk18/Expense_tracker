const jwt = require('jsonwebtoken');

const generateToken = (email, userId) => {
  return jwt.sign(
    { email, userId },
    process.env.JWT_SECRET ,
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
