"use strict";

var TextForm = require("./text-form");

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./text.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(text){
	var dom = $("<div></div>");
	update(dom, text);
	bindClick(dom);
	return dom;
};

function update(dom, text){
	var content = text.content.replace(/\n/g, "<br />\n");
	dom.html(tmpl.render({content: content}));
	dom.data("text", text);
}

function bindClick(dom){
	dom.on("click", "[mc-name=content]", function(){
		var editor = TextForm.create(dom.data("text"));
		bindEditor(dom, editor);
		dom.hide();
		dom.after(editor);
	});
}

function bindEditor(dom, editor){
	editor.on("text-updated", function(event, text){
		event.stopPropagation();
		update(dom, text);
		editor.remove();
		dom.show();
	});
	editor.on("cancel-edit", function(event){
		event.stopPropagation();
		editor.remove();
		dom.show();
	});
}

