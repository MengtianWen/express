/**
 * Created by luneice on 17-10-18.
 */

/*
 * Redis 数据库配置文件
 * */

/*
 * 连接哪个数据库
 * */
var redis = {
	'host': 'localhost'
};

var redis_index = {
	'query': 0,     /* Python 关键词数据库 */
	'cookies': 1,   /* Python cookies 数据库 */
	'proxy': 2,     /* Python 代理数据库 */
	'session': 8,   /* Node 用户登录 session 数据库 */
	'authcode': 9,  /* Node 验证码数据库 */
	'test': 10      /* 测试用数据库 */,
	'tmall_rate': 14,     /* Python 商品评论地址数据库 */
	'tmall_detail': 15,   /* Python 商品详情地址数据库 */
};

module.exports = {
	redis: redis,
	redis_index: redis_index
};