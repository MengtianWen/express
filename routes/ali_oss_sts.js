/**
 * Created by luneice on 17-8-7.
 */

var express = require('express');
var router = express.Router();
var STS = require('ali-oss').STS;
var co = require('co');
var fs = require('fs');
var conf = require('../settings/custom_settings').ali_oss;

router.use('/token', function (req, res) {

	var client = new STS({
		accessKeyId: conf.AccessKeyId,
		accessKeySecret: conf.AccessKeySecret
	});

	co(function* () {
		var result = yield client.assumeRole(conf.RoleArn, conf.policy, conf.TokenExpireTime);
		// console.log(result);
		res.set('Access-Control-Allow-Origin', '*');
		res.set('Access-Control-Allow-METHOD', 'GET');
		res.json({
			AccessKeyId: result.credentials.AccessKeyId,
			AccessKeySecret: result.credentials.AccessKeySecret,
			SecurityToken: result.credentials.SecurityToken,
			Expiration: result.credentials.Expiration
		});
	}).then(function () {
		// pass
	}).catch(function (err) {
		console.log(err);
		res.status(400).json(err.message);
	});
});

router.use('/callback', function () {
	console.log('回调执行成功');
});

module.exports = router;
