"use strict";

var $ = require("jquery");

function makeToken(key){
	return "jquery-inquire-" + key;
}

$.fn.reply = function(key, fn){
	var e = this;
	var t = makeToken(key);
	e.addClass(t);
	e.data(t, fn);
	return this;
};

$.fn.inquire = function(key){
	var args = [].slice(arguments, 1);
	var t = makeToken(key);
	var fn = this.closest("." + t).data(t);
	return fn.apply(undefined, args);
};