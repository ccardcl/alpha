'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.changeColumn(
      'users',
      'email',{
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
    }

  );
  },
  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.changeColumn(
      'users',
      'email',{
        type:Sequelize.STRING
      }

  );
    }
};
