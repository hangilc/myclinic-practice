"use strict";

var $ = require("jquery");

$.fn.broadcast = function(key, args){
	if( args === undefined ){
		args = [];
	}
	return this.map(function(){
		var e = $(this);
		return e.find("." + key).map(function(){
			var listener = $(this);
			var cb = listener.data(key);
			if( typeof cb === "function" ){
				return cb.apply(listener, args);
			} else {
				throw new Exception("cannot find function while broadcasting: " + key);
			}
		}).get();
	}).get();
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