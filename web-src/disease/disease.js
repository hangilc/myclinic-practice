"use strict";

var $ = require("jquery");
var moment = require("moment");
var ListPane = require("./disease-list-pane");
var AddPane = require("./disease-add-pane");

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

	dom.html(tmplHtml);
	var patientId = 0, diseases = [];
	var at = moment().format("YYYY-MM-DD");
	dom.listen("rx-start-page", function(appData){
		patientId = appData.currentPatientId;
		if( patientId > 0 ){
			diseases = appData.diseases;
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
		console.log("END");
	})
	dom.on("click", editLinkSelector, function(event){
		event.preventDefault();
		console.log("EDIT");
	})

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
};



