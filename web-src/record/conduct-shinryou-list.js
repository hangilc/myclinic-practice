"use strict";

var $ = require("jquery");

exports.setup = function(dom, shinryouList){
	dom.html("");
	shinryouList.forEach(function(shinryou){
		var e = $("<div></div>");
		e.text(shinryou.name);
		dom.append(e);
	});
};

