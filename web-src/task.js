"use strict";

var conti = require("conti");
var contiEnqueue = require("../conti-enqueue");
conti.enqueue = contiEnqueue.enqueue;

exports.run = function(fun, cb){
	var f;
	if( fun instanceof Array ){
		console.log(fun);
		f = function(done){
			conti.exec(fun, done);
		};
	} else {
		f = fun;
	}
	conti.enqueue(f, cb);
};