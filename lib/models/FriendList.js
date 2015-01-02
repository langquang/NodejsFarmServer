/**
* Created by CPU001 on 10/6/2014.
*/

'use strict';

var db = require('./../database').mainBucket;
var couchbase = require('couchbase');
var uuid = require('uuid');


function FriendList() {
}

FriendList.getKey = function(){
    return 'friend-list';
};

FriendList.create = function( callback) {
    var doc = {};
    var key = FriendList.getKey();

    db.insert(key, doc, function(err, result) {
        if(err){
            return callback(err);
        }
        callback(err, doc, result.cas);
    });
};


FriendList.get = function( callback) {
    var key = FriendList.getKey();

    db.get(key, function(err, result) {
        if (err) {
            return callback(err);
        }
        var doc = result.value;
        callback(null, doc );
    });
};

FriendList.save = function( doc, callback){
    var key = FriendList.getKey();

    db.upsert(key, doc, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result);
    });
};

FriendList.remove = function(callback){
    var key = FriendList.getKey();

    db.remove(key, {},  function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

module.exports = FriendList;