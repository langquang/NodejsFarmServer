/**
 * Created by CPU001 on 10/5/2014.
 */

var HarvestBar = function (isHarvest) {
    this.initialize(isHarvest);
};

var p = HarvestBar.prototype = new createjs.Container();
//============================== propertys
p._background = null;
p._background_2 = null;
p._runner = null;
p._mask = null;
p._tween_data = {value: 0};
p._txtDes = null;
p._isHarvest = null;

//============================== function
p.show = function (entity, x, y) {
    gMapIconContainer.addChild(this);
    this.x = x - 50;
    this.y = y - 70;
    var runner = this._runner;
    var tween_data = this._tween_data;
    var _this = this;

    tween_data.value = 0;
    createjs.Tween.get(this._tween_data, {onChange: handleOnchange}).to({value: 100}, 1000).call(handleComplete);

    function handleComplete() {
        //Tween complete
        gMapIconContainer.removeChild(_this);
        // +gold +exp
        var _pos = gMapIconContainer.localToGlobal(x, y);
        if( _this._isHarvest )    // harver my building
        {
           new FallIcon(RESOURCE_TYPE_GOLD, _pos.x,_pos.y, 0, gCurUserId, entity);
           new FallIcon(RESOURCE_TYPE_EXP, _pos.x,_pos.y, 1, gCurUserId, entity);
            entity.harvest();
            sendHarvest(entity.entityId);

        }
        else    // friend boots
        {
            new FallIcon(RESOURCE_TYPE_GOLD, _pos.x,_pos.y, 0, gCurUserId, entity);
            entity.harvest();
            gMainBar.boots(gCurUserId, gfriendList[gCurUserId]);
            sendBoots(gCurUserId);

        }

    }

    function handleOnchange() {
        var g = runner.graphics;
        g.clear();
        g.beginFill("#4DB8DB");
        g.drawRect(1, 1, 98 * tween_data.value / 100, 16);
        g.endFill();
    }

};


//======================================= Override==========================
//======================================= Constructor==========================
HarvestBar.prototype.Container_initialize = p.initialize;
HarvestBar.prototype.initialize = function (isHarvest) {
    this.Container_initialize();
    this._isHarvest = isHarvest;

    var g = new createjs.Graphics();
    g.beginFill("#FFF").drawRect(0, 0, 100, 18).endFill();
    this._background = new createjs.Shape(g);
    this._background.alpha = 0.7;
    this.addChild(this._background);

    g = new createjs.Graphics();
    g.beginFill("#002966").drawRect(1, 1, 98, 16).endFill();
    this._background_2 = new createjs.Shape(g);
    this._background_2.alpha = 0.7;
    this.addChild(this._background_2);

    g = new createjs.Graphics();
    g.beginFill("#4DB8DB").drawRect(1, 1, 98, 16).endFill();
    this._runner = new createjs.Shape(g);
    this._runner.alpha = 0.7;
    this.addChild(this._runner);

    this._txtDes = new createjs.Text(gTextData["text6"], "bold 12px Arial", "#FFF");
    this._txtDes.textAlign = "center";
    this._txtDes.x = 50;
    this._txtDes.y = 5;
    this.addChild(this._txtDes);
};
