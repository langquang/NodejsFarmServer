
var couchbase = require('couchbase');
var cluster  = new couchbase.Cluster('couchbase://192.168.1.30');
var bucket = cluster.openBucket('session');

//var couchbase = require('couchbase');
//var cluster = new couchbase.Cluster();
//var bucket = cluster.openBucket('default');
//
bucket.upsert('testdoc', {name:'Frank'}, function(err, result) {
    if (err) throw err;

    bucket.get('testdoc', function(err, result) {
        if (err) throw err;

        console.log(result.value);
        // {name: Frank}
    });
});