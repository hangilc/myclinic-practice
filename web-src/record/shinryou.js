"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./shinryou.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(shinryou){
	var e = $("<div></div>");
	var html = tmpl.render({
		label: shinryou.name
	});
	e.html(html);
	return e;
};


