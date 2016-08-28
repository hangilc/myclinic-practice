"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./drug-copy-selected-form.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");
var service = require("../service");
var task = require("../task");
var conti = require("conti");

exports.create = function(drugs){
	var data = {
		drugs: drugs.map(drugToData)
	};
	var dom = $(tmpl.render(data));
	bindEnter(dom, drugs);
	bindCancel(dom);
	return dom;
};

function drugToData(drug){
	return {
		drug_id: drug.drug_id,
		label: mUtil.drugRep(drug)
	}
}

function bindEnter(dom, drugs){
	dom.on("click", "> form > .workarea-commandbox [mc-name=enter]", function(event){
		event.preventDefault();
		event.stopPropagation();
		var checked = dom.find("input[type=checkbox][name=drug]:checked").map(function(){
			return +$(this).val();
		}).get();
		var selectedDrugs = drugs.filter(function(drug){
			return checked.indexOf(drug.drug_id) >= 0;
		});
		selectedDrugs = selectedDrugs.map(function(drug){
			return mUtil.assign({}, drug);
		});
		var targetVisitId = dom.inquire("fn-get-target-visit-id");
		if( !(targetVisitId > 0) ){
			alert("コピー先の（暫定）診察がみつかりません。");
			return;
		}
		var newDays = dom.find("> form input[name=days]").val();
		var targetVisitAt;
		var enteredDrugIds;
		var newlyEnteredDrugs = [];
		task.run([
			function(done){
				service.getVisit(targetVisitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					targetVisitAt = result.v_datetime;
					done();
				})
			},
			function(done){
				conti.forEachPara(selectedDrugs, function(drug, done){
					service.resolveIyakuhinMasterAt(drug.d_iyakuhincode, targetVisitAt, function(err, result){
						if( err ){
							done(err);
							return;
						}
						var modify = {
							visit_id: targetVisitId,
							d_iyakuhincode: result.iyakuhincode
						};
						if( newDays !== "" ){
							modify.d_days = newDays;
						}
						mUtil.assign(drug, result, modify);
						console.log(drug);
						done();
					})
				}, done);
			},
			function(done){
				service.batchEnterDrugs(selectedDrugs, function(err, result){
					if( err ){
						done(err);
						return;
					}
					enteredDrugIds = result;
					done();
				});
			},
			function(done){
				conti.forEach(enteredDrugIds, function(drugId, done){
					service.getFullDrug(drugId, targetVisitAt, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newlyEnteredDrugs.push(result);
						done();
					})
				}, done);
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			//dom.trigger("drugs-batch-entered", [targetVisitId, newlyEnteredDrugs]);
			newlyEnteredDrugs.forEach(function(newDrug){
				dom.trigger("drug-entered", [newDrug]);
			});
			dom.trigger("close-workarea");
		})
	})
}

function bindCancel(dom){
	dom.on("click", "> form > .workarea-commandbox [mc-name=cancel]", function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("cancel-workarea");
	})
}