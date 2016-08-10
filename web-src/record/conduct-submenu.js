"use strict";

var $ = require("jquery");
var tmplSrc = require("raw!./conduct-submenu.html");

exports.create = function(){
	var dom = $(tmplSrc);
	bindAddXp(dom);
	bindAddInject(dom);
	bindCopyAll(dom);
	bindCancel(dom);
	return dom;
};

function bindAddXp(dom){
	dom.on("click", "> [mc-name=addXp]", function(event){
		event.preventDefault();
		dom.trigger("add-xp");
	});
}

function bindAddInject(dom){
	dom.on("click", "> [mc-name=addInject]", function(event){
		event.preventDefault();
		dom.trigger("add-inject");
	});
}

function bindCopyAll(dom){
	dom.on("click", "> [mc-name=copyAll]", function(event){
		event.preventDefault();
		dom.trigger("copy-all");
	});
}

function bindCancel(dom){
	dom.on("click", "> [mc-name=cancel]", function(event){
		event.preventDefault();
		dom.trigger("cancel");
	});
}