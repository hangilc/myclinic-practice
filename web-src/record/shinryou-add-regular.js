"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./shinryou-add-regular.html");
var service = require("../service");

exports.create = function(visitId, at){
	var dom = $(tmplSrc);
	bindEnter(dom, visitId, at);
	bindCancel(dom);
	return dom;
}

function bindEnter(dom, visitId, at){
	var names = ["初診"];
	service.batchResolveShinryouNamesAt(names, at, function(err, result){
		if( err ){
			alert(err);
			return;
		}
		console.log(result);
	})
}

function bindCancel(dom){
	dom.on("click", "> form .workarea-commandbox [mc-name=cancel]", function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("close-workarea");
	});
}