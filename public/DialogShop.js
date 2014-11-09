/**
 * Created by CPU001 on 9/23/2014.
 */

var DialogShop = function () {
    this.initialize();
};

var p = DialogShop.prototype = new createjs.Container();
//============================== propertys
p._background = null;
p._btnNext = null;
p._btnPrev = null;
p._btnclose = null;
p._buildingContainer = null;
p._decorationContainer = null;
p._shopMask = null;

p.map_data = null;
p._data_items = null;
p._frame_lose_1 = 6;
p._frame_lose_2 = 7;
p._frame_next_1 = 4;
p._frame_next_2 = 5;
p._frame_prev_1 = 8;
p._frame_prev_2 = 9;

p._tween_distance = 165;
p._tween_min = -345;
p._cur_tab_container = null;
p._cur_tab_data = null;
p._cur_tap_max_tween_index = 0;
p._cur_tap_cur_tween_index = 0;
p._cur_tween = null;

p._tap_building = null;
p._tap_decoration = null;

//=======================================Functions =========================
p.loadData = function () {
    var manifest = [
        {src: "assets/window_shop.json", id: "window_shop"},
        {src: "assets/window_shop.png", id: "window_shop_texture"}
    ];

    // loader is global
    this.loader = new createjs.LoadQueue();
    this.loader.on("complete", this.loadDataCompleted, this);
    this.loader.loadManifest(manifest);
};

p.loadDataCompleted = function (evt) {
    this.map_data = this.loader.getResult("window_shop");
    this._data_items  = gLoader.getResult("window_shop").items;
    // add id property to iteminfo
    for (var key in this._data_items) {
        this._data_items[key].id = key;
    }
    var animation_data = this.map_data.anim;
    var ss = new createjs.SpriteSheet(animation_data);
    // background
    this._background = new createjs.Sprite(ss);
    this._background.gotoAndStop(0);
    this.addChild(this._background);
    // btn close
    ss = new createjs.SpriteSheet(animation_data);
    this._btnclose = new createjs.Sprite(ss);
    this._btnclose.gotoAndStop(this._frame_lose_1);
    this._btnclose.x = 345;
    this._btnclose.y = -255;
    this._btnclose.on("click", this.handleBtnCloseEvent, this);
    this._btnclose.on("rollover", this.handleBtnCloseEvent, this);
    this._btnclose.on("rollout", this.handleBtnCloseEvent, this);
    this.addChild(this._btnclose);

    // mask
    var g = new createjs.Graphics();
    g.beginFill("#00F").drawRect(0, 0, 647, 370);
    this._shopMask = new createjs.Shape(g);
    this._shopMask.x = -325;
    this._shopMask.y = -155;
//    this.addChild(this._shopMask);    // hide mask

    // building container
    this._buildingContainer = new createjs.Container();
    this._buildingContainer.x = this._tween_min;
    this._buildingContainer.y = -155;
    this._buildingContainer.mask = this._shopMask;  // set mask
    this._buildingContainer.visible = false;
    this.addChild(this._buildingContainer);
    var tabBuidling = this.map_data.tabs.house;
    var off_x = 20;
    var column = 0;
    for (var i = 0; i < tabBuidling.length; i++) {
        var itemShop = new ShopItem();
        itemShop.setItem(this._data_items[tabBuidling[i] + ""], animation_data);
        itemShop.x = off_x + column * this._tween_distance;
        itemShop.y = i % 2 == 0 ? 0 : 180;
        this._buildingContainer.addChild(itemShop);
        if (i > 0 && i % 2 == 1) {
            column++;
        }
    }
    // decoration container
    this._decorationContainer = new createjs.Container();
    this._decorationContainer.x = this._tween_min;
    this._decorationContainer.y = -155;
    this._decorationContainer.mask = this._shopMask;  // set mask
    this._decorationContainer.visible = false;
    this.addChild(this._decorationContainer);
    var tabDecoration = this.map_data.tabs.decoration;
    off_x = 20;
    column = 0;
    for (var i = 0; i < tabDecoration.length; i++) {
        var itemShop = new ShopItem();
        itemShop.setItem(this._data_items[tabDecoration[i] + ""], animation_data);
        itemShop.x = off_x + column * this._tween_distance;
        itemShop.y = i % 2 == 0 ? 0 : 180;
        this._decorationContainer.addChild(itemShop);
        if (i > 0 && i % 2 == 1) {
            column++;
        }
    }

    // btn Next
    ss = new createjs.SpriteSheet(animation_data);
    this._btnNext = new createjs.Sprite(ss);
    this._btnNext.gotoAndStop(this._frame_next_1);
    this._btnNext.x = 353;
    this._btnNext.on("click", this.handleBtnNextEvent, this);
    this._btnNext.on("rollover", this.handleBtnNextEvent, this);
    this._btnNext.on("rollout", this.handleBtnNextEvent, this);
    this.addChild(this._btnNext);
    // btn Prev
    ss = new createjs.SpriteSheet(animation_data);
    this._btnPrev = new createjs.Sprite(ss);
    this._btnPrev.gotoAndStop(this._frame_prev_1);
    this._btnPrev.x = -353;
    this._btnPrev.on("click", this.handleBtnPrevEvent, this);
    this._btnPrev.on("rollover", this.handleBtnPrevEvent, this);
    this._btnPrev.on("rollout", this.handleBtnPrevEvent, this);
    this.addChild(this._btnPrev);

    // tap
    ss = new createjs.SpriteSheet(animation_data);
    this._tap_building = new createjs.Sprite(ss);
    this._tap_building.gotoAndStop(2);
    this._tap_building.x = -300;
    this._tap_building.y = -225;
    this._tap_building.on("click", this.handleTabBuildingEvent, this);
    this._tap_building.on("rollover", this.handleTabBuildingEvent, this);
    this._tap_building.on("rollout", this.handleTabBuildingEvent, this);
    this.addChild(this._tap_building);

    ss = new createjs.SpriteSheet(animation_data);
    this._tap_decoration = new createjs.Sprite(ss);
    this._tap_decoration.gotoAndStop(3);
    this._tap_decoration.x = -230;
    this._tap_decoration.y = -225;
    this._tap_decoration.on("click", this.handleTabDecorationEvent, this);
    this._tap_decoration.on("rollover", this.handleTabDecorationEvent, this);
    this._tap_decoration.on("rollout", this.handleTabDecorationEvent, this);
    this.addChild(this._tap_decoration);


    this._showTap("building");

};

p._showTap = function(name){
    if( name == "building" ){
        this._cur_tab_container = this._buildingContainer;
        this._cur_tab_data = this.map_data.tabs.house;
        this._cur_tap_cur_tween_index = 0;
        this._cur_tap_max_tween_index = Math.ceil(this._cur_tab_data.length / 2) - 4;
    }else if( name == "decoration" ){
        this._cur_tab_container = this._decorationContainer;
        this._cur_tab_data = this.map_data.tabs.decoration;
        this._cur_tap_cur_tween_index = 0;
        this._cur_tap_max_tween_index = Math.ceil(this._cur_tab_data.length / 2) - 4;
    }

    this._cur_tap_cur_tween_index = 0;
    this._buildingContainer.visible = false;
    this._decorationContainer.visible = false;
    this._cur_tab_container.visible = true;
    this._cur_tab_container.x =  this._tween_min;

};


p.handleBtnCloseEvent = function (evt) {
    if (evt.type == "click") {
        this._btnclose.gotoAndStop(this._frame_lose_1);
        showIBShop(false);
    } else if (evt.type == "rollover") {
        this._btnclose.gotoAndStop(this._frame_lose_2);
    } else if (evt.type == "rollout") {
        this._btnclose.gotoAndStop(this._frame_lose_1);
    }
};

p.handleBtnNextEvent = function (evt) {
    if (evt.type == "click") {
        this._btnNext.gotoAndStop(this._frame_next_1);
        if( this._cur_tap_cur_tween_index < this._cur_tap_max_tween_index ){
            this._cur_tap_cur_tween_index++;
            var toX = this._tween_min - this._cur_tap_cur_tween_index*this._tween_distance;
            createjs.Tween.removeTweens(this._cur_tab_container);
            this._cur_tween = createjs.Tween.get(this._cur_tab_container).to({x: toX }, 200).call(this.handleComplete);
        }

    } else if (evt.type == "rollover") {
        this._btnNext.gotoAndStop(this._frame_next_2);
    } else if (evt.type == "rollout") {
        this._btnNext.gotoAndStop(this._frame_next_1);
    }
};

p.handleBtnPrevEvent = function (evt) {
    if (evt.type == "click") {
        this._btnPrev.gotoAndStop(this._frame_prev_1);
        if( this._cur_tap_cur_tween_index > 0 ){
            this._cur_tap_cur_tween_index--;
            var toX = this._tween_min - this._cur_tap_cur_tween_index*this._tween_distance;
            createjs.Tween.removeTweens(this._cur_tab_container);
            this._cur_tween = createjs.Tween.get(this._cur_tab_container).to({x: toX }, 200).call(this.handleComplete);
        }

    } else if (evt.type == "rollover") {
        this._btnPrev.gotoAndStop(this._frame_prev_2);
    } else if (evt.type == "rollout") {
        this._btnPrev.gotoAndStop(this._frame_prev_1);
    }
};

p.handleTabBuildingEvent = function (evt) {
    if (evt.type == "click") {
        this._showTap("building");
    } else if (evt.type == "rollover") {
        this._tap_building.scaleX = 1.1;
        this._tap_building.scaleY = 1.1;
    } else if (evt.type == "rollout") {
        this._tap_building.scaleX = 1.0;
        this._tap_building.scaleY = 1.0;
    }
};

p.handleTabDecorationEvent = function (evt) {
    if (evt.type == "click") {
        this._showTap("decoration");
    } else if (evt.type == "rollover") {
        this._tap_decoration.scaleX = 1.1;
        this._tap_decoration.scaleY = 1.1;
    } else if (evt.type == "rollout") {
        this._tap_decoration.scaleX = 1.0;
        this._tap_decoration.scaleY = 1.0;
    }
};

p.handleComplete = function () {
    //Tween complete
};

//======================================= Override==========================
//======================================= Constructor==========================
DialogShop.prototype.Container_initialize = p.initialize;
DialogShop.prototype.initialize = function () {
    this.Container_initialize();
    this.loadData();
    this.x = stageWidth / 2;
    this.y = stageHeight / 2;
};