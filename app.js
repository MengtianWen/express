var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');  /*日志库*/
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var router_page = require('./settings/custom_settings').router_page;



/*指定模板引擎*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/*日志的级别*/
// var logDirectory = __dirname + '/logs';
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// var accessLogStream = FileStreamRotator.getStream({
// 	date_format: 'YYYYMMDD',
// 	filename: logDirectory + '/%DATE%.log',
// 	frequency: 'daily',
// 	verbose: false
// });
// app.use(logger('combined', {stream: accessLogStream}));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*路由*/
var route = function () {
	var route_conf = require('./routes/route_settings').route;
	if (typeof route_conf !== 'object'){
		console.log('路由配置不合法');
		return;
	}
	for (let key in route_conf){
		let route_info = route_conf[key];
		let route = route_info[0], manage = route_info[1];
		app.use(route, manage);
	}
}();

/*404错误处理*/
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err.statusCode);
});

/*错误应答处理*/
app.use(function(err, req, res, next) {
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	var page = router_page.error.pc;
	if (req.headers['user-agent'].toLowerCase().match(/(iphone|ipod|ipad|android)/)){
		/*
		 * 如果是手机设备，则业务逻辑是
		 * */
		page = router_page.error.mobile;
	}
	res.render(page, {});
	next();
});

module.exports = app;
