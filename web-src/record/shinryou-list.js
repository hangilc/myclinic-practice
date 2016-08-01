"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var Shinryou = require("shinryou");

exports.setup = function(dom, shinryouList, visitId, at, patientId){
	dom.html("");
	shinryouList.forEach(function(shinryou){
		var se = Shinryou.create(shinryou);
		dom.append(se);
	});
};