/**
 * Created by luneice on 17-9-9.
 */

var express = require('express');
var router = express.Router();
var page = require('../../settings/custom_settings').router_page;

router.get('/', function(req, res, next) {
	var notfound = page.redirect.error.notfound;
	res.redirect(notfound);
});

module.exports = router;
