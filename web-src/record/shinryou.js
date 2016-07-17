"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./shinryou.html");
var tmpl = hogan.compile(tmplSrc);

function RecordShinryou(dom){
	this.dom = dom;
}

RecordShinryou.prototype.render = function(){
	return this;
};

RecordShinryou.prototype.update = function(label){
	var html = tmpl.render({
		label: label
	});
	this.dom.html(html);
	return this;
};

module.exports = RecordShinryou;

