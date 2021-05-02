'use strict';
module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define('Album', {
    artistId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    artist: DataTypes.STRING,
    tracks: DataTypes.STRING,
    self: DataTypes.STRING
  }, {});
  
  Album.associate = models => {
    // associations can be defined here
    Album.belongsTo(models.Artist, {foreignKey: 'artistId'});
    Album.hasMany(models.Track, { as: 'track', foreignKey: 'albumId', sourseKey: 'id', onDelete: 'CASCADE', hooks: true});

  };
  return Album;
};