/**
 * Created by CPU001 on 10/4/2014.
 */


'use strict';

var db = require('./../database').mainBucket;
var couchbase = require('couchbase');
var uuid = require('uuid');
var BuildingListData = require('./data/BuildingListData');


function BuildingListModel() {
}

BuildingListModel.getKey = function(uid){
    return 'buildings-' + uid;
};

BuildingListModel.create = function(uid, callback) {
    var doc = new BuildingListData(null);
    var key = BuildingListModel.getKey(uid);

    db.insert(key, doc, function(err, result) {
        if(err){
            return callback(err);
        }
        callback(err, doc, result.cas);
    });
};


BuildingListModel.get = function(uid, callback) {
    var key = BuildingListModel.getKey(uid);

    db.get(key, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result.value);
    });
};

BuildingListModel.save = function(uid, doc, callback){
    var key = BuildingListModel.getKey(uid);

    db.upsert(key, doc, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

module.exports = BuildingListModel;