/**
 * Created by luneice on 17-7-27.
 */

var express = require('express');
var router = express.Router();
var MongoDB = require('../custom_modules/MongoDB');
var custom_settings = require('../settings/custom_settings');
var router_page = custom_settings.router_page;
var mongo_conf = custom_settings.mongo.test;

/*
 * 这里是写业务逻辑方法地方
 * */

var hash = require('hash.js');
/*创建Redis实例，用来保存用户的验证码*/
var redis_index = custom_settings.redis_index;
var redis = require("redis"),
  client = redis.createClient({db: redis_index.authcode});

client.on("error", function (err) {
  console.log("Error " + err);
});

router.get('/', function(req, res) {
  //默认电脑端
  var page = router_page.redirect.pc;
  /* 如果是手机设备，则业务逻辑是 */
  if (req.headers['user-agent'].toLowerCase().match(/(iphone|ipod|ipad|android)/)){
    page = router_page.redirect.mobile.signup;
  }
  res.redirect(page);
});

router.post('/', function (req, res) {
  /*一律不要相信用户提交的任何数据，在这个地方一定要再次验证用户输入数据的合法性*/
  var id = req.body['id'];
  var email = req.body['email'];
  var token = req.body['token'];
  var password = req.body['password'];

  var d_token = hash.sha1().update(id + email + password).digest('hex');
  var message = {
    pass: {success: true, message: '注册成功'},
    block: {success: false, message: '注册失败'},
    is_signup: {success: false, message: '已被注册'},
    verify_fail: {success: false, message: '验证失败'}
  };
  /*根据d_token在数据库中取对应的值*/
  /*如果值相同中则用户没有修改原来验证过的值*/
  client.get(d_token, function (err, reply) {
    /*存取时出现错误则*/
    if (err){
      res.json(message.verify_fail);
      throw err;
    }
    /*将取出的结果与用户输入的对比*/
    if (reply === token){
      var username = [id, email];
      // 建造者模式
      var User = function (username, password) {
        this.username = username;
        this.random = Math.floor(Math.random() * (999999 - 100000) + 100000);
        this.time = new Date().getTime();
        this.password = hash.sha512().update(password + this.time + this.random).digest('hex');
        this.date = new Date().toUTCString();
        return this;
      };

      var user = new User(username, password);
      var mongo = new MongoDB(mongo_conf.host, mongo_conf.dbname, {
          username: Array,
          password: String,
          time: String,
          date: String,
          random: Number
        }
      );
      var condition = {
        col: 'User',
        query: {
          username: {
            $in: username
          }
        },
        filter: {
          '_id': 0,
          '__v': 0
        },
        limit: 7,
        skip: 0
      };
      mongo.query(condition, function (err, result) {
        if (err) throw err;
        if (result.length !== 0){
          /*数据库中已经有该用户*/
          res.json(message.block);
        }else {
          mongo.insert('user', user);
          res.json(message.pass);
        }
      });
    }else {
      res.json(message.block);
    }
  });
});

router.post('/verify', function (req, res) {
  var username = req.body['query'];
  /*是否符合学号的要求*/
  if (!(/^201[3-9][0-9]{5,6}$/.test(username) ||
      /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(username))){
    res.json({success: false, message: '已被注册'});
    return;
  }

  var mongo = new MongoDB(mongo_conf.host, mongo_conf.dbname, {
    username: Array
  });

  mongo.query(
    {
      query: {
        username: username
      },
      col: 'user'
    },
    function (err, results) {
      if (err) throw err;
      else (results.length === 0) ?
        res.json({success: true, message: '可以注册'}) : res.json({success: false, message: '已被注册'});

    });
});

router.post('/getAuthCode', function (req, res) {
  var id = req.body.id;
  var email = req.body.email;
  var password = req.body.password;

  if (!(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email) &&
      /^[A-Za-z0-9!@#$%^&*()_+-=|\\/?<>,.:;]{6,18}$/.test(password)  &&
      /^201[3-9][0-9]{5,6}$/.test(id))){
    res.json({success: false, message: '提交的数据有误'});
    return;
  }
  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer-smtp-transport');

  // 开启一个 SMTP 连接池
  var transport = nodemailer.createTransport(smtpTransport({
    service: 'qq.com',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
      user: '[]',
      pass: '[]'
    }
  }));

  /*计算随机的验证码*/
  var code = Math.floor(Math.random() * (999999 - 100000) + 100000);

  /*封装邮件*/
  var mailOptions = {
    from: '[]', // sender address
    to: email, // list of receivers
    subject: '您的验证码', // Subject line
    text: '', // plaintext body
    html: '<p>欢迎您注册会员，您的验证码为：' + code + '(五分钟内有效)</p>' // html body
  };

  /*发送邮件*/
  transport.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error, info);
      res.json({success: false, message: '未知错误', token: ''});
    }else{
      /*产生验证码的口令*/
      var v_token = hash.sha1().update(email + (new Date().getTime())).digest('hex');
      /*对提交的数据进行签名*/
      var d_token = hash.sha1().update(id + email + password).digest('hex');
      /*将口令与验证码存入数据库中*/
      client.set(v_token, code);
      client.expire(v_token, 300);
      /*将签名的数据存入数据库*/
      client.set(d_token, v_token);
      client.expire(d_token, 350);
      res.json({success: true, message: '验证码发送成功', token: v_token});
    }
  });
});

router.post('/verifyAuthCode', function (req, res) {
  var authcode = req.body.authcode;
  var token = req.body.token;
  if (token === ''){
    res.json({success: false, message: '验证失败'});
    return;
  }
  /*根据token在数据库中取验证码*/
  client.get(token, function (err, reply) {
    /*存取时出现错误则*/
    if (err){
      res.json({success: false, message: '验证失败'});
      throw err;
    }
    /*将取出的结果与用户输入的对比*/
    if (Number(reply) === Number(authcode)){
      res.json({success: true, message: '验证成功'});
    }else {
      res.json({success: false, message: '验证失败'});
    }
  });
});

module.exports = router;
