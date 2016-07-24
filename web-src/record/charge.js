"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var mUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./charge.html");
var tmpl = hogan.compile(tmplSrc);

exports.setup = function(dom, charge){
	if( charge ){
		charge = mUtil.assign({}, charge, {
			has_charge: true,
			charge_rep: mUtil.formatNumber(charge.charge)
		})
	} else {
		charge = { has_charge: false };
	}
	var html = tmpl.render(charge);
	dom.html(html);
};

function Charge(dom){
	this.dom = dom;
}

Charge.prototype.render = function(){
	return this;
};

Charge.prototype.update = function(data){
	if( data ){
		data = mUtil.assign({}, data, {
			has_charge: true,
			charge_rep: mUtil.formatNumber(data.charge)
		})
	} else {
		data = { has_charge: false };
	}
	var html = tmpl.render(data);
	this.dom.html(html);
	return this;
};

//module.exports = Charge;

