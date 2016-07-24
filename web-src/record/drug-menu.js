"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");

var tmplHtml = require("raw!./drug-menu.html");

exports.setup = function(dom){
	dom.html(tmplHtml);
}

