"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var mUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./select-patient-item.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(data){
	data = mUtil.assign({}, data, {
		state_label: mUtil.wqueueStateToKanji(data.wait_state)
	});
	var e = $(tmpl.render(data));
	return e;
};

