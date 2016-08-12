"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./conduct-disp.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(conductEx){
	var conductId = conductEx.id;
	var dom = $("<div></div>");
	dom.html(tmpl.render(conductEx));
	dom.listen("rx-conduct-modified", function(targetConductId, newConductEx){
		if( conductId !== targetConductId ){
			return;
		}
		dom.html(tmpl.render(newConductEx));
	});
	return dom;
};