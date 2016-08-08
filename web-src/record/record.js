"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./record.html");
var Title = require("./title");
var Text = require("./text");
var TextMenu = require("./text-menu");
var Hoken = require("./hoken");
var DrugMenu = require("./drug-menu");
var DrugList = require("./drug-list");
var ShinryouMenu = require("./shinryou-menu");
var ShinryouList = require("./shinryou-list");
var ConductMenu = require("./conduct-menu");
var ConductList = require("./conduct-list");
var Charge = require("./charge");

exports.create = function(visit, currentVisitId, tempVisitId){
	var dom = $(tmplSrc);
	Title.setup(dom.find("[mc-name=title]"), visit, currentVisitId, tempVisitId);
	var textWrapper = dom.find("[mc-name=texts]");
	visit.texts.forEach(function(text){
		var te = Text.create(text);
		textWrapper.append(te);
	});
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
	return dom;
}
