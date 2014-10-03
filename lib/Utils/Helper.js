
'use strict';

var Helper = function (){

};

var p = Helper.prototype;
//================================ Property =============================

//================================ function =============================
p.getSeconds = function(){
    return  new Date().getTime() / 1000;
};

//================================ Static =============================
Helper.getSeconds = function(){
    return  Math.floor(new Date().getTime() / 1000);
};

module.exports = Helper;
