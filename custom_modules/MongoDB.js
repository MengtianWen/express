/**
 * Created by luneice on 17-7-29.
 */

/*定义MongoDB类*/
var MongoDB = function (host, dbname, schema) {
    var mongoose = require('mongoose');
    var mongodb = mongoose.createConnection(host, dbname); //创建一个数据库连接
    var Schema =  new mongoose.Schema(schema);

    /*数据存库*/
    this.insert = function (col, docs) {
        var Model = mongodb.model(col, Schema);
        var Entity = new Model(docs);
        Entity.save();
    };

    /*查询数据库*/
    this.query = function (condition, callback) {
        var key, src = {}, params = {
            col: 'datum',
            query: {},
            filter: {
                '_id': 0,
                '__v': 0
            },
            limit: 7,
            skip: 0
        };

        if (typeof condition === 'object'){
            for(key in params){
                src[key] = (condition[key] === undefined ? params : condition)[key];
            }
        }

        var Model = mongodb.model(src.col, Schema);
        Model.find(src.query, src.filter).skip(src.skip).limit(src.limit).exec(function (err, results) {
            callback(err, results);
        });
    };
};

module.exports = MongoDB;
