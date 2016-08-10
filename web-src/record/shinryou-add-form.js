"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./shinryou-add-form.html");

exports.create = function(visitId, at){
	var dom = $(tmplSrc);
	bindCancel(dom);
	bindSearch(dom, at);
	return dom;
}

var searchTextInputSelector = "> form[mc-name=search-form] input[mc-name=text]";

function bindCancel(dom){
	dom.on("click", "> .workarea-commandbox [mc-name=close]", function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("cancel");
	});
}

function bindSearch(dom, at){
	dom.on("submit", "> form[mc-name=search-form]", function(event){
		event.preventDefault();
		event.stopPropagation();
		var text = dom.find(searchTextInputSelector).val().trim();
		
	});
}