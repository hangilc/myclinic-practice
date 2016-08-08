"use strict";

var $ = require("jquery");

$.fn.broadcast = function(key, args){
	console.log("enter broadcast", key);
	if( args === undefined ){
		args = [];
	}
	var retval = this.map(function(){
		var e = $(this);
		console.log("listeners", e.find("." + key).length);
		var iterReturn = e.find("." + key).map(function(){
			var listener = $(this);
			var cb = listener.data(key);
			if( typeof cb === "function" ){
				var listenReturn = cb.apply(listener, args);
				console.log("listen returns", listenReturn);
				listenReturn = 1;
				return listenReturn;
			} else {
				throw new Exception("cannot find function while broadcasting: " + key);
			}
		}).get();
		console.log("iter returns", iterReturn);
		return iterReturn;
	}).get();
	console.log("leave braodcast", key, retval);
	return retval;
};

$.fn.listen = function(key, cb){
	this.each(function(){
		var e = $(this);
		e.addClass(key);
		if( e.data(key) ){
			console.warn("There is already a listener.", e);
		}
		e.data(key, cb);
	});
	return this;
};