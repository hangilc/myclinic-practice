"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./disease-list-item.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(data){
	data = mUtil.assign({}, data, {
		label: mUtil.diseaseFullName(data),
		start_date_label: kanjidate.format("{G:a}{N}.{M}.{D}.", data.start_date)
	});
	return $(tmpl.render(data));
}

