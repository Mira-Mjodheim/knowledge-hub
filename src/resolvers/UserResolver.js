```javascript
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find().exec();
    },
    user: async (parent, { _id }) => {
      return await User.findById(_id).exec();
    },
    me: async (parent, args, { user }) => {
      return await User.findById(user._id).exec();
    },
  },
  Mutation: {
    register: async (parent, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      return await user.save();
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }).exec();
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Mot de passe incorrect');
      }
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: '1h',
      });
      return { token, user };
    },
    updateUser: async (parent, { _id, name, email }, { user }) => {
      if (user._id !== _id) {
        throw new Error('Vous n\'avez pas la permission de modifier cet utilisateur');
      }
      return await User.findByIdAndUpdate(_id, { name, email }, { new: true }).exec();
    },
    deleteUser: async (parent, { _id }, { user }) => {
      if (user._id !== _id) {
        throw new Error('Vous n\'avez pas la permission de supprimer cet utilisateur');
      }
      return await User.findByIdAndRemove(_id).exec();
    },
  },
};

module.exports = resolvers;
```