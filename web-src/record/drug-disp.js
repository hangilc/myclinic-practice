"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./drug-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");

exports.setup = function(dom, index, drug){
	var data = {
		index: index,
		label: mUtil.drugRep(drug)
	};
	dom.html(tmpl.render(data));
	dom.listen("rx-drug-modified", function(newDrug){
		if( drug.drug_id === newDrug.drug_id ){
			data.label = mUtil.drugRep(newDrug);
			dom.html(tmpl.render(data));
		}
	});
	dom.listen("rx-drug-modify-index", function(drugId, index){
		if( drug.drug_id === drugId ){
			data.index = index;
			dom.html(tmpl.render(data));
		}
	});
}
