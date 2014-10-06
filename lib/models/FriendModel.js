/**
 * Created by CPU001 on 10/6/2014.
 */


'use strict';

var db = require('./../database').mainBucket;
var couchbase = require('couchbase');
var uuid = require('uuid');


function FriendModel() {
}

FriendModel.getKey = function(uid){
    return 'friend-' + uid;
};

FriendModel.create = function(uid, callback) {
    var doc = {};
    var key = FriendModel.getKey(uid);

    db.insert(key, doc, function(err, result) {
        if(err){
            return callback(err);
        }
        callback(err, doc, result.cas);
    });
};


FriendModel.get = function(uid, callback) {
    var key = FriendModel.getKey(uid);

    db.get(key, function(err, result) {
        if (err) {
            return callback(err);
        }
        var doc = result.value;
        callback(null, doc );
    });
};

FriendModel.save = function(uid, doc, callback){
    var key = FriendModel.getKey(uid);

    db.upsert(key, doc, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

FriendModel.remove = function(uid, callback){
    var key = FriendModel.getKey(uid);

    db.remove(key, {},  function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

module.exports = FriendModel;