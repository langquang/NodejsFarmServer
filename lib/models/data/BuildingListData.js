/**
 * Created by CPU001 on 10/3/2014.
 */

'use strict';

var HashTable = require("../../structs/hashtable");
var BuildingListData = function () {
    this.initialize();
};

var p = BuildingListData.prototype;
//================================ Property =============================
p.map = null;   // id - buildingdata


//================================ function =============================
p.testFunction = function(){
    console.log("Test function!");
};

p.add = function(buildingdata){
  this.map.setItem(buildingdata.id, buildingdata);
};

p.get = function(id){
  return this.map.getItem(id);
};


//================================ Constructor =============================
BuildingListData.prototype.initialize = function () {
    this.map = new HashTable();

};

module.exports = BuildingListData;