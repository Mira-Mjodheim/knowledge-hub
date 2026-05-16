```javascript
const { validate: isEmail } = require('isemail');
const { isMongoId } = require('is-mongodb-id');

const validate = {
  isValidEmail: (email) => isEmail(email),
  isValidMongoId: (id) => isMongoId(id),
  isValidPassword: (password) => password.length >= 8,
  isValidString: (str) => typeof str === 'string' && str.trim().length > 0,
};

module.exports = validate;
```