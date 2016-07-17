"use strict";

var $ = require("jquery");

function request(service, data, method, cb){
	data = data || {};
	method = method || "GET";
	var config = {
		url: "./service?_q=" + service,
        type: method,
		data: data,
		dataType: "json",
		success: function(list){
			cb(undefined, list);
		},
		error: function(xhr){
			cb(xhr.responseText);
		}
	};
	$.ajax(config);
}

exports.recentVisits = function(cb){
	request("recent_visits", "", "GET", cb);
};

exports.suspendExam = function(patientId, cb){
	request("suspend_exam", {patient_id: patientId}, "GET", cb);
};

exports.getPatient = function(patientId, cb){
	request("get_patient", {patient_id: patientId}, "GET", cb);
};

