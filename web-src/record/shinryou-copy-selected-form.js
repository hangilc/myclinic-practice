"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./shinryou-copy-selected-form.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(shinryouList){
	var dom = $(tmpl.render({list: shinryouList}));
	bindSelectAll(dom);
	bindDeselectAll(dom);
	bindEnter(dom);
	bindCancel(dom);
	return dom;
};

var inputSelector = "> form[mc-name=search-result] input[name=shinryou_id]";
var selectAllSelector = "> div[mc-name=selector-box] [mc-name=selectAll]";
var deselectAllSelector = "> div[mc-name=selector-box] [mc-name=deselectAll]";
var enterSelector = "> form[mc-name=command-form] [mc-name=enter]";
var cancelSelector = "> form[mc-name=command-form] [mc-name=cancel]";

function bindSelectAll(dom){
	dom.on("click", selectAllSelector, function(event){
		event.preventDefault();
		dom.find(inputSelector).prop("checked", true);
	})
}

function bindDeselectAll(dom){
	dom.on("click", deselectAllSelector, function(event){
		event.preventDefault();
		dom.find(inputSelector).prop("checked", false);
	})
}

function bindEnter(dom){
	dom.on("click", enterSelector, function(event){
		var shinryouIds = dom.find(inputSelector).filter(function(){
			return $(this).is(":checked");
		}).map(function(){
			return +$(this).val();
		}).get();
		dom.trigger("enter", [shinryouIds]);
	});
}

function bindCancel(dom){
	dom.on("click", cancelSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("cancel");
	});
}
