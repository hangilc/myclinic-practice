"use strict";

var conti = require("conti");
var contiEnqueue = require("../conti-enqueue");
conti.enqueue = contiEnqueue.enqueue;

exports.run = function(fun, cb){
	conti.enqueue(fun, cb);
};