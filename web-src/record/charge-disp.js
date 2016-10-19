"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./charge-disp.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");

exports.create = function(charge){
	if( charge ){
		charge = mUtil.assign({}, charge, {
			has_charge: true,
			charge_rep: mUtil.formatNumber(charge.charge)
		})
	} else {
		charge = { has_charge: false };
	}
	var dom = $(tmpl.render(charge));
	bindClick(dom);
	return dom;
};

function bindClick(dom){
	dom.click(function(event){
		dom.trigger("v7lug8he-start-edit");
	});
}
