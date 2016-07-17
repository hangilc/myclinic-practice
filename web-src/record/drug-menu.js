"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./drug-menu.html");
var tmpl = hogan.compile(tmplSrc);

function DrugMenu(dom){
	this.dom = dom;
}

DrugMenu.prototype.render = function(){
	return this;
};

DrugMenu.prototype.update = function(){
	var html = tmpl.render({
	});
	this.dom.html(html);
	return this;
};

module.exports = DrugMenu;

