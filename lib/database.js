'use strict';

var couchbase = require('couchbase');
var cluster  = new couchbase.Cluster('couchbase://192.168.1.30');

// Connect to our Couchbase server
module.exports.mainBucket = cluster.openBucket('session');