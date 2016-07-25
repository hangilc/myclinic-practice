"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplHtml = require("raw!./drug-form.html");

exports.create = function(){
	var dom = $(tmplHtml);
	return dom;
}