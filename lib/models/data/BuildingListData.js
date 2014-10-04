/**
 * Created by CPU001 on 10/3/2014.
 */

'use strict';

var BuildingListData = function ( doc ) {
    this.initialize(doc);
};

var p = BuildingListData.prototype;
//================================ Property =============================
p.map = null;   // id - buildingdata


//================================ function =============================
p.testFunction = function(){
    console.log("Test function!");
};

p.add = function(buildingdata){
  this.map[buildingdata.id] = buildingdata;
};

p.get = function(id){
  return this.map[id];
};


//================================ Constructor =============================
BuildingListData.prototype.initialize = function (doc) {

    if(doc != null)
    {
        this.map = doc.map;
    }
    else
    {
        this.map = {};
    }

};

module.exports = BuildingListData;