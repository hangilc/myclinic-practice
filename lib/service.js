"use strict";

exports.get = {};
"use strict";

var conti = require("conti");
var db = require("myclinic-db");
var MasterMap = require("../master-map");
var mUtil = require("../myclinic-util");

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
	enterDrug(conn, drug, cb);
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

function enterDrug(conn, drug, cb){
	var at, drugId;
	conti.exec([
		function(done){
			db.getVisit(conn, drug.visit_id, function(err, result){
				if( err ){
					done(err);
					return;
				}
				at = result.v_datetime;
				done();
			})
		},
		function(done){
			db.getIyakuhinMaster(conn, drug.d_iyakuhincode, at, done);
		},
		function(done){
			db.insertDrug(conn, drug, function(err, result){
				if( err ){
					done(err);
					return;
				}
				drugId = result;
				done();
			})
		}
	], function(err){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, drugId);
	});
}

reg("batch_enter_drugs", function(conn, req, res, cb){
	var drugs = req.body;
	var enteredDrugIds = [];
	conti.forEach(drugs, function(drug, done){
		enterDrug(conn, drug, function(err, result){
			if( err ){
				done(err);
				return;
			}
			enteredDrugIds.push(result);
			done();
		})
	}, function(err){
		if( err ){
			done(err);
			return;
		}
		cb(undefined, enteredDrugIds);
	})
});

reg("batch_delete_drugs", function(conn, req, res, done){
	var drugIds = req.body;
	conti.forEachPara(drugIds, function(drugId, done){
		db.deleteDrug(conn, drugId, done);
	}, done);
});

reg("batch_update_drugs_days", function(conn, req, res, done){
	var drugIds = req.body.drug_ids;
	var days = req.body.days;
	var drugs;
	conti.exec([
		function(done){
			conti.mapPara(drugIds, function(drugId, cb){
				db.getDrug(conn, drugId, function(err, result){
					if( err ){
						cb(err);
						return;
					}
					cb(undefined, mUtil.assign({}, result));
				})
			}, function(err, result){
				if( err ){
					done(err);
					return;
				}
				drugs = result;
				done();
			})
		},
		function(done){
			drugs.forEach(function(drug){
				drug.d_days = days;
			});
			conti.forEachPara(drugs, function(drug, done){
				db.updateDrug(conn, drug, done);
			}, done);
		}
	], done);
});

reg("modify_drug", function(conn, req, res, done){
	var drug = req.body;
	var origDrug;
	conti.exec([
		function(done){
			db.getDrug(conn, drug.drug_id, function(err, result){
				if( err ){
					done(err);
					return;
				}
				origDrug = result;
				done();
			})
		},
		function(done){
			drug = mUtil.assign({}, origDrug, drug);
			db.updateDrug(conn, drug, done);
		}
	], done)
});

reg("batch_enter_shinryou", function(conn, req, res, cb){
	var shinryouList = req.body;
	var newShinryouIds = [];
	conti.forEach(shinryouList, function(shinryou, done){
		db.insertShinryou(conn, shinryou, function(err, result){
			if( err ){
				done(err);
				return;
			}
			newShinryouIds.push(result);
			done();
		})
	}, function(err){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, newShinryouIds);
	});
});

reg("get_shinryou", function(conn, req, res, cb){
	var shinryouId = +req.query.shinryou_id;
	db.getShinryou(conn, shinryouId, cb);
});

reg("get_full_shinryou", function(conn, req, res, cb){
	var shinryouId = +req.query.shinryou_id;
	var at = req.query.at;
	db.getFullShinryou(conn, shinryouId, at, cb);
});

reg("list_full_shinryou_for_visit", function(conn, req, res, cb){
	var visitId = +req.query.visit_id;
	var at = req.query.at;
	db.listFullShinryouForVisit(conn, visitId, at, cb);
});

reg("batch_delete_shinryou", function(conn, req, res, done){
	var shinryouIds = req.body;
	conti.forEachPara(shinryouIds, function(shinryouId, done){
		db.deleteShinryou(conn, shinryouId, done);
	}, done);
});

reg("search_shinryou_master", function(conn, req, res, cb){
	var text = req.query.text;
	var at = req.query.at;
	db.searchShinryouMaster(conn, text, at, cb);
});

reg("resolve_shinryou_master_at", function(conn, req, res, cb){
	var shinryoucode = +req.query.shinryoucode;
	var at = req.query.at.slice(0, 10);
	shinryoucode = MasterMap.mapShinryouMaster(shinryoucode, at);
	db.getShinryouMaster(conn, shinryoucode, at, cb);
});
