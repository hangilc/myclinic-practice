"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./shinryou-form.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(shinryou){
	var dom = $(tmpl.render({
		name: shinryou.name
	}));
	bindDelete(dom, shinryou.visit_id);
	bindCancel(dom);
	return dom;
}

var deleteSelector = "> form[mc-name=command-box] [mc-name=deleteLink]";
var cancelSelector = "> form[mc-name=command-box] [mc-name=cancelLink]";

function bindDelete(dom, visitId){
	dom.on("click", deleteSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		if( !dom.inquire("fn-confirm-edit", [visitId, "現在（暫定）診察中でありませんが、この診療行為を削除しますか？"]) ){
			return;
		}
		dom.trigger("delete");
	});
}

function bindCancel(dom){
	dom.on("click", cancelSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("cancel");
	});
}