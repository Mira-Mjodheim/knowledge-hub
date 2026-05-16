const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const secretKey = process.env.SECRET_KEY;

const authUtils = {
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  async comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  },

  generateToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
    };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
  },

  verifyToken(token) {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      return null;
    }
  },

  async authenticateUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    const isValidPassword = await this.comparePasswords(password, user.password);
    if (!isValidPassword) {
      return null;
    }
    return user;
  },
};

module.exports = authUtils;
