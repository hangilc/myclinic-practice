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

exports.startExam = function(visitId, done){
	request("start_exam", {visit_id: visitId}, "POST", done);
};

exports.suspendExam = function(visitId, done){
	request("suspend_exam", {visit_id: visitId}, "POST", done);
};

exports.listCurrentFullDiseases = function(patientId, cb){
	request("list_current_full_diseases", {patient_id: patientId}, "GET", cb);
};

exports.listFullWqueueForExam = function(cb){
	request("list_full_wqueue_for_exam", {}, "GET", cb);
};

exports.getVisit = function(visitId, cb){
	request("get_visit", {visit_id: +visitId}, "GET", cb);
};

exports.searchPatient = function(text, cb){
	request("search_patient", {text: text}, "GET", cb);
};

exports.listTodaysVisits = function(cb){
	request("list_todays_visits", {}, "GET", cb);
};

exports.startVisit = function(patientId, at, done){
	request("start_visit", {patient_id: patientId, at: at}, "POST", done);
};

exports.deleteVisit = function(visitId, done){
	request("delete_visit", {visit_id: visitId}, "POST", done);
};

exports.getText = function(textId, cb){
	request("get_text", {text_id: textId}, "GET", cb);
};

exports.updateText = function(text, done){
	request("update_text", text, "POST", done);
};

exports.deleteText = function(textId, done){
	request("delete_text", {text_id: textId}, "POST", done);
};
