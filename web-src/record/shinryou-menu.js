"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");

var tmplHtml = require("raw!./shinryou-menu.html");

exports.setup = function(dom){
	dom.html(tmplHtml);
}

