"use strict";

var $ = require("jquery");
var mUtil = require("../../myclinic-util");

exports.setup = function(dom, kizaiList){
	dom.html("");
	kizaiList.forEach(function(kizai){
		var e = $("<div></div>");
		e.text(mUtil.conductKizaiRep(kizai));
		dom.append(e);
	});

};

