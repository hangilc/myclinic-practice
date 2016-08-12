"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./charge-form.html");
var tmpl = hogan.compile(tmplSrc);

var enterLinkSelector = "[mc-name=enterLink]"
var cancelLinkSelector = "[mc-name=cancelLink]"

exports.create = function(meisai){
	var data = {

	};
	var dom = $(tmpl.render(data));
	dom.on("click", cancelLinkSelector, function(event){
		event.preventDefault();
		dom.trigger("30g8sm2i-cancel");
	})
	return dom;
}