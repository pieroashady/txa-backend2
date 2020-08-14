require('dotenv').config();
const Parse = require('parse/node');
const _ = require('lodash/lang');
const moment = require('moment-timezone');

Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/';
Parse.User.enableUnsafeCurrentUser();

class CategoryController {
  static async getCategory(req, res) {
    const Category = Parse.Object.extend('QuizCategory');
    const query = new Parse.Query(Category);
    const page = req.body.page || 1;
    const resultPerpage = 10;

    query.equalTo('status', 1);
    query.find().then((results) => res.json(results)).catch((error) => res.json(error));
  }

  static async handleFilter(req, res) {
    const Category = Parse.Object.extend('QuizCategory');
    const query = new Parse.Query(Category);

    switch (req.body.searchBy) {
      case 'Kode':
        query.equalTo('status', 1);
        query.matches('kodeCategory', req.body.searchValue, 'i');
        query
          .find()
          .then((x) => {
            res.json(x);
          })
          .catch((err) => {
            res.json(err);
          });
        break;
      case 'Nama Kategori':
        query.equalTo('status', 1);
        query.matches('category', req.body.searchValue, 'i');
        query
          .find()
          .then((x) => {
            res.json(x);
          })
          .catch((err) => {
            res.json(err);
          });
        break;
      default:
        break;
    }
  }

  static async getCategoryByBatch(req, res) {
    const Category = Parse.Object.extend('QuizCategory');
    //const query = new Parse.Query(Category);
    const batch = parseInt(req.body.batch);

    var d = new Date();
    var query = new Parse.Query(Category);

    var start = new moment(d);
    start.startOf('day');
    console.log(start);
    // from the start of the date (inclusive)
    query.greaterThanOrEqualTo('schedule', start.toDate());

    // var finish = new moment(start);
    // finish.add(1, 'day');
    // till the start of tomorrow (non-inclusive)
    //query.lessThan('createdAt', finish.toDate());
    query.containedIn('batch', [ batch ]);
    query
      .count()
      .then(function(results) {
        res.json(results);
      })
      .catch((err) => res.json(err));
  }

  static async getListCategory(req, res) {
    const Category = Parse.Object.extend('QuizCategory');
    //const query = new Parse.Query(Category);
    const batch = parseInt(req.body.batch);

    var d = new Date();
    var query = new Parse.Query(Category);

    var moment = require('moment-timezone');
    var dx = moment().tz('Asia/Jakarta');
    var start = moment(dx);
    start.startOf('day');
    console.log(start);
    // from the start of the date (inclusive)
    query.greaterThanOrEqualTo('schedule', start.toDate());

    // var finish = new moment(start);
    // finish.add(1, 'day');
    // till the start of tomorrow (non-inclusive)
    //query.lessThan('createdAt', finish.toDate());
    query.equalTo('status', 1);
    query.containedIn('batch', [ batch ]);
    query
      .find()
      .then(function(results) {
        res.json(results);
      })
      .catch((err) => res.json(err));
  }

  static async getTotalCategory(req, res) {
    const Category = Parse.Object.extend('QuizCategory');
    const query = new Parse.Query(Category);

    query.equalTo('status', 1);
    query.count().then((x) => res.json(x)).catch((error) => res.json(error));
  }

  static async getTotalCategoryPerBatch(req, res) {
    const Category = Parse.Object.extend('QuizCategory');
    const query = new Parse.Query(Category);

    const batch = parseInt(req.body.batch);

    query.containedIn('batch', [ batch ]);
    query.equalTo('status', 1);
    query.count().then((x) => res.json(x)).catch((error) => res.json(error));
  }

  static async addCategory(req, res) {
    const Category = Parse.Object.extend('QuizCategory');
    const category = new Category();

    const quizCategory = req.body.quizCategory;
    const desc = req.body.desc;
    const test = moment(req.body.schedule).tz('Asia/Jakarta').toDate();
    const schedule = req.body.schedule;
    const subtitle = req.body.subtitle;
    const timeInMinutes = req.body.timeInMinutes;
    const batch = req.body.batch;
    const kodeCategory = req.body.kodeCategory;

    console.log('before', req.body.schedule);
    console.log('after', test.toISOString());

    category.set('category', quizCategory);
    category.set('description', desc);
    category.set('schedule', test);
    category.set('subtitle', subtitle);
    category.set('timeInMinutes', timeInMinutes);
    category.set('batch', batch);
    category.set('status', 1);
    category.set('kodeCategory', kodeCategory);
    category
      .save()
      .then((x) => res.json({ status: 1, message: 'Add Category Success', x }))
      .catch((error) => res.json(error));
  }

  static async getCategoryById(req, res) {
    const Category = Parse.Object.extend('QuizCategory');

    const query = new Parse.Query(Category);
    const categoryId = req.body.categoryId;

    query.equalTo('objectId', categoryId);
    query.first().then((x) => res.json(x)).catch((error) => res.json(error));

    // const results = await query.first();
    // if (_.isEmpty(results)) return res.json({ status: 0, message: 'Data not found' });
    // return res.json(results);
  }

  static async updateCategory(req, res) {
    const Category = Parse.Object.extend('QuizCategory');

    const query = new Parse.Query(Category);
    const categoryId = req.body.categoryId;
    const category = req.body.category;
    const desc = req.body.desc;
    const schedule = new Date(req.body.schedule);
    const subtitle = req.body.subtitle;
    const timeInMinutes = req.body.timeInMinutes;
    const batch = req.body.batch;
    const kodeCategory = req.body.kodeCategory;

    query.equalTo('objectId', categoryId);
    const result = await query.first();

    result.set('category', category);
    result.set('categoryId', categoryId);
    result.set('description', desc);
    result.set('schedule', schedule);
    result.set('subtitle', subtitle);
    result.set('timeInMinutes', timeInMinutes);
    result.set('batch', batch);
    result.set('status', 1);
    result.set('kodeCategory', kodeCategory);
    result
      .save()
      .then((result) => {
        return res.json(result);
      })
      .catch((error) => {
        return res.json(error);
      });
  }

  static async deleteCategory(req, res) {
    const Category = Parse.Object.extend('QuizCategory');
    const query = new Parse.Query(Category);
    const categoryId = req.body.categoryId;

    query.equalTo('objectId', categoryId);
    const result = await query.first();

    if (_.isEmpty(result)) return res.json({ status: 0, message: 'Delete category failed' });
    result.set('status', 0);
    result
      .save()
      .then(() => res.json({ status: 1, message: 'Success delete category' }))
      .catch((error) => res.json(error));
  }
}

module.exports = CategoryController;
