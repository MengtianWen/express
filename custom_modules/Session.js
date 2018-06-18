/**
 * 登录保持
 * */
var hash = require('hash.js');
/*创建Redis实例，用来保存用户的cookies*/
var redis_index = require('../settings/redis_conf').redis_index;
var redis = require("redis"),
    client = redis.createClient({db: redis_index.session});

client.on("error", function (err) {
    console.log("Error " + err);
});

var Session = function () {

    var cookies = (function () {
        var h_key = '';
        var h_val = '';
        return {
            set: function (key, val) {
                h_key = key;
                h_val = val;
            },
            get: function () {
                return {
                    h_key: h_key,
                    h_val: h_val
                }
            }
        }
    })();

    var changeCookies = function (h_key) {
        var timestamp = new Date().getTime();
        var pref = hash.sha256().update(timestamp.toString(16)).digest('hex');
        var suff = hash.sha256().update(Math.sqrt(timestamp)).digest('hex');
        var string = pref + h_key + suff;
        var h_val = hash.sha512().update(string).digest('hex');
        client.set(h_key, h_val);  /*保存cookies*/
        cookies.set(h_key, h_val);
    };

    this.isValid = function (cookies, callback) {
        if (typeof cookies === 'object'){
            var h_key = cookies['uid'];
            var h_val = cookies['pid'];
            client.get(h_key, function (err, reply) {
                if (reply === h_val){
                    changeCookies(h_key);
                    callback(true);
                }else {
                    callback(false);
                    return false;
                }
            });
        }else {
            return false;
        }
    };

    /*用来创建cookies*/
    this.createSession = function (username) {
        var h_key = hash.sha256().update(username).digest('hex');
        var timestamp = new Date().getTime();
        var pref = hash.sha256().update(timestamp.toString(16)).digest('hex');
        var suff = hash.sha256().update(Math.sqrt(timestamp)).digest('hex');
        var string = pref + h_key + suff;
        var h_val = hash.sha512().update(string).digest('hex');
        client.set(h_key, h_val);  /*保存cookies*/
        cookies.set(h_key, h_val);
    };

    this.cookies = cookies;
};


module.exports = Session;
