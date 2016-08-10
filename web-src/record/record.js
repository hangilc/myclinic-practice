"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./record.html");
var Title = require("./title");
var TextList = require("./text-list");
var TextMenu = require("./text-menu");
var Hoken = require("./hoken");
var DrugMenu = require("./drug-menu");
var DrugList = require("./drug-list");
var ShinryouMenu = require("./shinryou-menu");
var ShinryouList = require("./shinryou-list");
var ConductMenu = require("./conduct-menu");
var ConductList = require("./conduct-list");
var Charge = require("./charge");
var task = require("../task");
var service = require("../service");

exports.create = function(visit, currentVisitId, tempVisitId){
	var dom = $(tmplSrc);
	Title.setup(dom.find("[mc-name=title]"), visit, currentVisitId, tempVisitId);
	TextList.setup(dom.find("[mc-name=texts]"), visit.visit_id, visit.texts);
	TextMenu.setup(dom.find("[mc-name=text-menu]"), visit.visit_id);
	Hoken.setup(dom.find("[mc-name=hoken]"), visit);
	DrugMenu.setup(dom.find("[mc-name=drugMenu]"), visit);
	DrugList.setup(dom.find("[mc-name=drugs].record-drug-wrapper"), 
		visit.drugs, visit.visit_id, visit.v_datetime, visit.patient_id);
	ShinryouMenu.setup(dom.find("[mc-name=shinryouMenu]"), visit.visit_id, visit.v_datetime);
	ShinryouList.setup(dom.find("[mc-name=shinryouList]"), visit.shinryou_list,
		visit.visit_id, visit.v_datetime, visit.patient_id);
	ConductMenu.setup(dom.find("[mc-name=conductMenu]"));
	ConductList.setup(dom.find("[mc-name=conducts]"), visit.conducts);
	Charge.setup(dom.find("[mc-name=charge]"), visit.charge);
	bindTextsEntered(dom, visit.visit_id);
	bindDrugsEntered(dom, visit.visit_id);
	bindDrugsDeleted(dom, visit.visit_id);
	bindDrugsModifiedDays(dom, visit.visit_id);
	bindDrugsNeedRenumbering(dom, visit.visit_id);
	bindShinryouEntered(dom, visit.visit_id);
	bindShinryouDeleted(dom, visit.visit_id);
	bindShinryouDeleteDuplicated(dom, visit.visit_id);
	return dom;
}

function bindTextsEntered(dom, visitId){
	dom.on("text-batch-entered", function(event, targetVisitId, texts){
		if( visitId === targetVisitId ){
			event.stopPropagation();
			dom.broadcast("rx-texts-batch-entered", [targetVisitId, texts]);
		}
	})
}

function bindDrugsEntered(dom, visitId){
	dom.on("drugs-batch-entered", function(event, targetVisitId, drugs){
		if( targetVisitId === visitId ){
			event.stopPropagation();
			dom.broadcast("rx-drugs-batch-entered", [targetVisitId, drugs]);
		}
	});
}

function bindDrugsModifiedDays(dom, visitId){
	dom.on("drugs-batch-modified-days", function(event, targetVisitId, drugIds, days){
		if( visitId === targetVisitId ){
			event.stopPropagation();
			drugIds.forEach(function(drugId){
				dom.broadcast("rx-drug-modified-days", [drugId, days]);
			});
		}
	});
}

function bindDrugsDeleted(dom, visitId){
	dom.on("drugs-batch-deleted", function(event, targetVisitId, drugIds){
		if( targetVisitId === visitId ){
			event.stopPropagation();
			drugIds.forEach(function(drugId){
				dom.broadcast("rx-drug-deleted", [drugId]);
			})
		}
	})
}

function bindDrugsNeedRenumbering(dom, visitId){
	dom.on("drugs-need-renumbering", function(event, targetVisitId){
		if( visitId === targetVisitId ){
			event.stopPropagation();
			dom.broadcast("rx-drugs-need-renumbering", [visitId]);
		}
	})
}

function bindShinryouEntered(dom, visitId){
	dom.on("shinryou-batch-entered", function(event, targetVisitId, shinryouList){
		if( visitId === targetVisitId ){
			event.stopPropagation();
			dom.broadcast("rx-shinryou-batch-entered", [targetVisitId, shinryouList]);
		}
	})
}

function bindShinryouDeleted(dom, visitId){
	dom.on("shinryou-batch-deleted", function(event, targetVisitId, deletedShinryouIds){
		if( visitId === targetVisitId ){
			event.stopPropagation();
			deletedShinryouIds.forEach(function(shinryouId){
				dom.broadcast("rx-shinryou-deleted", [shinryouId])
			});
		}
	});
}

function bindShinryouDeleteDuplicated(dom, visitId){
	dom.on("shinryou-delete-duplicated", function(event, targetVisitId){
		if( visitId === targetVisitId ){
			event.stopPropagation();
			var shinryouItems = dom.broadcast("rx-shinryou-lookup-for-visit", [targetVisitId]);
			var curMap = {};
			var duplicateShinryouIds = [];
			shinryouItems.forEach(function(item){
				var shinryoucode = item.shinryoucode;
				if( curMap[shinryoucode] ){
					duplicateShinryouIds.push(item.shinryou_id);
				} else {
					curMap[shinryoucode] = true;
				}
			});
			task.run([
				function(done){
					service.batchDeleteShinryou(duplicateShinryouIds, done);
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				duplicateShinryouIds.forEach(function(shinryouId){
					dom.broadcast("rx-shinryou-deleted", [shinryouId]);
				})
			})
		}
	});
}




