const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('./Index');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue('password', hash);
    }
  },
  token: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  paranoid: true // Soft delete
});

// Instance methods
User.prototype.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// Hooks
User.afterCreate(async (user) => {
  console.log(`Novo usuário criado: ${user.email}`);
});

module.exports = User;