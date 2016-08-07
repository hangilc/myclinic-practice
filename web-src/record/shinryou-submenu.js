"use strict";

var $ = require("jquery");
var tmplSrc = require("raw!./shinryou-submenu.html");

exports.setup = function(dom, visitId, at){
	dom.html(tmplSrc);
	bindAddForm(dom, visitId);
};

function bindAddForm(dom, visitId){
	dom.on("click", "> [mc-name=search]", function(event){
		var ok = dom.inquire("fn-confirm-edit", visitId, 
			"（暫定）診察中の項目ではありませんが、診療行為を追加しますか？");
		if( !ok ){
			return;
		}
		dom.trigger("submenu-add-form");
	});
}