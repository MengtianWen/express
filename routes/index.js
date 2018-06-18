/*
 * 路由说白了类似DNS做的事情，将各种请求与相应的资源对应
 * */

var express = require('express');
var router = express.Router();
var read_conf = require('../custom_modules/ReadConf');

/*
 * 这里是写业务逻辑方法地方10.10.57.39
 * */

router.get('/', function(req, res) {
	try {
		read_conf('../settings/page/redirect.json', function (err, datas) {
			if (err) throw err;
			router_page = JSON.parse(datas);
			var page = router_page.response.index;
			res.redirect(page);
		});
	}catch (e){
		console.log(e);
	}


	// var page = router_page.redirect.pc.home; /*默认电脑端*/
	// /* 如果是手机设备，则业务逻辑是 */
	// if (req.headers['user-agent'].toLowerCase().match(/(iphone|ipod|ipad|android)/)){
	// 	page = router_page.redirect.mobile.home;
	// }
	// res.redirect(page);
});

/* *
 * req.params.xxxxx 从path中的变量
 * req.query.xxxxx 从get中的?xxxx=中
 * req.body.xxxxx 从post中的变量
 * */

router.get('/getdata', function(req, res) {
	var Mongo = require('../custom_modules/MongoDB');
	var schema = {
		type: String,
		name: String,
		url: String,
		time: String,
		attach: Object
	};
	var mongo = new Mongo('localhost', 'test', schema);
	var data = {};
	var func = req.query['func'];
	var params = req.query;
	var skip = (params['page'] - 1) * 7;

	// mongo.insert('document', {
	// 	type: "word",
	// 	name: "高等数学",
	// 	url: "",
	// 	time: new Date().getFullYear(),
	// 	attach:{
	// 		path: "",
	// 		spec: "",
	// 		time: new Date().getTime(),
	// 		inst: '电气与信息工程学院',
	// 		author: ''
	// 	}
	// });

	var condition = {
		col: 'document',
		query: {},
		filter: {
			'_id': 0,
			'__v': 0
		},
		limit: 7,
		skip: skip
	};

	mongo.query(condition, function (err, results) {
		data[func] = results;
		console.log(data);
		// res.cookie('q', 'datum', { domain: 'luneice.com', path: '/', expires: new Date(Date.now() + 12000), httpOnly: true, secure: true });
		res.json(data);
	});
});

module.exports = router;
