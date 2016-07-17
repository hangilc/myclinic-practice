"use strict";

var $ = require("jquery");

function ConductShinryouList(dom){
	this.dom = dom;
}

ConductShinryouList.prototype.render = function(){
	return this;
};

ConductShinryouList.prototype.update = function(list){
	var wrapper = this.dom.html("");
	list.forEach(function(data){
		var e = $("<div></div>");
		e.text(data.name);
		wrapper.append(e);
	});
};

module.exports = ConductShinryouList;