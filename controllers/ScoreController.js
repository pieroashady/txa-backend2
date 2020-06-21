require('dotenv').config();
const Parse = require('parse/node');
const moment = require('moment');
const _ = require('lodash/lang');
const getDate = moment().format('DD/MM/YYYY [at] H:mm:ss');

Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/';
Parse.User.enableUnsafeCurrentUser();

class ScoreController {
	static async getQuizList(req, res) {
		const Quiz = Parse.Object.extend('Quiz');
		const query = new Parse.Query(Quiz);

		query.include('categoryId');
		query.equalTo('status', 1);
		query.find().then((x) => res.json(x)).catch((err) => res.json(err));
	}

	static async getScoreByCategory(req, res) {
		const Score = Parse.Object.extend('Score');
		const query = new Parse.Query(Score);

		query.containedIn('answers', [ 'New Delhi' ]);
		const results = await query.find();

		if (_.isEmpty(results)) return res.json({ status: 0, message: 'No data found' });
		return res.json(results);
	}

	static getScoreByPassed() {
		const Score = Parse.Object.extend('Score');
		const query = new Parse.Query(Score);

		query.equalTo('passed', true);
		query
			.count()
			.then((x) => {
				return x;
			})
			.catch((err) => {
				return console.log(err);
			});
	}

	static getScoreByFailed() {
		const Score = Parse.Object.extend('Score');
		const query = new Parse.Query(Score);

		query.equalTo('passed', false);
		query
			.count()
			.then((x) => {
				console.log(x);
				return x;
			})
			.catch((err) => {
				return err;
			});
	}

	static async scorePercentage(req, res) {
		const Score = Parse.Object.extend('Score');
		const query = new Parse.Query(Score);

		query
			.count()
			.then((x) => {
				console.log(x);
			})
			.catch((error) => res.json(error));
	}

	static async addScore(req, res) {
		const Score = Parse.Object.extend('Score');
		const score = new Score();
		const QuizCategory = Parse.Object.extend('QuizCategory');
		const User = new Parse.User();

		const totalScore = req.body.totalScore;
		const userAnswers = req.body.userAnswers;
		const passed = req.body.passed;
		const categoryId = req.body.categoryId;
		const pointer = QuizCategory.createWithoutData(categoryId);
		const userId = Parse.User.createWithoutData(req.body.userId);
		const status = req.body.status;

		score.set('score', totalScore);
		score.set('userAnswers', userAnswers);
		score.set('categoryId', pointer);
		score.set('userId', userId);
		score.set('passed', passed);
		score.set('status', 1);

		score.save().then((x) => res.json(x)).catch((error) => res.json(error));
	}

	static async getScoreById(req, res) {
		const Score = Parse.Object.extend('Score');
		const query = new Parse.Query(Score);

		const scoreId = req.body.scoreId;

		//query.include('categoryId');
		query.get(scoreId).then((x) => res.json(x)).catch((err) => res.json(err));
	}

	static async getScoreByUser(req, res) {
		const Score = Parse.Object.extend('Score');
		const trainee = new Parse.User();
		const query = new Parse.Query(Score);

		const userId = req.body.userId;
		trainee.id = userId;

		query.equalTo('userId', trainee);
		query.include('userId');
		query.include('categoryId');
		query.find().then((result) => res.json(result)).catch((error) => res.json(error));
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

module.exports = ScoreController;
