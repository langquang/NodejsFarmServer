//this.createjs = this.createjs || {};
//this.stage = this.stage || {};

var ENTITY_TYPE_ROAD = "road";
var ENTITY_TYPE_BUILDING = "building";
var ENTITY_TYPE_DECO = "deco";

var IsoEntity = function (shop_data, entityId) {
    this.initialize(shop_data, entityId);
};

var p = IsoEntity.prototype = new createjs.Container();


//============================== propertys
p.shop_id = 0;   // ref to Constance
p.entityId = "";    // identify
p.entityType = ENTITY_TYPE_BUILDING;
p.texture = "";
p.shop_data = null;
p.sprite = null;
p.isoX = 0;
p.isoY = 0;
p.cellX = 0;
p.cellY = 0;
p.loader = null;
p.sizeX = 2;    // cell size
p.sizeY = 2;    // cell size
p.anchorX = 1;    // cell size
p.anchorY = 1;    // cell size
p.anchorX_2 = 1;    // cell size
p.anchorY_2 = 1;    // cell size
p._building_data = null; // constance data
p.startFrame = 0;
p.sprite_sheet = null;

// server
p.last_harvest = 0;
// ============================ function

p._setPosition = function (x, y) {
    this.x = x;
    this.y = y;
};

p._setIsoPosition = function (x, y) {
    this.isoX = x;
    this.isoY = y;
    var screenP = isoToScreen($V([x, y, 0]));
    this._setPosition(screenP.e(1), screenP.e(2));
};

p.setCellPosition = function (cellX, cellY) {
    this.cellX = cellX;
    this.cellY = cellY;
    this._setIsoPosition(cellX * CELL_SIZE, cellY * CELL_SIZE);
};


// this != this
p.handleEvt = function (evt) {
    if (evt.type == "rollover") {
        this.sprite.scaleX = 1.03;
        this.sprite.scaleY = 1.03;
    }
    else if (evt.type == "rollout") {
        this.sprite.scaleX = 1.0;
        this.sprite.scaleY = 1.0;
    }
    else if (evt.type == "click") {
        if (gCursor.state == CURSOR_REMOVE) {
            gIsoState.remove(this);
            sendDelete(this.entityId)
        }
        else if (gCursor.state == CURSOR_MOVE) {
            if (gCursor._sprite_cursor == null) {
                // attach current building to cursor
                gIsoState.remove(this);
                gCursor.attachIsoEntity(this);
            }
        }
    }
};

// this != this
p.loadDataCompleted = function (evt) {
    this._building_data = this.loader.getResult(this.shop_id).data;
    var animation_data = this.loader.getResult(this.shop_id).anim;
    this.sprite_sheet = new createjs.SpriteSheet(animation_data);
    this.sprite = new createjs.Sprite(this.sprite_sheet);
    this.sprite.gotoAndStop(this.startFrame);
    this.addChild(this.sprite);

    // move anchor o top-left
//    var offset = $V([Math.floor((this.sizeX - 1) * CELL_SIZE / 2), Math.floor((this.sizeY - 1) * CELL_SIZE / 2)]);
//    offset = isoToScreen(offset);
//    this.sprite.x = +offset.e(1);
//    this.sprite.y = +offset.e(2);

//    this.sprite.x = this.x;
//    this.sprite.y = this.y;
//    gIsoContainer.addChild(this.sprite);
    this.sprite.on("click", this.handleEvt, this);
//    this.sprite.on("dblclick", this.handleEvt, this);
    this.sprite.on("rollover", this.handleEvt, this);
    this.sprite.on("rollout", this.handleEvt, this);
//    this.sprite.on("mousedown", this.handleEvt, this);
//    this.sprite.on("pressmove", this.handleEvt, this);


};

p.onCursorClick = function () {
    console.log("onCursorClick");
};

p.onCreatedByCursorClick = function (current_cursor) {
    console.log("onCreatedByCursorClick");
};

p.gotoAndStop = function (frame_index) {
    this.startFrame = frame_index;
    if (this.sprite != null) {
        this.sprite.gotoAndStop(frame_index);
    }
};

p.gotoAndPlay = function (frame_index) {
    if (this.sprite == null) {
        this.startFrame = frame_index;
    } else {
        this.sprite.gotoAndPlay(frame_index);
        this.sprite.update();
    }
};


p.loadData = function () {
    var manifest = [
        {src: "assets/" + this.texture + ".json", id: this.shop_id}
    ];

    // loader is global
    this.loader = new createjs.LoadQueue();
    this.loader.on("complete", this.loadDataCompleted, this);
    this.loader.loadManifest(manifest);
};

//======================================= Override==========================
//======================================= Constructor==========================
IsoEntity.prototype.Container_initialize = p.initialize;
IsoEntity.prototype.initialize = function (shop_data, entityId) {
    this.Container_initialize();
    this.shop_data = shop_data;
    this.shop_id = this.shop_data.id;
    this.entityId = entityId;
    this.texture = this.shop_data.texture;
    this.sizeX = this.shop_data.width;
    this.sizeY = this.shop_data.height;
    this.anchorX = Math.floor(this.sizeX / 2);
    this.anchorY = Math.floor(this.sizeY / 2);

    if( this.anchorX == 0 )
        this.anchorX_2 = 1;
    else
        this.anchorX_2 = this.anchorX;

    if( this.anchorY == 0 )
        this.anchorY_2 = 1;
    else
        this.anchorY_2 = this.anchorY;

    this.loadData();
};
