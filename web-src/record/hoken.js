"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./hoken.html");
var tmpl = hogan.compile(tmplSrc);

exports.setup = function(dom, visit){
	var label = mUtil.hokenRep(visit);
	dom.html(tmpl.render({label: label}));
};

