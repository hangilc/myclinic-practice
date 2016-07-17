"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./text.html");
var tmpl = hogan.compile(tmplSrc);

function RecordText(dom){
	this.dom = dom;
}

RecordText.prototype.render = function(){
	return this;
};

RecordText.prototype.update = function(content){
	content = content.replace(/\n/g, "<br />\n");
	this.dom.html(tmpl.render({content: content}));
	return this;
}

module.exports = RecordText;