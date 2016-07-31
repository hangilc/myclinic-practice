"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./drug-modify-days.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");

exports.create = function(drugs, visitId, at){
	var dom = $("<div></div>");
	var data = {
		drugs: drugs.map(function(drug){
			return {
				drug_id: drug.drug_id,
				label: mUtil.drugRep(drug)
			}
		})
	};
	dom.html(tmpl.render(data));
	bindEnter(dom, drugs, visitId);
	bindCancel(dom);
	return dom;
};

function bindEnter(dom, drugs, visitId){
	dom.on("click", "> form > .workarea-commandbox [mc-name=enter]", function(event){
		event.preventDefault();
		event.stopPropagation();
		var checked = dom.find("input[type=checkbox][name=drug]:checked").map(function(drug){
			return +$(this).val();
		}).get();
		var selectedDrugs = drugs.filter(function(drug){
			return checked.indexOf(drug.drug_id) >= 0;
		});
		var days = dom.find("input[name=days]").val().trim();
		if( days === "" ){
			alert("日数が入力されていません。");
			return;
		}
		if( !/^\d+$/.test(days) ){
			alert("日数の入力が適切でありません。");
			return;
		}
		days = +days;
		selectedDrugs = selectedDrugs.map(function(drug){
			return mUtil.assign({}, drug, {
				d_days: days
			});
		});
		console.log(selectedDrugs);
	});
}

function bindCancel(dom){
	dom.on("click", "> form > .workarea-commandbox [mc-name=cancel]", function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("cancel-workarea");
	})
}