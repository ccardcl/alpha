const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.tracks.list', '/', async (ctx) => {
    const tracks = await ctx.orm.Track.findAll();
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
    
  });
  
  
  router.get('api.tracks.show', '/:id', async (ctx) => {
    try{
    console.log(ctx.params);
    const track = await ctx.orm.Track.findByPk(ctx.params.id);
    
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
  } catch {
    ctx.throw=(404,'track no encontrado');
  }
  });

  router.put('api.tracks.play', '/:id/play', async (ctx) => {
    try{
    console.log(ctx.params);
    const track = await ctx.orm.Track.findByPk(ctx.params.id);
    track.times_played +=1;
    await track.save();
    ctx.body=('cancion reproducida');
    ctx.status=200;
  } catch {
    ctx.throw=(404,'track no encontrado');
  }
  });
  

  router.del('tracks.delete', '/:id', async (ctx) => {
    console.log(ctx.params.id);
    try {
    const track = await ctx.orm.Track.findByPk(ctx.params.id);
    console.log(track);
    await track.destroy();
    ctx.body=('track eliminado');
    ctx.status = 204;
    } catch (validationError) {
      ctx.body = ( 'track inexistente');
      ctx.status= 404;
    }
  });

  module.exports = router;