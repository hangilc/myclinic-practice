"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./conduct-shinryou.html");
var tmpl = hogan.compile(tmplSrc);

function ConductShinryou(dom){
	this.dom = dom;
}

ConductShinryou.prototype.render = function(){
	return this;
};

ConductShinryou.prototype.update = function(data){
	var html = tmpl.render(data);
	this.dom.html(html);
	return this;
};

module.exports = ConductShinryou;

