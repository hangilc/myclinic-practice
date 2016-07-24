"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");

var tmplHtml = require("raw!./conduct-menu.html");

exports.setup = function(dom){
	dom.html(tmplHtml);
}

