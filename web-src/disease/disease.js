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
var service = require("../service");
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

	var ctx = {
		patientId: 0,
		diseases: [],
		allDiseases: null
	};
	dom.listen("rx-start-page", function(appData){
		ctx.patientId = appData.currentPatientId;
		if( ctx.patientId > 0 ){
			ctx.diseases = appData.diseases;
			dom.html(tmplHtml);
			listPane();
		} else {
			dom.html("");
		}
	});
	dom.on("click", listLinkSelector, function(event){
		event.preventDefault();
		listPane();
	})
	dom.on("click", addLinkSelector, function(event){
		event.preventDefault();
		addPane();
	})
	dom.on("click", endLinkSelector, function(event){
		event.preventDefault();
		endPane();
	})
	dom.on("click", editLinkSelector, function(event){
		event.preventDefault();
		editPane();
	});
	// from add disease pane
	dom.on("r6ihx2oq-entered", function(event, newDisease){
		ctx.diseases.push(newDisease);
	});
	// from end disease pane
	dom.on("gvr59xqp-modified", function(event, modifiedDiseases){
		updateWithModifiedDiseases(ctx, modifiedDiseases);
		endPane();
	});
	// from edi disease pane
	dom.on("kodrsu7v-selected", function(event, disease){
		itemPane(disease);
	});
	// from item disease pane
	dom.on("cirqgerl-modified", function(event, modifiedDisease){
		updateWithModifiedDiseases(ctx, [modifiedDisease]);
		listPane();
	});

	function listPane(){
		var wa = dom.find(workareaSelector);
		wa.empty();
		wa.append(ListPane.create(ctx.diseases));
	}

	function addPane(){
		var wa = dom.find(workareaSelector);
		wa.empty();
		wa.append(AddPane.create(ctx.patientId));
	}

	function endPane(){
		var wa = dom.find(workareaSelector);
		wa.empty();
		wa.append(EndPane.create(ctx.diseases));
	}

	function editPane(){
		var wa = dom.find(workareaSelector);
		if( ctx.allDiseases ){
			wa.empty();
			wa.append(EditPane.create(ctx.allDiseases));
		} else {
			task.run([
				function(done){
					service.listAllFullDiseases(ctx.patientId, function(err, result){
						if( err ){
							done(err);
							return;
						}
						ctx.allDiseases = result;
						done();
					})
				}
			], function(err){
				wa.empty();
				wa.append(EditPane.create(ctx.allDiseases));
			})
		}
	}

	function itemPane(disease){
		var wa = dom.find(workareaSelector);
		wa.empty();
		wa.append(ItemPane.create(disease));
	}
};

function updateWithModifiedDiseases(ctx, modifiedDiseases){
	var diseases = ctx.diseases;
	var allDiseases = ctx.allDiseases;

	for(var i=0;i<modifiedDiseases.length;i++){
		var modified = modifiedDiseases[i];
		var j = findIndex(modified.disease_id);
		if( j >= 0 ){
			if( modified.end_reason !== mConsts.DiseaseEndReasonNotEnded ){
				diseases.splice(j, 1);
			} else {
				disease[j] = modified;
			}
		}

		if( allDiseases ){
			var k = findIndexForAll(modified.disease_id);
			if( k < 0 ){
				alert("cannot find in all diseases: " + modified.disease_id);
				return;
			}
			allDiseases[k] = modified;
		}
	}

	function findIndex(diseaseId){
		for(var i=0;i<diseases.length;i++){
			if( diseases[i].disease_id === diseaseId ){
				return i;
			}
		}
		return -1;
	}

	function findIndexForAll(diseaseId){
		for(var i=0;i<allDiseases.length;i++){
			if( allDiseases[i].disease_id === diseaseId ){
				return i;
			}
		}
		return -1;
	}
}

