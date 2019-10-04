module.exports = function(sequelize, DataTypes) {
  var Song = sequelize.define("Song", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    spotifyURI: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    emotion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
  });

  Song.associate = function(models) {
    Song.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Song;
};