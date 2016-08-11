"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./conduct-disp.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(conductEx){
	var conductId = conductEx.id;
	var dom = $(tmpl.render(conductEx));
	dom.listen("rx-conduct-modified", function(targetConductId, newConductEx){
		if( conductId !== targetConductId ){
			return;
		}
		dom.replaceWith(exports.create(newConductEx));
	});
	return dom;
};