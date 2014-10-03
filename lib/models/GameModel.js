/**
 * Created by CPU001 on 10/3/2014.
 */

'use strict';

var db = require('./../database').mainBucket;
var couchbase = require('couchbase');
var uuid = require('uuid');


function GameModel() {
}

GameModel.create = function(uid, username, callback) {
    var gameDoc = {
        type: 'game',
        uid: uid,
        name: username,
        gold : 5000,
        energy: 20,
        last_enegry: 0
    };
    var gameDocName = 'game-' + gameDoc.uid;

    db.add(gameDocName, gameDoc, function(err, result) {
        callback(err, gameDoc, result.cas);
    });
};


GameModel.get = function(uid, callback) {
    var gameDocName = 'game-' + gameDoc.uid;

    db.get(gameDocName, function(err, result) {
        if (err) {
            return callback(err);
        }

        callback(null, result.value);
    });
};

module.exports = GameModel;