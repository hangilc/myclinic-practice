"use strict";

var queue = [];

function run(){
	if( queue.length < 1 ){
		return;
	}
	var task = queue[0];
	var f = task[0], cb = task[1];
	f(function(){
		var args = [].slice.call(arguments);
		cb.apply(null, args);
		queue.shift();
		run();
	})	
}

exports.enqueue = function(f, cb){
	queue.push([f, cb]);
	if( queue.length === 1 ){
		run();
	}
};

