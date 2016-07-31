"use strict";

var $ = require("jquery");
var tmplHtml = require("raw!./drug-list.html");
var Drug = require("./drug");

exports.setup = function(dom, drugs, visitId, at, patientId){
	dom.html(tmplHtml);
	var listDom = getListDom(dom);
	updateRp(dom, drugs.length);
	var index = 1;
	drugs.forEach(function(drug){
		var e = Drug.create(index++, drug, at, patientId);
		listDom.append(e);
	});
	respondToDrugsBatchEntered(dom, visitId);
	respondToNumberOfDrugsChanged(dom, visitId);
	respondToDrugsNeedRenumbering(dom);
};

function getRpDom(dom){
	return dom.find("[mc-name=rp]");
}

function getListDom(dom){
	return dom.find("[mc-name=list]");
}

function listDrugDoms(dom){
	return dom.find(".record-drug-item");
}

function countDrugs(dom){
	return listDrugDoms(dom).length;
}

function updateRp(dom, numDrugs){
	var text = numDrugs > 0 ? "Rp)" : "";
	getRpDom(dom).text(text);
}

function respondToDrugsBatchEntered(dom, visitId){
	dom.listen("rx-drugs-batch-entered", function(targetVisitId, drugs){
		if( visitId === targetVisitId ){
			var index = countDrugs(dom) + 1;
			var listDom = getListDom(dom);
			drugs.forEach(function(drug){
				var e = Drug.create(index++, drug);
				listDom.append(e);
			});
			updateRp(dom, countDrugs(dom));
		}
	});
}

function respondToNumberOfDrugsChanged(dom, visitId){
	dom.listen("rx-number-of-drugs-changed", function(targetVisitId){
		if( visitId !== targetVisitId ){
			return;
		}
		updateRp(dom, countDrugs(dom));
	});
}

function respondToDrugsNeedRenumbering(dom){
	dom.listen("rx-drugs-need-renumbering", function(){
		var drugDoms = listDrugDoms(dom);
		var index = 1;
		drugDoms.each(function(){
			var de = $(this);
			Drug.updateIndex(de, index++);
		});
	});
}