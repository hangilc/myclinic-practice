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

exports.getPatient = function(patientId, cb){
	request("get_patient", {patient_id: patientId}, "GET", cb);
};

exports.calcVisits = function(patientId, cb){
	request("calc_visits", {patient_id: patientId}, "GET", cb);
};

exports.listFullVisits = function(patientId, offset, n, cb){
	request("list_full_visits", {patient_id: patientId, offset: offset, n: n}, "GET", cb);
};

exports.suspendExam = function(visitId, done){
	request("suspend_exam", {visit_id: visitId}, "POST", done);
};

