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
	if( method === "POST" && typeof data === "string" ){
		config.contentType = "application/json";
	}
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

exports.enterText = function(text, cb){
	request("enter_text", text, "POST", cb);
};

exports.listAvailableHoken = function(patientId, at, cb){
	request("list_available_hoken", {patient_id: patientId, at: at}, "GET", cb);
};

exports.updateVisit = function(visit, done){
	request("update_visit", visit, "POST", done);
};

exports.getVisitWithFullHoken = function(visitId, cb){
	request("get_visit_with_full_hoken", {visit_id: visitId}, "GET", cb);
};

exports.searchIyakuhinMaster = function(text, at, cb){
	request("search_iyakuhin_master", {text: text, at: at}, "GET", cb);
};

exports.searchPrescExample = function(text, cb){
	request("search_presc_example", {text: text}, "GET", cb);
};

exports.searchFullDrugForPatient = function(patientId, text, cb){
	request("search_full_drug_for_patient", {patient_id: patientId, text: text}, "GET", cb);
};

exports.resolveIyakuhinMasterAt = function(iyakuhincode, at, cb){
	request("resolve_iyakuhin_master_at", {iyakuhincode: iyakuhincode, at: at}, "GET", cb);
};

exports.enterDrug = function(drug, cb){
	request("enter_drug", drug, "POST", cb);
};

exports.getFullDrug = function(drugId, at, cb){
	request("get_full_drug", {drug_id: drugId, at: at}, "GET", cb);
};

exports.listFullDrugsForVisit = function(visitId, at, cb){
	request("list_full_drugs_for_visit", {visit_id: visitId, at: at}, "GET", cb);
};

exports.batchEnterDrugs = function(drugs, cb){
	request("batch_enter_drugs", JSON.stringify(drugs), "POST", cb);
};

exports.batchDeleteDrugs = function(drugIds, done){
	request("batch_delete_drugs", JSON.stringify(drugIds), "POST", done);
};

exports.batchUpdateDrugsDays = function(drugIds, days, done){
	var data = {
		drug_ids: drugIds,
		days: days
	};
	request("batch_update_drugs_days", JSON.stringify(data), "POST", done);
};

exports.modifyDrug = function(drug, done){
	request("modify_drug", JSON.stringify(drug), "POST", done);
};

exports.batchResolveShinryouNamesAt = function(names, at, cb){
	var body = JSON.stringify({
		names: names,
		at: at
	});
	request("batch_resolve_shinryou_names_at", body, "POST", cb);
};

exports.batchEnterShinryou = function(shinryouList, cb){
	var body = JSON.stringify(shinryouList);
	request("batch_enter_shinryou", body, "POST", cb);
};

exports.getShinryou = function(shinryouId, cb){
	request("get_shinryou", {shinryou_id: shinryouId}, "GET", cb);
};

exports.getFullShinryou = function(shinryouId, at, cb){
	request("get_full_shinryou", {shinryou_id: shinryouId, at: at}, "GET", cb);
};

exports.listFullShinryouForVisit = function(visitId, at, cb){
	request("list_full_shinryou_for_visit", {visit_id: visitId, at: at}, "GET", cb);
};

exports.batchDeleteShinryou = function(shinryouIds, done){
	request("batch_delete_shinryou", JSON.stringify(shinryouIds), "POST", done);
};

exports.searchShinryouMaster = function(text, at, cb){
	request("search_shinryou_master", {text: text, at: at}, "GET", cb);
};

exports.resolveShinryouMasterAt = function(shinryoucode, at, cb){
	request("resolve_shinryou_master_at", {shinryoucode: shinryoucode, at: at}, "GET", cb);
};

exports.enterConduct = function(conduct, cb){
	request("enter_conduct", JSON.stringify(conduct), "POST", cb);
};

exports.enterGazouLabel = function(gazouLabel, done){
	request("enter_gazou_label", JSON.stringify(gazouLabel), "POST", done);
};

exports.enterConductDrug = function(conductDrug, cb){
	request("enter_conduct_drug", JSON.stringify(conductDrug), "POST", cb);
};

exports.enterConductKizai = function(conductKizai, cb){
	request("enter_conduct_kizai", JSON.stringify(conductKizai), "POST", cb);
};

exports.resolveKizaiNameAt = function(name, at, cb){
	var data = {
		name: name,
		at: at
	};
	request("resolve_kizai_name_at", data, "GET", cb);
};

exports.batchEnterConductShinryou = function(conductShinryouList, cb){
	request("batch_enter_conduct_shinryou", JSON.stringify(conductShinryouList), "POST", cb);
};

exports.getFullConduct = function(conductId, at, cb){
	request("get_full_conduct", {conduct_id: conductId, at: at}, "GET", cb);
};

exports.enterConductDrug = function(conductDrug, cb){
	request("enter_conduct_drug", JSON.stringify(conductDrug), "POST", cb);
};

exports.copyConducts = function(srcVisitId, dstVisitId, cb){
	request("copy_conducts", {src_visit_id: srcVisitId, dst_visit_id: dstVisitId}, "POST", cb);
};

exports.deleteConduct = function(conductId, done){
	request("delete_conduct", {conduct_id: conductId}, "POST", done);
};
