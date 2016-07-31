"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./drug-delete-selected.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");
var service = require("../service");
var task = require("../task");

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
	bindEnter(dom, visitId);
	bindCancel(dom);
	return dom;
};

function bindEnter(dom, visitId){
	dom.on("click", "> form > .workarea-commandbox [mc-name=enter]", function(event){
		event.preventDefault();
		event.stopPropagation();
		var checked = dom.find("input[type=checkbox][name=drug]:checked").map(function(drug){
			return +$(this).val();
		}).get();
		task.run(function(done){
			service.batchDeleteDrugs(checked, done);
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("drugs-batch-deleted", [visitId, checked]);
			dom.trigger("number-of-drugs-changed", [visitId]);
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