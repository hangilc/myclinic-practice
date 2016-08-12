"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");
var DrugDisp = require("./drug-disp");
var DrugForm = require("./drug-form");

var tmplSrc = require("raw!./drug.html");

var dispAreaSelector = "> [mc-name=disp-area]";
var formAreaSelector = "> [mc-name=form-area]";

function getDispAreaDom(dom){
	return dom.find(dispAreaSelector);
}

function getFormAreaDom(dom){
	return dom.find(formAreaSelector);
}

exports.create = function(index, drug, at, patientId){
	var dom = $(tmplSrc);
	DrugDisp.setup(getDispAreaDom(dom), index, drug);
	var ctx = {
		drug: drug
	};
	dom.listen("rx-drug-modified", function(newDrug){
		if( ctx.drug.drug_id === newDrug.drug_id ){
			ctx.drug = newDrug;
		}
	});
	dom.listen("rx-drug-lookup-for-visit", function(targetVisitId){
		if( targetVisitId === drug.visit_id ){
			return {
				drug_id: drug.drug_id
			};
		}
	});
	dom.listen("rx-drug-deleted", function(drugId){
		if( drugId === drug.drug_id ){
			dom.remove();
		}
	});
	bindClick(dom, ctx, at, patientId);
	return dom;
	// drug = mUtil.assign({}, drug);
	// var html = tmpl.render({
	// 	index: index,
	// 	label: mUtil.drugRep(drug)
	// });
	// var e = $(html);
	// e.listen("rx-drug-lookup-for-visit", function(targetVisitId){
	// 	if( targetVisitId === drug.visit_id ){
	// 		return {
	// 			drug_id: drug.drug_id
	// 		};
	// 	}
	// });
	// e.listen("rx-drug-deleted", function(drugId){
	// 	if( drugId === drug.drug_id ){
	// 		e.remove();
	// 	}
	// });
	// e.listen("rx-drug-modified-days", function(drugId, days){
	// 	if( drugId !== drug.drug_id ){
	// 		return;
	// 	}
	// 	drug.d_days = days;
	// 	e.find("> [mc-name=disp] [mc-name=label]").text(mUtil.drugRep(drug));
	// });
	// e.listen("rx-drug-modify-index", function(drugId, index){
	// 	if( drugId !== drug.drug_id ){
	// 		return;
	// 	}
	// 	updateIndex(e, index);
	// });
	// bindClick(e, drug, at, patientId);
	// return e;
}

// function updateIndex(dom, index){
// 	getDispIndexDom(dom).text(index);
// }

// function getDispDom(dom){
// 	return dom.find("> [mc-name=disp]");
// }

// function getDispIndexDom(dom){
// 	return getDispDom(dom).find("[mc-name=index]");
// }

// function getFormAreaDom(dom){
// 	return dom.find("> [mc-name=form-area]");
// }

function bindClick(dom, ctx, at, patientId){
	dom.on("click", dispAreaSelector, function(event){
		event.stopPropagation();
		var drug = ctx.drug;
		var message = "（暫定）診察中でありませんが、この薬剤を編集しますか？";
		if( !dom.inquire("fn-confirm-edit", [drug.visit_id, message]) ){
			return;
		}
		var form = DrugForm.createEditForm(drug, at, patientId);
		form.on("cancel", function(event){
			event.stopPropagation();
			getDispAreaDom(dom).show();
			getFormAreaDom(dom).empty();
		});
		form.on("modified", function(event, newDrug){
			event.stopPropagation();
			dom.trigger("drug-modified", [newDrug]);
			getDispAreaDom(dom).show();
			getFormAreaDom(dom).empty();
		});
		form.on("deleted", function(event){
			event.stopPropagation();
			dom.trigger("drug-deleted", [drug.drug_id, drug.visit_id]);
		});
		var formArea = getFormAreaDom(dom);
		formArea.append(form);
		getDispAreaDom(dom).hide();
	});
}

// function bindFormModified(dom, form){
// 	form.on("drug-modified", function(event, newDrug){
// 		event.stopPropagation();
// 		form.remove();
// 		var dispDom = getDispDom(dom);
// 		dispDom.find("[mc-name=label]").text(mUtil.drugRep(newDrug));
// 		dispDom.show();
// 	});
// }

// function bindFormCancel(dom, form){
// 	form.on("cancel-form", function(event){
// 		event.stopPropagation();
// 		form.remove();
// 		getDispDom(dom).show();
// 	});
// }

// function bindFormDelete(dom, form, visitId){
// 	form.on("drug-deleted", function(event){
// 		event.stopPropagation();
// 		var parent = dom.parent();
// 		dom.remove();
// 		parent.trigger("number-of-drugs-changed", [visitId]);
// 		parent.trigger("drugs-need-renumbering", [visitId]);
// 	});
// }



