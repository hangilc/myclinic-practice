"use strict";

var $ = require("jquery");
var tmplSrc = require("raw!./conduct-add-xp-form.html");

exports.create = function(){
	var dom = $(tmplSrc);
	bindEnter(dom);
	bindCancel(dom);
	return dom;
}

var labelSelectSelector = "> form [mc-name=label-selector-area] select[mc-name=label]";
var filmSelectSelector = "> form [mc-name=film-selector-area] select[mc-name=film]";
var enterSelector = "> form .workarea-commandbox [mc-name=enter]";
var cancelSelector = "> form .workarea-commandbox [mc-name=cancel]";

function getSelectedLabel(dom){
	return dom.find(labelSelectSelector + " option:selected").val();
}

function getSelectedFilm(dom){
	return dom.find(filmSelectSelector + " option:selected").val();
}

function bindEnter(dom){
	dom.on("click", enterSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		var label = getSelectedLabel(dom);
		var film = getSelectedFilm(dom);
		dom.trigger("enter", [label, film]);
	});
}

function bindCancel(dom){
	dom.on("click", cancelSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("cancel");
	});
}