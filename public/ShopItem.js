/**
 * Created by CPU001 on 9/23/2014.
 */

var ShopItem = function () {
    this.initialize();
};

var p = ShopItem.prototype = new createjs.Container();
//============================== propertys
p._background = null;
p._txtPrice = null;
p._txtName = null;
p._icon = null;
p.shop_data = null;
p.loader = null;
p._scale_rate = 1;
p._filter_value = [new createjs.BlurFilter(2, 2, 2), new createjs.ColorMatrixFilter(new createjs.ColorMatrix(0, 0, -100, 0))];

//======================================= Function ===========================
p.setItem = function (item_data, anim_data) {
    this.shop_data = item_data;
    var ss = new createjs.SpriteSheet(anim_data);
    // background
    this._background = new createjs.Sprite(ss);
    this._background.gotoAndStop(1);
    this.addChild(this._background);
    // txtName
    this._txtName = new createjs.Text("Name", "bold 14px Arial", "#000");
    this._txtName.textAlign = "center";
    this._txtName.x = 70;
    this._txtName.y = 10;
    this.addChild(this._txtName);
    // txtName
    this._txtPrice = new createjs.Text("500", "bold 14px Arial", "#FFF");
    this._txtPrice.x = 55;
    this._txtPrice.y = 150;
    this.addChild(this._txtPrice);

    if (this.shop_data != null) {
        this._txtName.text = this.shop_data.name;
        this._txtPrice.text = this.shop_data.price;
    }

    this.loadData(this.shop_data.texture);
};


p.update = function () {
    if (gHud.getGold() > this.shop_data.price) {
        this._txtPrice.color = "#FFF";
    } else {
        this._txtPrice.color = "#F00";
    }
};

p.loadData = function (texture) {
    var manifest = [
        {src: "assets/" + texture + ".json", id: this.shop_data.name}
    ];

    // loader is global
    this.loader = new createjs.LoadQueue();
    this.loader.on("complete", this.loadDataCompleted, this);
    this.loader.loadManifest(manifest);
};

p.loadDataCompleted = function (evt) {
    var animation_data = this.loader.getResult(this.shop_data.name).anim;
    var ss = new createjs.SpriteSheet(animation_data);
    this._icon = new createjs.Sprite(ss);

    if( this.shop_data.texture == "tokyo_tower" )
    {
        this._scale_rate = 0.3;
        this._icon.scaleX = this._scale_rate;
        this._icon.scaleY = this._scale_rate;
    }
    else if( this.shop_data.type == ENTITY_TYPE_BUILDING )
    {
        this._scale_rate = 100 / this._icon.getBounds().width;
        this._icon.scaleX = this._scale_rate;
        this._icon.scaleY = this._scale_rate;
    }

    this._icon.x = 76;
    this._icon.y = 100;
    this._icon.gotoAndStop(ss.getNumFrames() - 1);
    this.addChild(this._icon);

    this.on("click", this.handleEvt, this);
    this.on("rollover", this.handleEvt, this);
    this.on("rollout", this.handleEvt, this);
};

p.handleEvt = function (evt) {

    if (evt.type == "click") {

        if( gHud.getGold() >= this.shop_data.price ){
            // hide ibshop
            showIBShop(false);
            // create cursor
            var entity = gIsoState.createIsoEntity(this.shop_data, 10, 10);
            entity.startFrame = this._icon.currentFrame;
            gCursor.attachIsoEntity(entity);
            gCursor.setState(CURSOR_BUY);
        }else{
            this.error(gTextData["text3"]);
        }
    }
    else if (evt.type == "rollover") {
        this._icon.scaleX = this._scale_rate * 1.05;
        this._icon.scaleY = this._scale_rate * 1.05;
    }
    else if (evt.type == "rollout") {
        this._icon.scaleX = this._scale_rate;
        this._icon.scaleY = this._scale_rate;
    }
};

p.error = function(text) {

    var stageP = this.localToGlobal(50,50);
    var uiP = gUIContainer.globalToLocal(stageP.x, stageP.y);

    var label = new createjs.Text(text, "bold 12px Arial", "#F00");
    label.textAlign = "center";
    label.x = uiP.x;
    label.y = uiP.y;
    gUIContainer.addChild(label);

    createjs.Tween.get(label).to({y: uiP.y - 100}, 1000).call(handleComplete);
    function handleComplete() {
        gUIContainer.removeChild(label);
    }
};


//======================================= Override============================
//======================================= Constructor==========================
ShopItem.prototype.Container_initialize = p.initialize;
ShopItem.prototype.initialize = function () {
    this.Container_initialize();
};