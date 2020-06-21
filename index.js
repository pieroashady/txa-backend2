const express = require('express');
const path = require('path');
const port = process.env.PORT || 6000;
const app = express();
const cors = require('cors');

const AdminController = require('./controllers/AdminController');
const QuizController = require('./controllers/QuizController');
const CategoryController = require('./controllers/CategoryController');
const TraineeController = require('./controllers/TraineeController');
const ContentController = require('./controllers/ContentController');
const ScoreController = require('./controllers/ScoreController');

app.all('*', (req, res, next) => {
	var origin = req.get('origin');
	res.header('Access-Control-Allow-Origin', origin);
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/hello', (req, res) => {
	res.send('hello world');
});

app.post('/api/score/user', ScoreController.getScoreByUser);
app.post('/api/score/id', ScoreController.getScoreById);
app.post('/api/score/add', ScoreController.addScore);
app.get('/api/score/percentage', ScoreController.scorePercentage);

app.post('/api/login', AdminController.login);
app.post('/api/logout', AdminController.logout);
app.post('/api/user', AdminController.user);
app.post('/api/join', AdminController.joinChatbot);

app.get('/api/content/list', ContentController.getContent);
app.post('/api/content/id', ContentController.getContentById);
app.post('/api/content/delete', ContentController.deleteContent);
app.get('/api/content/total', ContentController.getTotalContent);

app.get('/api/quiz/list', QuizController.getQuizList);
app.get('/api/quiz/batch', QuizController.getQuizByBatch);
app.post('/api/quiz/id', QuizController.getQuizById);
app.post('/api/quiz/category', QuizController.getQuizByCategory);
app.post('/api/quiz/add', QuizController.addQuiz);
app.post('/api/quiz/update', QuizController.updateQuiz);
app.post('/api/quiz/delete', QuizController.deleteQuiz);

app.get('/api/category/list', CategoryController.getCategory);
app.get('/api/category/batch', CategoryController.getCategoryByBatch);
app.post('/api/category/id', CategoryController.getCategoryById);
app.post('/api/category/add', CategoryController.addCategory);
app.post('/api/category/update', CategoryController.updateCategory);
app.post('/api/category/delete', CategoryController.deleteCategory);
app.get('/api/category/total', CategoryController.getTotalCategory);

app.get('/api/trainee/list', TraineeController.getTraineeList);
app.post('/api/trainee/id', TraineeController.getTraineeById);
app.post('/api/trainee/add', TraineeController.addTrainee);
app.post('/api/trainee/batch', TraineeController.getTraineeByBatch);
app.post('/api/trainee/update', TraineeController.updateTrainee);
app.post('/api/trainee/delete', TraineeController.deleteTrainee);
app.get('/api/trainee/total', TraineeController.totalTrainee);

app.get('/api/trainee-list', AdminController.getTrainee);

app.listen(port);

console.log('App is listening on your server with port ' + port);
