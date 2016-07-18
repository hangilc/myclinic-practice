"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./disease-list-pane.html");
var tmpl = hogan.compile(tmplSrc);

var DiseaseListItem = require("./disease-list-item");

function DiseaseListPane(dom){
	this.dom = dom;
}

DiseaseListPane.prototype.render = function(){
	return this;
};

DiseaseListPane.prototype.update = function(diseaseList){
	var e = $("<div></div>");
	e.html(tmpl.render({}));
	var wrapper = e.find("[mc-name=list]");
	diseaseList.forEach(function(disease){
		var tr = $("<tr></tr>");
		new DiseaseListItem(tr).update(disease);
		wrapper.append(tr);
	});
	this.dom.html("").append(e);
	return this;
};

module.exports = DiseaseListPane;