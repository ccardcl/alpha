const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');

const authApi = require('./auth');
const userApi = require('./users');

const router = new KoaRouter();

// unauthenticated endpoints
router.use('/auth', authApi.routes());
router.use('/users',userApi.routes());

// JWT authentication without passthrough (error if not authenticated)
router.use(jwt({ secret: process.env.JWT_SECRET, passthrough: true, key: 'authData' }));
router.use(async (ctx, next) => {
    try {
        if (ctx.state.authData.userId) {
        ctx.state.currentUser = await ctx.orm.user.findByPk(ctx.state.authData.userId);
        }
        return next();
    } catch (Error) {
        ctx.throw(401)
    }
  });
// authenticated endpoints
//router.use('/restaurants', restaurantApi.routes());

module.exports = router;