"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./drug.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(index, drug){
	drug = mUtil.assign({}, drug);
	var e = $("<div></div>");
	var html = tmpl.render({
		index: index,
		label: mUtil.drugRep(drug)
	});
	e = $(html);
	e.listen("rx-drug-deleted", function(drugId){
		if( drugId === drug.drug_id ){
			e.remove();
		}
	});
	e.listen("rx-drug-modified-days", function(drugId, days){
		if( drugId !== drug.drug_id ){
			return;
		}
		drug.d_days = days;
		e.find("> [mc-name=disp] [mc-name=label]").text(mUtil.drugRep(drug));
	})
	return e;
}




