"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./disease-add-pane.html");
var tmpl = hogan.compile(tmplSrc);
var resultTmplSrc = require("raw!./disease-add-pane-search-result.html");
var resultTmpl = hogan.compile(resultTmplSrc);
var task = require("../task");
var service = require("../service");
var conti = require("conti");
var moment = require("moment");
var DateBinder = require("../../date-binder");
var mUtil = require("../../myclinic-util");

var gengouSelector = "> .start-date select[mc-name=gengou]";
var nenInputSelector = "> .start-date input[mc-name=nen]";
var monthInputSelector = "> .start-date input[mc-name=month]";
var dayInputSelector = "> .start-date input[mc-name=day]";

var messageSelector = "> [mc-name=message]";
var dispSelector = "> [mc-name=disp-area] [mc-name=name]";
var enterLinkSelector = "> .commandbox [mc-name=enterLink]";
var addSuspectLinkSelector = "> .commandbox [mc-name=suspectLink]";
var deleteAdjLinkSelector = "> .commandbox [mc-name=deleteAdjLink]";
var searchFormSelector = "> form[mc-name=search-form]";
var exampleLinkSelector = "> form[mc-name=search-form] [mc-name=exampleLink]";
var searchModeInput = "> form[mc-name=search-form] input[type=radio][name=search-kind]"
var searchTextSelector = "> form[mc-name=search-form] input[mc-name=searchText]";
var searchLinkSelector = "> form[mc-name=search-form] [mc-name=searchLink]";
var searchResultSelector = "> form[mc-name=search-form] select[mc-name=searchResult]";

var diseaseExamplesSrc = [
    '急性上気道炎',
    '急性気管支炎',
    'アレルギー性鼻炎',
    'アレルギー性結膜炎',
    '気管支喘息',
    '急性胃腸炎',
    '頭痛',
    '糖尿病',
    ['糖尿病の疑い', { disease:'糖尿病', adj:['の疑い'] }],
    'インフルエンザＡ型',
    ['(の疑い)', { adj:['の疑い'] }]
];

var diseaseExamplesData = parseDiseaseExamplesSrc(diseaseExamplesSrc);

exports.create = function(patientId){
	var dom = $(tmpl.render({}));
	var ctx = {
		shoubyoumeiMaster: undefined,
		shuushokugoMasters: [],
		dateBinder: DateBinder.bind(mkStartDateMap(dom)),
		patientId: patientId
	};
	ctx.dateBinder.setDate(moment());
	bindEnter(dom, ctx);
	bindAddSusp(dom, ctx);
	bindDeleteAdj(dom, ctx);
	bindSearch(dom, ctx.dateBinder);
	bindExampleLink(dom);
	bindSearchResult(dom, ctx);
	return dom;
};

function mkStartDateMap(dom){
	return {
		gengouSelect: dom.find(gengouSelector),
		nenInput: dom.find(nenInputSelector),
		monthInput: dom.find(monthInputSelector),
		dayInput: dom.find(dayInputSelector)
	};
}

function parseDiseaseExamplesSrc(src){
	return src.map(function(item){
		if( item instanceof Array ){
			return {
				label: item[0],
				config: item[1]
			}
		} else {
			return {
				label: item,
				config: { disease: item, adj: [] }
			}
		}
	});
}

function fillExampleOptions(select){
	var data = diseaseExamplesData;
	select.empty();
	data.forEach(function(item){
		var opt = $("<option>X</option>");
		opt.text(item.label);
		opt.data("config", item.config);
		opt.data("mode", "example");
		select.append(opt);
	})
}

function bindEnter(dom, ctx){
	dom.on("click", enterLinkSelector, function(event){
		event.preventDefault();
		if( !ctx.shoubyoumeiMaster ){
			alert("傷病名が指定されていません。");
			return;
		}
		var shoubyoumeicode = ctx.shoubyoumeiMaster.shoubyoumeicode;
		var patientId = ctx.patientId;
		var startDate = getStartDate(ctx.dateBinder);
		if( !startDate ){
			alert("開始日の設定が不適切です。");
			return;
		}
		var shuushokugocodes = ctx.shuushokugoMasters.map(function(master){
			return master.shuushokugocode;
		});
		var diseaseId, newDisease;
		task.run([
			function(done){
				service.enterDisease(shoubyoumeicode, patientId, startDate, shuushokugocodes, function(err, result){
					if( err ){
						done(err);
						return;
					}
					diseaseId = result;
					done();
				})
			},
			function(done){
				service.getFullDisease(diseaseId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newDisease = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			var name = dom.find(dispSelector).text();
			dom.find(messageSelector).text(name + "が入力されました。").show();
			dom.trigger("r6ihx2oq-entered", [newDisease]);
		})
	})
}

function bindAddSusp(dom, ctx){
	dom.on("click", addSuspectLinkSelector, function(event){
		event.preventDefault();
		var master;
		task.run([
			function(done){
				service.getShuushokugoMasterByName("の疑い", function(err, result){
					if( err ){
						done(err);
						return;
					}
					master = result;
					done();
				});
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			ctx.shuushokugoMasters.push(master);
			updateDisp(dom, ctx);
		})
	})
}

function bindDeleteAdj(dom, ctx){
	dom.on("click", deleteAdjLinkSelector, function(event){
		event.preventDefault();
		ctx.shuushokugoMasters = [];
		updateDisp(dom, ctx);
	})
}

function searchShoubyoumei(dom, text, at){
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
			});
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		var list = searchResult.map(function(item){
			return {
				name: item.name,
				mode: "disease",
				code: item.shoubyoumeicode
			};
		});
		var resultSelect = dom.find(searchResultSelector);
		resultSelect.html(resultTmpl.render({list: list}));
	});
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
			});
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		var list = searchResult.map(function(item){
			return {
				name: item.name,
				mode: "adj",
				code: item.shuushokugocode
			};
		});
		var resultSelect = dom.find(searchResultSelector);
		resultSelect.html(resultTmpl.render({list: list}));
	});
}

function getStartDate(dateBinder){
	var optDate = dateBinder.getDate();
	if( !optDate.ok ){
		alert("開始日が適切に設定されていません。\n" + optDate.error);
		return null;
	} else {
		return optDate.sqlDate;
	}
}

function bindSearch(dom, dateBinder){
	dom.on("submit", searchFormSelector, function(event){
		event.preventDefault();
		var at = getStartDate(dateBinder);
		if( !at ){
			return;
		}
		var text = dom.find(searchTextSelector).val().trim();
		if( text === "" ){
			return;
		}
		var mode = dom.find(searchModeInput+":checked").val();
		if( mode === "disease" ){
			searchShoubyoumei(dom, text, at);
		} else if( mode === "adj" ){
			searchShuushokugo(dom, text);
		} else {
			alert("unknown search mode: " + mode);
			return;
		}
	})
}

function bindExampleLink(dom){
	dom.on("click", exampleLinkSelector, function(event){
		event.preventDefault();
		var select = dom.find(searchResultSelector);
		fillExampleOptions(select);
	});
}

function updateDisp(dom, ctx){
	var disease = {
		name: ctx.shoubyoumeiMaster ? ctx.shoubyoumeiMaster.name : "",
		adj_list: ctx.shuushokugoMasters
	};
	var fullName = mUtil.diseaseFullName(disease);
	dom.find(dispSelector).text(fullName);
}

function selectShoubyoumei(dom, code, ctx){
	var at = getStartDate(ctx.dateBinder);
	if( !at ){
		return;
	}
	var master;
	task.run([
		function(done){
			service.getShoubyoumeiMaster(code, at, function(err, result){
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
			console.log(err);
			alert("この傷病名は、開始日に有効でありません。");
			return;
		}
		ctx.shoubyoumeiMaster = master;
		updateDisp(dom, ctx);
	})
}

function selectShuushokugo(dom, code, ctx){
	var master;
	task.run([
		function(done){
			service.getShuushokugoMaster(code, function(err, result){
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

function selectExample(dom, config, ctx){
	var shoubyoumeiMaster = null;
	var shuushokugoMasters = [];
	var at = getStartDate(ctx.dateBinder);
	if( !at ){
		return;
	}
	task.run([
		function(done){
			if( config.disease ){
				service.getShoubyoumeiMasterByName(config.disease, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					shoubyoumeiMaster = result;
					done();
				})
			} else {
				done();
			}
		},
		function(done){
			if( config.adj && config.adj.length > 0 ){
				conti.forEach(config.adj, function(name, done){
					service.getShuushokugoMasterByName(name, function(err, result){
						if( err ){
							done(err);
							return;
						}
						shuushokugoMasters.push(result);
						done();
					})
				}, done);
			} else {
				done();
			}
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		ctx.shoubyoumeiMaster = shoubyoumeiMaster;
		ctx.shuushokugoMasters = shuushokugoMasters;
		updateDisp(dom, ctx);
	});
}

function bindSearchResult(dom, ctx){
	dom.on("change", searchResultSelector, function(){
		var opt = dom.find(searchResultSelector + " option:selected");
		var code = opt.val();
		var mode = opt.data("mode");
		if( mode === "disease" ){
			selectShoubyoumei(dom, code, ctx);
		} else if( mode === "adj" ){
			selectShuushokugo(dom, code, ctx);
		} else if( mode === "example" ){
			selectExample(dom, opt.data("config"), ctx);
		} else {
			alert("invalid option mode: " + mode);
			return;
		}
	})
}

