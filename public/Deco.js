/**
 * Created by CPU001 on 11/8/2014.
 */
/**
 * Created by CPU001 on 9/21/2014.
 */


var IsoDeco = function (shop_data, entityId) {
    this.initialize(shop_data, entityId);
};

var p = IsoDeco.prototype = Object.create(IsoEntity.prototype);

//======================================= override ================================
IsoDeco.prototype.IsoEntity_onCreatedByCursorClick = p.onCreatedByCursorClick;
IsoDeco.prototype.onCreatedByCursorClick = function (current_cursor) {
//    gIsoState.execRoad(this, true);
};

IsoDeco.prototype.IsoEntity_loadDataCompleted = p.loadDataCompleted;
IsoDeco.prototype.loadDataCompleted = function (evt) {
    this.IsoEntity_loadDataCompleted(evt);
    if( this.startFrame == 0 ){
        this.sprite.gotoAndStop(this.sprite_sheet.getNumFrames() - 1);
    }
};


// ====================================== Constructor =============================
IsoDeco.prototype.IsoEntity_initialize = p.initialize;
IsoDeco.prototype.initialize = function (shop_data, entityId) {
    this.IsoEntity_initialize(shop_data, entityId);
    this.entityType = ENTITY_TYPE_DECO;
};