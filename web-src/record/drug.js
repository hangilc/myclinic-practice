"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./drug.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(index, drug){
	var e = $("<div></div>");
	var html = tmpl.render({
		index: index,
		label: mUtil.drugRep(drug)
	});
	e = $(html);
	e.listen("rx-drug-deleted", function(drugId){
		console.log("rx-drug-deleted", drugId);
		if( drugId === drug.drug_id ){
			e.remove();
		}
	})
	return e;
}




