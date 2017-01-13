"use strict";

var service = require("myclinic-service-api");
var conti = require("conti");
var rcptUtil = require("../rcpt-util");
var moment = require("moment");

var args = {};
var searchStr = location.search.substring(1);
searchStr.split("&").forEach(function(part){
	var tokens = part.split("=");
	var key = decodeURIComponent(tokens[0]);
	var val = tokens.length >= 2 ? decodeURIComponent(tokens[1]) : "";
	args[key] = val;
});
var textId;
if( /^\d+$/.test(args.text_id) ){
	textId = +args.text_id;
	//document.getElementById("form").submit();
} else {
	document.getElementById("error").appendChild(
		document.createTextNode("cannot find text_id")
	);
}

var text, visit, patient, futanWari;
conti.exec([
	function(done){
		service.getText(textId, function(err, result){
			if( err ){
				done(err);
				return;
			}
			text = result;
			done();
		});
	},
	function(done){
		service.getVisitWithFullHoken(text.visit_id, function(err, result){
			if( err ){
				done(err);
				return;
			}
			visit = result;
			done();
		});
	},
	function(done){
		service.getPatient(visit.patient_id, function(err, result){
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
	futanWari = rcptUtil.calcFutanWari(visit, patient);
	var data = {
		drugs: text.content,
		"futan-wari": futanWari
	};
	extendShohousenData(data, {
		patient: patient,
		visit: visit
	});
	document.getElementById("data").value = JSON.stringify(data);
	document.getElementById("form").submit();
});

function extendShohousenData(data, dbData){
	var patient = dbData.patient;
	if( patient ){
		var lastName = patient.last_name || "";
		var firstName = patient.first_name || "";
		if( lastName || firstName ){
			data.shimei = lastName + firstName;
		}
		if( patient.birth_day && patient.birth_day !== "0000-00-00" ){
			var birthday = moment(patient.birth_day);
			if( birthday.isValid() ){
				data.birthday = [birthday.year(), birthday.month()+1, birthday.date()];
			}
		}
		if( patient.sex === "M" || patient.sex === "F" ){
			data.sex = patient.sex;
		}
	}
	var visit = dbData.visit;
	if( visit ){
		var shahokokuho = visit.shahokokuho;
		if( shahokokuho ){
			data["hokensha-bangou"] = "" + shahokokuho.hokensha_bangou;
			data.hihokensha = [shahokokuho.hihokensha_kigou || "", shahokokuho.hihokensha_bangou || ""].join(" ・ ");
			if( 0 === +shahokokuho.honnin ){
				data["kubun-hifuyousha"] = true;
			} else if( 1 === +shahokokuho.honnin ){
				data["kubun-hihokensha"] = true;
			}
		}
		var koukikourei = visit.koukikourei;
		if( koukikourei ){
			data["hokensha-bangou"] = "" + koukikourei.hokensha_bangou;
			data["hihokensha"] = "" + koukikourei.hihokensha_bangou;
		}
		var kouhi_list = visit.kouhi_list || [];
		if( kouhi_list.length > 0 ){
			data["kouhi-1-futansha"] = kouhi_list[0].futansha;
			data["kouhi-1-jukyuusha"] = kouhi_list[0].jukyuusha;
		}
		if( kouhi_list.length > 1 ){
			data["kouhi-2-futansha"] = kouhi_list[1].futansha;
			data["kouhi-2-jukyuusha"] = kouhi_list[1].jukyuusha;
		}
		var at = moment(visit.v_datetime);
		//var at = moment();
		data["koufu-date"] = [at.year(), at.month()+1, at.date()];
	}
}
