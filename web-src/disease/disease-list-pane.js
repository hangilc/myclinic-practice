"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./disease-list-pane.html");
var tmpl = hogan.compile(tmplSrc);

var DiseaseListItem = require("./disease-list-item");

exports.setup = function(dom, list){
	dom.html(tmpl.render({}));
	var wrapper = dom.find("[mc-name=list]");
	list.forEach(function(disease){
		var tr = DiseaseListItem.create(disease);
		wrapper.append(tr);
	});
};

