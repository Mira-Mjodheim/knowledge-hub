const validate = {
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isValidMongoId: (id) => /^[a-f\d]{24}$/i.test(id),
  isValidPassword: (password) => password.length >= 8,
  isValidString: (str) => typeof str === 'string' && str.trim().length > 0,
};

module.exports = validate;
