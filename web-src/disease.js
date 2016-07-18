"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./disease.html");
var tmpl = hogan.compile(tmplSrc);

var ListPane = require("./disease/disease-list-pane")

function Disease(dom){
	this.dom = dom;
	this.mode = "list";
}

Disease.prototype.render = function(){
	return this;
};

Disease.prototype.update = function(diseaseList){
	this.dom.hide();
	this.dom.html(tmpl.render({}));
	var wrapper = this.dom.find("[mc-name=workarea]");
	switch(this.mode){
		case "list": 
			new ListPane(wrapper).render().update(diseaseList); break;
		default: wrapper.text(this.mode); break;
	}
	this.dom.show();
};

module.exports = Disease;

