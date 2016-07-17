"use strict";

var $ = require("jquery");
var Conduct = require("./conduct");

function ConductList(dom){
	this.dom = dom;
}

ConductList.prototype.render = function(){
	return this;
};

ConductList.prototype.update = function(conducts){
	var wrapper = this.dom.html("");
	conducts.forEach(function(data){
		var ce = $("<div></div>");
		new Conduct(ce).render().update(data);
		wrapper.append(ce);
	})
};

module.exports = ConductList;

