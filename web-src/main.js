"use strict";

var $ = require("jquery");
var conti = require("conti");
var service = require("./service");
var registry = require("../hc-registry");
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

var itemsPerPage = 10;

var currentPatientId = 0;
var currentVisitId = 0;
var tempVisitId = 0;
var currentPage = 0;
var totalPages = 0;

registry.set("getCurrentVisitId", function(){
	return currentVisitId;
});

registry.set("getTempVisitId", function(){
	return tempVisitId;
});

PatientInfo.setup($("#patient-info-wrapper"));

CurrentManip.setup($("#current-manip-pane"));

$(".record-nav-wrapper").each(function(i){
	RecordNav.setup($(this));
});

RecordList.setup($("#record-list"));

var disease = new Disease($("#disease-wrapper")).render();

new SelectPatient($("#select-patient-wrapper")).update();
new SearchPatient($("#search-patient-wrapper")).update();
RecentVisits.setup($("#recent-visits-wrapper"));
new TodaysVisits($("#todays-visits-wrapper")).update();

$("#reception-link").click(function(event){
	event.preventDefault();
	Reception.open();
});

function calcNumberOfPages(totalItems, itemsPerPage){
	return Math.floor((totalItems + itemsPerPage - 1)/itemsPerPage);
}

function adjustPage(page, numPages){
	if( numPages <= 0 ){
		page = 0;
	} else {
		if( page <= 0 ){
			page = 1;
		} else if( page > numPages ){
			page = numPages;
		}
	}
	return page;
}

function resetRecordNavData(totalVisits){
	totalPages = calcNumberOfPages(totalVisits, itemsPerPage);
	currentPage = adjustPage(1, totalPages);
}

function setStates(patientId, visitId){
	currentPatientId = +patientId;
	currentVisitId = +visitId;
	tempVisitId = 0;
}

function clearStates(){
	currentPatientId = 0;
	currentVisitId = 0;
	tempVisitId = 0;
}

function clearComponents(){
	$("body").trigger("patient-changed", [null]);
	$("body").trigger("visit-changed", [0, 0]);
	resetRecordNavData(0);
	$("body").trigger("page-settings-changed", [{
		totalPages: totalPages,
		currentPage: currentPage
	}]);
	$("body").trigger("record-list-changed", [[]]);
	disease.update(null);
}

function updateComponents(){
	conti.exec([
		function(done){
			service.getPatient(currentPatientId, function(err, patient){
				if( err ){
					done(err);
					return;
				}
				$("body").trigger("patient-changed", [patient]);
				$("body").trigger("visit-changed", [currentPatientId, currentVisitId]);
				done();
			});
		},
		function(done){
			service.calcVisits(currentPatientId, function(err, count){
				if( err ){
					done(err);
					return;
				}
				resetRecordNavData(count);
				$("body").trigger("page-settings-changed", [{
					totalPages: totalPages,
					currentPage: currentPage
				}]);
				$("body").trigger("goto-page", [1]);
				done();
			})
		},
		function(done){
			service.listCurrentFullDiseases(currentPatientId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				disease.update(result);
				done();
			})
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
	})
}

$("body").on("start-patient", function(event, patientId){
	conti.exec([
		function(done){
			if( currentVisitId > 0 ){
				service.suspendExam(currentVisitId, done);
			} else {
				done();
			}
		},
		function(done){
			clearStates();
			clearComponents();
			done();
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		setStates(patientId, 0);
		updateComponents();
	})
});

$("body").on("start-exam", function(event, visitId){
	conti.exec([
		function(done){
			if( currentVisitId > 0 ){
				service.suspendExam(currentVisitId, done);
			} else {
				done();
			}
		},
		function(done){
			clearStates();
			clearComponents();
			done();
		},
		function(done){
			service.startExam(visitId, done);
		},
		function(done){
			service.getVisit(visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				setStates(result.patient_id, visitId);
				done();
			})
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		updateComponents();
	})
});

$("body").on("page-settings-changed", function(event, setting){
	$("body").find(".rx-page-settings-changed").each(function(){
		$(this).data("rx-page-settings-changed")(setting);
	})
});

$("body").on("record-list-changed", function(event, list){
	$("body").find(".rx-record-list-changed").each(function(){
		$(this).data("rx-record-list-changed")(list);
	})
});


$("body").on("goto-page", function(event, page){
	if( currentPatientId <= 0 ){
		$("body").trigger("record-list-changed", [[]]);
		return;
	}
	currentPage = adjustPage(page, totalPages);
	$("body").trigger("page-settings-changed", [{
		totalPages: totalPages,
		currentPage: currentPage
	}]);
	var offset = itemsPerPage * (currentPage-1);
	service.listFullVisits(currentPatientId, offset, itemsPerPage, function(err, result){
		if( err ){
			alert(err);
			return;
		}
		$("body").trigger("record-list-changed", [result]);
	});
});

$("body").on("patient-changed", function(event, data){
	$(".rx-patient-changed").each(function(){
		$(this).data("rx-patient-changed")(data);
	})	
});




/*$("body").on("visit-deleted", function(event, visitId){
	if( currentVisitId === visitId ){
		currentVisitId = 0;
	} else if( tempVisitId === visitId ){
		tempVisitId = 0;
	}
	conti.exec([
		function(done){
			service.calcVisits(currentPatientId, function(err, count){
				if( err ){
					done(err);
					return;
				}
				$("body").trigger("total-visits-changed", [count, true]);
				done();
			})
		},
	], function(err){
		if( err ){
			alert(err);
			return;
		}
	})
});

$("body").on("end-patient", function(event){
	event.stopPropagation();
	conti.exec([
		function(done){
			if( currentVisitId > 0 ){
				service.suspendExam(currentVisitId, done);
			} else {
				done();
			}
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		clearStates();
		clearComponents();
	});
});

coop.publish($("body"), "page-settings-changed");

coop.trigger($("body"), "page-settings-changed", {
	totalPages: 3,
	currentPage: 2
});







$("body").trigger("patient-changed", [null]);

$("body").on("visit-changed", function(event, patientId, visitId){
	$(".rx-visit-changed").each(function(){
		$(this).data("rx-visit-changed")(patientId, visitId);
	})	
});

$("body").trigger("visit-changed", [0, 0]);

$("body").on("total-visits-changed", function(event, count, triggerPageLoad){
	$(".rx-total-visits-changed").each(function(){
		$(this).data("rx-total-visits-changed")(count, triggerPageLoad);
	})	
});

$("body").trigger("total-visits-changed", [0, true]);

$("body").on("set-temp-visit-id", function(event, visitId){
	if( currentVisitId > 0 ){
		alert("現在診察中なので、暫定診察設定ができません。");
		return;
	}
	tempVisitId = visitId;
	$(".rx-set-temp-visit-id").each(function(){
		$(this).data("rx-set-temp-visit-id")(visitId);
	})
});*/