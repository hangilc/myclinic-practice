"use strict";

var $ = require("jquery");
var conti = require("conti");
var service = require("./service");
var PatientInfo = require("./patient-info/patient-info");
var CurrentManip = require("./current-manip/current-manip");
var RecordNav = require("./record-nav");
var RecordList = require("./record-list");
var Disease = require("./disease");
var SelectPatient = require("./select-patient");
var SearchPatient = require("./search-patient");
var RecentVisits = require("./recent-visits/recent-visits");
var TodaysVisits = require("./todays-visits");
var Reception = require("./reception");

var currentPatientId = 0;
var currentPatient = null;
var currentVisitId = 0;
var tempVisitId = 0;

var itemsPerPage = 10;

PatientInfo.setup($("#patient-info-wrapper"));

CurrentManip.setup($("#current-manip-pane"));

var recordNavs = $(".record-nav-wrapper").map(function(index, e){
	return new RecordNav($(e), itemsPerPage).render();
}).get();

var recordList = new RecordList($("#record-list")).render();

var disease = new Disease($("#disease-wrapper")).render();

new SelectPatient($("#select-patient-wrapper")).update();
new SearchPatient($("#search-patient-wrapper")).update();
RecentVisits.setup($("#recent-visits-wrapper"));
new TodaysVisits($("#todays-visits-wrapper")).update();

$("#reception-link").click(function(event){
	event.preventDefault();
	Reception.open();
});

function setStates(patientId, visitId){
	currentPatientId = +patientId;
	currentPatient = null;
	currentVisitId = +visitId;
}

function clearStates(){
	currentPatientId = 0;
	currentPatient = null;
	currentVisitId = 0;
}

function clearComponents(){
	//patientInfo.update(null);
	$("body").trigger("patient-changed", [null]);
	$("body").trigger("visit-changed", [0, 0]);
	//currentManip.update(0, 0);
	recordNavs.forEach(function(nav){
		nav.setTotalItems(0);
		nav.update(0);
	});
	recordList.update(0, 0, 0, function(){});
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
				currentPatient = patient;
				//patientInfo.update(patient);
				$("body").trigger("patient-changed", [patient]);
				$("body").trigger("visit-changed", [currentPatientId, currentVisitId]);
				//currentManip.update(currentPatientId, currentVisitId);
				done();
			});
		},
		function(done){
			service.calcVisits(currentPatientId, function(err, count){
				if( err ){
					done(err);
					return;
				}
				recordNavs.forEach(function(nav){
					nav.setTotalItems(count);
				});
				$("body").trigger("goto-page", 1);
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

$("body").on("goto-page", function(event, page){
	if( currentPatientId <= 0 ){
		return;
	}
	if( page <= 0 ){
		page = 1;
	}
	var offset = itemsPerPage * (page-1);
	recordNavs.forEach(function(nav){
		nav.update(page);
	})
	recordList.update(currentPatientId, offset, itemsPerPage, function(err){
		if( err ){
			alert(err);
			return;
		}
	})
});

$("body").on("visit-deleted", function(event, visitId){
	if( !(currentPatientId > 0) ){
		return;
	}
	var page = recordNavs[0].currentPage;
	conti.exec([
		function(done){
			service.calcVisits(currentPatientId, function(err, count){
				if( err ){
					done(err);
					return;
				}
				recordNavs.forEach(function(nav){
					nav.setTotalItems(count);
				});
				done();
			})
		},
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		if( currentVisitId === visitId ){
			currentVisitId = 0;
		} else if( tempVisitId === visitId ){
			tempVisitId = 0;
		}
		$("body").trigger("goto-page", [page]);
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

$("body").on("patient-changed", function(event, data){
	$(".rx-patient-changed").each(function(){
		$(this).data("rx-patient-changed")(data);
	})	
});

$("body").trigger("patient-changed", [null]);

$("body").on("visit-changed", function(event, patientId, visitId){
	$(".rx-visit-changed").each(function(){
		$(this).data("rx-visit-changed")(patientId, visitId);
	})	
});

$("body").trigger("visit-changed", [0, 0]);

