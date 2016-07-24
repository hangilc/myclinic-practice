"use strict";

var $ = require("jquery");

$.fn.broadcast = function(key, arg1){
	var args = [].slice.call(arguments, 1);
	this.each(function(){
		var e = $(this);
		e.find("." + key).each(function(){
			var listener = $(this);
			var cb = listener.data(key);
			cb.apply(listener, args);
		});
	});
};

$.fn.listen = function(key, cb){
	this.each(function(){
		var e = $(this);
		e.addClass(key);
		e.data(key, cb);
	});
};