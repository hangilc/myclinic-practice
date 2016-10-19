"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./disease-item-pane.html");
var resultTmplSrc = require("raw!./disease-item-pane-search-result.html");
var resultTmpl = hogan.compile(resultTmplSrc);
var mUtil = require("../../myclinic-util");
var kanjidate = require("kanjidate");
var task = require("../task");
var service = require("myclinic-service-api");
var DateBinder = require("../../date-binder");
var moment = require("moment");

var nameSelector = "> [mc-name=name-area] [mc-name=name]";
var startDateGengouSelector = "> .start-date select[mc-name=startDateGengou]";
var startDateNenInputSelector = "> .start-date input[mc-name=startDateNen]";
var startDateMonthInputSelector = "> .start-date input[mc-name=startDateMonth]";
var startDateDayInputSelector = "> .start-date input[mc-name=startDateDay]";
var endDateGengouSelector = "> .end-date select[mc-name=endDateGengou]";
var endDateNenInputSelector = "> .end-date input[mc-name=endDateNen]";
var endDateMonthInputSelector = "> .end-date input[mc-name=endDateMonth]";
var endDateDayInputSelector = "> .end-date input[mc-name=endDateDay]";
var endReasonSelector = "> [mc-name=end-reason-area] select[mc-name=endReason]";
var enterLinkSelector = "> .command-box [mc-name=enterLink]";
var deleteAdjLinkSelector = "> .command-box [mc-name=deleteAdjLink]";
var deleteLinkSelector = "> .command-box [mc-name=deleteLink]";
var searchFormSelector = "> form[mc-name=search-form]";
var searchTextInputSelector = "> form[mc-name=search-form] input[mc-name=searchText]";
var searchModeInputSelector = "> form[mc-name=search-form] input[type=radio][name=search-kind]";
var searchResultSelector = "> form[mc-name=search-form] select[mc-name=searchResult]";

exports.create = function(disease){
	var dom = $(tmplSrc);
	var ctx = {
		diseaseId: disease.disease_id,
		patientId: disease.patient_id,
		startDate: disease.start_date,
		endDate: disease.end_date,
		endReason: disease.end_reason,
		shoubyoumeiMaster: disease,
		shuushokugoMasters: disease.adj_list,
		startDateBinder: makeStartDateBinder(dom),
		endDateBinder: makeEndDateBinder(dom)
	}
	updateDisp(dom, ctx);
	bindEnter(dom, ctx);
	bindDeleteAdj(dom, ctx);
	bindDelete(dom, ctx);
	bindSearch(dom, ctx);
	bindSearchSelect(dom, ctx);
	return dom;
};

function makeStartDateBinder(dom){
	var map = {
		gengouSelect: dom.find(startDateGengouSelector),
		nenInput: dom.find(startDateNenInputSelector),
		monthInput: dom.find(startDateMonthInputSelector),
		dayInput: dom.find(startDateDayInputSelector)
	};
	return DateBinder.bind(map);
}

function makeEndDateBinder(dom){
	var map = {
		gengouSelect: dom.find(endDateGengouSelector),
		nenInput: dom.find(endDateNenInputSelector),
		monthInput: dom.find(endDateMonthInputSelector),
		dayInput: dom.find(endDateDayInputSelector)
	};
	return DateBinder.bind(map);
}

function composeFullName(ctx){
	var disease = mUtil.assign({}, ctx.shoubyoumeiMaster, {
		adj_list: ctx.shuushokugoMasters
	});
	return mUtil.diseaseFullName(disease);
}

function updateDisp(dom, ctx){
	dom.find(nameSelector).text(composeFullName(ctx));
	ctx.startDateBinder.setDate(moment(ctx.startDate));
	if( ctx.endDate === "0000-00-00"){
		ctx.endDateBinder.setDate(moment()).empty();
	} else {
		ctx.endDateBinder.setDate(moment(ctx.endDate));
	}
	dom.find(endReasonSelector).val(ctx.endReason);
}

function searchShoubyoumei(dom, text, ctx){
	var at = ctx.startDate;
	var searchResult;
	task.run([
		function(done){
			service.searchShoubyoumeiMaster(text, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				searchResult = result;
				done();
			})
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		var list = searchResult.map(function(item){
			return {
				name: item.name,
				code: item.shoubyoumeicode,
				mode: "disease"
			};
		});
		dom.find(searchResultSelector).html(resultTmpl.render({list: list}));
	})
}

function searchShuushokugo(dom, text){
	var searchResult;
	task.run([
		function(done){
			service.searchShuushokugoMaster(text, function(err, result){
				if( err ){
					done(err);
					return;
				}
				searchResult = result;
				done();
			})
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		var list = searchResult.map(function(item){
			return {
				name: item.name,
				code: item.shuushokugocode,
				mode: "adj"
			};
		});
		dom.find(searchResultSelector).html(resultTmpl.render({list: list}));
	})
}

function bindEnter(dom, ctx){
	dom.on("click", enterLinkSelector, function(event){
		event.preventDefault();
		var startDateOpt = ctx.startDateBinder.getDate();
		if( !startDateOpt.ok ){
			alert("開始日の設定が不適切です。");
			return;
		}
		var startDate = startDateOpt.sqlDate;
		var endDateOpt = ctx.endDateBinder.getDate();
		var endDate;
		if( !endDateOpt.ok ){
			if( endDateOpt.isEmpty ){
				endDate = "0000-00-00";
			} else {
				alert("終了日の設定が不適切です。");
				return;
			}
		} else {
			endDate = endDateOpt.sqlDate;
		}
		var endReason = dom.find(endReasonSelector + " option:selected").val();
		var newDisease = mUtil.assign({}, ctx.shoubyoumeiMaster, {
			disease_id: ctx.diseaseId,
			patient_id: ctx.patientId,
			start_date: startDate,
			end_reason: endReason,
			end_date: endDate
		});
		newDisease.adj_list = ctx.shuushokugoMasters.map(function(adj){
			return mUtil.assign({}, adj, {
				disease_id: ctx.diseaseId,
				shuushokugocode: adj.shuushokugocode
			});
		});
		var updatedDisease;
		task.run([
			function(done){
				service.updateDiseaseWithAdj(newDisease, done);
			},
			function(done){
				service.getFullDisease(ctx.diseaseId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					updatedDisease = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("cirqgerl-modified", [updatedDisease]);
		});
	})
}

function bindDeleteAdj(dom, ctx){
	dom.on("click", deleteAdjLinkSelector, function(event){
		event.preventDefault();
		ctx.shuushokugoMasters = [];
		updateDisp(dom, ctx);
	});
}

function bindDelete(dom, ctx){
	dom.on("click", deleteLinkSelector, function(event){
		event.preventDefault();
		if( !confirm("この傷病名を削除しますか？") ){
			return;
		}
		var diseaseId = ctx.diseaseId;
		task.run([
			function(done){
				service.deleteDiseaseWithAdj(diseaseId, done);
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("cirqgerl-deleted", [diseaseId]);
		})
	});
}

function bindSearch(dom, ctx){
	dom.on("submit", searchFormSelector, function(event){
		event.preventDefault();
		var text = dom.find(searchTextInputSelector).val().trim();
		if( text === "" ){
			return;
		}
		var mode = dom.find(searchModeInputSelector + ":checked").val();
		if( mode === "disease" ){
			searchShoubyoumei(dom, text, ctx);
		} else if( mode === "adj" ){
			searchShuushokugo(dom, text);
		} else {
			alert("unknown mode: " + mode);
			return;
		}
	});
}

function selectShoubyoumei(dom, shoubyoumeicode, ctx){
	var at = ctx.startDate;
	var master;
	task.run([
		function(done){
			service.getShoubyoumeiMaster(shoubyoumeicode, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				master = result;
				done();
			})
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		ctx.shoubyoumeiMaster = master;
		updateDisp(dom, ctx);
	})
}

function selectShuushokugo(dom, shuushokugocode, ctx){
	var master;
	task.run([
		function(done){
			service.getShuushokugoMaster(shuushokugocode, function(err, result){
				if( err ){
					done(err);
					return;
				}
				master = result;
				done();
			})
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		ctx.shuushokugoMasters.push(master);
		updateDisp(dom, ctx);
	})
}

function bindSearchSelect(dom, ctx){
	dom.on("change", searchResultSelector, function(){
		var opt = dom.find(searchResultSelector + " option:selected");
		var code = opt.val();
		var mode = opt.data("mode");
		if( mode === "disease" ){
			selectShoubyoumei(dom, code, ctx);
		} else if( mode === "adj" ){
			selectShuushokugo(dom, code, ctx);
		} else {
			alert("unknown mode: " + mode);
			return;
		}
	});
}
