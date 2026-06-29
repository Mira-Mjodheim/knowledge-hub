const { User } = require('../models');
const { hashPassword, comparePasswords, generateToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find().exec();
    },
    user: async (parent, { id }) => {
      return await User.findById(id).exec();
    },
    me: async (parent, args, { user }) => {
      if (!user) throw new Error('Non authentifié');
      return await User.findById(user.id).exec();
    },
  },
  Mutation: {
    register: async (parent, { username, email, password }) => {
      const existing = await User.findOne({ email }).exec();
      if (existing) throw new Error('Un utilisateur avec cet email existe déjà');
      const hashedPassword = await hashPassword(password);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      const token = generateToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }).exec();
      if (!user) throw new Error('Utilisateur non trouvé');
      const valid = await comparePasswords(password, user.password);
      if (!valid) throw new Error('Mot de passe incorrect');
      const token = generateToken(user);
      return { token, user };
    },
    updateUser: async (parent, { id, username, email }, { user }) => {
      if (!user) throw new Error('Non authentifié');
      if (user.id !== id) throw new Error('Permission refusée');
      return await User.findByIdAndUpdate(id, { username, email }, { new: true }).exec();
    },
    deleteUser: async (parent, { id }, { user }) => {
      if (!user) throw new Error('Non authentifié');
      if (user.id !== id) throw new Error('Permission refusée');
      await User.findByIdAndDelete(id).exec();
      return true;
    },
  },
};

module.exports = resolvers;
