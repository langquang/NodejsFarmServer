/**
 * Created by CPU001 on 10/3/2014.
 */

'use strict';

var parsedJSON = require('../asset/window_shop.json');
parsedJSON = parsedJSON.items;
// Connect to our Couchbase server
module.exports.shopConf = parsedJSON;