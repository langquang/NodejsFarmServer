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
var BuildingData = require('./lib/models/data/buildingdata');
var GameData = require('./lib/models/data/gamedata');
var BuildingListData = require('./lib/models/data/BuildingListData');
var FriendModel = require('./lib/models/FriendModel');
var FriendList = require('./lib/models/FriendList');
var LoadFriendList = require('./lib/models/LoadFriendModel');


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var HastMap = require('./lib/structs/hashtable');
var Player = require('./lib/structs/player');
var shopConfig = require('./config/shopconf').shopConf;
var shortId = require('shortid');
var Helper = require('./lib/utils/helper');

io.set('origins', 'http://localhost:63342');

app.get('/', function (req, res) {
    res.sendFile('/index.html', { root: path.join(__dirname, '/') });
});

//==================================== global variable ==========================
var m_listPlayer = new HastMap();
var m_listSocket = new HastMap();
var m_friend10 = [];
//==================================== MSG ===============================
var _msg_login_ = "login";
var _msg_buy_ = "buy";
var _msg_harvest_ = "harvest";
var _msg_move_ = "move";
var _msg_delete_ = "delete";
var _msg_visit_ = "visit";
var _msg_boots_ = "boots";

//create friend list
FriendList.get(function (err, friendlistDoc) {
    if (err) {
        m_friend10 = [];
    } else {
        m_friend10 = friendlistDoc;
    }
});


io.on('connection', function (socket) {

    socket.on('disconnect', function () {
        console.log('DISCONNESSO!!! ');
        var player = m_listSocket.getItem(socket.id);
        if (player != null) {
                savePlayer(player);
//            gameModel.save(player.getId(), player.game, function (err, result) {
//                if (err) {
//                    console.log("Save Game fail! - " + player.getId());
//                    return;
//                }
//                buildingsModel.save(player.getId(), player.buildings, function (err, result) {
//                    if (err) {
//                        console.log("Save buildings fail! - " + player.getId());
//                        return;
//                    }
//                    console.log("Save  - " + player.getId() + " - success");
//                })
//            })
        }
    });

    //===================================== Login ===========================
    socket.on(_msg_login_, function (params) {
        console.log("*** Login ***");
        var player = new Player(null, null, socket);
        // user exist?
        checkUserId.create(params.userId, function (err, userId) {
            if (err) {
                console.log('UserId: ' + params.userId + ' exist!');
                // ************* Registered User
                // read data
                gameModel.get(params.userId, function (err, gameDoc) {
                    if (err) {
                        console.log("Loaded game fail!");
                    } else {
                        console.log("Loaded game success!");
                        player.game = gameDoc;
                        player.game.updateEnegry();

                        // load buidling List
                        buildingsModel.get(params.userId, function (err, buildingsDoc) {
                            if (err) {
                                console.log('Loaded Buildings: ' + params.userId + ' fail!' + err);
                            } else {
                                console.log('Loaded: Building success!');
                                player.buildings = new BuildingListData(buildingsDoc);
                                // add player to list
                                m_listPlayer.setItem(player.getId(), player);
                                m_listSocket.setItem(socket.id, player);

                                FriendModel.get(params.userId, function (err, friendDoc) {
                                    if (err) {
                                        console.log('Loaded Friend: ' + params.userId + ' fail!' + err);
                                        player.friends = {};
                                    } else {
                                        player.friends = friendDoc;
                                    }
                                    return responseLogin(player);
                                })
                            }
                        })
                    }
                })
            } else {
                // *************  New User
                console.log('Created: ' + params.userId);
                // create data
                gameModel.create(params.userId, params.userId, function (err, gameDoc) {
                    if (err) {
                        console.log('Create Game: ' + params.userId + ' fail!' + err);
                    }
                    else {
                        console.log('Created: Game');
                        player.game = gameDoc;

                        // create buidling List
                        buildingsModel.create(params.userId, function (err, buildingsDoc) {
                            if (err) {
                                console.log('Create Buildings: ' + params.userId + ' fail!' + err);
                            } else {
                                console.log('Created: Building');
                                player.buildings = buildingsDoc;
                                // add player to list
                                m_listPlayer.setItem(player.getId(), player);
                                m_listSocket.setItem(socket.id, player);
                                FriendModel.create(params.userId, function (err, frienddoc) {
                                    if (err) {
                                        console.log('Create friend: ' + params.userId + ' fail!' + err);
                                        player.friends = {};
                                    } else {
                                        player.friends = frienddoc;
                                        return responseLogin(player);
                                    }
                                })
                            }
                        })
                    }
                });
            }
        });

    });
    //===================================== Buy =============================
    socket.on(_msg_buy_, function (params) {
        var player = m_listPlayer.getItem(params.userId);
        if (player != null) {
            console.log("create buidling");
            var config = shopConfig[params.id];
            if (config.price <= player.game.gold) {
                var entityId = shortId.generate();
                var building = new BuildingData(config.type, params.id, entityId, 0, params.x, params.y);
                player.buildings.add(building);
                player.game.gold -= config.price;
                player.socket.emit(_msg_buy_, {result: true, temptId: params.temptId, entityId: entityId});
                return;
            }
        }
        console.log("not found player");
        socket.emit(_msg_buy_, {result: false});
    });
    //===================================== Harvest ===========================
    socket.on(_msg_harvest_, function (params) {
        var player = m_listPlayer.getItem(params.userId);
        if (player != null) {
            var building = player.buildings.get(params.buildingId);
            if (building != null) {
                player.game.updateEnegry();
                if (player.game.energy > 0) {
                    var config = shopConfig[building.shop_id];
                    if (building.last_harvest == 0 || building.last_harvest + config.time <= Helper.getSeconds()) {
                        console.log("harvest building");
                        building.last_harvest = Helper.getSeconds();
                        player.game.energy--;
                        player.game.gold += config.income;
                        player.game.exp += 1;
                        player.socket.emit(_msg_harvest_, {result: true});
                        return;
                    }
                }

            }
        }
        socket.emit(_msg_harvest_, {result: false});
    });
    //===================================== move ===========================
    socket.on(_msg_move_, function (params) {
        var player = m_listPlayer.getItem(params.userId);
        if (player != null) {
            var building = player.buildings.get(params.buildingId);
            if (building != null) {
                console.log("move building");
                building.x = params.x;
                building.y = params.y;
                player.socket.emit(_msg_move_, {result: true});
                return;
            }
        }
        player.socket.emit(_msg_move_, {result: false});
    });
    //===================================== delete ===========================
    socket.on(_msg_delete_, function (params) {
        var player = m_listPlayer.getItem(params.userId);
        if (player != null) {
            var building = player.buildings.get(params.buildingId);
            if (building != null) {
                console.log("delete building");
                delete player.buildings.remove(params.buildingId);
                player.socket.emit(_msg_delete_, {result: true});
                return;
            }
        }
        socket.socket.emit(_msg_delete_, {result: false});
    });
    //===================================== visit friend ===========================
    socket.on(_msg_visit_, function (params) {
        if (m_listSocket.hasItem(socket.id)) {
            var player = m_listSocket.getItem(socket.id);
            if (player != null) {
                if (player.getId() == params.friendId) // go home
                {
                    socket.emit(_msg_visit_, {result: true, buildings: player.buildings.map, userId: params.friendId});
                }
                else    // visit friend
                {
                    buildingsModel.get(params.friendId, function (err, doc) {
                        if (err) {
                            console.log("visit fail" + params.friendId);
                            socket.emit(_msg_visit_, {result: false});
                            return;
                        }
                        console.log("visit success" + params.friendId);
                        socket.emit(_msg_visit_, {result: true, buildings: doc.map, userId: params.friendId});
                    })
                }
            }
        }
        else {
            socket.emit(_msg_visit_, {result: false});
        }

    });
    //===================================== boots friend ===========================
    socket.on(_msg_boots_, function (params) {
        if( m_listSocket.hasItem(socket.id) )
        {
            var player = m_listSocket.getItem(socket.id)
            if( player != null ){
                if( player.friends.hasOwnProperty(params.friendId) && player.friends[params.friendId] > 0){
                    player.friends[params.friendId]--;
                    player.game.gold += 10;
                    socket.emit(_msg_boots_, {result: true});
                    console.log("Boots success");
                    return;
                }
            }

        }
        socket.emit(_msg_boots_, {result: false});
        console.log("Boots fail");
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});


//**********************************************************************************
function responseLogin(player) {
    // add current user to list
    if (m_friend10.indexOf(player.getId()) == -1) {
        m_friend10.push(player.getId());
        if (m_friend10.length > 10) {
            m_friend10.pop();
        }
    }
    FriendList.save(m_friend10, function (err, result) {
        if (err) {
            console.log("save friend10 error")
        }
    });

    // add friend to current usser
    for (var key in player.friends) {
        if (m_friend10.indexOf(key) == -1) {
            delete player.friends[key];
        }
    }

    m_friend10.forEach(function (element, index, array) {
        if (!player.friends.hasOwnProperty(element)) {
            player.friends[element] = 5;
        }
    });
    // read friend data
    LoadFriendList.get(m_friend10, function (err, doc) {
        if (err) {
            player.friendInfo = {};
        }
        else {
            player.friendInfo = doc;
        }
        player.socket.emit(_msg_login_, {result: true, time: Helper.getSeconds(), game: player.game, friend: player.friends, friendInfo: player.friendInfo, buildings: player.buildings.map});
    });


}

function responseLoginFail(player) {
    player.socket.emit(_msg_login_, {result: false});
}

function savePlayer(player) {
    gameModel.save(player.getId(), player.game, function (err, gameDoc) {
        if (err) {
            console.log('Saved Game: ' + player.getId() + ' fail!' + err);
        }
        else {
            console.log('Saved: Game');
            buildingsModel.save(player.getId(), player.buildings, function (err, buildingsDoc) {
                if (err) {
                    console.log('Saved Buildings: ' + player.getId() + ' fail!' + err);
                } else {
                    console.log('Saved: Building');
                    FriendModel.save(player.getId(), player.friends, function (err, doc) {
                        if (err) {
                            console.log('Saved Buildings: ' + player.getId() + ' fail!' + err);
                        }
                    })
                }
            })
        }
    });
}

//======================================= Prevent crash =========================
process.on('uncaughtException', function (error) {
    console.log(error.stack);
});