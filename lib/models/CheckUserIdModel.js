/**
 * Created by CPU001 on 10/3/2014.
 */

'use strict';

var db = require('./../database').mainBucket;
var couchbase = require('couchbase');
var uuid = require('uuid');


function CheckUserIdModel() {
}

CheckUserIdModel.create = function(uid, callback) {
    var doc = {
        type: 'CheckUserId',
        uid: uid
    };
    var key = 'userid-' + doc.uid;

    db.insert(key, doc, function(err, result) {
        if( err ){
           return callback(err);
        }
        callback(null, doc.uid, result.cas);
    });
};

module.exports = CheckUserIdModel;