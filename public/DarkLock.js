/**
 * Created by CPU001 on 9/29/2014.
 */

var DarkLock = function () {
    this.initialize();
};

var p = DarkLock.prototype = new createjs.Container();
//============================== propertys
p._shape = null;
p._isShow = false;
p._imgLoading = null;
p._bitmapLoading = null;

//======================================= Function ===========================
p.show = function (visible) {
    var _this = this;
    this._isShow = visible;
    if (visible) {
        gUIContainer.addChild(this);
        this.alpha = 0;
        createjs.Tween.get(this).to({alpha: 1}, 300);
    } else {
        createjs.Tween.get(this).to({alpha: 0}, 300).call(complete);
    }

    function complete() {
        gUIContainer.removeChild(_this);
    }
};

p.isShowing = function () {
    return this._isShow;
};


//======================================= Override============================
//======================================= Constructor==========================
DarkLock.prototype.Container_initialize = p.initialize;
DarkLock.prototype.initialize = function () {
    this.Container_initialize();

    var g = new createjs.Graphics();
    g.beginFill("#000");
    g.drawRect(0, 0, stageWidth, stageHeight);
    g.endFill();

    this._shape = new createjs.Shape(g);
    this._shape.alpha = 0.6;
    this.addChild(this._shape);

    this._imgLoading = new Image();
    this._imgLoading.onload = handleImageLoad;
    this._imgLoading.src = "assets/loading.png";
    var _this = this;

    function handleImageLoad() {
        _this._bitmapLoading = new createjs.Bitmap(this);
        _this._bitmapLoading.x = (stageWidth - this.width) / 2;
        _this._bitmapLoading.y = (stageHeight - this.height) / 2;
        _this.addChild(_this._bitmapLoading);
    }


};