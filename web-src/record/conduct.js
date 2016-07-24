"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");
var ConductShinryouList = require("./conduct-shinryou-list");
var ConductDrugList = require("./conduct-drug-list");
var ConductKizaiList = require("./conduct-kizai-list");

var tmplSrc = require("raw!./conduct.html");
var tmpl = hogan.compile(tmplSrc);

exports.setup = function(dom, conduct){
	var data = mUtil.assign({}, conduct, {
		kind_label: mUtil.conductKindToKanji(conduct.kind)
	})
	var html = tmpl.render(data);
	dom.html(html);
	ConductShinryouList.setup(dom.find("[mc-name=shinryouList]"), conduct.shinryou_list);
	ConductDrugList.setup(dom.find("[mc-name=drugs]"), conduct.drugs);
	ConductKizaiList.setup(dom.find("[mc-name=kizaiList]"), conduct.kizai_list);
}

