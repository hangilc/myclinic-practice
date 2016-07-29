"use strict";

var $ = require("jquery");

$.fn.broadcast = function(key, arg1){
	var args = [].slice.call(arguments, 1);
	this.each(function(){
		var e = $(this);
		e.find("." + key).each(function(){
			var listener = $(this);
			var cb = listener.data(key);
			if( typeof cb === "function" ){
				cb.apply(listener, args);
			}
		});
	});
	return this;
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