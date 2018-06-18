/**
 * Created by luneice on 17-10-17.
 *
 * User 类， 依赖 Redis 类
 * User 类负责维护浏览器携带的 cookies 或 session 与 Redis 之间的存储
 * 判断用户的状态和身份，不关心 cookies 或 session 是如何产生的
 * cookies 或 session 的产生由 Login 维护
 * Login 用来处理浏览器提交的数据，并与 MongoDB 交互
 */

var Redis = require('../custom_modules/Redis');

var User = function (option) {

	var name = option || '';
	var redis = new Redis();
	/* 通过 cookies 或者 session 判断是否登录 */
	User.prototype.isLogin = function (str) {
		return redis.set('luneice', true);
	};

	/* 根据 cookies 或 session 得到用户信息 */
	User.prototype.getUserInfo = function (condition, callback) {
		if (callback === undefined) return;
		return redis.get(condition, callback);
	};

	User.prototype.getName = function () {
		console.log(name);
	};

	/* 注入函数作为保留函数 */
	User.prototype.inject = function () {

	};
};

var user = new User();
user.isLogin();
user.getUserInfo('luneice', function (err, reply) {
	if (err) throw err;
	console.log(typeof reply);
});
