/**
 * Created by CPU001 on 10/6/2014.
 */


'use strict';

var db = require('./../database').mainBucket;
var couchbase = require('couchbase');
var uuid = require('uuid');
var GameModel = require('./gamemodel');

function LoadFriendModel() {
}




LoadFriendModel.get = function(friend10, callback) {

    var keys = [];
    friend10.forEach(function(element, index, array){
       keys.push(GameModel.getKey(element));
    });

    db.getMulti(keys, function(err, result) {
        if (err) {
            return callback(err);
        }
        var doc = {};
        for(var key in result)
        {
            if(result.hasOwnProperty(key))
            {
                doc[GameModel.getUserId(key)] = {exp : result[key].value.exp};
            }
        }
        callback(null, doc );
    });
};



module.exports = LoadFriendModel;