"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./text-disp.html");
var tmpl = hogan.compile(tmplSrc);

exports.setup = function(dom, text){
	var content = text.content.replace(/\n/g, "<br />\n");
	if( content === "" ){
		content = "（空白）"
	}
	var data = {
		content: content
	};
	dom.html(tmpl.render(data));
	bindClick(dom);
};

function bindClick(dom){
	dom.on("click", function(event){
		event.stopPropagation();
		dom.trigger("content-click");
	})
}
