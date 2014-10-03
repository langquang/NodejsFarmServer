/**
 * Created by CPU001 on 10/4/2014.
 */

var GameData = require("../models/data/gamedata");
var BuildingListData = require("../models/data/BuildingListData");

var Player = function (gameData, buildingListData, socket) {
    this.initialize(gameData, buildingListData, socket);
};

var p = Player.prototype;
//================================ Property =============================
p.game = null;
p.buildings = null;
p.socket = null;

//================================ function =============================
p.getId = function(){
    return this.game.userId;
};


//================================ Constructor =============================
Player.prototype.initialize = function (gameData, buildingListData, socket) {
    this.gameData = gameData;
    this.buildings = buildingListData;
    this.socket = socket;
};

module.exports = Player;
