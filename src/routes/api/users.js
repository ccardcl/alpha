const KoaRouter = require('koa-router');
const jwtgenerator = require('jsonwebtoken');

const router = new KoaRouter();

router.get('api.users.list', '/', async (ctx) => {
	const users = await ctx.orm.user.findAll();
	ctx.body = ctx.jsonSerializer('user', {
	attributes: ['name', 'email', 'img','vendor_name', 'rut', 'type', 'phone','rsocial','bank_account'],
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
		attributes: ['name', 'email', 'img','rut', 'type', 'phone','rsocial','bank_account','vendor_name'],
		topLevelLinks: {
		self: `${ctx.origin}${ctx.router.url('api.users')}`,
		},
	}).serialize(user);
	});
router.post('users.create', '/create', async (ctx) => {
	const user = ctx.orm.user.build(ctx.request.body);
	
	try {
		await user.save({ fields: ['name', 'email', 'vendor_name','img','password', 'rut', 'type', 'phone','rsocial','bank_account' ] });//sin foto
		const token = await new Promise((resolve, reject) => {
			jwtgenerator.sign(
			  { userId: user.id },
			  'authData',
			  (err, tokenResult) => (err ? reject(err) : resolve(tokenResult)),
			);
		  });
		  ctx.body = { token };
		//ctx.redirect(ctx.router.url('api.users.list'));
	} catch (validationError) {
		console.log(validationError);
		
	}
	});
router.patch('users.update', '/edit', async (ctx) => {
	const { id } = ctx.request.body;
	console.log(id)
	const  user  = await ctx.orm.user.findByPk(id);
	try {
		const { name, email, img, vendor_name, rut, type, phone,rsocial,bank_account} = ctx.request.body;
		await user.update({ name, email, img, vendor_name, rut, type, phone,rsocial,bank_account});
		ctx.body = { user };
	} catch (validationError) {
		console.log(validationError);
	}
	});

	

module.exports = router;
