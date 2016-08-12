"use strict";

var $ = require("jquery");
var tmplHtml = require("raw!./drug-list.html");
var Drug = require("./drug");

exports.setup = function(dom, drugs, visitId, at, patientId){
	dom.html(tmplHtml);
	var listDom = getListDom(dom);
	updateRp(dom, drugs.length > 0);
	var index = 1;
	drugs.forEach(function(drug){
		var e = Drug.create(index++, drug, at, patientId);
		listDom.append(e);
	});
	//respondToDrugsBatchEntered(dom, visitId);
	respondToDrugEntered(dom, visitId, at, patientId);
	respondToNumberOfDrugsChanged(dom, visitId);
	//respondToDrugsNeedRenumbering(dom, visitId);
};

function getRpDom(dom){
	return dom.find("[mc-name=rp]");
}

function getListDom(dom){
	return dom.find("[mc-name=list]");
}

function lookupDrugs(dom, visitId){
	return dom.broadcast("rx-drug-lookup-for-visit", [visitId]);
}

function countDrugs(dom, visitId){
	return lookupDrugs(dom, visitId).length;
}

function updateRp(dom, show){
	var text = show ? "Rp)" : "";
	getRpDom(dom).text(text);
}

function respondToDrugEntered(dom, visitId, at, patientId){
	dom.listen("rx-drug-entered", function(newDrug){
		if( visitId === newDrug.visit_id ){
			var index = countDrugs(dom, visitId) + 1;
			var listDom = getListDom(dom);
			listDom.append(Drug.create(index, newDrug, at, patientId));
			updateRp(dom, true);
		}
	});
}

// function respondToDrugsBatchEntered(dom, visitId){
// 	dom.listen("rx-drugs-batch-entered", function(targetVisitId, drugs){
// 		if( visitId === targetVisitId ){
// 			var index = countDrugs(dom, visitId) + 1;
// 			var listDom = getListDom(dom);
// 			drugs.forEach(function(drug){
// 				var e = Drug.create(index++, drug);
// 				listDom.append(e);
// 			});
// 			updateRp(dom, true);
// 		}
// 	});
// }

function respondToNumberOfDrugsChanged(dom, visitId){
	dom.listen("rx-number-of-drugs-changed", function(targetVisitId){
		if( visitId === targetVisitId ){
			var index = 1;
			var drugs = lookupDrugs(dom, visitId);
			updateRp(dom, drugs.length > 0);
			drugs.forEach(function(drug){
				dom.broadcast("rx-drug-modify-index", [drug.drug_id, index++]);
			})
		}
	});
}

function respondToDrugsNeedRenumbering(dom, visitId){
	dom.listen("rx-drugs-need-renumbering", function(targetVisitId){
		if( visitId !== targetVisitId ){
			return;
		}
		var index = 1;
		var drugs = lookupDrugs(dom, visitId);
		drugs.forEach(function(drug){
			dom.broadcast("rx-drug-modify-index", [drug.drug_id, index++]);
		})
	});
}