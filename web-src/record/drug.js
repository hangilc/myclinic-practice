"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./drug.html");
var tmpl = hogan.compile(tmplSrc);

function RecordDrug(dom){
	this.dom = dom;
}

RecordDrug.prototype.render = function(){
	return this;
};

RecordDrug.prototype.update = function(index, label){
	var html = tmpl.render({
		index: index,
		label: label
	});
	this.dom.html(html);
	return this;
};

module.exports = RecordDrug;

