"use strict";

var kanjidate = require("kanjidate");
var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./title.html");
var tmpl = hogan.compile(tmplSrc);

function RecordTitle(dom){
	this.dom = dom;
}

RecordTitle.prototype.render = function(){
	return this;
};

RecordTitle.prototype.update = function(at, visitId){
	var label = kanjidate.format("{G}{N:2}年{M:2}月{D:2}日（{W}） {h:2}時{m:2}分", at);
	var data = {
		label: label
	};
	var html = tmpl.render(data);
	this.dom.html(html);
}

module.exports = RecordTitle;