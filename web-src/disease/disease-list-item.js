"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./disease-list-item.html");
var tmpl = hogan.compile(tmplSrc);

function DiseaseListItem(dom){
	this.dom = dom;
}

DiseaseListItem.prototype.update = function(data){
	data = mUtil.assign({}, data, {
		label: mUtil.diseaseFullName(data),
		start_date_label: kanjidate.format("{G:a}{N}.{M}.{D}.", data.start_date)
	});
	this.dom.html(tmpl.render(data));
	return this;
};

module.exports = DiseaseListItem;