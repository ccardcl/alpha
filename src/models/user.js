const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    type: DataTypes.INTEGER,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    rsocial: DataTypes.STRING,
    rut: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    name: DataTypes.STRING,
    img: DataTypes.STRING,
    bank_account: DataTypes.JSON,
  }, {});
  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };
  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
};
