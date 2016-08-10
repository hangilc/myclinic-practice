"use strict";

var $ = require("jquery");
var Text = require("./text");

exports.setup = function(dom, visitId, texts){
	batchAdd(dom, texts);
	dom.listen("rx-text-batch-entered", function(targetVisitId, texts){
		if( visitId !== targetVisitId ){
			return;
		}
		batchAdd(dom, texts);
	})
}

function batchAdd(dom, texts){
	texts.forEach(function(text){
		var te = Text.create(text);
		dom.append(te);
	});
}