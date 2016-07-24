"use strict";

var $ = require("jquery");
var tmplHtml = require("raw!./text-menu.html");
var TextForm = require("./text-form");
var Text = require("./text");

exports.setup = function(dom, visitId){
	dom.html(tmplHtml);
	bindEnter(dom, visitId);
};

function bindEnter(dom, visitId){
	dom.on("click", "[mc-name=addTextLink]", function(event){
		event.preventDefault();
		var editor = TextForm.create({content: "", visit_id: visitId});
		bindEditor(dom, editor, visitId);
		dom.hide();
		dom.after(editor);
	});
}

function bindEditor(dom, editor, visitId){
	editor.on("text-entered", function(event, text){
		event.stopPropagation();
		var textDom = Text.create(text);
		editor.remove();
		dom.before(textDom);
		dom.show();
	});
	editor.on("cancel-edit", function(event){
		event.stopPropagation();
		editor.remove();
		dom.show();
	})
}