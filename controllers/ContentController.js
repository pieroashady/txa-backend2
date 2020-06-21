require('dotenv').config();
const Parse = require('parse/node');
const _ = require('lodash/lang');
const path = require('path');
const fs = require('fs');
const request = require('request-promise');
const moment = require('moment');

Parse.initialize(process.env.APP_ID, process.env.JAVASCRIPT_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/';
Parse.User.enableUnsafeCurrentUser();

class ContentController {
	static async getContent(req, res) {
		const Content = Parse.Object.extend('BootcampEvent');
		const query = new Parse.Query(Content);
		const page = req.body.page || 1;
		const resultPerpage = 8;

		query.equalTo('status', 1);
		query.limit(resultPerpage);
		query.skip(resultPerpage * page - resultPerpage);
		query.find().then((results) => res.json(results)).catch((error) => res.json(error));
	}

	static async getTotalContent(req, res) {
		const Content = Parse.Object.extend('BootcampEvent');
		const query = new Parse.Query(Content);

		query.equalTo('status', 1);
		query.count().then((x) => res.json(x)).catch((error) => res.json(error));
	}

	static async getContentByType(req, res) {
		const Content = Parse.Object.extend('BootcampEvent');
		const query = new Parse.Query(Content);

		query.equalTo('contentType', req.body.contentType);
		query
			.find()
			.then((x) => {
				return res.json(x);
			})
			.catch((error) => {
				return res.json(error);
			});
	}

	static async getContentByBatch(req, res) {
		const Content = Parse.Object.extend('BootcampEvent');
		const query = new Parse.Query(Content);

		query.containedIn('batch', parseInt(req.body.contentType));
		query
			.find()
			.then((x) => {
				return res.json(x);
			})
			.catch((error) => {
				return res.json(error);
			});
	}

	static async getContentById(req, res) {
		const Content = Parse.Object.extend('BootcampEvent');

		const query = new Parse.Query(Content);
		const contentId = req.body.contentId;

		query.equalTo('objectId', contentId);
		query.first().then((x) => res.json(x)).catch((error) => res.json(error));

		// const results = await query.first();
		// if (_.isEmpty(results)) return res.json({ status: 0, message: 'Data not found' });
		// return res.json(results);
	}

	static async updateContent(req, res) {
		const Content = Parse.Object.extend('Bootcamp Event');

		const query = new Parse.Query(Content);
		const contentId = req.body.contentId;
		const content = req.body.contentBody;
		const contentTitle = req.body.desc;
		const schedule = new Date(req.body.schedule);
		const subtitle = req.body.subtitle;
		const timeInMinutes = req.body.timeInMinutes;
		const batch = req.body.batch;

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
		result
			.save()
			.then((result) => {
				return res.json(result);
			})
			.catch((error) => {
				return res.json(error);
			});
	}

	static async deleteContent(req, res) {
		const Content = Parse.Object.extend('BootcampEvent');
		const query = new Parse.Query(Content);
		const contentId = req.body.contentId;

		query
			.get(contentId)
			.then((result) => {
				result.set('status', 0);
				result.save().then((x) => res.json(x)).catch((error) => res.json(error));
			})
			.catch((error) => res.json(error));
		// query.equalTo('objectId', categoryId);
		// const result = await query.first();

		// if (_.isEmpty(result)) return res.json({ status: 0, message: 'Delete category failed' });
		// result.set('status', 0);
		// result
		// 	.save()
		// 	.then(() => res.json({ status: 1, message: 'Success delete category' }))
		// 	.catch((error) => res.json(error));
	}
}

module.exports = ContentController;
