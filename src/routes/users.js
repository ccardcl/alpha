const KoaRouter = require('koa-router');
const router = new KoaRouter();
require('dotenv').config();
const bcrypt = require('bcrypt');
const PASSWORD_SALT = 10;

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findByPk(ctx.params.id);
  return next();
}

// aws.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: 'sa-east-1'
// });

router.get('users.list', '/', async (ctx) => {
  const usersList = await ctx.orm.user.findAll();
  await ctx.render('users/index', {
    usersList,
    newUserPath: ctx.router.url('users.new'),
    editUserPath: (user) => ctx.router.url('users.edit', { id: user.id }),
    deleteUserPath: (user) => ctx.router.url('users.delete', { id: user.id }),
    makeAdminPath: (user) => ctx.router.url('users.admin', { id: user.id }),
    dietsUserPath: (user) => ctx.router.url('users.diets', { id: user.id }),
    profilePath: ctx.router.url('profile.show'),
  });
});

router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  const dietList = await ctx.orm.diet.findAll();
  await ctx.render('users/new', {
    user,
    dietList,
    submitUserPath: ctx.router.url('users.create'),
  });
});

router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  const { img } = ctx.request.body;

  try {
    await user.save()
    await user.save({ fields: ['name', 'email', 'vendor_name','password', 'rut', 'type', 'phone','rsocial','bank_account' ] });//sin foto

    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('users/new', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});



router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  await ctx.render('users/edit', {
    user,
    submitUserPath: ctx.router.url('users.update', { id: user.id }),
    changeUserPassPath: ctx.router.url('users.editpass', { id: user.id })
  });
});

router.patch('users.update', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  try {
    const { name, email} = ctx.request.body;
    await user.update({ name, email});
    ctx.redirect(ctx.router.url('users.list'));
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update', { id: user.id }),
      changeUserPassPath: ctx.router.url('users.editpass', { id: user.id })
    });
  }
});

router.del('users.delete', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;

  await user.destroy();
  ctx.redirect(ctx.router.url('users.list'));
});

router.patch('users.admin', '/:id/admin', loadUser, async (ctx) => {
  const { user } = ctx.state;

  user.type = '1';

  await user.save();
  ctx.redirect(ctx.router.url('users.list'));
});

router.get('users.editpass', '/:id/editpass', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const dietList = await ctx.orm.diet.findAll();
  //const wrongpass = 0;
  await ctx.render('users/editpass', {

    user,
    //wrongpass,
    submitUserPath: ctx.router.url('users.updatepass', { id: user.id }),
  });
});

router.patch('users.updatepass', '/:id/updatepass', loadUser, async (ctx) => {
  const { user } = ctx.state;

  const { cpassword, npassword } = ctx.request.body;

  if (await bcrypt.compare(cpassword, user.password)) {
    console.log("IGUALESSSSSSSSSSSSSS");
    user.update({password:npassword});
    ctx.redirect(ctx.router.url('users.list'));

  }else{
    ctx.redirect(ctx.router.url('users.editpass', { id: user.id }));
    const wrongpass = 1;
    await ctx.render('users/editpass', {
      user,
      wrongpass,
      submitUserPath: ctx.router.url('users.updatepass', { id: user.id }),
    });

  }

});


module.exports = router;
