/**
 * Created by luneice on 17-12-26.
 * 读取配置文件
 */

var readConf = function (filename, callback) {
	var fs = require('fs');
	var path = require('path');
	var file_path = path.join(__dirname, filename);
	console.log(file_path);
	return fs.readFile(file_path, 'utf8', callback);
};

module.exports = readConf;
