'use strict';

// Various requirements
var express = require('express');
var crypt = require('./lib/crypt');

var accountModel = require('./lib/models/accountmodel');
var sessionModel = require('./lib/models/sessionmodel');
var stateModel = require('./lib/models/statemodel');
var checkUserId = require('./lib/models/checkuseridmodel');
var gameModel = require('./lib/models/gamemodel');


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
    res.sendFile('/index.html', { root: path.join(__dirname, '/') });
});

io.on('connection', function(socket){

    //===================================== Login ===========================
    socket.on('login', function(msg){

    });
    //===================================== Buy =============================
    socket.on('buy', function(msg){

    });
    //===================================== Harvest ===========================
    socket.on('harvest', function(msg){

    });
    //===================================== move ===========================
    socket.on('move', function(msg){

    });
    //===================================== visit friend ===========================
    socket.on('visit', function(msg){

    });
    //===================================== boots friend ===========================
    socket.on('boots', function(msg){

    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});



//======================= Login ===============================
//===== Login 1: check new User
var temp_userid = "butin";
gameModel.remove(temp_userid, function (err) {
    if (err == null) {
        console.log('remove Game: ' + temp_userid);
    }
});

checkUserId.create(temp_userid, function (err, uid) {
    if (err) {
        console.log('UserId: ' + temp_userid + ' exist!');
    } else {
        console.log('Created: ' + uid);
    }
});
//===== Create Game
gameModel.create(temp_userid, temp_userid, function (err, gameDoc) {
    if (err) {
        console.log('Create Game: ' + temp_userid + ' fail!' + err);
    }
});
//===== Read Game
gameModel.get(temp_userid, function (err, gameDoc) {
    if (err) {
        console.log('get Game: ' + temp_userid + ' fail!');
    }
    else {
        console.log(JSON.stringify(gameDoc));

        gameDoc.gold = Math.floor(Math.random() * (7000 - 6000) + 6000);
        // ===== Set Game
        gameModel.save(temp_userid, gameDoc, function (err, result) {
            if (err) {
                console.log('get Game: ' + temp_userid + ' fail!');
            }
            else {
                console.log(JSON.stringify(gameDoc));
            }
        });
    }
});
