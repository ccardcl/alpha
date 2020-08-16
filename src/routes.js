const KoaRouter = require('koa-router');

const hello = require('./routes/hello');
const index = require('./routes/index');
const api = require('./routes/api');
const router = new KoaRouter();

router.use(async (ctx, next) => {
   Object.assign(ctx.state, {
       currentUser: ctx.session.userId && await ctx.orm.user.findByPk(ctx.session.userId),
       destroySessionPath: ctx.router.url('session.destroy'),
  
    });
     return next();
   });
router.use('/', index.routes());
router.use('/hello', hello.routes());
router.use('/api', api.routes());
module.exports = router;
