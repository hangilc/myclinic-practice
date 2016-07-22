"use strict";

var $ = require("jquery");
var conti = require("conti");
var mUtil = require("../myclinic-util");
var task = require("./task");
var service = require("./service");
var appData = require("./app-data");

var RecentVisits = require("./recent-visits/recent-visits");

RecentVisits.setup($("#recent-visits-wrapper"));

var pageData = {
	currentPatientId: 0,
	currentVisitId: 0,
	tempVisitId: 0,
	currentPage: 0,
	totalPages: 0,
	itemsPerPage: 10,
};

window.getCurrentPatientId = function(){
	return pageData.currentPatientId;
};

window.getCurrentVisitId = function(){
	return pageData.currentVisitId;
};

window.getTempVisitId = function(){
	return pageData.tempVisitId;
};

$("body").on("start-patient", function(event, patientId){
	pageData.currentPatientId = patientId;
	pageData.currentVisitId = 0;
	pageData.tempVisitId = 0;
	task.run(appData.makeLoader(pageData), function(err){
		if( err ){
			alert(err);
			return;
		}
		var data = mUtil.assign({}, pageData);
		$("body").broadcast("rx-page-start", data);
	});
});