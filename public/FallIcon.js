/**
 * Created by CPU001 on 11/9/2014.
 */

var RESOURCE_TYPE_GOLD = "gold";
var RESOURCE_TYPE_EXP = "exp";

var FallIcon = function (res_type, x, y, index, userId, building) {
    this.initialize(res_type, x, y, index, userId, building);
};

//============================== propertys
p._sprite = null;
p._res_type = null;
p._res_type = null;
p._y_top = null;
p._y_bottom = null;
p._x = null;
p._userId = null;
p._building = null;
//============================== function


//======================================= Override==========================
//======================================= Constructor==========================
FallIcon.prototype.initialize = function (res_type, x, y, index, userId, building) {
    this._res_type = res_type;
    this._userId = userId;
    this._building = building;
    this._sprite = new createjs.Sprite(gMap_Icons);
    if (this._res_type == RESOURCE_TYPE_GOLD) {
        this._sprite.gotoAndStop(1);
    }
    else {
        this._sprite.gotoAndStop(0);
    }

    var isoP = stageToScreen(x, y);
    x = isoP.e(1);
    y = isoP.e(2);

    this._sprite.x = x;
    this._sprite.y = y;
    gIsoFallIconContainer.addChild(this._sprite);

    this._x = index % 2 == 0 ? x - (Math.floor(index / 2) * 20) - 60 : x + (Math.floor(index / 2) * 20) + 60;
    this._y_top = y - 110 - 10 * index;
    this._y_bottom = y;
    var _this = this;

    createjs.Tween.get(this._sprite).to({x: this._x}, 500, createjs.Ease.none);
    createjs.Tween.get(this._sprite).to({y: this._y_top}, 400, createjs.Ease.quadOut);
    createjs.Tween.get(this._sprite).wait(400).to({y: this._y_bottom}, 400, createjs.Ease.quadIn).call(handleComplete);

    function handleComplete() {
        _this._sprite.on("rollover", handleMouseOver);
        createjs.Tween.get(_this._sprite).wait(3000).call(handleMouseOver);
    }

    function handleMouseOver() {
        _this._sprite.off("rollover", this);
        var stageP = gIsoFallIconContainer.localToGlobal(_this._sprite.x, _this._sprite.y);
        _this._sprite.x = stageP.x;
        _this._sprite.y = stageP.y;
        gResourceContainer.addChild(_this._sprite);
        if (_this._res_type == RESOURCE_TYPE_GOLD) {
            createjs.Tween.get(_this._sprite).to({x: 260}, 700, createjs.Ease.sineOut).call(handleDisappear);
            createjs.Tween.get(_this._sprite).to({y: 0}, 700, createjs.Ease.sineIn);
        }
        else {
            createjs.Tween.get(_this._sprite).to({x: 680}, 700, createjs.Ease.sineOut).call(handleDisappear);
            createjs.Tween.get(_this._sprite).to({y: 0}, 700, createjs.Ease.sineIn);
        }

    }

    function handleDisappear() {
        gResourceContainer.removeChild(_this._sprite);
        if (_this._userId == gUserId && _this._res_type == RESOURCE_TYPE_GOLD)  // harvest my building
        {
            var gold = _this._building.getIncome();
            gHud.incGold(gold > 0 ? gold : 0);
        }
        else if (_this._userId == gUserId && _this._res_type == RESOURCE_TYPE_EXP) {
            gHud.incExp(1);
        }
        else if (_this._userId != gUserId && _this._res_type == RESOURCE_TYPE_GOLD) {
            gHud.incGold(10);

        }
    }
};
