"use strict";

var $ = require("jquery");
require("../../jquery-inquire");
var tmplHtml = require("raw!./drug-submenu.html");
var task = require("../task");
var service = require("../service");
var mUtil = require("../../myclinic-util");
var conti = require("conti");

exports.setup = function(dom, visitId, at){
	dom.data("visible", false);
	bindCopyAll(dom, visitId, at);
	bindCopySelected(dom, visitId, at);
	bindModifyDays(dom, visitId);
	bindDeleteSelected(dom, visitId);
	bindCancel(dom);
};

exports.isVisible = function(dom){
	return dom.data("visible");
};

exports.show = function(dom){
	dom.data("visible", true);
	dom.html(tmplHtml);
};

exports.hide = function(dom){
	dom.data("visible", false);
	dom.html("");
};

function bindCopyAll(dom, visitId, at){
	dom.on("click", "[mc-name=copyAll]", function(event){
		event.preventDefault();
		event.stopPropagation();
		var targetVisitId = window.getCurrentVisitId() || window.getTempVisitId();
		if( targetVisitId === 0 ){
			alert("現在（暫定）診察中でないため、コピーできません。");
			return;
		}
		if( targetVisitId === visitId ){
			alert("自分自身にはコピーできません。");
			return;
		}
		var targetAt, drugs, enteredDrugIds, enteredDrugs = [];
		task.run([
			function(done){
				service.getVisit(targetVisitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					targetAt = result.v_datetime;
					done();
				})
			},
			function(done){
				service.listFullDrugsForVisit(visitId, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					drugs = result.map(function(item){
						return mUtil.assign({}, item);
					});
					done();
				})
			},
			function(done){
				conti.forEachPara(drugs, function(drug, done){
					service.resolveIyakuhinMasterAt(drug.d_iyakuhincode, targetAt, function(err, result){
						if( err ){
							done(err);
							return;
						}
						mUtil.assign(drug, {visit_id: targetVisitId}, result);
						done();
					})
				}, done);
			},
			function(done){
				service.batchEnterDrugs(drugs, function(err, result){
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
					service.getFullDrug(drugId, targetAt, function(err, result){
						if( err ){
							done(err);
							return;
						}
						enteredDrugs.push(result);
						done();
					})
				}, done);
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("drugs-batch-entered", [targetVisitId, enteredDrugs]);
			exports.hide(dom);
		})
	});
}

function bindCopySelected(dom, visitId, at){
	dom.on("click", "[mc-name=copySelected]", function(event){
		var targetVisitId = dom.inquire("fn-get-target-visit-id");
		if( !targetVisitId ){
			alert("現在（暫定）診察中でありません。");
			return;
		}
		if( visitId === targetVisitId ){
			alert("同じ診察にはコピーできません。");
			return;
		}
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("submenu-copy-selected", [targetVisitId]);
	})
}

function bindModifyDays(dom, visitId){
	dom.on("click", "[mc-name=modifyDays]", function(event){
		var ok = dom.inquire("fn-confirm-edit", visitId, 
			"（暫定）診察中の項目ではありませんが、薬剤を選択して日数を変更しますか？");
		if( !ok ){
			return;
		}
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("submenu-modify-days");
	})
}

function bindDeleteSelected(dom, visitId){
	dom.on("click", "[mc-name=deleteSelected]", function(event){
		var ok = dom.inquire("fn-confirm-edit", visitId, 
			"（暫定）診察中の項目ではありませんが、薬剤を選択して削除しますか？");
		if( !ok ){
			return;
		}
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("submenu-delete-selected");
	})
}

function bindCancel(dom){
	dom.on("click", "[mc-name=cancel]", function(event){
		event.preventDefault();
		exports.hide(dom);
	});
}