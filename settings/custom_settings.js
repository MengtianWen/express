/**
 * Created by luneice on 17-6-28.
 */

// 数据库的配置
redis_index = {
  'query': 0,     /* Python 关键词数据库 */
  'cookies': 1,   /* Python cookies 数据库 */
  'proxy': 2,     /* Python 代理数据库 */
  'session': 7,
  'website': 8,   /* Node  */
  'authcode': 9,  /* Node 验证码数据库 */
  'test': 10      /* 测试用数据库 */,
  'tmall_rate': 14,     /* Python 商品评论地址数据库 */
  'tmall_detail': 15,   /* Python 商品详情地址数据库 */
};

// 请求的页面路由地址信息
router_page = {
  home: {
    mobile: './home/m-index',
    pc: './home/p-index'
  },
  error: {
    mobile: './error/m-error',
    pc: './error/p-error'
  },
  redirect: {
    mobile: {
      home: './index.html',
      login: './login/index.html',
      signup: './signup/index.html'
    },
    pc: {
      home: './pc/index.html'
    },
    sharedocs: {
      home: '../response/sharedocs/index.html'
    },
    error: {
      notfound: './error/404.html'
    }
  },
  blogs: {
    home: './blog/index.jade'
  }
};

ali_oss = {
  "AccessKeyId" : "",
  "AccessKeySecret" : "",
  "RoleArn" : "acs:ram:::role/",
  "TokenExpireTime" : "1000",
  "PolicyFile": {
    "Statement": [
      {
        "Action": [
          "oss:*"
        ],
        "Effect": "Allow",
        "Resource": ["acs:oss:*:*:*"]
      }
    ],
    "Version": "1"
  }
};

// 阿里短信服务配置信息
ali_mns = {
  accessKeyId: '[]',
  secretAccessKey: '[]',
  endpoint: 'https://[].mns.cn-beijing.aliyuncs.com/',
  apiVersion: '2015-06-06' // 调用MNS接口的版本号，当前版本为2015-06-06
};

// MongoDB 数据库配置信息
var mongo = {
  test: {
    host: 'localhost',
    dbname: 'test'
  }
};

module.exports = {
  router_page: router_page,
  redis_index: redis_index,
  ali_oss: ali_oss,
  ali_mns: ali_mns,
  mongo: mongo
};
