const KoaRouter = require('koa-router');
const jwtgenerator = require('jsonwebtoken');

const router = new KoaRouter();

router.get('api.users.list', '/', async (ctx) => {
	const users = await ctx.orm.user.findAll();
	ctx.body = ctx.jsonSerializer('user', {
	attributes: ['name', 'email', 'password', 'rut', 'type', 'phone','rsocial','bank_account'],
	topLevelLinks: {
		self: `${ctx.origin}${ctx.router.url('api.users.list')}`,
	},
	dataLinks: {
		self: (dataset, user) => `${ctx.origin}/api/users/${user.id}`,
	},
	}).serialize(users);
	});

router.get('api.users.show', '/:id', async (ctx) => {
	const user = await ctx.orm.user.findByPk(ctx.params.id);
	ctx.body = ctx.jsonSerializer('user', {
		attributes: ['name', 'email', 'password', 'rut', 'type', 'phone','rsocial','bank_account'],
		topLevelLinks: {
		self: `${ctx.origin}${ctx.router.url('api.users')}`,
		},
	}).serialize(user);
	});
router.post('users.create', '/create', async (ctx) => {
	console.log(`entre al post`)
	const user = ctx.orm.user.build(ctx.request.body);
	const { img } = ctx.request.body;
	try {
		await user.save({ fields: ['name', 'email', 'password', 'rut', 'type', 'phone','rsocial','bank_account' ] });//sin foto
		console.log(`se guardo`)
		ctx.redirect(ctx.router.url('api.users.list'));
	} catch (validationError) {
		console.log(validationError);
		await ctx.render('users/new', {
		user,
		errors: validationError.errors,
		submitUserPath: ctx.router.url('users.create'),
		});
	}
	});
router.patch('api.users.updatepass', '/:id/updatepass', async (ctx) => {
	const user = await ctx.orm.user.findByPk(ctx.params.id);
	const { cpassword, npassword } = ctx.request.body;
	
	if (await bcrypt.compare(cpassword, user.password)) {
		console.log("IGUALESSSSSSSSSSSSSS");
		user.update({password:npassword});
		ctx.redirect(ctx.router.url('api.users.show', { id: user.id }));
	
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
