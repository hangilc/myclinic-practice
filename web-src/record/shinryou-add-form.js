"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./shinryou-add-form.html");

exports.create = function(){
	var dom = $(tmplSrc);
	return dom;
}