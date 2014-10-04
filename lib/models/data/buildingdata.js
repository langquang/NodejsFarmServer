/**
 * Created by CPU001 on 10/3/2014.
 */

var BuildingData = function (shop_type, shop_id, id, last_harvest, x, y) {
    this.initialize(shop_type, shop_id, id, last_harvest, x, y);
};

var p = BuildingData.prototype;
//================================ Property =============================
p.shop_type = null;
p.shop_id = null;
p.id = null;
p.last_harvest = 0;
p.x = 0;
p.y = 0;

//================================ function =============================
p.testFunction = function(){
    console.log("Test function!");
};

//================================ Constructor =============================
BuildingData.prototype.initialize = function (shop_type, shop_id, id, last_harvest, x , y) {
    this.shop_type = shop_type;
    this.shop_id = shop_id;
    this.id = id;
    this.last_harvest = last_harvest;
    this.x = x;
    this.y = y;
};

module.exports = BuildingData;