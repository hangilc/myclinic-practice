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

reg("suspend_exam", function(conn, req, res, cb){
	var patientId = req.query.patient_id;
	db.suspendExam(conn, patientId, cb);
});

reg("get_patient", function(conn, req, res, cb){
	var patientId = req.query.patient_id;
	db.getPatient(conn, patientId, cb);
})