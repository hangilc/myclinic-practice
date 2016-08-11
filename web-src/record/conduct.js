"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");
var ConductDisp = require("./conduct-disp");
var ConductForm = require("./conduct-form");
var task = require("../task");
var service = require("../service");
var tmplSrc = require("raw!./conduct.html");

var dispAreaSelector = "> [mc-name=disp-area]";
var workAreaSelector = "> [mc-name=work-area]";

function extendConductsWithLabel(conduct){
	conduct = mUtil.assign({}, conduct);
	conduct.kind_label = mUtil.conductKindToKanji(conduct.kind);
	conduct.drugs = conduct.drugs.map(function(drug){
		return mUtil.assign({}, drug, {
			label: mUtil.conductDrugRep(drug)
		});
	});
	conduct.kizai_list = conduct.kizai_list.map(function(kizai){
		return mUtil.assign({}, kizai, {
			label: mUtil.conductKizaiRep(kizai)
		});
	});
	return conduct;
}

exports.create = function(conduct, visitId, at){
	var visitId = conduct.visit_id;
	var conductId = conduct.id;
	conduct = extendConductsWithLabel(conduct);
	var dom = $(tmplSrc);
	getDispAreaDom(dom).append(ConductDisp.create(conduct));
	bindClick(dom, visitId, at, conduct);
	dom.on("conduct-modified", function(event, targetConductId, newConduct){
		if( conductId === targetConductId ){
			event.stopPropagation();
			var newConductEx = extendConductsWithLabel(newConduct);
			dom.broadcast("rx-conduct-modified", [targetConductId, newConductEx]);
			return;
		}
	});
	return dom;
};

function getDispAreaDom(dom){
	return dom.find(dispAreaSelector);
}

function getWorkAreaDom(dom){
	return dom.find(workAreaSelector);
}

function bindClick(dom, visitId, at, conduct){
	dom.on("click", dispAreaSelector, function(event){
		event.preventDefault();
		var conductId = conduct;
		var msg = "現在（暫定）診察中でありませんが、この処置を変更しますか？";
		if( !dom.inquire("fn-confirm-edit", [visitId, msg]) ){
			return;
		}
		var form = ConductForm.create(conduct, at);
		form.on("close", function(event){
			event.stopPropagation();
			getWorkAreaDom(dom).html("");
			getDispAreaDom(dom).show();
		});
		form.on("delete", function(event){
			event.stopPropagation();
			task.run(function(done){
				service.deleteConduct(conductId, done);
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.remove();
			})
		})
		getDispAreaDom(dom).hide();
		getWorkAreaDom(dom).append(form);
	});
}

