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
	bindDrugEntered(dom);
	bindDrugModified(dom);
	bindDrugDeleted(dom);

	//bindDrugsBatchEntered(dom);
	//bindNumberOfDrugsChanged(dom);
	bindShinryouBatchEntered(dom);
	bindConductsBatchEntered(dom);
};

function bindDrugEntered(recordListDom){
	recordListDom.on("drug-entered", function(event, newDrug){
		recordListDom.broadcast("rx-drug-entered", [newDrug]);
	});
}

function bindDrugModified(dom){
	dom.on("drug-modified", function(event, newDrug){
		dom.broadcast("rx-drug-modified", [newDrug]);
	});
}

function bindDrugDeleted(dom){
	dom.on("drug-deleted", function(event, drugId, visitId){
		dom.broadcast("rx-drug-deleted", [drugId]);
		dom.broadcast("rx-number-of-drugs-changed", [visitId]);
	});
}

// function bindDrugsBatchEntered(recordListDom){
// 	recordListDom.on("drugs-batch-entered", function(event, targetVisitId, drugs){
// 		event.stopPropagation();
// 		recordListDom.broadcast("rx-drugs-batch-entered", [targetVisitId, drugs]);
// 	});
// }

function bindNumberOfDrugsChanged(recordListDom){
	recordListDom.on("number-of-drugs-changed", function(event, visitId){
		event.stopPropagation();
		recordListDom.broadcast("rx-number-of-drugs-changed", [visitId]);
	});
}

function bindShinryouBatchEntered(dom){
	dom.on("shinryou-batch-entered", function(event, visitId, shinryouList){
		event.stopPropagation();
		dom.broadcast("rx-shinryou-batch-entered", [visitId, shinryouList]);
	})
}

function bindConductsBatchEntered(dom){
	dom.on("conducts-batch-entered", function(event, visitId, conducts){
		event.stopPropagation();
		dom.broadcast("rx-conducts-batch-entered", [visitId, conducts]);
	});
}


