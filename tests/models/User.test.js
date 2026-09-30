const { User } = require('../../src/models');

describe('User', () => {
  it("n'utilise pas la propriété 'id' déclarée dans le schéma", () => {
    expect(User.schema.paths).not.toHaveProperty('id');
  });

  it("le champ 'id' virtuel résout l'ObjectId _id", () => {
    const user = new User({ username: 'alice', email: 'alice@test.local', password: 'motdepasse' });

    expect(user.id).toBe(user._id.toString());
  });
});
