"use strict";

var $ = require("jquery");
var conti = require("conti");
var mUtil = require("../myclinic-util");
var task = require("./task");
var service = require("./service");
var AppData = require("./app-data");

var PatientInfo = require("./patient-info/patient-info");
var CurrentManip = require("./current-manip/current-manip");
var RecordNav = require("./record-nav/record-nav");
var RecordList = require("./record-list");
var Disease = require("./disease");
var SelectPatient = require("./select-patient");
var SearchPatient = require("./search-patient");
var RecentVisits = require("./recent-visits/recent-visits");
var TodaysVisits = require("./todays-visits");
var Reception = require("./reception");

PatientInfo.setup($("#patient-info-wrapper"));
CurrentManip.setup($("#current-manip-pane"));
$(".record-nav-wrapper").each(function(i){
	RecordNav.setup($(this), i);
});
RecordList.setup($("#record-list"));
RecentVisits.setup($("#recent-visits-wrapper"));

var appData = new AppData();

window.getCurrentVisitId = function(){
	return appData.currentVisitId;
};

window.getTempVisitId = function(){
	return appData.tempVisitId;
};

function startPage(patientId, visitId){
	appData.startPage(patientId, visitId, function(err){
		if( err ){
			alert(err);
			return;
		}
		var data = mUtil.assign({}, appData);
		$("body").broadcast("rx-start-page", data);
	});
}

$("body").on("start-patient", function(event, patientId){
	startPage(patientId, 0);
});

$("body").on("end-patient", function(event){
	startPage(0, 0);
});

$("body").on("goto-page", function(event, page){
	appData.gotoPage(page, function(err){
		if( err ){
			alert(err);
			return;
		}
		var data = mUtil.assign({}, appData);
		$("body").broadcast("rx-goto-page", data);
	})
})