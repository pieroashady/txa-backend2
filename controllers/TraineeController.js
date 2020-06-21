require('dotenv').config();
const Parse = require('parse/node');
const _ = require('lodash/lang');

Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/';
Parse.User.enableUnsafeCurrentUser();

class TraineeController {
	static async getTraineeList(req, res) {
		const query = new Parse.Query(Parse.User);

		query.equalTo('role', 'trainee');
		query.ascending('batch');
		query.ascending('fullname');

		query.find().then((x) => res.json(x)).catch((err) => res.json(err));
	}

	static async totalTrainee(req, res) {
		const query = new Parse.Query(new Parse.User());

		query.equalTo('status', 1);
		query.equalTo('role', 'trainee');

		query.count().then((x) => res.json(x)).catch((error) => res.json(error));
	}

	static async getTraineeByBatch(req, res) {
		const query = new Parse.Query(Parse.User);

		query.equalTo('role', 'trainee');
		query.equalTo('batch', parseInt(req.body.batch));
		console.log(req.body.batch);
		query.ascending('batch');
		query.ascending('fullname');

		query.find().then((x) => res.json(x)).catch((error) => res.json(error));
	}

	static async addTrainee(req, res) {
		const trainee = new Parse.User();
		const username = req.body.username;
		const email = req.body.email;
		const password = req.body.password;
		const pob = req.body.pob;
		const dob = req.body.dob;
		const phoneNumber = req.body.phoneNumber;
		const role = req.body.role;
		const batch = req.body.batch;
		const fullname = req.body.fullname;

		trainee.set('username', username);
		trainee.set('password', password);
		trainee.set('email', email);
		trainee.set('placeOfBirth', pob);
		trainee.set('role', role);
		trainee.set('phoneNumber', phoneNumber);
		trainee.set('dateOfBirth', dob);
		trainee.set('batch', batch);
		trainee.set('fullname', fullname);
		trainee
			.save()
			.then(() => res.json({ status: 1, message: 'Registration Success' }))
			.catch((error) => res.json({ status: 0, message: error }));
	}

	static async getTraineeById(req, res) {
		const Quiz = Parse.Object.extend('Quiz');

		const query = new Parse.Query(Quiz);
		const quizId = req.body.quizId;

		query.include('categoryId');
		query.equalTo('objectId', quizId);

		const results = await query.first();
		if (!results) return res.json({ status: 0, message: 'Data not found' });
		return res.json(results);
	}

	static async updateTrainee(req, res) {
		const Quiz = Parse.Object.extend('Quiz');
		const QuizCategory = Parse.Object.extend('QuizCategory');

		const query = new Parse.Query(Quiz);
		const quizId = req.body.quizId;
		const question = req.body.question;
		const option = req.body.option;
		const correctAnswer = req.body.correctAnswer;
		const categoryId = req.body.categoryId;
		const pointer = QuizCategory.createWithoutData(categoryId);

		query.equalTo('objectId', quizId);
		const results = await query.first();
		if (!results) return res.json({ status: 0, message: 'No data found' });

		results.set('question', question);
		results.set('correctAnswers', correctAnswer);
		results.set('categoryId', pointer);
		results.set('answers', option);
		results
			.save()
			.then((quiz) => {
				return res.json({ status: 1, message: `Update quiz success` });
			})
			.catch((error) => {
				return res.json(error);
			});
	}

	static async deleteTrainee(req, res) {
		const Quiz = Parse.Object.extend('Quiz');
		const query = new Parse.Query(Quiz);
		const quizId = req.body.quizId;

		query.equalTo('objectId', quizId);
		const results = await query.first();
		if (!results) return res.json({ status: 0, message: 'Delete quiz failed' });
		results.set('status', 0);
		results
			.save()
			.then(() => res.json({ status: 1, message: 'Success delete quiz' }))
			.catch((error) => res.json(error));
	}
}

module.exports = TraineeController;
