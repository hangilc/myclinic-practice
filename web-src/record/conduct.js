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

function RecordConduct(dom){
	this.dom = dom;
}

RecordConduct.prototype.render = function(){
	return this;
};

RecordConduct.prototype.update = function(conduct){
	var data = mUtil.assign({}, conduct, {
		kind_label: mUtil.conductKindToKanji(conduct.kind)
	})
	var html = tmpl.render(data);
	this.dom.html(html);
	new ConductShinryouList(this.dom.find("[mc-name=shinryouList]")).render().update(conduct.shinryou_list);
	new ConductDrugList(this.dom.find("[mc-name=drugs]")).render().update(conduct.drugs);
	new ConductKizaiList(this.dom.find("[mc-name=kizaiList]")).render().update(conduct.kizai_list);
	return this;
};

module.exports = RecordConduct;

