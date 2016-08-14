"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./disease-end-pane.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");
var kanjidate = require("kanjidate");
var DateBinder = require("../../date-binder");
var moment = require("moment");
var task = require("../task");
var service = require("../service");
var conti = require("conti");

var diseaseCheckboxSelector = "> .list input[type=checkbox][name=disease]";
var endDateGengouSelector = "> .end-date select[mc-name=gengou]";
var endDateNenInputSelector = "> .end-date input[mc-name=nen]";
var endDateMonthInputSelector = "> .end-date input[mc-name=month]";
var endDateDayInputSelector = "> .end-date input[mc-name=day]";
var reasonRadioSelector = "> [mc-name=end-reason-area] input[type=radio][name=end-reason]";
var enterLinkSelector = "> .commandbox [mc-name=enterLink]";

exports.create = function(diseases){
	var data = {
		diseases: diseasesData(diseases)
	};
	var dom = $(tmpl.render(data));
	var ctx = {
		dateBinder: setupDateBinder(dom)
	}
	ctx.dateBinder.setDate(moment());
	bindEnter(dom, ctx);
	return dom;
}

function diseasesData(diseases){
	return diseases.map(function(d){
		return {
			disease_id: d.disease_id,
			name_label: mUtil.diseaseFullName(d),
			start_date_label: kanjidate.format(kanjidate.f3, d.start_date)
		}
	})
}

function setupDateBinder(dom){
	var map = {
		gengouSelect: dom.find(endDateGengouSelector),
		nenInput: dom.find(endDateNenInputSelector),
		monthInput: dom.find(endDateMonthInputSelector),
		dayInput: dom.find(endDateDayInputSelector),
	}
	return DateBinder.bind(map);
}

function bindEnter(dom, ctx){
	dom.on("click", enterLinkSelector, function(event){
		event.preventDefault();
		var diseaseIds = dom.find(diseaseCheckboxSelector + ":checked").map(function(){
			return +$(this).val();
		}).get();
		var dateOpt = ctx.dateBinder.getDate();
		if( !dateOpt.ok ){
			alert(dateOpt.error);
			return;
		}
		var endDate = dateOpt.sqlDate;
		var reason = dom.find(reasonRadioSelector + ":checked").val();
		console.log(diseaseIds, endDate, reason);
		var diseases = [], newDiseases = [];
		task.run([
			function(done){
				conti.forEach(diseaseIds, function(diseaseId, done){
					service.getDisease(diseaseId, function(err, result){
						if( err ){
							done(err);
							return;
						}
						diseases.push(result);
						done();
					})
				}, done);
			},
			function(done){
				diseases.forEach(function(disease){
					disease.end_reason = reason;
					disease.end_date = endDate;
				});
				service.batchUpdateDiseases(diseases, done);
			},
			function(done){
				conti.forEach(diseaseIds, function(diseaseId, done){
					service.getFullDisease(diseaseId, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newDiseases.push(result);
						done();
					})
				}, done);
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("gvr59xqp-modified", [newDiseases]);
		})
	})
}
