"use strict";

var store = {};

exports.set = function(key, value){
	store[key] = value;
};

exports.get = function(key){
	return store[key];
};