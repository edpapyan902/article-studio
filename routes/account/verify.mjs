import User from "../../models/user.mjs";
import auth from "../../app/loaders/passport.mjs";
import app from "../../app/loaders/express.mjs";
import { DB } from "../../app/resource.mjs";
import { transporter } from "../../app/resource.mjs";
import { createMailSender } from "../../app/dependencies/Util.mjs";

// Send mail
const sendMail = createMailSender(transporter);

// login process
app.post("/loginprocess", auth.login, async (req, res) => {
	const r = req.user;
	req.session.userID = r.username;
	res.redirect("/article");
	res.end();
});

// sign up process
app.post("/signupprocess", async (req, res) => {
	const r = await DB.users.findOne({
		username: req.body.name,
	});
	if (!r)
		await Promise.all([
			sendMail({
				from: 'aquaplmc@gmail.com',
				to: req.body.email,
				subject: 'Your username and password',
				text: `
					Username: ${req.body.name}
					Password: ${req.body.pass}
					If you didn't sign up on our site, just ignore or delete this mail
					Send feedback to our site: Userfeedbackrespond@gmail.com
				`
			}),
			new User({
				username: req.body.name,
				password: req.body.pass,
			}).save()
		]);
	if (!r || req.body.pass === r.password) 
		req.session.userID = req.body.name;
	res.redirect("/article");
});