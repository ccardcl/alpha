module.exports = (sequelize, DataTypes) => {
  const Artist = sequelize.define('Artist', {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    albums: DataTypes.STRING,
    tracks: DataTypes.STRING,
    self: DataTypes.STRING
  }, {});
  Artist.associate = models => {
    // associations can be defined here
    Artist.hasMany(models.Album, { as: 'album', foreignKey: 'artistId', sourseKey: 'id', onDelete: 'CASCADE', hooks: true});

  };
  return Artist;
};