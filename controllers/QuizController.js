require('dotenv').config();
const Parse = require('parse/node');
const moment = require('moment');
const _ = require('lodash/lang');
const getDate = moment().format('DD/MM/YYYY [at] H:mm:ss');

Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/';
Parse.User.enableUnsafeCurrentUser();

class QuizController {
	static async getQuizList(req, res) {
		const Quiz = Parse.Object.extend('Quiz');
		const query = new Parse.Query(Quiz);

		query.include('categoryId');
		query.equalTo('status', 1);
		query.find().then((x) => res.json(x)).catch((err) => res.json(err));
	}

	static async getQuizByBatch(req, res) {
		const Quiz = Parse.Object.extend('Quiz');
		const query = new Parse.Query(Quiz);

		query.containedIn('answers', [ 'New Delhi' ]);
		const results = await query.find();

		if (_.isEmpty(results)) return res.json({ status: 0, message: 'No data found' });
		return res.json(results);
	}

	static async addQuiz(req, res) {
		const Quiz = Parse.Object.extend('Quiz');
		const quiz = new Quiz();
		const QuizCategory = Parse.Object.extend('QuizCategory');

		const question = req.body.question;
		const option = req.body.option;
		const correctAnswer = req.body.correctAnswer;
		const categoryId = req.body.categoryId;
		const pointer = QuizCategory.createWithoutData(categoryId);
		const status = req.body.status;

		quiz.set('question', question);
		quiz.set('correctAnswers', correctAnswer);
		quiz.set('categoryId', pointer);
		quiz.set('answers', option);
		quiz.set('status', 1);

		quiz
			.save()
			.then((x) => res.json({ status: 1, message: 'Add question success', x }))
			.catch((error) => res.json(error));
	}

	static async getQuizById(req, res) {
		const Quiz = Parse.Object.extend('Quiz');
		const query = new Parse.Query(Quiz);

		const quizId = req.body.quizId;

		query.equalTo('objectId', quizId);
		query.include('categoryId');
		query.first().then((x) => res.json(x)).catch((err) => res.json(err));
	}

	static async getQuizByCategory(req, res) {
		const Quiz = Parse.Object.extend('Quiz');
		const QuizCategory = Parse.Object.extend('QuizCategory');
		const category = new QuizCategory();
		const query = new Parse.Query(Quiz);

		const categoryId = req.body.categoryId;
		category.id = categoryId;

		query.equalTo('categoryId', category);
		query.include('categoryId');
		const results = await query.find();

		if (_.isEmpty(results)) return res.json([]);

		return res.json(results);
	}

	static async updateQuiz(req, res) {
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
		query.include('categoryId');
		const results = await query.first();
		if (!results) return res.json({ message: 'No data found' });
		results.set('question', question);
		results.set('correctAnswers', correctAnswer);
		results.set('categoryId', pointer);
		results.set('answers', option);
		results
			.save()
			.then((quiz) => {
				return res.json(quiz);
			})
			.catch((error) => {
				return res.json(error);
			});
	}

	static async deleteQuiz(req, res) {
		const Quiz = Parse.Object.extend('Quiz');
		const query = new Parse.Query(Quiz);
		const quizId = req.body.quizId;

		query.equalTo('objectId', quizId);
		const results = await query.first();
		if (_.isEmpty(results)) return res.json({ message: 'Delete quiz failed' });
		results.set('status', 0);
		results
			.save()
			.then(() => res.json({ message: 'Success delete quiz' }))
			.catch((error) => res.json(error));
	}
}

module.exports = QuizController;
