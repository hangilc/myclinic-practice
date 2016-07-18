"use strict";

var $ = require("jquery");
var conti = require("conti");
var service = require("./service");
var RecentVisits = require("./recent-visits");
var PatientInfo = require("./patient-info");
var CurrentManip = require("./current-manip");
var RecordNav = require("./record-nav");
var RecordList = require("./record-list");
var Disease = require("./disease");

var currentPatientId = 0;
var currentPatient = null;
var currentVisitId = 0;

var itemsPerPage = 10;

new RecentVisits($("#recent-visits-wrapper")).render();

var patientInfo = new PatientInfo($("#patient-info-wrapper")).render();

var currentManip = new CurrentManip($("#current-manip-pane")).render();

var recordNavs = $(".record-nav-wrapper").map(function(index, e){
	return new RecordNav($(e), itemsPerPage).render();
}).get();

var recordList = new RecordList($("#record-list")).render();

var disease = new Disease($("#disease-wrapper")).render();

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
			currentPatientId = +patientId;
			currentPatient = null;
			currentVisitId = 0;
			currentManip.update(currentPatientId, currentVisitId);
			service.getPatient(patientId, function(err, patient){
				if( err ){
					done(err);
					return;
				}
				currentPatient = patient;
				patientInfo.update(patient);
				done();
			});
		},
		function(done){
			service.calcVisits(patientId, function(err, count){
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
});

$("body").on("goto-page", function(event, page){
	if( currentPatientId <= 0 ){
		return;
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

currentManip.dom.on("end-patient", function(event){
	event.stopPropagation();
	conti.exec([
		function(done){
			if( currentVisitId > 0 ){
				service.suspendExam(currentVisitId, done);
			} else {
				done();
			}
		},
		function(done){
			currentPatientId = 0;
			currentPatient = null;
			currentVisitId = 0;
			done();
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		update();
		patientInfo.update(currentPatient);
		currentManip.update(currentPatientId, currentVisitId);
		recordNavs.forEach(function(nav){
			nav.setTotalItems(0);
			nav.update(0);
		});
		recordList.update(0, 0, 0, function(){});
	});
});

