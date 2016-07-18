"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var mUtil = require("../myclinic-util");

var tmplSrc = require("raw!./select-patient-item.html");
var tmpl = hogan.compile(tmplSrc);

function SelectPatientItem(dom){
	this.dom = dom;
}

SelectPatientItem.prototype.update = function(data){
	data = mUtil.assign({}, data, {
		state_label: mUtil.wqueueStateToKanji(data.wait_state)
	});
	this.dom.html(tmpl.render(data));
};

module.exports = SelectPatientItem;