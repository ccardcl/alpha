const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.albums.list', '/', async (ctx) => {
    const albums = await ctx.orm.Album.findAll();
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
    
  });
  
  
  router.get('api.albums.show', '/:id', async (ctx) => {
    try{
    console.log(ctx.params);
    const album = await ctx.orm.Album.findByPk(ctx.params.id);
    console.log(album.genre)
    ctx.body = {
        id: album.id,
            artist_id: album.artistId,
        name: album.name,
        genre: album.genre,
        artist:  album.artist,
      tracks:  album.tracks,
      self: album.self

    }
  } catch {
    ctx.throw=(404,'album no encontrado');
  }
  });

  router.get('album.tracks.list', '/:id/tracks', async (ctx) => {
    try{
      const tracks = await ctx.orm.Track.findAll({
        where: {
          albumId: ctx.params.id
        }
      }

      );
      const data = []
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
    }catch{
      ctx.throw(404, 'album no encontrado')
    }
    
  });

  
 
  
  router.post('api.tracks.create', '/:id/tracks', async (ctx) => {
    if ((typeof ctx.request.body['name']) === 'string' && (typeof ctx.request.body['duration']) === 'number') {
      console.log('hola')
      const art = await ctx.orm.Album.findAll({
        where: {
          id: ctx.params.id
        }
        });
      if (art.length) {
        console.log('1sssss');
    existe = await ctx.orm.Track.findAll({
      where: {
        name: ctx.request.body['name']
      }
    })
    console.log('1sssss');
    const albuma = await ctx.orm.Album.findByPk(ctx.params.id);
    if (existe.length) {
      const name1 = ctx.request.body['name'];
    const encoder = `${name1}:${albuma.id}`;
    const pkid =Buffer.from(encoder).toString('base64').slice(0, 22);
    const track = await ctx.orm.Track.findByPk(pkid);
    
    ctx.body = {
        id: track.id,
            album_id: track.albumId,
            name: track.name,
            duration: track.duration,
            times_played: track.times_played,
            artist: track.artist,
            album: track.album,
            self:  track.self

    }
    ctx.status=409;
    } else {
    console.log('sssss');
    const name1 = ctx.request.body['name']
    const encoder = `${name1}:${albuma.id}`
    const pkid =Buffer.from(encoder).toString('base64').slice(0, 22);
    const  self = `${ctx.origin}/traks/${pkid}`;
    const album = `${ctx.origin}/albums/${albuma.id}`;
    const  artist =  `${ctx.origin}/artist/${albuma.artistId}`;
    const newbody= {
        id: pkid,
        albumId: albuma.id,
        name: name1,
        duration: ctx.request.body['duration'],
        times_played: 0,
        album: album,
        artist: artist,
        self: self

    }
    const track = ctx.orm.Track.build(newbody);
    console.log(pkid)
    try {
      await track.save({ fields: ['name', 'albumId', 'id', 'self', 'artist', 'album', 'duration', 'times_played'] });
      ctx.body = {
          id: track.id,
          album_id: track.albumId,
          name: track.name,
          duration: track.duration,
          times_played: track.times_played,
          artist: track.artist,
          album: track.album,
          self:  track.self
      }
      ctx.status=201;
    } catch (validationError) {
      console.log(validationError)
    }} }else{
      ctx.throw(422,'album no existe')
    }
  } else {
    ctx.throw(400, 'input invalido')
  }
  });
  
  router.put('api.tracks.play', '/:id/tracks/play', async (ctx) => {
    try{
        const tracks = await ctx.orm.Track.findAll({
            where: {
              albumId: ctx.params.id
            }
          }
    
          );
          tracks.forEach( async function(track) {
              track.times_played +=1
              await track.save()
            })
    ctx.body=('canciones reproducida');
    ctx.status=200;
  } catch {
    ctx.throw=(404,'album no encontrado');
  }
  });



  router.del('albums.delete', '/:id', async (ctx) => {
    console.log(ctx.params.id);
    try {
    const album = await ctx.orm.Album.findByPk(ctx.params.id);
    console.log(album);
    await album.destroy();
    ctx.body=('album eliminado');
    ctx.status = 204;
    } catch (validationError) {
      ctx.body = ( 'album inexistente');
      ctx.status= 404;
    }
  });

  module.exports = router;