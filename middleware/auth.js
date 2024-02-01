const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
    console.log(token);
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Token is not valid', error: error.message });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error('Error in auth middleware:', err);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
};