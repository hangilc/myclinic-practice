"use strict";

var $ = require("jquery");
var conti = require("conti");
var service = require("./service");
var RecentVisits = require("./recent-visits");
var PatientInfo = require("./patient-info");
var RecordNav = require("./record-nav");
var RecordList = require("./record-list");

var currentPatientId = 0;
var currentPatient = null;
var currentVisitId = 0;

var itemsPerPage = 10;

new RecentVisits($("#recent-visits-wrapper")).render();

var patientInfo = new PatientInfo($("#patient-info-wrapper")).render();

var recordNavs = $(".record-nav-wrapper").map(function(index, e){
	return new RecordNav($(e), itemsPerPage).render();
}).get();

var recordList = new RecordList($("#record-list")).render();

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

