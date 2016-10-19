"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./disease-edit-pane.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");
var kanjidate = require("kanjidate");
var task = require("../task");
var service = require("myclinic-service-api");

var dispNameSelector = "> .disease-editor [mc-name=name]";
var dispStartDateSelector = "> .disease-editor [mc-name=startDate]";
var dispEndReasonSelector = "> .disease-editor [mc-name=endReason]";
var dispEndDateSelector = "> .disease-editor [mc-name=endDate]";
var diseaseListSelector = "> .disease-list select[mc-name=select]";
var editLinkSelector = "> .commandbox [mc-name=editLink]";

exports.create = function(allDiseases){
	var data = {
		diseases: cvtAllDiseasesToData(allDiseases)
	}
	var dom = $(tmpl.render(data));
	var ctx = {
		disease: undefined
	}
	bindEdit(dom, ctx);
	bindSelectChange(dom, ctx);
	return dom;
};

function cvtAllDiseasesToData(allDiseases){
	return allDiseases.map(function(item){
		return {
			disease_id: item.disease_id,
			end_reason_label: mUtil.diseaseEndReasonToKanji(item.end_reason),
			name_label: mUtil.diseaseFullName(item),
			start_date_label: kanjidate.format(kanjidate.f3, item.start_date)
		}
	})
}

function endDateRep(endDate){
	if( endDate === "0000-00-00" ){
		return "";
	} else {
		return kanjidate.format(kanjidate.f5, endDate);
	}
}

function updateDisp(dom, disease){
	dom.find(dispNameSelector).text(mUtil.diseaseFullName(disease));
	dom.find(dispStartDateSelector).text(kanjidate.format(kanjidate.f5, disease.start_date));
	dom.find(dispEndReasonSelector).text(mUtil.diseaseEndReasonToKanji(disease.end_reason));
	dom.find(dispEndDateSelector).text(endDateRep(disease.end_date));
}

function bindEdit(dom, ctx){
	dom.on("click", editLinkSelector, function(event){
		event.preventDefault();
		if( !ctx.disease ){
			alert("傷病名が選択されていません。");
			return;
		}
		dom.trigger("kodrsu7v-selected", [ctx.disease]);
	});
}

function bindSelectChange(dom, ctx){
	dom.on("change", diseaseListSelector, function(){
		var diseaseId = $(this).val();
		var disease;
		task.run([
			function(done){
				service.getFullDisease(diseaseId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					disease = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			ctx.disease = disease;
			updateDisp(dom, disease);
		})
	});
}
