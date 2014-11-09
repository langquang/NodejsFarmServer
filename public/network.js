/**
 * Created by CPU001 on 10/4/2014.
 */
'use strict';
// socket
var socket = io.connect('192.168.1.20:3000');
//==================================== MSG ===============================
var _msg_login_ = "login";
var _msg_buy_ = "buy";
var _msg_harvest_ = "harvest";
var _msg_move_ = "move";
var _msg_delete_ = "delete";
var _msg_visit_ = "visit";
var _msg_boots_ = "boots";

var gfriendList;
//====================================== RECIVE ==================================================
socket.on(_msg_login_, function (res) {
//    console.log("Login response" + JSON.stringify(res));
    gLoginData = res;
    gfriendList = res.friend;
    var buildings = res.buildings;
    for (var key in buildings) {
        if (buildings.hasOwnProperty(key)) {
            var building_data = buildings[key];
            var shop_data = gItemConfig[building_data.shop_id];
            var building = gIsoState.createStableIsoEntity(shop_data, building_data.x, building_data.y, key);
            building.last_harvest = building_data.last_harvest;
            gIsoState.add(building);

        }
    }

    gHud.setInfo(res.game.gold, res.game.exp, res.game.energy, res.game.lastEnergy);

    gDeltaTime = res.time - Math.floor(new Date().getTime() / 1000);
    console.log("login success");
    onLoginComplete();
    gIsoState.centerOnCell(20,20);

    // =============================== export map editor ===============================
    var list = gIsoState.children;
    var json = [];
    list.forEach(function(element, index, array){
        var obj = {type : element.shop_data.id, x : element.cellX, y : element.cellY};
        json.push( obj );
    });
    console.log(JSON.stringify(json));

    //================================ end map editor ==================================

});

socket.on(_msg_buy_, function (res) {
    if (res.result == true) {
        var building = gIsoState.get(res.temptId);
        if (building != null) {
            console.log("buy success");
            building.entityId = res.entityId;
        }
    }
});

socket.on(_msg_move_, function (res) {
    if (res.result == true) {
        console.log("move success");
    }
});

socket.on(_msg_delete_, function (res) {
    if (res.result == true) {
        console.log("delete success");
    }
});

socket.on(_msg_harvest_, function (res) {
    if (res.result == true) {
        console.log("harvest success");
    }
});

socket.on(_msg_visit_, function (res) {
    if (res.result == true) {
        console.log("visit success");
        gIsoState.removeAll();
        var buildings = res.buildings;
        for (var key in buildings) {
            if (buildings.hasOwnProperty(key)) {
                var building_data = buildings[key];
                var shop_data = gItemConfig[building_data.shop_id];
                var building = gIsoState.createStableIsoEntity(shop_data, building_data.x, building_data.y, key);
                building.last_harvest = building_data.last_harvest;
                gIsoState.add(building);

            }
        }
        gCurUserId = res.userId;
        gMainBar.showHome(gCurUserId == gUserId);
        gMainBar.setUserName(gCurUserId);
        gDarkLock.show(false);
        gIsoState.centerOnCell(20,20);
    }
});


//====================================== send ==================================================
function sendLogin() {
    console.log("Connecting......");
    socket.emit(_msg_login_, {userId: gUserId});
}

function sendBuy(id, x, y, temptId) {
    socket.emit(_msg_buy_, {userId: gUserId, id: id, x: x, y: y, temptId: temptId});
}

function sendDelete(buildingId) {
    socket.emit(_msg_delete_, {userId: gUserId, buildingId: buildingId});
}

function sendMove(buildingId, x, y) {
    socket.emit(_msg_move_, {userId: gUserId, buildingId: buildingId, x: x, y: y});
}

function sendHarvest(buildingId) {
    socket.emit(_msg_harvest_, {userId: gUserId, buildingId: buildingId});
}

function sendVisit(friendId) {
    gDarkLock.show(true);
    socket.emit(_msg_visit_, {friendId: friendId});
}

function sendBoots(friendId) {
    socket.emit(_msg_boots_, {friendId: friendId});
}