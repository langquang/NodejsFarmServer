//this.createjs = this.createjs || {};

var CELL_SIZE = 24;

var dependency = {};
var visited = {};
var depth = 0;

function zorder(children) {

    if (children.length < 2) {
        return;
    }

    dependency = {};
    var i = 0;
    var max = children.length;
    for (i = 0; i < max; ++i) {
        var behind = [];
        var objA = children[i];
        var rightA = objA.cellX + objA.anchorX_2;
        var frontA = objA.cellY + objA.anchorY_2;

        for (var j = 0; j < max; ++j) {
            var objB = children[j];

            // See if B should go behind A
            // simplest possible check, interpenetrations also count as "behind", which does do a bit more work later, but the inner loop tradeoff for a faster check makes up for it
            if ((objB.cellX - objB.anchorX < rightA) &&
                (objB.cellY - objB.anchorY < frontA) &&
                (i !== j)) {
                behind.push(objB);
            }
        }
        dependency[objA.entityId] = behind;
    }

    visited = {};
    depth = 0;
    for (i = 0; i < children.length; i++) {
        if (true != visited[children[i].entityId])
            place(children[i]);
    }
    // Clear out temporary dictionary so we're not retaining memory between calls
    visited = {};
}

function place(obj) {
    visited[obj.entityId] = true;
    for (var i = 0; i < dependency[obj.entityId].length; i++) {
        var inner = dependency[obj.entityId][i];
        if (true != visited[inner.entityId])
            place(inner);
    }
    gIsoContainer.setChildIndex(obj, depth);
    //console.log(obj.entityId, depth);
    ++depth;
}

/**
 *
 * @param screenPt : Vector
 * @returns {Vector}
 */
function screenToIso(screenPt) {
    var y = screenPt.e(2) - screenPt.e(1) / 2;
    var x = screenPt.e(1) / 2 + screenPt.e(2);
    return $V([x, y, 0]);
}

/**
 *
 * @param isoPt : Vector
 * @returns {Vector}
 */
function isoToScreen(isoPt) {
    var y = (isoPt.e(1) + isoPt.e(2)) / 2;
    var x = isoPt.e(1) - isoPt.e(2);
    return $V([x, y, 0]);
}

/**
 *
 * @param stageX : Number
 * @param stageY : Number
 * @returns {Vector}
 */
function stageToScreen(stageX, stageY) {
    var sP = gIsoContainer.globalToLocal(stageX, stageY);
    return $V([sP.x, sP.y, 0]);
}

/**
 *
 * @param stageX : Number
 * @param stageY : Number
 * @returns {Vector}
 */
function stageToIso(stageX, stageY) {
    var sP = stageToScreen(stageX, stageY);
    return screenToIso(sP);
}

/**
 *
 * @param stageX : Number
 * @param stageY : Number
 * @returns {Vector}
 */
function stageToCell(stageX, stageY) {
    var isoP = stageToIso(stageX, stageY);
    return $V([getCell(isoP.e(1)), getCell(isoP.e(2)), 0]);
}

/**
 *
 * @param iso : Number isometric position
 * @returns {number} floor to Cell
 */
function getCell(iso) {
    return Math.floor(iso / CELL_SIZE);
}

/**
 *
 * @param iso : Number isometric position
 * @returns {number}: floor to Cell
 */
function snap(iso) {
    var cell = getCell(iso);
    return cell * CELL_SIZE;
}


function cellToScreen(cellX, cellY) {
    var isoP = $V([cellX * CELL_SIZE, cellY * CELL_SIZE, 0]);
    return isoToScreen(isoP);
}

function cellToStage(cellX, cellY){
    var screenP = cellToScreen(cellX, cellY);
    var sP = gIsoContainer.localToGlobal(screenP.e(1), screenP.e(2));
    return sP;
}

/**
 * check hitUI
 */
function isHitUI(stageX, stageY) {

    if (!gIsLogin) {
        return true;
    }

    if (gDarkLock.isShowing()) {
        return true;
    }

    var localP = gShop.globalToLocal(stageX, stageY);
    if (gShop._background != null && gUIContainer.contains(gShop) && gShop._background.hitTest(localP.x, localP.y)) {
        return true;
    }

    localP = gMainBar.globalToLocal(stageX, stageY);
    if (gMainBar._background != null && gMainBar._background.hitTest(localP.x, localP.y)) {
        return true;
    }


    return false;
}

function getSeconds() {
    return  Math.floor(new Date().getTime() / 1000) + gDeltaTime;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toHHMMSS(sec_num) {
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

function showTextError(text, game_x, game_y) {
    var label = new createjs.Text(text, "bold 12px Arial", "#F00");
    label.textAlign = "center";
    label.x = game_x;
    label.y = game_y;
    gMapIconContainer.addChild(label);

    createjs.Tween.get(label).to({y: game_y - 100}, 1000).call(handleComplete);
    function handleComplete() {
        gMapIconContainer.removeChild(label);
    }
}
