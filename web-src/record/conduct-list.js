"use strict";

var $ = require("jquery");
var Conduct = require("./conduct");

exports.setup = function(dom, conducts, visitId, at){
	batchAdd(dom, conducts);
	dom.listen("rx-conducts-batch-entered", function(targetVisitId, conducts){
		if( visitId !== targetVisitId ){
			return;
		}
		batchAdd(dom, conducts);
	});
};

function batchAdd(dom, conducts){
	conducts.forEach(function(conduct){
		var ce = Conduct.create(conduct);
		dom.append(ce);
	})
}


