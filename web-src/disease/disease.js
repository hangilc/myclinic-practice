"use strict";

var $ = require("jquery");
var moment = require("moment");
var ListPane = require("./disease-list-pane");
var AddPane = require("./disease-add-pane");
var EndPane = require("./disease-end-pane");
var mConsts = require("myclinic-consts");

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
	var diseases = [];
	var at = moment().format("YYYY-MM-DD");
	dom.listen("rx-start-page", function(appData){
		patientId = appData.currentPatientId;
		if( patientId > 0 ){
			diseases = appData.diseases;
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
		console.log("EDIT");
	});
	// from add disease pane
	dom.on("r6ihx2oq-entered", function(event, newDisease){
		diseases.push(newDisease);
	});
	// from end disease pane
	dom.on("gvr59xqp-modified", function(event, modifiedDiseases){
		updateWithModifiedDiseases(diseases, modifiedDiseases);
		endPane();
	});

	function listPane(){
		var wa = dom.find(workareaSelector);
		wa.empty();
		wa.append(ListPane.create(diseases));
	}

	function addPane(){
		var wa = dom.find(workareaSelector);
		wa.empty();
		wa.append(AddPane.create(patientId, at));
	}

	function endPane(){
		var wa = dom.find(workareaSelector);
		wa.empty();
		wa.append(EndPane.create(diseases));
	}
};

function updateWithModifiedDiseases(diseases, modifiedDiseases){
	for(var j=0;j<modifiedDiseases.length;j++){
		var modified = modifiedDiseases[j];
		var i = findIndex(modified.disease_id);
		if( i < 0 ){
			alert("cannot find disease: " + modified.disease_id);
			return;
		}
		if( modified.end_reason !== mConsts.DiseaseEndReasonNotEnded ){
			diseases.splice(i, 1);
		} else {
			disease[i] = modified;
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
}

