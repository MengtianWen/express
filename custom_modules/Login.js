/**
 * Created by luneice on 17-10-21.
 * 依赖 MongoDB 数据库
 * 这个模块只负责登录
 * 并生成 cookies
 */

var MongoDB = require('../custom_modules/MongoDB');
var hash = require('hash.js');

var Login = function (req) {
	var input_model = {
		username: req.body.username || req.query.username,
		password: req.body.password
	};


	var db_object = function () {

		var readFile = function (callback) {
			var fs = require('fs');
			var path = require('path');
			var file_path = path.join(__dirname, '../settings/mongo_conf.json');
			return fs.readFile(file_path, 'utf8', callback);
		};

		return readFile(function (err, data) {
			var configs = JSON.parse(data);
			var mongo_conf = configs.user;
			var schema = {username: Array, password: String, time: String, date: String};
			var mongo = new MongoDB(mongo_conf.host, mongo_conf.dbname, schema);
			var condition = {
				col: 'User',
				query: {
					username: '',
					password: ''
				},
				filter: {
					'_id': 0,
					'__v': 0
				},
				limit: 7,
				skip: 0
			};
			return {
				query: mongo.query,
				insert: mongo.insert
			}
		}())
	};

	/*
	 * Sync 同步的
	 * @return Boolean
	 * */
	var inputNotLegal = function (input_model) {
		// 如果不满足以下正则要求返回 true 否则返回 false
		return !(/^201[3-9][0-9]{5,6}$/.test(input_model.username) ||
				/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
						.test(input_model.username));
	};

	/*
	 * Sync  同步的
	 * @return VerifyModel
	 * */
	var encrypt = function (input_model) {
		return {
			username: input_model.username,
			password: hash.sha512().update(input_model.password).digest('hex')  // 密码的 SHA-512 值作为密码
		}
	};

	/*
	 * ASync 异步的
	 * @return Boolean
	 * */
	var verifyUser = function (verify_model, callback) {
		var condition = {
			col: 'User',
			query: {
				username: '',
				password: ''
			},
			filter: {
				'_id': 0,
				'__v': 0
			},
			limit: 7,
			skip: 0
		};
		condition.query = verify_model;
		return db_object.query(condition, callback);
	};

	Login.prototype.getUserModel = function (callback) {
		// 输入合法性判断
		if (inputNotLegal(input_model)){
			return null;
		} else {
			//	进入数据库查找用户名和密码是否一致
			return verifyUser(encrypt(input_model), callback);
		}
	};
};
var req = {
	body: {
		username: "",
		password: "123456789"
	}
};

var login = new Login(req);
login.getUserModel(function (err, results) {
	if (err) throw err;
	console.log(results);
});
