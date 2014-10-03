/**
 * Created by CPU001 on 10/3/2014.
 */

'use strict';

var GameData = function (userId, userName, gold, energy, lastEnergy) {
    this.initialize(userId, userName, gold, energy, lastEnergy);
};

var p = GameData.prototype;
//================================ Property =============================
p.userId = null;
p.username = null;
p.gold = 0;
p.energy = 0;
p.lastEnergy = 0;

//================================ function =============================
p.testFunction = function(){
  console.log("Test function!");
};

//================================ Constructor =============================
GameData.prototype.initialize = function (userId, userName, gold, energy, lastEnergy) {
    this.userId = userId;
    this.userName = userName;
    this.gold = gold;
    this.energy = energy;
    this.lastEnergy = lastEnergy;
};

module.exports = GameData;