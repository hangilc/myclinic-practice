"use strict";

var $ = require("jquery");
var tmplHtml = require("raw!./text-menu.html");
var TextForm = require("./text-form");
var Text = require("./text");

exports.setup = function(dom, visitId){
	dom.html(tmplHtml);
	bindEnter(dom, visitId);
};

var enterLinkSelector = "> [mc-name=disp] [mc-name=addTextLink]";

function getDispDom(dom){
	return dom.find("> [mc-name=disp]");
}

function getWorkspaceDom(dom){
	return dom.find("> [mc-name=workspace]");
}

function bindEnter(dom, visitId){
	dom.on("click", enterLinkSelector, function(event){
		event.preventDefault();
		var editor = TextForm.create({content: "", visit_id: visitId});
		bindEditor(dom, editor, visitId);
		var disp = getDispDom(dom);
		var work = getWorkspaceDom(dom);
		disp.hide();
		work.html("").append(editor);
	});
}

function bindEditor(dom, editor, visitId){
	editor.on("text-entered", function(event, text){
		event.stopPropagation();
		var disp = getDispDom(dom);
		var work = getWorkspaceDom(dom);
		dom.trigger("text-batch-entered", [visitId, [text]]);
		work.html("");
		disp.show();
	});
	editor.on("cancel-edit", function(event){
		event.stopPropagation();
		var disp = getDispDom(dom);
		var work = getWorkspaceDom(dom);
		work.html("");
		disp.show();
	})
}