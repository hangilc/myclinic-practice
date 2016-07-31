"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");
var DrugForm = require("./drug-form/drug-form");

var tmplSrc = require("raw!./drug.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(index, drug, at, patientId){
	drug = mUtil.assign({}, drug);
	var e = $("<div></div>");
	var html = tmpl.render({
		index: index,
		label: mUtil.drugRep(drug)
	});
	e = $(html);
	e.listen("rx-drug-deleted", function(drugId){
		if( drugId === drug.drug_id ){
			e.remove();
		}
	});
	e.listen("rx-drug-modified-days", function(drugId, days){
		if( drugId !== drug.drug_id ){
			return;
		}
		drug.d_days = days;
		e.find("> [mc-name=disp] [mc-name=label]").text(mUtil.drugRep(drug));
	});
	bindClick(e, drug, at, patientId);
	return e;
}

exports.updateIndex = function(dom, index){
	getDispIndexDom(dom).text(index);
}

function getDispDom(dom){
	return dom.find("> [mc-name=disp]");
}

function getDispIndexDom(dom){
	return getDispDom(dom).find("[mc-name=index]");
}

function getFormAreaDom(dom){
	return dom.find("> [mc-name=form-area]");
}

function bindClick(dom, drug, at, patientId){
	dom.on("click", "[mc-name=disp]", function(event){
		event.stopPropagation();
		var message = "（暫定）診察中でありませんが、この薬剤を編集しますか？";
		if( !dom.inquire("fn-confirm-edit", drug.visit_id, message) ){
			return;
		}
		var form = DrugForm.createEditForm(drug, at, patientId);
		bindFormModified(dom, form);
		bindFormCancel(dom, form);
		bindFormDelete(dom, form, drug.visit_id);
		var formArea = getFormAreaDom(dom).html("");
		formArea.append(form);
		getDispDom(dom).hide();
	});
}

function bindFormModified(dom, form){
	form.on("drug-modified", function(event, newDrug){
		event.stopPropagation();
		form.remove();
		var dispDom = getDispDom(dom);
		dispDom.find("[mc-name=label]").text(mUtil.drugRep(newDrug));
		dispDom.show();
	});
}

function bindFormCancel(dom, form){
	form.on("cancel-form", function(event){
		event.stopPropagation();
		form.remove();
		getDispDom(dom).show();
	});
}

function bindFormDelete(dom, form, visitId){
	form.on("drug-deleted", function(event){
		event.stopPropagation();
		var parent = dom.parent();
		dom.remove();
		parent.trigger("number-of-drugs-changed", [visitId]);
		parent.trigger("drugs-need-renumbering");
	});
}



