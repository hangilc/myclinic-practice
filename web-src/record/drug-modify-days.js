"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./drug-modify-days.html");

exports.create = function(){
	var dom = $("<div></div>");
	dom.html(tmplSrc);
	bindCancel(dom);
	return dom;
};

function bindCancel(dom){
	dom.on("click", "> .workarea-commandbox [mc-name=cancel]", function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("cancel-workarea");
	})
}