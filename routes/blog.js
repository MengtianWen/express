/**
 * Created by luneice on 17-8-17.
 */

var express = require('express');
var router = express.Router();

var router_page = require('../settings/custom_settings').router_page;

/* GET users listing. */
router.get('/', function(req, res, next) {
    var home = router_page.blogs.home;
    res.render(home, {title: '我的博客'})
});

module.exports = router;
