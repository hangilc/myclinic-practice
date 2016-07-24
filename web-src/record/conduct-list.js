"use strict";

var $ = require("jquery");
var Conduct = require("./conduct");

exports.setup = function(dom, conducts){
	dom.html("");
	conducts.forEach(function(conduct){
		var ce = $("<div></div>");
		Conduct.setup(ce, conduct);
		dom.append(ce);
	})
}


