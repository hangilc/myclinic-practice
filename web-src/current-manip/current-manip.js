"use strict";

var $ = require("jquery");
var Account = require("./account");
var SearchText = require("./search-text");
var modal = require("../../myclinic-modal");
var task = require("../task");
var service = require("myclinic-service-api");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");
var tmplHtml = require("raw!./current-manip.html");
var hogan = require("hogan.js");
var referTmplSrc = require("raw!./submit-refer.html");
var referTmpl = hogan.compile(referTmplSrc);

var accountLinkSelector = "[mc-name=accountButton]";
var searchTextLinkSelector = "[mc-name=searchTextLink]";
var referLinkSelector = "[mc-name=createReferLink]";

exports.setup = function(dom, referUrl){
	var patientId = 0;
	dom.listen("rx-start-page", function(appData){
		patientId = appData.currentPatientId;
		if( appData.currentPatientId > 0 ){
			dom.html(tmplHtml);
		} else {
			dom.html("");
		}
	});
	dom.on("click", accountLinkSelector, function(event){
		event.preventDefault();
		doAccount(dom);
	});
	dom.on("click", searchTextLinkSelector, function(event){
		event.preventDefault();
		doSearchText(patientId);
	});
	dom.on("click", referLinkSelector, function(event){
		event.preventDefault();
		var patient;
		task.run([
			function(done){
				service.getPatient(patientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					patient = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
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
			modal.startModal({
				title: "紹介状発行",
				init: function(content, close){
					content = $(content);
					var referData = {
						patientName: data["patient-name"],
						jsonData: JSON.stringify(data)
					};
					content.html(referTmpl.render(referData));
					console.log(content.html());
					content.find("form").submit(function(){
						close();
					});
					content.find("[mc-name=cancelLink]").click(function(event){
						event.preventDefault();
						close();
					});
				}
			});
			return;
		})
	})
	dom.on("click", "[mc-name=endPatientButton]", function(event){
		event.preventDefault();
		dom.trigger("end-patient");
	});
};

function doAccount(dom){
	var visitId = dom.inquire("fn-get-current-visit-id");
	if( !(visitId > 0) ){
		return;
	}
	var charge, meisai;
	task.run([
		function(done){
			service.findCharge(visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				charge = result;
				done();
			})
		},
		function(done){
			if( charge ){
				done();
			} else {
				service.calcMeisai(visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					meisai = result;
					done();
				})
			}
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		if( !meisai ){
			return;
		}
		var account = Account.create(meisai, visitId);
		modal.startModal({
			title: "会計",
			init: function(content, close){
				content.appendChild(account.get(0));
				account.on("0ms9b2wl-cancel", close);
				account.on("0ms9b2wl-entered", function(){
					close();
					$("body").trigger("exam-ended");
				})
			}
		})
		//modal.open("会計", account);
	})
}

function doSearchText(patientId){
	var form = SearchText.create(patientId);
	modal.startModal({
		title: "文章検索",
		init: function(content){
			content.appendChild(form.get(0));
		}
	})
	//modal.open("文章検索", form);
}

// account dialog
// $("body").on("0ms9b2wl-cancel", function(){
// 	modal.close();
// })

// account dialog
// $("body").on("0ms9b2wl-entered", function(event){
// 	modal.close();
// 	$("body").trigger("exam-ended");
// });
