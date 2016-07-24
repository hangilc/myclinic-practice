"use strict";

var $ = require("jquery");
var mUtil = require("../../myclinic-util");

exports.setup = function(dom, drugs){
	dom.html("");
	drugs.forEach(function(drug){
		var e = $("<div></div>");
		e.text(mUtil.conductDrugRep(drug));
		dom.append(e);
	});
}

