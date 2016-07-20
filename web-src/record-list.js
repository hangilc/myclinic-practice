"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("./service");
var mUtil = require("../myclinic-util");
var registry = require("../hc-registry");
var Title = require("./record/title");
var Text = require("./record/text");
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
	dom.addClass("rx-record-list-changed");
	dom.data("rx-record-list-changed", function(records){
		var currentVisitId = registry.get("getCurrentVisitId")();
		var tempVisitId = registry.get("getTempVisitId")();
		dom.html("");
		records.forEach(function(data){
			dom.append(makeRecord(data, currentVisitId, tempVisitId));
		})
	});
};

function makeRecord(visit, currentVisitId, tempVisitId){
	var e = $(recordTmpl.render(visit));
	Title.setup(e.find("[mc-name=title]"), visit, currentVisitId, tempVisitId);
	var textWrapper = e.find("[mc-name=texts]");
	visit.texts.forEach(function(text){
		var te = Text.create(text);
		textWrapper.append(te);
	});
	return e;
}

function makeRecordOrig(visit){
	new Title(e.find("[mc-name=title]")).update(visit.v_datetime, visit.visit_id);
	var textWrapper = e.find("[mc-name=texts]");
	visit.texts.forEach(function(text){
		var te = $("<div></div>");
		new Text(te).render().update(text.content);
		textWrapper.append(te);
	});
	new Hoken(e.find("[mc-name=hoken]")).render().update(mUtil.hokenRep(visit));
	new DrugMenu(e.find("[mc-name=drugMenu]")).render().update();
	var drugWrapper = e.find("[mc-name=drugs]");
	var drugIndex = 1;
	visit.drugs.forEach(function(drug){
		var de = $("<div></div>");
		new Drug(de).render().update(drugIndex++, mUtil.drugRep(drug));
		drugWrapper.append(de);
	});
	new ShinryouMenu(e.find("[mc-name=shinryouMenu]")).render().update();
	var shinryouWrapper = e.find("[mc-name=shinryouList]");
	visit.shinryou_list.forEach(function(shinryou){
		var se = $("<div></div>");
		new Shinryou(se).render().update(shinryou.name);
		shinryouWrapper.append(se);
	});
	new ConductMenu(e.find("[mc-name=conductMenu]")).render().update();
	new ConductList(e.find("[mc-name=conducts]")).render().update(visit.conducts);
	new Charge(e.find("[mc-name=charge]")).render().update(visit.charge);
	return e;
}

