"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var TextDisp = require("./text-disp");
var TextForm = require("./text-form");
var tmplSrc = require("raw!./text.html");

exports.create = function(text){
	var dom = $(tmplSrc);
	TextDisp.setup(getDispDom(dom), text);
	bindContentClick(dom, text);
	return dom;
};

function getDispDom(dom){
	return dom.find("> [mc-name=disp]");
}

function getFormDom(dom){
	return dom.find("> [mc-name=form]");
}

function bindContentClick(dom, text){
	dom.on("content-click", function(event){
		event.stopPropagation();
		var editor = TextForm.create(text);
		getDispDom(dom).hide();
		getFormDom(dom).html("").append(editor);
		bindEditor(dom, editor);
	})
}

function bindEditor(dom, editor){
	editor.on("text-updated", function(event, text){
		event.stopPropagation();
		var disp = getDispDom(dom);
		var form = getFormDom(dom);
		TextDisp.setup(disp, text);
		form.html("");
		disp.show();
	});
	editor.on("cancel-edit", function(event){
		event.stopPropagation();
		var disp = getDispDom(dom);
		var form = getFormDom(dom);
		form.html("");
		disp.show();
	});
	editor.on("text-deleted", function(event){
		event.stopPropagation();
		dom.remove();
	});
}

