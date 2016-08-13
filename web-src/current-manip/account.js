"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./account.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(meisai){
	var data = {

	};
	var dom = $(tmpl.render(data));
	return dom;
};