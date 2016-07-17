"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./shinryou-menu.html");
var tmpl = hogan.compile(tmplSrc);

function ShinryouMenu(dom){
	this.dom = dom;
}

ShinryouMenu.prototype.render = function(){
	return this;
};

ShinryouMenu.prototype.update = function(){
	var html = tmpl.render({
	});
	this.dom.html(html);
	return this;
};

module.exports = ShinryouMenu;

