/**
 * Created by luneice on 17-9-8.
 */

var express = require('express');
var router = express.Router();

var router_page = require('../../settings/custom_settings').router_page;

/* GET users listing. */
router.get('/', function(req, res) {
	var sharedocs = router_page.redirect.sharedocs.home;
	res.redirect(sharedocs);
});

module.exports = router;