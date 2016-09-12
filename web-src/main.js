"use strict";

var $ = require("jquery");
require("../jquery-broadcast");
require("../jquery-inquire");
var conti = require("conti");
var mUtil = require("../myclinic-util");
var task = require("./task");
var service = require("myclinic-service-api");
var AppData = require("./app-data");

var PatientInfo = require("./patient-info/patient-info");
var CurrentManip = require("./current-manip/current-manip");
var RecordNav = require("./record-nav/record-nav");
var RecordList = require("./record-list");
var Disease = require("./disease/disease");
var SelectPatient = require("./select-patient/select-patient");
var SearchPatient = require("./search-patient/search-patient");
var RecentVisits = require("./recent-visits/recent-visits");
var TodaysVisits = require("./todays-visits/todays-visits");
var Reception = require("./reception/reception");
var SearchWholeText = require("./search-whole-text/search-whole-text");

PatientInfo.setup($("#patient-info-wrapper"));
CurrentManip.setup($("#current-manip-pane"));
$(".record-nav-wrapper").each(function(i){
	RecordNav.setup($(this), i);
});
RecordList.setup($("#record-list"));
Disease.setup($("#disease-wrapper"));
SelectPatient.setup($("#select-patient-wrapper"));
SearchPatient.setup($("#search-patient-wrapper"));
RecentVisits.setup($("#recent-visits-wrapper"));
TodaysVisits.setup($("#todays-visits-wrapper"));
$("#reception-link").click(function(event){
	event.preventDefault();
	Reception.open();
});
SearchWholeText.setup($("#all-text-search-link"));

var appData = new AppData();

function startPage(patientId, visitId){
	appData.startPage(patientId, visitId, function(err){
		if( err ){
			alert(err);
			return;
		}
		var data = mUtil.assign({}, appData);
		$("body").broadcast("rx-start-page", [data]);
	});
}

$("body").on("start-patient", function(event, patientId){
	startPage(patientId, 0);
});

$("body").on("start-exam", function(event, patientId, visitId){
	startPage(patientId, visitId);
});

$("body").on("end-patient", function(event){
	startPage(0, 0);
});

$("body").on("exam-ended", function(event){
	appData.clear();
	startPage(0, 0);
});

$("body").on("goto-page", function(event, page){
	appData.gotoPage(page, function(err){
		if( err ){
			alert(err);
			return;
		}
		var data = mUtil.assign({}, appData);
		$("body").broadcast("rx-goto-page", [data]);
	})
});

$("body").on("delete-visit", function(event, visitId){
	appData.deleteVisit(visitId, function(err){
		if( err ){
			alert(err);
			return;
		}
		var data = mUtil.assign({}, appData);
		$("body").broadcast("rx-delete-visit", [data]);
	})	
});

$("body").on("set-temp-visit-id", function(event, visitId, done){
	if( appData.currentVisitId > 0 ){
		done("現在診察中なので、暫定診察を設定できません。");
		return;
	}
	appData.tempVisitId = visitId;
	$("body").broadcast("rx-set-temp-visit-id", [appData]);
	done();
});

$("body").reply("fn-get-target-visit-id", function(){
	return appData.currentVisitId || appData.tempVisitId;
});

$("body").reply("fn-confirm-edit", function(visitId, message){
	if( visitId === appData.currentVisitId || visitId === appData.tempVisitId ){
		return true;
	} else {
		return confirm(message);
	}
});

$("body").reply("fn-get-current-visit-id", function(){
	return appData.currentVisitId;
});

$("body").reply("fn-get-temp-visit-id", function(){
	return appData.tempVisitId;
});


