/**
 * Created by CPU001 on 10/3/2014.
 */

'use strict';

var Helper = require('../../utils/helper');

var GameData = function (userId, userName, gold, energy, lastEnergy, exp, lastLogin) {
    this.initialize(userId, userName, gold, energy, lastEnergy, exp, lastLogin);
};

var p = GameData.prototype;
//================================ Property =============================
p.userId = null;
p.username = null;
p.gold = 0;
p.energy = 0;
p.lastEnergy = 0;
p.exp = 10;
p.lastLogin = 0;

//================================ function =============================
p.updateEnegry = function(){
    var deltatime = Helper.getSeconds() - this.lastEnergy;
    var incEnergy = Math.floor(deltatime / 60);
    if( incEnergy > 0 ){
        this.energy += incEnergy;
        this.lastEnergy = Helper.getSeconds() - (deltatime % 60);
    }

    if( this.energy > 30 ){
        this.energy = 30;
    }
};

//================================ Constructor =============================
GameData.prototype.initialize = function (userId, userName, gold, energy, lastEnergy, exp, lastLogin) {
    this.userId = userId;
    this.userName = userName;
    this.gold = gold;
    this.energy = energy;
    this.lastEnergy = lastEnergy;
    this.exp = exp;
    this.lastLogin = lastLogin;
};

module.exports = GameData;