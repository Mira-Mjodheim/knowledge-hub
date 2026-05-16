```javascript
const { User } = require('../models/User');
const { mongo } = require('../db/mongo');

const userService = {
  async getAllUsers() {
    return await User.find().exec();
  },

  async getUserById(id) {
    return await User.findById(id).exec();
  },

  async createUser(userInput) {
    const existingUser = await User.findOne({ email: userInput.email }).exec();
    if (existingUser) {
      throw new Error('Utilisateur déjà existant avec cet e-mail');
    }
    const user = new User(userInput);
    return await user.save();
  },

  async updateUser(id, userInput) {
    return await User.findByIdAndUpdate(id, userInput, { new: true }).exec();
  },

  async deleteUser(id) {
    return await User.findByIdAndDelete(id).exec();
  },

  async getUserByEmail(email) {
    return await User.findOne({ email }).exec();
  },
};

module.exports = userService;
```