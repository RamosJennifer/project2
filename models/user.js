module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
  });

  User.associate = function (models) {
    User.hasMany(models.Song, {
      onDelete: "CASCADE"
    });
  };

  return User;
};