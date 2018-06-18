var express = require('express');
var router = express.Router();
var STS = require('ali-oss').STS;
var co = require('co');
var conf = require('../settings/custom_settings').ali_oss;

router.use('/sts/token', function (req, res) {
	/*阿里对象存储的授权*/
	var client = new STS({
		accessKeyId: conf.AccessKeyId,
		accessKeySecret: conf.AccessKeySecret
	});

	co(function* () {
		var result = yield client.assumeRole(conf.RoleArn, conf.policy, conf.TokenExpireTime);
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-METHOD', 'GET');
		res.json({
			AccessKeyId: result.credentials.AccessKeyId,
			AccessKeySecret: result.credentials.AccessKeySecret,
			SecurityToken: result.credentials.SecurityToken,
			Expiration: result.credentials.Expiration
		});
	}).then(function () {}).catch(function (err) {
		console.log(err);
		res.status(400).json(err.message);
	});
});

router.use('/callback', function (req, res) {
	/* *
   * req.params.xxxxx 从path中的变量
   * req.query.xxxxx 从get中的?xxxx=中
   * req.body.xxxxx 从post中的变量
   * */

	var body = req.body;
	console.log(body);
	res.json(body);
});

module.exports = router;
