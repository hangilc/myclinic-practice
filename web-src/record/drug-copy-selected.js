"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./drug-copy-selected.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");

exports.create = function(drugs){
	var dom = $("<div></div>");
	var data = {
		drugs: drugs.map(drugToData)
	};
	dom.html(tmpl.render(data));
	bindCancel(dom);
	return dom;
};

function drugToData(drug){
	return {
		drug_id: drug.drugId,
		label: mUtil.drugRep(drug)
	}
}

function bindCancel(dom){
	dom.on("click", "> .workarea-commandbox [mc-name=cancel]", function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("cancel-workarea");
	})
}