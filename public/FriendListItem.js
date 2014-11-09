/**
 * Created by CPU001 on 9/25/2014.
 */

var FriendListItem = function () {
    this.initialize();
};

var p = FriendListItem.prototype = new createjs.Container();
//============================== propertys
p._background = null;
p._txtPrice = null;
p._txtEnegry = null;
p._txtName = null;
p._icon = null;
p._iconExp = null;
p._iconEnergy = null;
p._friend_data = null;
p.loader = null;
p._scale_rate = 1;
p._frame_1 = 0;
p._frame_2 = 0;

//======================================= Function ===========================
p.setFriendInfo = function (friend_data, anim_data, frame_1, frame_2) {
    this._friend_data = friend_data;
    this._frame_1 = frame_1;
    this._frame_2 = frame_2;
    var ss = new createjs.SpriteSheet(anim_data);
    // background
    this._background = new createjs.Sprite(ss);
    this._background.gotoAndStop(this._frame_1);
    this.addChild(this._background);
    // txtName
    this._txtName = new createjs.Text( this._friend_data.name, "bold 12px Arial", "#000");
    this._txtName.textAlign = "center";
    this._txtName.x = 0;
    this._txtName.y = -45;
    this.addChild(this._txtName);

    // iconExp
    this._iconExp = new createjs.Sprite(ss);
    this._iconExp.x = 15;
    this._iconExp.y = 30;
    this._iconExp.scaleX = 0.7;
    this._iconExp.scaleY = 0.7;
    this._iconExp.gotoAndStop(12);
    this.addChild(this._iconExp);
    // txtName
    this._txtPrice = new createjs.Text( this._friend_data.level, "bold 14px Arial", "#0066FF");
    this._txtPrice.x = 8;
    this._txtPrice.y = 25;
    this.addChild(this._txtPrice);

    // iconEnegry
    this._iconEnergy = new createjs.Sprite(ss);
    this._iconEnergy.x = -40;
    this._iconEnergy.y = 17;
    this._iconEnergy.gotoAndStop(26);
    this.addChild(this._iconEnergy);
    // txtName
    this._txtEnegry = new createjs.Text( this._friend_data.enegry, "bold 14px Arial", "#CCCC00");
    this._txtEnegry.x = -20;
    this._txtEnegry.y = 25;
    this.addChild(this._txtEnegry);

    if( this._friend_data.enegry <= 0 ){
        this._iconEnergy.visible = false;
        this._txtEnegry.visible = false;
    }

    if( this._friend_data.name == gUserId ){
        this._iconEnergy.visible = false;
        this._txtEnegry.visible = false;
    }

    this.on("click", this.handleEvent, this);
    this.on("rollover", this.handleEvent, this);
    this.on("rollout", this.handleEvent, this);
};

p.update = function(){
    if( this._friend_data.enegry <= 0 ){
        this._iconEnergy.visible = false;
        this._txtEnegry.visible = false;
    }

    if( this._friend_data.name == gUserId ){
        this._iconEnergy.visible = false;
        this._txtEnegry.visible = false;
    }

    this._txtEnegry.text = this._friend_data.enegry;
};


p.handleEvent = function (evt) {
    if (evt.type == "click") {
        this._background.gotoAndStop(this._frame_1);
        sendVisit(this._friend_data.name);
    } else if (evt.type == "rollover") {
        this._background.gotoAndStop(this._frame_2);
    } else if (evt.type == "rollout") {
        this._background.gotoAndStop(this._frame_1);
    }
};


//======================================= Override============================
//======================================= Constructor==========================
FriendListItem.prototype.Container_initialize = p.initialize;
FriendListItem.prototype.initialize = function () {
    this.Container_initialize();
};