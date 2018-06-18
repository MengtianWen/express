/**
 * Created by luneice on 17-10-18.
 * Redis 对象
 */

/*
 * 引入 redis 库
 * */
var redis = require('redis');


var Redis = function (options) {
	var redis_conf = {
		host: 'localhost',
		port: 6379,
		db: 7
	};

	/* 应用自定义的配置 */
	if (typeof options === 'object'){
		for (var key in options){
			if (redis_conf[key] === undefined) continue;
			redis_conf[key] = options[key] === undefined ? redis_conf[key] : options[key];
		}
	}
	/* 返回一个连接对象 */
	var client = redis.createClient(redis_conf);

	Redis.prototype.set = function (str_1, str_2, func) {
		if (func === undefined)
			return client.set(str_1, str_2);
		return client.set(str_1, str_2, func);
	};

	Redis.prototype.get = function (key, func) {
		return client.get(key, func);
	};
};

module.exports = Redis;
