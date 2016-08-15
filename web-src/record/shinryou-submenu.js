"use strict";

var $ = require("jquery");
var tmplSrc = require("raw!./shinryou-submenu.html");

exports.create = function(){
	var dom = $(tmplSrc);
	bindKensaForm(dom);
	bindAddForm(dom);
	bindCopyAll(dom);
	bindCopySelected(dom);
	bindDeleteSelected(dom);
	bindDeleteDuplicated(dom);
	bindCancel(dom);
	return dom;
};

function bindKensaForm(dom){
	dom.on("click", "> [mc-name=kensa]", function(event){
		dom.trigger("submenu-kensa-form");
	});
}

function bindAddForm(dom){
	dom.on("click", "> [mc-name=search]", function(event){
		dom.trigger("submenu-add-form");
	});
}

function bindCopyAll(dom){
	dom.on("click", "> [mc-name=copyAll]", function(event){
		dom.trigger("submenu-copy-all");
	});
}

function bindCopySelected(dom){
	dom.on("click", "> [mc-name=copySelected]", function(event){
		dom.trigger("submenu-copy-selected");
	});
}

function bindDeleteSelected(dom){
	dom.on("click", "> [mc-name=deleteSelected]", function(event){
		dom.trigger("submenu-delete-selected");
	});
}

function bindDeleteDuplicated(dom){
	dom.on("click", "> [mc-name=deleteDuplicated]", function(event){
		dom.trigger("submenu-delete-duplicated");
	});
}

function bindCancel(dom){
	dom.on("click", "> [mc-name=cancel]", function(event){
		dom.trigger("submenu-cancel");
	});
}