/**
 * Created by CPU001 on 10/4/2014.
 */


var EntityInfo = function () {
    this.initialize();
};

var p = EntityInfo.prototype = new createjs.Container();
//============================== propertys
p._background = null;
p._txtName = null;
p._txtName_stroke = null;
p._txtDes = null;
p._curBuilding = null;
//============================== function
p.show = function(visible, x, y)
{
    if( visible ){
        gMapIconContainer.addChild(this);
    }else{
        gMapIconContainer.removeChild(this);
        this._curBuilding = null;
    }
    this.x = x;
    this.y = y - 110;
};

p.setInfo= function(name, des, building){
    this._txtName.text = name;
    this._txtName_stroke.text = name;
    this._txtDes.text = des;
    this._curBuilding = building;
};

p.update = function(cur_seconds){

    if( this._curBuilding){
        var wait_seconds = this._curBuilding.last_harvest + this._curBuilding.shop_data.time - cur_seconds;
        if( wait_seconds > 0 )
        {
            this._txtDes.text = gTextData["text2"] + toHHMMSS(wait_seconds);
        }
        else{
            this._txtDes.text = gTextData["text1"];
        }
    }
};

//======================================= Override==========================
//======================================= Constructor==========================
EntityInfo.prototype.Container_initialize = p.initialize;
EntityInfo.prototype.initialize = function () {
    this.Container_initialize();

    var g = new createjs.Graphics();
    g.beginStroke("#FFF").beginFill("#0099FF").drawRect(0, 0, 200, 20);
    this._background = new createjs.Shape(g);
    this._background.x = -100;
    this._background.alpha = 0.7;
    this.addChild(this._background);

    this._txtName = new createjs.Text("Name", "bold 18px Arial", "#0066FF");
    this._txtName.textAlign = "center";
    this._txtName.x = 0;
    this._txtName.y = -18;
    this._txtName.outline = 4;
    this.addChild(this._txtName);

    this._txtName_stroke = this._txtName.clone();
    this._txtName_stroke.outline = false;
    this._txtName_stroke.color = "#fff";
    this.addChild(this._txtName_stroke);


    this._txtDes = new createjs.Text(gTextData["text1"], "bold 12px Arial", "#FFF");
    this._txtDes.textAlign = "center";
    this._txtDes.x = 0;
    this._txtDes.y = 5;
    this.addChild(this._txtDes);

    this.mouseEnabled = false;
    this.mouseChildren = false;

};