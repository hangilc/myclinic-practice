"use strict";

exports.get = {};
"use strict";

var db = require("myclinic-db");
var MasterMap = require("../master-map");

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

reg("delete_visit", function(conn, req, res, done){
	var visitId = +req.body.visit_id;
	db.safelyDeleteVisit(conn, visitId, done);
});

reg("get_text", function(conn, req, res, cb){
	var textId = +req.query.text_id;
	db.getText(conn, textId, cb);
});

reg("update_text", function(conn, req, res, done){
	var text = req.body;
	db.updateText(conn, text, done);
});

reg("delete_text", function(conn, req, res, done){
	var textId = +req.body.text_id;
	db.deleteText(conn, textId, done);
});

reg("enter_text", function(conn, req, res, cb){
	var text = req.body;
	db.insertText(conn, text, cb);
});

reg("list_available_hoken", function(conn, req, res, cb){
	var patientId = +req.query.patient_id;
	var at = req.query.at;
	db.listAvailableHoken(conn, patientId, at, cb);
});

reg("update_visit", function(conn, req, res, done){
	var data = {
		visit_id: +req.body.visit_id,
		shahokokuho_id: +req.body.shahokokuho_id,
		koukikourei_id: +req.body.koukikourei_id,
		roujin_id: +req.body.roujin_id,
		kouhi_1_id: +req.body.kouhi_1_id,
		kouhi_2_id: +req.body.kouhi_2_id,
		kouhi_3_id: +req.body.kouhi_3_id
	};
	db.updateVisit(conn, data, done);
});

reg("get_visit_with_full_hoken", function(conn, req, res, cb){
	var visitId = +req.query.visit_id;
	db.getVisitWithFullHoken(conn, visitId, cb);
});

reg("search_iyakuhin_master", function(conn, req, res, cb){
	var text = req.query.text;
	var at = req.query.at;
	db.searchIyakuhinMaster(conn, text, at, cb);
});

reg("search_presc_example", function(conn, req, res, cb){
	var text = req.query.text;
	db.searchPrescExample(conn, text, cb);
});

reg("search_full_drug_for_patient", function(conn, req, res, cb){
	var patientId = +req.query.patient_id;
	var text = req.query.text;
	db.searchFullDrugForPatient(conn, patientId, text, cb);
});

reg("resolve_iyakuhin_master_at", function(conn, req, res, cb){
	var iyakuhincode = +req.query.iyakuhincode;
	var at = req.query.at;
	iyakuhincode = MasterMap.mapIyakuhinMaster(iyakuhincode, at);
	if( iyakuhincode === 0 ){
		cb("現在使用できない薬剤です。");
		return;
	}
	db.getIyakuhinMaster(conn, iyakuhincode, at, cb);
});

reg("enter_drug", function(conn, req, res, cb){
	var drug = req.body;
	db.insertDrug(conn, drug, cb);
});

reg("get_full_drug", function(conn, req, res, cb){
	var drugId = +req.query.drug_id;
	var at = req.query.at;
	db.getFullDrug(conn, drugId, at, cb);
});

reg("list_full_drugs_for_visit", function(conn, req, res, cb){
	var visitId = +req.query.visit_id;
	var at = req.query.at;
	db.listFullDrugsForVisit(conn, visitId, at, cb);
});