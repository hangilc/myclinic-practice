"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./disease-list-pane-item.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(disease){
	var data = mUtil.assign({}, disease, {
		label: mUtil.diseaseFullName(disease),
		start_date_label: kanjidate.format("{G:a}{N}.{M}.{D}.", disease.start_date)
	});
	var dom = $(tmpl.render(data));
	bindClick(dom, disease);
	return dom;
}

function bindClick(dom, disease){
	dom.on("click", function(event){
		event.preventDefault();
		dom.trigger("3dynuzj3-selected", [disease]);
	});
}

