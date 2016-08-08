"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./record.html");
var Title = require("./record/title");
var Text = require("./record/text");
var TextMenu = require("./record/text-menu");
var Hoken = require("./record/hoken");
var DrugMenu = require("./record/drug-menu");
var DrugList = require("./record/drug-list");
var ShinryouMenu = require("./record/shinryou-menu");
var ShinryouList = require("./record/shinryou-list");

exports.create = function(visit, currentVisitId, tempVisitId){
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
	ShinryouMenu.setup(e.find("[mc-name=shinryouMenu]"), visit.visit_id, visit.v_datetime);
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
