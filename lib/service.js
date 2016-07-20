"use strict";

exports.get = {};
"use strict";

var db = require("myclinic-db");

function reg(q, f){
	if( q in exports ){
		throw q + " is already registered.";
	}
	exports[q] = f;
}

reg("recent_visits", function(conn, req, res, cb){
	db.recentVisits(conn, 20, cb);
});

reg("get_patient", function(conn, req, res, cb){
	var patientId = +req.query.patient_id;
	db.getPatient(conn, patientId, cb);
});

reg("get_visit", function(conn, req, res, cb){
	var visitId = +req.query.visit_id;
	db.getVisit(conn, visitId, cb);
})

reg("calc_visits", function(conn, req, res, cb){
	var patientId = req.query.patient_id;
	db.calcVisits(conn, patientId, cb);
});

reg("list_full_visits", function(conn, req, res, cb){
	var patientId = +req.query.patient_id;
	var offset = +req.query.offset;
	var n = +req.query.n;
	db.listFullVisitsForPatient(conn, patientId, offset, n, cb);
});

reg("suspend_exam", function(conn, req, res, done){
	var visitId = +req.body.visit_id;
	if( !(visitId > 0) ){
		done("invalid visitId");
		return;
	}
	db.suspendExam(conn, visitId, done);
});

reg("start_exam", function(conn, req, res, done){
	var visitId = +req.body.visit_id;
	if( !(visitId > 0) ){
		done("invalid visitId");
		return;
	}
	db.startExam(conn, visitId, done);
});

reg("list_current_full_diseases", function(conn, req, res, cb){
	var patientId = +req.query.patient_id;
	db.listCurrentFullDiseases(conn, patientId, cb);
});

reg("list_full_wqueue_for_exam", function(conn, req, res, cb){
	db.listFullWqueueForExam(conn, cb);
});

reg("search_patient", function(conn, req, res, cb){
	var text = req.query.text;
	db.searchPatient(conn, text, cb);
});

reg("list_todays_visits", function(conn, req, res, cb){
	db.listTodaysVisits(conn, cb);
});

reg("start_visit", function(conn, req, res, done){
	var patientId = +req.body.patient_id;
	var at = req.body.at;
	db.startVisit(conn, patientId, at, done);
});
