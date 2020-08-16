const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');

const authApi = require('./auth');
const userApi = require('./users');
const passwordApi = require('./password');

const router = new KoaRouter();

// unauthenticated endpoints
router.use('/auth', authApi.routes());
router.use('/users',userApi.routes());
// JWT authentication without passthrough (error if not authenticated) process.env.JWT_SECRET
router.use(jwt({ secret: 'authData', passthrough: true, key: 'authData' }));
router.use(async (ctx, next) => {
    try {
        console.log(ctx.state)
        if (ctx.state.authData.userId) {
        ctx.state.currentUser = await ctx.orm.user.findByPk(ctx.state.authData.userId);
        }
        return next();
    } catch (Error) {
        console.log(Error)
        ctx.throw(401)
    }
  });
// authenticated endpoints
router.use('/password',passwordApi.routes());
//router.use('/restaurants', restaurantApi.routes());

module.exports = router;