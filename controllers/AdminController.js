require('dotenv').config();
const Parse = require('parse/node');
const twilio = require('twilio');
const _ = require('lodash/lang');

Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/';
Parse.User.enableUnsafeCurrentUser();

class AdminController {
	static async login(req, res) {
		const username = req.body.username;
		const password = req.body.password;

		try {
			const user = await Parse.User.logIn(username, password);
			if (user) {
				const userData = await Parse.User.currentAsync();
				console.log('someone logged in');
				return res.send(userData);
			}
		} catch (error) {
			return res.send(error);
		}
	}

	static async loginAdmin(req, res) {
		const User = new Parse.User();
		const query = new Parse.Query(User);

		const username = req.body.username;
		const password = req.body.password;

		Parse.User
			.logIn(username, password)
			.then((user) => {
				Parse.User
					.currentAsync()
					.then((userData) => {
						if (userData.get('role') !== 'admin') {
							return res.json({ status: 0, message: 'not Admin' });
						}
						return res.json(userData);
					})
					.catch((error) => res.json(error));
			})
			.catch((error) => res.json(error));
	}

	static async logout(req, res) {
		Parse.User
			.logOut()
			.then((x) => {
				return res.json({ status: 1, message: 'Logout success' });
			})
			.catch((error) => res.json({ error }));
	}

	static async user(req, res) {
		const sessionToken = req.body.token;
		Parse.User
			.become(sessionToken)
			.then((x) => {
				console.log(x);
				res.json(x);
			})
			.catch((error) => {
				console.log(error);
				res.json(error);
			});
	}

	static joinChatbot(req, res) {
		const accountSid = 'AC87ea945f52eed1569056525d44db5e8a';
		const authToken = '059d19ded4d03cfa6c5c7c68cb7e4d7c';
		const client = twilio(accountSid, authToken);

		const password = generator.generate({
			length: 4,
			numbers: true
		});

		client.messages
			.create({
				from: 'whatsapp:+14155238886',
				body: `Verification code : ${password}`,
				to: 'whatsapp:+6288977502463'
			})
			.then((message) => res.send(message))
			.catch((err) => console.log(err));
	}

	static async quizList(req, res) {
		const Quiz = Parse.Object.extend('Quiz');
		const query = new Parse.Query(Quiz);
		query.include('categoryId');
		const results = await query.find();
		return res.send(results);
	}

	static async getTrainee(req, res) {
		const query = new Parse.Query(Parse.User);
		query.equalTo('status', 1);
		query.equalTo('role', 'trainee');
		query.ascending('batch');
		query.ascending('fullname');

		const results = await query.find();
		if (_.isEmpty(results)) return res.json({ status: 0, message: 'No data found' });
		return res.json({
			results,
			totalTrainee: results.length
		});
	}
}

module.exports = AdminController;
