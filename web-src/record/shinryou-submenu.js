"use strict";

var $ = require("jquery");
var tmplSrc = require("raw!./shinryou-submenu.html");

exports.setup = function(dom){
	dom.html(tmplSrc);
};