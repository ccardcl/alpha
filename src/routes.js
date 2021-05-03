const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
//const api = require('./routes/api');
const artist = require('./routes/artists');
const album= require('./routes/albums');
const track= require('./routes/tracks');
const data=require('./routes/db');
const router = new KoaRouter();

router.use(async (ctx, next) => {
   Object.assign(ctx.state, {
       currentUser: ctx.session.userId && await ctx.orm.user.findByPk(ctx.session.userId),
       destroySessionPath: ctx.router.url('session.destroy'),
  
    });
     return next();
   });
//router.use('/api', api.routes());
router.use('/dev', data.routes());
router.use('/artists', artist.routes());
router.use('/albums', album.routes());
router.use('/tracks', track.routes());
//router.use('/index', index.routes());
//router.use('/hello', hello.routes());
module.exports = router;
