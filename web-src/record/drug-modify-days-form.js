"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./drug-modify-days-form.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");
var mConst = require("myclinic-consts");
var service = require("../service");
var task = require("../task");

exports.create = function(drugs, visitId, at){
	drugs = drugs.filter(function(drug){
		return drug.d_category === mConst.DrugCategoryNaifuku;
	});
	var data = {
		drugs: drugs.map(function(drug){
			return {
				drug_id: drug.drug_id,
				label: mUtil.drugRep(drug)
			}
		})
	};
	var dom = $(tmpl.render(data));
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
		var days = dom.find("input[name=days]").val().trim();
		if( days === "" ){
			alert("日数が入力されていません。");
			return;
		}
		if( !/^\d+$/.test(days) ){
			alert("日数の入力が適切でありません。");
			return;
		}
		task.run([
			function(done){
				service.batchUpdateDrugsDays(checked, +days, done);
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("drugs-batch-modified-days", [visitId, checked, days]);
			dom.trigger("close-workarea");
		})
	});
}

function bindCancel(dom){
	dom.on("click", "> form > .workarea-commandbox [mc-name=cancel]", function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("cancel-workarea");
	})
}