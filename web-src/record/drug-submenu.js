"use strict";

var $ = require("jquery");
var tmplHtml = require("raw!./drug-submenu.html");

exports.setup = function(dom){
	dom.data("visible", false);
	bindCancel(dom);
};

exports.isVisible = function(dom){
	return dom.data("visible");
};

exports.show = function(dom){
	dom.data("visible", true);
	dom.html(tmplHtml);
};

exports.hide = function(dom){
	dom.data("visible", false);
	dom.html("");
};

function bindCancel(dom){
	dom.on("click", "[mc-name=cancel]", function(event){
		event.preventDefault();
		dom.trigger("cancel-submenu");
	});
}