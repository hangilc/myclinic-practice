"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("./service");
var mUtil = require("../myclinic-util");
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
	dom.addClass("rx-visit-changed");
	dom.data("rx-visit-changed", function(patientId, visitId){
		dom.data("current-patient-id", patientId);
		dom.data("current-visit-id", visitId);
		dom.data("temp-visit-id", 0);
		if( patientId === 0 ){
			dom.html("");
		}
	})
	dom.addClass("rx-goto-page");
	dom.data("rx-goto-page", function(page, itemsPerPage){
		var patientId = dom.data("current-patient-id");
		if( page <= 0 || patientId === 0 ){
			dom.html("");
		} else {
			render(dom, page, itemsPerPage);
		}
	})
	dom.addClass("rx-set-temp-visit-id");
	dom.data("rx-set-temp-visit-id", function(newTempVisitId){
		dom.data("temp-visit-id", newTempVisitId);
	})
}

function render(dom, page, itemsPerPage){
	var patientId = dom.data("current-patient-id");
	var currentVisitId = dom.data("current-visit-id");
	var tempVisitId = dom.data("temp-visit-id");
	var offset = itemsPerPage * (page - 1);
	dom.html("");
	service.listFullVisits(patientId, offset, itemsPerPage, function(err, result){
		if( err ){
			alert(err);
			return;
		}
		result.forEach(function(data){
			dom.append(makeRecord(data, currentVisitId, tempVisitId));
		})
	})

}

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

function RecordList(dom){
	this.dom = dom;
}

RecordList.prototype.render = function(){
	return this;
};

RecordList.prototype.update = function(patientId, offset, n, done){
	if( patientId === 0 ){
		this.dom.html("");
		done();
		return;
	}
	var wrapper = $("<div></div>");
	this.dom.html("").append(wrapper);
	var main = this.main;
	service.listFullVisits(patientId, offset, n, function(err, result){
		if( err ){
			done(err);
			return;
		}
		result.forEach(function(data){
			var e = makeRecord(data, main);
			wrapper.append(e);
		});
		done();
	})
};

//module.exports = RecordList;
