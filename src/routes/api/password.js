const KoaRouter = require('koa-router');
const jwtgenerator = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = new KoaRouter();


router.patch('api.password', '/:id', async (ctx) => {
    console.log(`entre a cambio de contrasena`)
	const user = await ctx.orm.user.findByPk(ctx.params.id);
	console.log(`encontre el user`)
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