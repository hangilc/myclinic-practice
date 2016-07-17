"use strict";

var $ = require("jquery");
var mUtil = require("../../myclinic-util");

function ConductKizaiList(dom){
	this.dom = dom;
}

ConductKizaiList.prototype.render = function(){
	return this;
};

ConductKizaiList.prototype.update = function(list){
	var wrapper = this.dom.html("");
	list.forEach(function(data){
		var e = $("<div></div>");
		e.text(mUtil.conductKizaiRep(data));
		wrapper.append(e);
	});
};

module.exports = ConductKizaiList;