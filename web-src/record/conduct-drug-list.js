"use strict";

var $ = require("jquery");
var mUtil = require("../../myclinic-util");

function ConductDrugList(dom){
	this.dom = dom;
}

ConductDrugList.prototype.render = function(){
	return this;
};

ConductDrugList.prototype.update = function(list){
	var wrapper = this.dom.html("");
	list.forEach(function(data){
		var e = $("<div></div>");
		e.text(mUtil.conductDrugRep(data));
		wrapper.append(e);
	});
};

module.exports = ConductDrugList;