"use strict";

var $ = require("jquery");
var moment = require("moment");
var ListPane = require("./disease-list-pane");
var AddPane = require("./disease-add-pane");
var EndPane = require("./disease-end-pane");
var EditPane = require("./disease-edit-pane");
var ItemPane = require("./disease-item-pane");
var mConsts = require("myclinic-consts");
var task = require("../task");
var service = require("myclinic-service-api");
var conti = require("conti");

var tmplHtml = require("raw!./disease.html");

var workareaSelector = "> div > [mc-name=workarea]";
var listLinkSelector = "> div > [mc-name=command-box] [mc-name=listLink]";
var addLinkSelector = "> div > [mc-name=command-box] [mc-name=addLink]";
var endLinkSelector = "> div > [mc-name=command-box] [mc-name=endLink]";
var editLinkSelector = "> div > [mc-name=command-box] [mc-name=editLink]";

exports.setup = function(dom){
	if( dom.data("setup") ){
		throw new Error("duplicate setup for disease");
	}
	dom.data("setup", 1);

	var patientId = 0;
	dom.listen("rx-start-page", function(appData){
		patientId = appData.currentPatientId;
		if( patientId > 0 ){
			dom.html(tmplHtml);
			listPane(dom, patientId, appData.diseases);
		} else {
			dom.html("");
		}
	});
	dom.on("click", listLinkSelector, function(event){
		event.preventDefault();
		listPane(dom, patientId);
	})
	dom.on("click", addLinkSelector, function(event){
		event.preventDefault();
		addPane(dom, patientId);
	})
	dom.on("click", endLinkSelector, function(event){
		event.preventDefault();
		endPane(dom, patientId);
	})
	dom.on("click", editLinkSelector, function(event){
		event.preventDefault();
		editPane(dom, patientId);
	});
	// from list disease pane
	dom.on("3dynuzj3-selected", function(event, disease){
		itemPane(dom, disease);
	});
	// from add disease pane
	dom.on("r6ihx2oq-entered", function(event, newDisease, message){
		addPane(dom, patientId, message);
	});
	// from end disease pane
	dom.on("gvr59xqp-modified", function(event, modifiedDiseases){
		endPane(dom, patientId);
	});
	// from edi disease pane
	dom.on("kodrsu7v-selected", function(event, disease){
		itemPane(dom, disease);
	});
	// from item disease pane
	dom.on("cirqgerl-modified", function(event, modifiedDisease){
		listPane(dom, patientId);
	});
	dom.on("cirqgerl-deleted", function(event, deletedDiseaseId){
		listPane(dom, patientId);
	});
};

function listPane(dom, patientId, optDiseases){
	if( optDiseases ){
		invoke(optDiseases);
	} else {
		var diseases;
		task.run([
			function(done){
				service.listCurrentFullDiseases(patientId, function(err, result){
					if( err ){
						alert(err);
						return;
					}
					diseases = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			invoke(diseases);
		})
	}

	function invoke(diseases){
		var wa = dom.find(workareaSelector).empty();
		wa.append(ListPane.create(diseases));
	}
}

function addPane(dom, patientId, optMessage){
	var wa = dom.find(workareaSelector);
	wa.empty();
	wa.append(AddPane.create(patientId, optMessage));
}

function endPane(dom, patientId){
	var diseases;
	task.run([
		function(done){
			service.listCurrentFullDiseases(patientId, function(err, result){
				if( err ){
					alert(err);
					return;
				}
				diseases = result;
				done();
			})
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		var wa = dom.find(workareaSelector);
		wa.empty();
		wa.append(EndPane.create(diseases));
	})
}

function editPane(dom, patientId){
	var wa = dom.find(workareaSelector);
	var allDiseases;
	task.run([
		function(done){
			service.listAllFullDiseases(patientId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				allDiseases = result;
				done();
			})
		}
	], function(err){
		wa.empty();
		wa.append(EditPane.create(allDiseases));
	})
}

function itemPane(dom, disease){
	var wa = dom.find(workareaSelector);
	wa.empty();
	wa.append(ItemPane.create(disease));
}
