/**
 * Created by luneice on 17-9-2.
 */

var express = require('express');
var router = express.Router();

var router_page = require('../../settings/custom_settings').router_page;

/* GET users listing. */
router.post('/', function(req, res) {
	var home = router_page.blogs.home;
	res.render(home, {title: '我的博客'})
});

module.exports = router;
