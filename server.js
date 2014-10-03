'use strict';

// Various requirements
var express = require('express');
var crypt = require('./lib/crypt');

var accountModel = require('./lib/models/accountmodel');
var sessionModel = require('./lib/models/sessionmodel');
var stateModel = require('./lib/models/statemodel');
var checkUserId = require('./lib/models/checkuseridmodel');
var gameModel = require('./lib/models/gamemodel');
var buildingsModel = require('./lib/models/buildinglistmodel');


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var HastMap = require('./lib/structs/hashtable');
var Player = require('./lib/structs/player');

app.get('/', function(req, res){
    res.sendFile('/index.html', { root: path.join(__dirname, '/') });
});

//==================================== global variable ==========================
var m_listPlayer = new HastMap();
//==================================== MSG ===============================
var _msg_login_ = "login";
var _msg_buy_ = "buy";
var _msg_harvest_ = "harvest";
var _msg_move_ = "move";
var _msg_delete_ = "delete";
var _msg_visit_ = "visit";
var _msg_boots_ = "boots";

io.on('connection', function(socket){

    //===================================== Login ===========================
    socket.on(_msg_login_, function(msg){
        var params = JSON.parse(msg);
        var player = new Player(null, null, socket);
        // user exist?
        checkUserId.create(params.userId, function (err, userId) {
            if (err) {
                console.log('UserId: ' + params.userId + ' exist!');
                // ************* Registered User
                // read data
                gameModel.get(params.userId, function(err, gameDoc){
                    if(err){
                        console.log("Loaded game fail!");
                    }else{
                        console.log("Loaded game success!");
                        player.game = gameDoc;

                        // load buidling List
                        buildingsModel.get(params.userId, function(err, buildingsDoc){
                            if(err){
                                console.log('Loaded Buildings: ' + params.userId + ' fail!' + err);
                            }else{
                                console.log('Loaded: Building success!');
                                player.buildings = buildingsDoc;
                                // add player to list
                                m_listPlayer.setItem(player.getId(), player);
                                responseLogin(player);
                            }
                        })
                    }
                })
            } else {
                // *************  New User
                console.log('Created: ' + uid);
                // create data
                gameModel.create(params.userId, params.userId, function (err, gameDoc) {
                    if (err) {
                        console.log('Create Game: ' + params.userId + ' fail!' + err);
                    }
                    else{
                        console.log('Created: Game');
                        player.game = gameDoc;

                        // create buidling List
                        buildingsModel.create(params.userId, function(err, buildingsDoc){
                            if(err){
                                console.log('Create Buildings: ' + params.userId + ' fail!' + err);
                            }else{
                                console.log('Created: Building');
                                player.buildings = buildingsDoc;
                                // add player to list
                                m_listPlayer.setItem(player.getId(), player);
                                responseLogin(player);
                            }
                        })
                    }
                });
            }
        });

    });
    //===================================== Buy =============================
    socket.on(_msg_buy_, function(msg){

    });
    //===================================== Harvest ===========================
    socket.on(_msg_harvest_, function(msg){

    });
    //===================================== move ===========================
    socket.on(_msg_move_, function(msg){

    });
    //===================================== delete ===========================
    socket.on(_msg_delete_, function(msg){

    });
    //===================================== visit friend ===========================
    socket.on(_msg_visit_, function(msg){

    });
    //===================================== boots friend ===========================
    socket.on(_msg_boots_, function(msg){

    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});


//**********************************************************************************
function responseLogin(player){
    player.socket.emit(_msg_login_, JSON.stringify({game: player.game, buildings : player.buildings}));
}

function savePlayer(player){
    gameModel.save(player.getId(), player.game, function (err, gameDoc) {
        if (err) {
            console.log('Saved Game: ' + player.getId() + ' fail!' + err);
        }
        else{
            console.log('Saved: Game');
            buildingsModel.save(player.getId(), player.buildings, function(err, buildingsDoc){
                if(err){
                    console.log('Saved Buildings: ' + player.getId()+ ' fail!' + err);
                }else{
                    console.log('Saved: Building');
                }
            })
        }
    });
}


