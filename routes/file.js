/**
 * Created by luneice on 17-8-18.
 */

var fs = require('fs');
// var path = require('path');

var data = '这是一段通过fs.writeFile函数写入的内容；\r\n';
var w_data = new Buffer(data);


fs.writeFile(__dirname + '/../public/blog/css/test.css', w_data, {flag: 'a'}, function (err) {
    if(err) {
        console.error(err);
        throw err;
    } else {
        console.log('写入成功');
    }
});
