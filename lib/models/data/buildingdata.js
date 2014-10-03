/**
 * Created by CPU001 on 10/3/2014.
 */

var BuildingData = function (building_type, building_id, id, last_harvest) {
    this.initialize(building_type, building_id, id, last_harvest);
};

var p = BuildingData.prototype;
//================================ Property =============================
p.building_type = null;
p.building_id = null;
p.id = null;
p.last_harvest = 0;

//================================ function =============================
p.testFunction = function(){
    console.log("Test function!");
};

//================================ Constructor =============================
BuildingData.prototype.initialize = function (building_type, building_id, id, last_harvest) {
    this.building_type = building_type;
    this.building_id = building_id;
    this.id = id;
    this.last_harvest = last_harvest;
};

module.exports = BuildingData;