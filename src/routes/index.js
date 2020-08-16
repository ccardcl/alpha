const KoaRouter = require('koa-router');
const pkg = require('../../package.json');
const S3_BUCKET = process.env.S3_BUCKET;
const router = new KoaRouter();

router.get('/', async (ctx) => {
  await ctx.render('index', { 
    appVersion: pkg.version,
    a: S3_BUCKET,
  });
});

module.exports = router;
