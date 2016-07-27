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
var Drug = require("./record/drug");
var ShinryouMenu = require("./record/shinryou-menu");
var Shinryou = require("./record/shinryou");
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
	var drugWrapper = e.find("[mc-name=drugs].record-drug-wrapper").html("");
	var drugIndex = 1;
	if( visit.drugs.length > 0 ){
		drugWrapper.append("<div>Rp)</div>");
	}
	visit.drugs.forEach(function(drug){
		var de = Drug.create(drugIndex++, drug);
		drugWrapper.append(de);
	});
	ShinryouMenu.setup(e.find("[mc-name=shinryouMenu]"));
	var shinryouWrapper = e.find("[mc-name=shinryouList]");
	visit.shinryou_list.forEach(function(shinryou){
		var se = Shinryou.create(shinryou);
		shinryouWrapper.append(se);
	});
	ConductMenu.setup(e.find("[mc-name=conductMenu]"));
	ConductList.setup(e.find("[mc-name=conducts]"), visit.conducts);
	Charge.setup(e.find("[mc-name=charge]"), visit.charge);
	bindDrugEntered(e);
	return e;
}

function bindDrugEntered(dom){
	dom.on("drug-entered", function(event, newDrug){
		event.stopPropagation();
		var drugWrapper = dom.find("[mc-name=drugs].record-drug-wrapper");
		var items = drugWrapper.find(".record-drug-item");
		if( items.length === 0 ){
			drugWrapper.append("<div>Rp)</div>");
		}
		var de = Drug.create(items.length+1, newDrug);
		drugWrapper.append(de);
	});
}

function bindDrugsBatchEntered(recordListDom){
	recordListDom.on("drugs-batch-entered", function(event, targetVisitId, drugs){
		event.stopPropagation();
		if( drugs.length === 0 ){
			return;
		}
		var dom = recordListDom.children(".visit-entry[visit-id=" + targetVisitId + "]");
		var drugWrapper = dom.find("[mc-name=drugs].record-drug-wrapper");
		var items = drugWrapper.find(".record-drug-item");
		if( items.length === 0 ){
			drugWrapper.append("<div>Rp)</div>");
		}
		var index = items.length + 1;
		drugs.forEach(function(drug){
			console.log(drug);
			var de = Drug.create(index++, drug);
			drugWrapper.append(de);
		})
	});
}

