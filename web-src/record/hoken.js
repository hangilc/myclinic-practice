"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./hoken.html");
var tmpl = hogan.compile(tmplSrc);

function RecordHoken(dom){
	this.dom = dom;
}

RecordHoken.prototype.render = function(){
	return this;
};

RecordHoken.prototype.update = function(label){
	var html = tmpl.render({
		label: label
	});
	this.dom.html(html);
	return this;
};

module.exports = RecordHoken;

