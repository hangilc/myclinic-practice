"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("./service");
var mUtil = require("../myclinic-util");
var Record = require("./record/record");

exports.setup = function(dom){
	["rx-start-page", "rx-goto-page", "rx-delete-visit"].forEach(function(key){
		dom.listen(key, function(appData){
			var currentVisitId = dom.inquire("fn-get-current-visit-id");
			var tempVisitId = dom.inquire("fn-get-temp-visit-id");
			var records = appData.record_list;
			dom.html("");
			records.forEach(function(data){
				dom.append(Record.create(data, currentVisitId, tempVisitId));
			})
		})
	});
	bindDrugsBatchEntered(dom);
	bindNumberOfDrugsChanged(dom);
};

function bindDrugsBatchEntered(recordListDom){
	recordListDom.on("drugs-batch-entered", function(event, targetVisitId, drugs){
		event.stopPropagation();
		recordListDom.broadcast("rx-drugs-batch-entered", [targetVisitId, drugs]);
	});
}

function bindNumberOfDrugsChanged(recordListDom){
	recordListDom.on("number-of-drugs-changed", function(event, visitId){
		event.stopPropagation();
		recordListDom.broadcast("rx-number-of-drugs-changed", [visitId]);
	});
}


