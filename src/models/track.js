module.exports = (sequelize, DataTypes) => {
  const Track = sequelize.define('Track', {
    albumId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    duration: DataTypes.FLOAT,
    times_played: DataTypes.INTEGER,
    artist: DataTypes.STRING,
    album: DataTypes.STRING,
    self: DataTypes.STRING
  }, {});
  Track.associate = models => {
    // associations can be defined here
    Track.belongsTo(models.Album, {foreignKey: 'albumId'});

  };
  return Track;
};