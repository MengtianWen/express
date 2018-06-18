/**
 * Created by luneice on 17-9-2.
 */
/*路由的添加*/
/*
 * 谁的路由===>[路径，路由文件]
 * */

var route = {
	'index': ['/', require('./index')],
	'login': ['/login', require('./login')],
	'signup': ['/signup', require('./signup')],
	'blog': ['/blog', require('./blog')],
	'alioss': ['/alioss', require('./alioss')],
	'alimns': ['/alimns', require('./mns/alimns')],
	'qqmns': ['/qqmns', require('./mns/qqmns')],
	'sharedocs': ['/sharedocs', require('./huater/sharedocs')],
	// 'dbdemo': ['/dbdemo', require('./dbdemo')],
	'404': ['/404', require('./error/notfound')]
};

module.exports = {
	route: route
};
