const KoaRouter = require('koa-router');
const { Op } = require("sequelize");

const router = new KoaRouter();

router.get('api.artists.list', '/', async (ctx) => {
    const artists = await ctx.orm.Artist.findAll();
    const data = []
    artists.forEach( function(artist) {
        const body= {
            id: artist.id,
        name: artist.name,
        age: artist.age,
        albums: artist.albums,
        tracks:  artist.tracks,
        self:  artist.self
        } 
        data.push(body);
      })
    ctx.body=data;
    
  });

  router.get('api.albums.list', '/:id/albums', async (ctx) => {
    try{
      const albums = await ctx.orm.Album.findAll({
        where: {
          artistId: ctx.params.id
        }
      }

      );
      const data = []
      albums.forEach( function(album) {
          const body= {
              id: album.id,
              artist_id: album.artistId,
          name: album.name,
          genre: album.genre,
          artist:  album.artist,
        tracks:  album.tracks,
        self: album.self
          } 
          data.push(body);
        })
      ctx.body=data;
    }catch{
      ctx.throw(404, 'artista no encontrado')
    }
    
  });

  router.get('api.tracks.list', '/:id/tracks', async (ctx) => {
    try{
      const albums = await ctx.orm.Album.findAll({
        where: {
          artistId: ctx.params.id
        }
      }

      );
      console.log(albums)
      const albums_ids =[]
      const data=[]
      albums.forEach(  function(album) {
        const body={
          albumId: album.id
        }
        albums_ids.push(body)
      })
      const tracks= await ctx.orm.Track.findAll({
        where: {
          [Op.or]: albums_ids
        }
      })
      tracks.forEach( function(track) {
        const body= {
          id: track.id,
          album_id: track.albumId,
          name: track.name,
          duration: track.duration,
          times_played: track.times_played,
          artist: track.artist,
          album: track.album,
          self:  track.self
        } 
        data.push(body);
      })
          
      ctx.body=data;
    }catch (Error){
      console.log(Error)
      ctx.throw(404, 'artista no encontrado')
    }
    
  });
  
  
  
  router.get('api.artists.show', '/:id', async (ctx) => {
    try{
    console.log(ctx.params);
    const artist = await ctx.orm.Artist.findByPk(ctx.params.id);
    ctx.body = {
        id: artist.id,
        name: artist.name,
        age: artist.age,
        albums: artist.albums,
      tracks:  artist.tracks,
        self:  artist.self

    }
    ctx.status=200;
  } catch {
    ctx.throw=(404,'artista no encontrado');
  }
  });
 
  
  router.post('api.artists.create', '/', async (ctx) => {
    if ((typeof ctx.request.body['name']) === 'string' && (typeof ctx.request.body['age']) === 'number') {
    existe = await ctx.orm.Artist.findAll({
      where: {
        name: ctx.request.body['name']
      }
    })
    if (existe.length) {
      const name1 = ctx.request.body['name']
    const pkid =Buffer.from(name1).toString('base64').slice(0, 22);
    const artist = await ctx.orm.Artist.findByPk(pkid);
    ctx.body = {
      id: artist.id,
      name: artist.name,
      age: artist.age,
      albums: artist.albums,
    tracks:  artist.tracks,
      self:  artist.self

  }
    ctx.status=409;
    } else {
    console.log('sssss');
    const name1 = ctx.request.body['name']
    const pkid =Buffer.from(name1).toString('base64').slice(0, 22);
    console.log(pkid)
    const  self = `${ctx.origin}/artists/${pkid}`;
    const albums = `${ctx.origin}/artists/${pkid}/albums`;
    const  tracks =  `${ctx.origin}/artists/${pkid}/tracks`;
    const newbody= {
        id: pkid,
        name: name1,
        age: ctx.request.body['age'],
        albums: albums,
        tracks: tracks,
        self: self

    }
    const artist = ctx.orm.Artist.build(newbody);
    console.log(pkid)
    try {
      await artist.save({ fields: ['name', 'age', 'id', 'self', 'albums', 'tracks'] });
      ctx.body = {
          id: artist.id,
          name: artist.name,
          age: artist.age,
          albums: `${ctx.origin}/artists/${artist.id}/albums`,
          tracks:  `${ctx.origin}/artists/${artist.id}/tracks`,
          self:  `${ctx.origin}/artists/${artist.id}`
      }
      ctx.status=201;
    } catch (validationError) {
      console.log(validationError)
    }}
  } else {
    ctx.throw(400, 'input invalido')
  }
  });

  
  
  router.post('api.albums.create', '/:id/albums', async (ctx) => {
    if ((typeof ctx.request.body['name']) === 'string' && (typeof ctx.request.body['genre']) === 'string') {
      console.log('hola')
      const art = await ctx.orm.Artist.findAll({
        where: {
          id: ctx.params.id
        }
        });
      if (art.length) {
    existe = await ctx.orm.Album.findAll({
      where: {
        name: ctx.request.body['name']
      }
    })
    const artista = await ctx.orm.Artist.findByPk(ctx.params.id);
    if (existe.length) {
      const name1 = ctx.request.body['name']
    const encoder = `${name1}:${artista.id}`
    const pkid =Buffer.from(encoder).toString('base64').slice(0, 22);
      const album = await ctx.orm.Album.findByPk(pkid);
    ctx.body = {
        id: album.id,
            artist_id: album.artistId,
        name: album.name,
        genre: album.genre,
        artist:  album.artist,
      tracks:  album.tracks,
      self: album.self

    }
    ctx.status=409;
    } else {
    console.log('sssss');
    const name1 = ctx.request.body['name']
    const encoder = `${name1}:${artista.id}`
    const pkid =Buffer.from(encoder).toString('base64').slice(0, 22);
    console.log(pkid)
    const  self = `${ctx.origin}/albums/${pkid}`;
    const artist = `${ctx.origin}/artists/${artista.id}`;
    const  tracks =  `${ctx.origin}/albums/${pkid}/tracks`;
    const newbody= {
        id: pkid,
        artistId: artista.id,
        name: name1,
        genre: ctx.request.body['genre'],
        artist: artist,
        tracks: tracks,
        self: self

    }
    const album = ctx.orm.Album.build(newbody);
    console.log(pkid)
    try {
      await album.save({ fields: ['name', 'artistId', 'id', 'self', 'genre', 'artist', 'tracks'] });
      ctx.body = {
          id: album.id,
          artist_id: artista.id,
          name: album.name,
          genre: album.genre,
          artist: album.artist,
          tracks: album.tracks,
          self:  album.self
      }
      ctx.status=201;
    } catch (validationError) {
      console.log(validationError)
    }} }else{
      ctx.throw(422,'artista no existe')
    }
  } else {
    ctx.throw(400, 'input invalido')
  }
  });
  
  router.put('api.tracks.play', '/:id/albums/play', async (ctx) => {
    try{
      console.log('quiero puuut')
      const albums = await ctx.orm.Album.findAll({
        where: {
          artistId: ctx.params.id
        }
      }

      );
      console.log(albums)
      const albums_ids =[]
      albums.forEach(  function(album) {
        const body={
          albumId: album.id
        }
        albums_ids.push(body)
      })
      const tracks= await ctx.orm.Track.findAll({
        where: {
          [Op.or]: albums_ids
        }
      })
      tracks.forEach( async function(track) {
        track.times_played+=1;
        await track.save();
      })
          
      ctx.body=('canciones repoducidas');
    }catch (Error){
      console.log(Error)
      ctx.throw(404, 'artista no encontrado')
    }
    
  });



  router.del('artists.delete', '/:id', async (ctx) => {
    console.log(ctx.params.id);
    try {
    const artist = await ctx.orm.Artist.findByPk(ctx.params.id);
    console.log(artist);
    await artist.destroy();
    ctx.status = 204;
    } catch (validationError) {
      ctx.body = { description: 'artista inexistente'};
      ctx.status= 404;
    }
  });

  module.exports = router;