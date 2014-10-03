
//====================================== Couchbase ===============================
//var couchbase = require('couchbase');
//var cluster  = new couchbase.Cluster('couchbase://192.168.1.30');
//var bucket = cluster.openBucket('session');
//
////
//bucket.upsert('testdoc', {name:'Frank'}, function(err, result) {
//    if (err) throw err;
//
//    bucket.get('testdoc', function(err, result) {
//        if (err) throw err;
//
//        console.log(result.value);
//        // {name: Frank}
//    });
//});

//======================================== generate userid=============================
//var FlakeIdGen = require('flake-idgen')
//    , intformat = require('biguint-format')
//    , generator = new FlakeIdGen;
//var id1 = generator.next();
//var id3 = intformat(id1, 'dec');
//console.log(id3);

//======================================== Get seconds ===================================
//var helper = require("./lib/utils/helper");
//console.log(helper.getSeconds());
//process.exit(0);

//======================================== Load Json ===================================
//var parsedJSON = require('./asset/window_shop.json');
//console.log(parsedJSON);
//========================================= config =====================================
var shopConfig = require('./config/shopconf').shopConf;
console.log(shopConfig);