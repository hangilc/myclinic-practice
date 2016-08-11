"use strict";

var $ = require("jquery");
var Conduct = require("./conduct");

exports.setup = function(dom, conducts, visitId, at){
	batchAdd(dom, conducts, visitId, at);
	dom.listen("rx-conducts-batch-entered", function(targetVisitId, conducts){
		if( visitId !== targetVisitId ){
			return;
		}
		batchAdd(dom, conducts, visitId, at);
	});
};

function batchAdd(dom, conducts, visitId, at){
	conducts.forEach(function(conduct){
		var ce = Conduct.create(conduct, visitId, at);
		dom.append(ce);
	})
}


