"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./text.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(text){
	var content = text.content.replace(/\n/g, "<br />\n");
	return tmpl.render({content: content});
}

