/**
 * Created by CPU001 on 10/3/2014.
 */

'use strict';

var db = require('./../database').mainBucket;
var couchbase = require('couchbase');
var uuid = require('uuid');
var GameData = require('./data/gamedata');


function GameModel() {
}

GameModel.getKey = function(uid){
    return 'game-' + uid;
};

GameModel.create = function(uid, username, callback) {
    var gameDoc = new GameData(uid, username, 5000, 20, 0, 10);
    var key = GameModel.getKey(uid);

    db.insert(key, gameDoc, function(err, result) {
        if(err){
            return callback(err);
        }
        callback(err, gameDoc, result.cas);
    });
};


GameModel.get = function(uid, callback) {
    var key = GameModel.getKey(uid);

    db.get(key, function(err, result) {
        if (err) {
            return callback(err);
        }
        var gameDoc = new GameData(result.value.userId, result.value.username, result.value.gold, result.value.energy, result.value.lastEnergy, result.value.exp);
        callback(null, gameDoc );
    });
};

GameModel.save = function(uid, gameDoc, callback){
    var key = GameModel.getKey(uid);

    db.upsert(key, gameDoc, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

GameModel.remove = function(uid, callback){
    var key = GameModel.getKey(uid);

    db.remove(key, {},  function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result);
    });
};

module.exports = GameModel;