/**
 * Created by luneice on 17-11-16.
 */

var mysql_conf = require('../settings/database_conf');
var mysql = require('mysql');

// MySQL 类的定义
var MySQL = function (paras) {
	if (typeof paras !== 'object') return;
	const conf = mysql_conf;
	for (let key in conf){
		conf[key] = paras[key] === undefined ? conf[key] : paras[key];
	}
	var db = mysql.createConnection(conf);
	db.connect();
	MySQL.prototype.select = function (sql, callback) {
		db.query(sql, callback);
	}
};

module.exports = MySQL;