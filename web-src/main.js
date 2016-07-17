"use strict";

var $ = require("jquery");
var conti = require("conti");
var service = require("./service");
var RecentVisits = require("./recent-visits");
var PatientInfo = require("./patient-info");

var currentPatientId = 0;
var currentPatient = null;
var currentVisitId = 0;

new RecentVisits($("#recent-visits-wrapper")).render();

var patientInfo = new PatientInfo($("#patient-info-wrapper")).render();

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
			service.getPatient(patientId, function(err, patient){
				if( err ){
					done(err);
					return;
				}
				currentPatient = patient;
				patientInfo.update(patient);
				done();
			});
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
	})
});

