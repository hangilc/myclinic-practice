"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./conduct-menu.html");
var tmpl = hogan.compile(tmplSrc);

function ConductMenu(dom){
	this.dom = dom;
}

ConductMenu.prototype.render = function(){
	return this;
};

ConductMenu.prototype.update = function(){
	var html = tmpl.render({
	});
	this.dom.html(html);
	return this;
};

module.exports = ConductMenu;

