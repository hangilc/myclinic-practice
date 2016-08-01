"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("./service");
var mUtil = require("../myclinic-util");
var Title = require("./record/title");
var Text = require("./record/text");
var TextMenu = require("./record/text-menu");
var Hoken = require("./record/hoken");
var DrugMenu = require("./record/drug-menu");
var DrugList = require("./record/drug-list");
var ShinryouMenu = require("./record/shinryou-menu");
var ShinryouList = require("./record/shinryou-list");
//var Shinryou = require("./record/shinryou");
var ConductMenu = require("./record/conduct-menu");
var ConductList = require("./record/conduct-list");
var Charge = require("./record/charge");

var recordTmplSrc = require("raw!./record/record.html");
var recordTmpl = hogan.compile(recordTmplSrc);

exports.setup = function(dom){
	["rx-start-page", "rx-goto-page", "rx-delete-visit"].forEach(function(key){
		dom.listen(key, function(appData){
			var currentVisitId = window.getCurrentVisitId();
			var tempVisitId = window.getTempVisitId();
			var records = appData.record_list;
			dom.html("");
			records.forEach(function(data){
				dom.append(makeRecord(data, currentVisitId, tempVisitId));
			})
		})
	});
	bindDrugsBatchEntered(dom);
	bindNumberOfDrugsChanged(dom);
};

function makeRecord(visit, currentVisitId, tempVisitId){
	var e = $(recordTmpl.render(visit));
	Title.setup(e.find("[mc-name=title]"), visit, currentVisitId, tempVisitId);
	var textWrapper = e.find("[mc-name=texts]");
	visit.texts.forEach(function(text){
		var te = Text.create(text);
		textWrapper.append(te);
	});
	TextMenu.setup(e.find("[mc-name=text-menu]"), visit.visit_id);
	Hoken.setup(e.find("[mc-name=hoken]"), visit);
	DrugMenu.setup(e.find("[mc-name=drugMenu]"), visit);
	DrugList.setup(e.find("[mc-name=drugs].record-drug-wrapper"), 
		visit.drugs, visit.visit_id, visit.v_datetime, visit.patient_id);
	ShinryouMenu.setup(e.find("[mc-name=shinryouMenu]"));
	ShinryouList.setup(e.find("[mc-name=shinryouList]"), visit.shinryou_list,
		visit.visit_id, visit.v_datetime, visit.patient_id);
	ConductMenu.setup(e.find("[mc-name=conductMenu]"));
	ConductList.setup(e.find("[mc-name=conducts]"), visit.conducts);
	Charge.setup(e.find("[mc-name=charge]"), visit.charge);
	bindDrugsBatchModifiedDays(e, visit.visit_id);
	bindDrugsBatchDeleted(e);
	bindDrugsNeedRenumbering(e);
	return e;
}

function bindDrugsBatchModifiedDays(recordDom, visitId){
	recordDom.on("drugs-batch-modified-days", function(event, targetVisitId, drugIds, days){
		if( visitId !== targetVisitId ){
			return;
		}
		drugIds.forEach(function(drugId){
			recordDom.broadcast("rx-drug-modified-days", drugId, days);
		});
	});
}

function bindDrugsBatchDeleted(recordDom){
	recordDom.on("drugs-batch-deleted", function(event, drugIds){
		event.stopPropagation();
		drugIds.forEach(function(drugId){
			recordDom.broadcast("rx-drug-deleted", drugId);
		})
	});
}

function bindDrugsNeedRenumbering(recordDom){
	recordDom.on("drugs-need-renumbering", function(event){
		event.stopPropagation();
		recordDom.broadcast("rx-drugs-need-renumbering");
	})
}

function bindDrugsBatchEntered(recordListDom){
	recordListDom.on("drugs-batch-entered", function(event, targetVisitId, drugs){
		event.stopPropagation();
		recordListDom.broadcast("rx-drugs-batch-entered", targetVisitId, drugs);
	});
}

function bindNumberOfDrugsChanged(recordListDom){
	recordListDom.on("number-of-drugs-changed", function(event, visitId){
		event.stopPropagation();
		recordListDom.broadcast("rx-number-of-drugs-changed", visitId);
	});
}


