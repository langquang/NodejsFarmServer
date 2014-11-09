/**
 * Created by CPU001 on 9/28/2014.
 */

var Hub = function () {
    this.initialize();
};

var p = Hub.prototype = new createjs.Container();
//============================== propertys
p._init = false;
p._gold_bg = null;
p._gold_text = null;
p._gold_number = 0;

p._energy_bg = null;
p._energy_text = null;
p._energy_runer = null;
p._energy_icon = null;
p._energy_number = 0;
p._energy_number_max = 30;
p._energy_mask = null;

p._exp_bg = null;
p._exp_text = null;
p._exp_level = null;
p._exp_runer = null;
p._exp_icon = null;
p._exp_number = 0;
p._exp_total = 0;
p._exp_number_max = 10;
p._exp_level_number = 0;
p._exp_mask = null;

p._frame_gold = 19;
p._frame_bar_border = 20;
p._frame_runer = 21;
p._frame_energy_icon = 30;
p._frame_exp_icon = 29;

p._countdown = null;
p._lastEnergy = 0;
//======================================= Function ===========================

p.loadData = function () {
    var manifest = [
        {src: "assets/gui_hud.json", id: "gui_hud"},
        {src: "assets/gui_hud.png", id: "gui_hud_texture"}
    ];

    // loader is global
    this.loader = new createjs.LoadQueue();
    this.loader.on("complete", this.loadDataCompleted, this);
    this.loader.loadManifest(manifest);
};

p.loadDataCompleted = function (evt) {
    this.map_data = this.loader.getResult("gui_hud");
    var animation_data = this.map_data.anim;
    var ss = new createjs.SpriteSheet(animation_data);
    // gold
    this._gold_bg = new createjs.Sprite(ss);
    this._gold_bg.gotoAndStop(this._frame_gold);
    this._gold_bg.x = -250;
    this.addChild(this._gold_bg);

    this._gold_text = new createjs.Text("1000", "bold 14px Arial", "#222");
    this._gold_text.x = this._gold_bg.x + 30;
    this._gold_text.y = this._gold_bg.y - 5;
    this.addChild(this._gold_text);
    // enegry
    this._energy_bg = new createjs.Sprite(ss);
    this._energy_bg.gotoAndStop(this._frame_bar_border);
    this._energy_bg.x = -50;
    this.addChild(this._energy_bg);

    this._energy_runer = new createjs.Sprite(ss);
    this._energy_runer.gotoAndStop(this._frame_runer);
    this._energy_runer.x = this._energy_bg.x;
    this.addChild(this._energy_runer);

    var g = new createjs.Graphics();
    this._energy_mask = new createjs.Shape(g);
    this._energy_mask.x = this._energy_bg.x - 5;
    this._energy_mask.y = -12;
//    this.addChild(this._energy_mask);
    this._energy_runer.mask = this._energy_mask;

    this._energy_icon = new createjs.Sprite(ss);
    this._energy_icon.gotoAndStop(this._frame_energy_icon);
    this._energy_icon.x = this._energy_bg.x;
    this.addChild(this._energy_icon);

    this._energy_text = new createjs.Text("1000", "bold 14px Arial", "#FFF");
    this._energy_text.x = this._energy_bg.x + 50;
    this._energy_text.y = this._energy_bg.y - 7;
    this.addChild(this._energy_text);
    // exp
    this._exp_bg = new createjs.Sprite(ss);
    this._exp_bg.gotoAndStop(this._frame_bar_border);
    this._exp_bg.x = 170;
    this.addChild(this._exp_bg);

    this._exp_runer = new createjs.Sprite(ss);
    this._exp_runer.gotoAndStop(this._frame_runer);
    this._exp_runer.x = this._exp_bg.x;
    this.addChild(this._exp_runer);

    g = new createjs.Graphics();
    this._exp_mask = new createjs.Shape(g);
    this._exp_mask.x = this._exp_bg.x - 5;
    this._exp_mask.y = -12;
//    this.addChild(this._exp_mask);
    this._exp_runer.mask = this._exp_mask;

    this._exp_icon = new createjs.Sprite(ss);
    this._exp_icon.gotoAndStop(this._frame_exp_icon);
    this._exp_icon.x = this._exp_bg.x;
    this.addChild(this._exp_icon);

    this._exp_text = new createjs.Text("1000", "bold 14px Arial", "#FFF");
    this._exp_text.x = this._exp_bg.x + 30;
    this._exp_text.y = this._exp_bg.y - 7;
    this.addChild(this._exp_text);

    this._exp_level_ = new createjs.Text("99", "bold 14px Arial", "#000");
    this._exp_level_.x = this._exp_bg.x - 8;
    this._exp_level_.y = this._exp_bg.y - 5;
    this.addChild(this._exp_level_);
    this._init = true;

    this.update();
};

p.update = function () {

    if( this._init == false ){
        return;
    }

    this._gold_text.text = this._gold_number;
    this._exp_text.text = this._exp_number;
    this._energy_text.text = this._energy_number;
    this._exp_level_.text = this._exp_level_number;

    var g = this._energy_mask.graphics;
    g.clear();
    g.beginFill("#F00");
    g.drawRect(0, 0, this._energy_runer.getBounds().width * this._energy_number / this._energy_number_max, this._energy_runer.getBounds().height);
    g.endFill();

    g = this._exp_mask.graphics;
    g.clear();
    g.beginFill("#F00");
    g.drawRect(0, 0, this._exp_runer.getBounds().width * this._exp_number / this._exp_number_max, this._exp_runer.getBounds().height);
    g.endFill();

};

p.setInfo = function (gold, exp, energy, lastEnergy) {
    this._gold_number = gold;
    this._energy_number = energy;
    this._exp_total = exp;
    this._exp_level_number = Math.floor(this._exp_total / 10);
    this._exp_number = this._exp_total % 10;
    this._lastEnergy = lastEnergy;
    this.update();
};

p.getGold = function () {
    return this._gold_number;
};

p.incGold = function (value) {
    this._gold_number += value;
    if (this._gold_number < 0) {
        this._gold_number = 0;
    }
    this.update();
};

p.decGold = function (value) {
    this._gold_number -= value;
    if (this._gold_number < 0) {
        this._gold_number = 0;
    }
    this.update();
};

p.incEnegry = function (value) {
    this._energy_number += value;
    if (this._energy_number < 0) {
        this._energy_number = 0;
    }
    this.update();
};

p.decEnegry = function (value) {
    if( this._energy_number == 30 ){
        this._lastEnergy = getSeconds();
    }
    this._energy_number -= value;
    if (this._energy_number < 0) {
        this._energy_number = 0;
    }
    this.update();
};

p.getEnegry = function () {
    return this._energy_number;
};


p.incExp = function (value) {
    this._exp_total += value;
    if (this._exp_total < 0) {
        this._exp_total = 0;
    }
    this._exp_level_number = Math.floor(this._exp_total / 10);
    this._exp_number = this._exp_total % 10;
    this.update();
};

p.energycountdown = function(curseconds){
    if( this._energy_number < 30 )
    {
        var deltatime = curseconds - this._lastEnergy;
        var incEnergy = Math.floor(deltatime / 60);
        if( incEnergy > 0 ){
            this._energy_number += incEnergy;
            this._lastEnergy = curseconds - (deltatime % 60);
            this.update();
        }
        this._countdown.text = toHHMMSS(60 - deltatime % 60);
        this._countdown.visible = true;
    }
    else
    {
        this._countdown.visible = false;
    }

};


//======================================= Override============================
//======================================= Constructor==========================
Hub.prototype.Container_initialize = p.initialize;
Hub.prototype.initialize = function () {
    this.Container_initialize();
    this.loadData();
    this.x = stageWidth / 2;
    this.y = 20;

    this._countdown = new createjs.Text("1:00", "bold 12px Arial", "#fff");
    this._countdown.x = 0;
    this._countdown.y = 15;
    this.addChild(this._countdown);
};