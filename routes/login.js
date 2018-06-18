/**
 * Created by luneice on 17-7-21.
 */

var express = require('express');
var router = express.Router();
var custom_settings = require('../settings/custom_settings');
var router_page = custom_settings.router_page;
var mongo_conf = custom_settings.mongo.test;
var Session = require('../custom_modules/Session');
var hash = require('hash.js');
/*
 * 这里是写业务逻辑方法地方
 * */

/*登录页面的定向*/
router.get('/', function(req, res) {
	var session = new Session();
	session.isValid(req.cookies, function (status) {
		var page = router_page.redirect.pc.home; /*默认电脑端*/
		/* 如果是手机设备，则业务逻辑是 */
		if (req.headers['user-agent'].toLowerCase().match(/(iphone|ipod|ipad|android)/)){
			page = router_page.redirect.mobile.home;
		}
		if (status){
			res.redirect(page);
		}else {
			res.redirect(router_page.redirect.mobile.login);
		}
	});
});

/*登录的业务处理*/
router.post('/', function(req, res) {
	/*一律不要相信用户提交的任何数据，在这个地方一定要再次验证用户输入的合法性*/
	var username = req.body['username'];
	var password = req.body['password'];
	var User = function (username, password) {
		this.username = username;
		this.password = password;
		this.time = new Date().getTime();
		this.date = new Date().toUTCString();
		return this;
	};

	if ((/^201[3-9][0-9]{5,6}$/.test(username)) ||  /*是否符合学号的要求*/
			// (/^1[0-9]{10}$/.test(username)) ||  /*是否符合手机号的要求*/
			(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(username))){  /*是否符合邮箱的要求*/
		var h_password = hash.sha512().update(password).digest('hex');
		var user = new User(username, h_password);
		var Mongo = require('../custom_modules/MongoDB');
		var mongo = new Mongo(mongo_conf.host, mongo_conf.dbname, {username: Array, password: String, time: String, date: String});
		var condition = {
			col: 'User',
			query: {
				username: user.username,
				password: user.password
			},
			filter: {
				'_id': 0,
				'__v': 0
			},
			limit: 7,
			skip: 0
		};
		mongo.query(condition, function (err, results) {
			if(err) throw err;
			if (results.length === 1){
				var session = new Session();
				session.createSession(username);
				var cookies = session.cookies.get();
				var h_key = cookies.h_key;
				var h_val = cookies.h_val;
				res.cookie('uid', h_key, { domain: '.luneice.com', path: '/', expires: new Date(Date.now() + 120 * 1000), httpOnly: true, secure: true });
				res.cookie('pid', h_val, { domain: '.luneice.com', path: '/', expires: new Date(Date.now() + 120 * 1000), httpOnly: true, secure: true });
				res.json({success: true, message: '登陆成功'});
			} else{
				res.json({message: "用户名或密码错误！"});
			}
		});
	}else {
		/*不符合规则要求一律返回此消息，防止SQL注入等*/
		res.json({message: "用户名或密码错误！"});
	}
});

module.exports = router;