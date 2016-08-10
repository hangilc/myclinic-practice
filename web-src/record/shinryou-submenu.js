"use strict";

var $ = require("jquery");
var tmplSrc = require("raw!./shinryou-submenu.html");

exports.setup = function(dom, visitId, at){
	dom.html(tmplSrc);
	bindAddForm(dom, visitId);
	bindCopyAll(dom, visitId);
	bindCopySelected(dom, visitId);
	bindDeleteSelected(dom, visitId);
	bindCancel(dom, visitId);
};

function bindAddForm(dom, visitId){
	dom.on("click", "> [mc-name=search]", function(event){
		var ok = dom.inquire("fn-confirm-edit", [visitId, 
			"（暫定）診察中の項目ではありませんが、診療行為を追加しますか？"]);
		if( !ok ){
			return;
		}
		dom.trigger("submenu-add-form");
	});
}

function bindCopyAll(dom, visitId){
	dom.on("click", "> [mc-name=copyAll]", function(event){
		dom.trigger("submenu-copy-all");
	});
}

function bindCopySelected(dom, visitId){
	dom.on("click", "> [mc-name=copySelected]", function(event){
		dom.trigger("submenu-copy-selected");
	});
}

function bindDeleteSelected(dom, visitId){
	dom.on("click", "> [mc-name=deleteSelected]", function(event){
		dom.trigger("submenu-delete-selected");
	});
}

function bindCancel(dom, visitId){
	dom.on("click", "> [mc-name=cancel]", function(event){
		dom.trigger("submenu-cancel");
	});
}