"use strict";

var service = require("myclinic-service-api");
var conti = require("conti");
var rcptUtil = require("../rcpt-util");
var moment = require("moment");
var kanjidate = require("kanjidate");
var mUtil = require("../myclinic-util.js");

var args = {};
var searchStr = location.search.substring(1);
searchStr.split("&").forEach(function(part){
	var tokens = part.split("=");
	var key = decodeURIComponent(tokens[0]);
	var val = tokens.length >= 2 ? decodeURIComponent(tokens[1]) : "";
	args[key] = val;
});

var patientId, patient;
conti.exec([
	function(done){
		if( /^\d+$/.test(args.patient_id) ){
			patientId = +args.patient_id;
			done();
		} else {
			done("cannot find patient_id");
		}
	},
	function(done){
		service.getPatient(patientId, function(err, result){
			if( err ){
				done(err);
				return;
			}
			patient = result;
			done();
		});
	}
], function(err){
	if( err ){
		document.getElementById("error").appendChild(
			document.createTextNode(err)
		);
		return;
	}	
	var bday = (patient.birth_day && patient.birth_day === "0000-00-00") ? 
		"" : kanjidate.format(kanjidate.f5, patient.birth_day);
	var age = null;
	if( patient.birth_day && patient.birth_day !== "0000-00-00" ){
		age = mUtil.calcAge(patient.birth_day);
	}
	var data = {
		"title": "紹介状",
		"patient-name": patient.last_name + " " + patient.first_name,
		"patient-birthday": bday,
		"patient-age": age,
		"patient-sex": mUtil.sexToKanji(patient.sex)
	};
	document.getElementById("data").value = JSON.stringify(data);
	document.getElementById("form").submit();
});


