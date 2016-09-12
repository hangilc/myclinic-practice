"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var mUtil = require("../../myclinic-util");
var service = require("myclinic-service-api");
var task = require("../task");
var mConsts = require("myclinic-consts");

var tmplSrc = require("raw!./drug-form.html");
var tmpl = hogan.compile(tmplSrc);
var itemTmplSrc = require("raw!./drug-form-search-result-item.html");
var itemTmpl = hogan.compile(itemTmplSrc);

var Naifuku = mConsts.DrugCategoryNaifuku;
var Tonpuku = mConsts.DrugCategoryTonpuku;
var Gaiyou = mConsts.DrugCategoryGaiyou;

var ZaikeiGaiyou = mConsts.ZaikeiGaiyou;

exports.createAddForm = function(visitId, at, patientId){
	var dom = $(tmpl.render({isCreating: true, title: "新規処方の入力"}));
	bindSearchForm(dom, visitId, at, patientId);
	bindSearchResult(dom, at);
	bindUsageExample(dom);
	bindCategoryChange(dom);
	bindClear(dom);
	bindEnter(dom, visitId, at);
	bindCancel(dom);
	return dom;
};

exports.createEditForm = function(drug, at, patientId){
	var data = {
		isEditing: true,
		title: "処方の編集",
		name: drug.name,
		iyakuhincode: drug.d_iyakuhincode,
		amount: drug.d_amount,
		unit: drug.unit,
		usage: drug.d_usage,
		days: drug.d_days,
		category: drug.d_category
	}
	var dom = $(tmpl.render(data));
	updateDisplayDom(dom, data);
	bindSearchForm(dom, drug.visit_id, at, patientId);
	bindSearchResult(dom, at);
	bindUsageExample(dom);
	bindCategoryChange(dom);
	bindClear(dom);
	bindModify(dom, drug.drug_id, at);
	bindCancel(dom);
	bindDelete(dom, drug.drug_id);
	return dom;
}

function getErrorBox(dom){
	return dom.find("> .error-box");
}

function getDisplayDom(dom){
	return dom.find("> .drug-area");
}

function getDisplayNameDom(dom){
	return dom.find("> .drug-area [mc-name=name]");
}

function getDisplayAmountLabelDom(dom){
	return dom.find("> .drug-area [mc-name=amountLabel]");
}

function getDisplayAmountInputDom(dom){
	return dom.find("> .drug-area input[mc-name=amount]");
}

function getDisplayUnitDom(dom){
	return dom.find("> .drug-area [mc-name=unit]");
}

function getDisplayUsageInputDom(dom){
	return dom.find("> .drug-area input[mc-name=usage]");
}

function getDisplayDaysRowDom(dom){
	return dom.find("> .drug-area [mc-name=daysRow]");
}

function getDisplayDaysLabelDom(dom){
	return dom.find("> .drug-area [mc-name=daysLabel]");
}

function getDisplayDaysInputDom(dom){
	return dom.find("> .drug-area input[mc-name=days]");
}

function getDisplayDaysUnitDom(dom){
	return dom.find("> .drug-area [mc-name=daysUnit]");
}

function getSearchButtonDom(dom){
	return dom.find("[mc-name=searchLink]");
}

function getSearchTextDom(dom){
	return dom.find("[mc-name=searchText]");
}

function getSearchMode(dom){
	return dom.find("input[type=radio][name=search-mode]:checked").val();
}

function getSearchSelectDom(dom){
	return dom.find("> .drug-search-area select[mc-name=searchResult]");
}

function getCheckedCategory(dom){
	return dom.find("> .drug-area input[type=radio][name=category]:checked").val();
}

function adaptToCategory(dom, category){
	var amountLabel, daysLabel, daysUnit;
	switch(category){
		case Naifuku: 
			amountLabel = "用量";
			daysLabel = "日数";
			daysUnit = "日分";
			break;
		case Tonpuku:
			amountLabel = "一回";
			daysLabel = "回数";
			daysUnit = "回分";
			break;
		case Gaiyou:
			amountLabel: "";
			amountLabel = "用量";
			daysLabel = "";
			daysUnit = "";
			break;
		default: alert("unknown category"); return;
	}
	getDisplayAmountLabelDom(dom).text(amountLabel);
	getDisplayDaysLabelDom(dom).text(daysLabel);
	if( category === Gaiyou ){
		getDisplayDaysRowDom(dom).hide();
	} else {
		getDisplayDaysRowDom(dom).show();
	}
	getDisplayDaysUnitDom(dom).text(daysUnit);
}

function updateDisplayCategory(dom, category){
	dom.find("> .drug-area input[type=radio][name=category][value=" + category + "]").prop("checked", true);
	adaptToCategory(dom, category);
}

function updateDisplayDom(dom, data){
	getDisplayDom(dom).data("iyakuhincode", data.iyakuhincode);
	getDisplayNameDom(dom).text(data.name);
	getDisplayAmountInputDom(dom).val(data.amount);
	getDisplayUnitDom(dom).text(data.unit);
	getDisplayUsageInputDom(dom).val(data.usage);
	getDisplayDaysInputDom(dom).val(data.days);
	updateDisplayCategory(dom, data.category);
}

function fixedDays(dom){
	var input = dom.find("> .drug-area input[mc-name=fixedDaysCheck]:visible");
	return input.length > 0 ? input.prop("checked") : false;
}

function preserveUsageEtc(dom){
	var input = dom.find("> .drug-area input[mc-name=preserveUsage]:visible");
	return input.length > 0 ? input.prop("checked") : false;
}

function updateDisplay(dom, data, at){
	var iyakuhincode = +data.iyakuhincode;
	var master;
	task.run(function(done){
		service.resolveIyakuhinMasterAt(iyakuhincode, at, function(err, result){
			if( err ){
				done(err);
				return;
			}
			master = result;
			done();
		})
	}, function( err ){
		if( err ){
			alert(err);
			return;
		}
		if( master === null ){
			alert("現在使用できない薬剤です。");
			return;
		}
		var dispData = {
			iyakuhincode: master.iyakuhincode,
			name: master.name,
			amount: data.amount,
			unit: data.unit,
			usage: data.usage,
			days: data.days,
			category: data.category
		};
		if( fixedDays(dom) && getDisplayDaysInputDom(dom).val() !== "" ){
			dispData.days = getDisplayDaysInputDom(dom).val();
		}
		if( preserveUsageEtc(dom) ){
			mUtil.assign(dispData, {
				amount: getDisplayAmountInputDom(dom).val(),
				usage: getDisplayUsageInputDom(dom).val(),
				days: getDisplayDaysInputDom(dom).val()
			});
		}
		updateDisplayDom(dom, dispData);
	});
}

function clearDisplay(dom){
	getErrorBox(dom).html("").hide();
	getDisplayDom(dom).removeData("iyakuhincode");
	getDisplayNameDom(dom).text("");
	getDisplayAmountInputDom(dom).val("");
	getDisplayUsageInputDom(dom).val("");
	getDisplayDaysInputDom(dom).val("");
}

function updateSearchResult(dom, dataList){
	var select = getSearchSelectDom(dom).html("");
	dataList.forEach(function(data){
		var opt = $(itemTmpl.render(data));
		opt.data("data", data);
		select.append(opt);
	})
}

function masterToData(master){
	return {
		label: master.name,
		iyakuhincode: master.iyakuhincode,
		amount: "",
		unit: master.unit,
		usage: "",
		days: "",
		category: (+master.zaikei) === ZaikeiGaiyou ? Gaiyou : Naifuku
	}
}

function searchMaster(dom, text, at){
	var list;
	if( text === "" ){
		return;
	}
	task.run(function(done){
		service.searchIyakuhinMaster(text, at, function(err, result){
			if( err ){
				done(err);
				return;
			}
			list = result;
			done();
		})
	}, function(err){
		if( err ){
			alert(err);
			return;
		}
		updateSearchResult(dom, list.map(masterToData));
	});
}

function convertPrescExampleToDrug(ex){
	var drug = {};
	Object.keys(ex).forEach(function(key){
		var val = ex[key];
		if( key.startsWith("m_") ){
			key = "d_" + key.slice(2);
		}
		drug[key] = val;
	});
	return drug;
}

function stockToData(stock){
	var drug = convertPrescExampleToDrug(stock);
	return {
		label: mUtil.drugRep(drug),
		iyakuhincode: drug.d_iyakuhincode,
		amount: drug.d_amount,
		unit: stock.unit,
		usage: drug.d_usage,
		days: drug.d_days,
		category: drug.d_category
	}
}

function searchStock(dom, text){
	var list;
	if( text === "" ){
		return;
	}
	task.run(function(done){
		service.searchPrescExample(text, function(err, result){
			if( err ){
				done(err);
				return;
			}
			list = result;
			done();
		})
	}, function(err){
		if( err ){
			alert(err);
			return;
		}
		var dataList = list.map(stockToData);
		updateSearchResult(dom, dataList);
	});
}

function prevToData(prev){
	return {
		label: mUtil.drugRep(prev),
		iyakuhincode: prev.d_iyakuhincode,
		amount: prev.d_amount,
		unit: prev.unit,
		usage: prev.d_usage,
		days: prev.d_days,
		category: prev.d_category
	}
}

function searchPrev(dom, patientId, text){
	var list;
	task.run(function(done){
		service.searchFullDrugForPatient(patientId, text, function(err, result){
			if( err ){
				done(err);
				return;
			}
			list = result;
			done();
		})
	}, function(err){
		if( err ){
			alert(err);
			return;
		}
		updateSearchResult(dom, list.map(prevToData));
	});
}

function bindSearchForm(dom, visitId, at, patientId){
	var form = dom.find("> .drug-search-area form[mc-name=searchForm]");
	form.submit(function(event){
		event.preventDefault();
		event.stopPropagation();
		var text = getSearchTextDom(dom).val().trim();
		var mode = getSearchMode(dom);
		switch(mode){
			case "master": searchMaster(dom, text, at); break;
			case "stock": searchStock(dom, text); break;
			case "prev": searchPrev(dom, patientId, text); break;
			default: throw new Error("unknown search mode: " + mode); 
		}
	});
}

function bindSearchResult(dom, at){
	var select = getSearchSelectDom(dom);
	select.on("click", "option", function(event){
		var data = $(this).data("data");
		updateDisplay(dom, data, at);
	})
}

function bindUsageExample(dom){
	var examples = dom.find("> .drug-area [mc-name=usageExampleWrapper]")
	dom.on("click", "> .drug-area [mc-name=usageExampleLink]", function(event){
		event.preventDefault();
		event.stopPropagation();
		examples.toggle();
	});
	dom.on("click", "> .drug-area select[name=usage-example] option", function(){
		var value = $(this).val();
		getDisplayUsageInputDom(dom).val(value);
		examples.hide();
	});
}

function bindCategoryChange(dom){
	dom.on("change", "> .drug-area input[type=radio][name=category]", function(event){
		var category = +$(this).val();
		adaptToCategory(dom, category);
	});
}

function bindClear(dom){
	dom.on("click", "> .workarea-commandbox [mc-name=clearFormLink]", function(event){
		event.preventDefault();
		clearDisplay(dom);
	});
}

function bindCancel(dom){
	dom.on("click", "> .workarea-commandbox [mc-name=closeLink]", function(event){
		event.stopPropagation();
		dom.trigger("cancel");
	});
}

function collectFormInputs(dom, drug){
	mUtil.assign(drug, {
		d_amount: getDisplayAmountInputDom(dom).val(),
		d_usage: getDisplayUsageInputDom(dom).val(),
		d_category: +getCheckedCategory(dom),
		d_days: +getDisplayDaysInputDom(dom).val()
	});
	if( drug.d_category === Gaiyou ){
		drug.d_days = 1;
	}
}

function validate(drug){
	var errs = [];
	if( !(drug.d_iyakuhincode > 0) ){
		errs.push("invalid iyakuhincode: " + drug.d_iyakuhincode);
	}
	if( !drug.d_amount ){
		errs.push("用量が指定されていません。");
	}
	var category = +drug.d_category;
	if( !(category === Naifuku || category === Tonpuku || category === Gaiyou) ){
		errs.push("invalid category: " + category);
	}
	if( !(drug.d_days && ("" + drug.d_days).match(/^\d+$/)) ){
		errs.push("日数・回数の指定が不適切です。");
	}
	return errs;
}

function clearDisplayConsideringFixedDays(dom){
	var days = getDisplayDaysInputDom(dom).val();
	clearDisplay(dom);
	if( fixedDays(dom) ){
		getDisplayDaysInputDom(dom).val(days);
	}
}

function clearSearchArea(dom){
	getSearchTextDom(dom).val("");
	getSearchSelectDom(dom).empty();
}

function bindEnter(dom, visitId, at){
	dom.on("click", "> .workarea-commandbox [mc-name=enterLink]", function(event){
		event.stopPropagation();
		var iyakuhincode = getDisplayDom(dom).data("iyakuhincode");
		if( !iyakuhincode ){
			alert("薬剤が設定されていません。");
			return;
		}
		var drug = {
			visit_id: visitId,
			d_iyakuhincode: iyakuhincode,
			d_prescribed: 0
		};
		collectFormInputs(dom, drug);
		var errors = validate(drug);
		if( errors.length > 0 ){
			getErrorBox(dom).text(errors.join("")).show();
			return;
		}
		var drugId, newDrug;
		task.run([
			function(done){
				service.enterDrug(drug, function(err, result){
					if( err ){
						done(err);
						return;
					}
					drugId = result;
					done();
				})
			},
			function(done){
				service.getFullDrug(drugId, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newDrug = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("entered", [newDrug]);
			clearDisplayConsideringFixedDays(dom);
			clearSearchArea(dom);
		})
	});
}

function bindModify(dom, drugId, at){
	dom.on("click", "> .workarea-commandbox [mc-name=enterLink]", function(event){
		event.stopPropagation();
		var iyakuhincode = getDisplayDom(dom).data("iyakuhincode");
		if( !iyakuhincode ){
			alert("薬剤が設定されていません。");
			return;
		}
		var drug = {
			drug_id: drugId,
			d_iyakuhincode: iyakuhincode
		};
		collectFormInputs(dom, drug);
		var errors = validate(drug);
		if( errors.length > 0 ){
			getErrorBox(dom).text(errors.join("")).show();
			return;
		}
		var newDrug;
		task.run([
			function(done){
				service.modifyDrug(drug, done);
			},
			function(done){
				service.getFullDrug(drug.drug_id, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newDrug = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("modified", [newDrug]);
		})
	});
}

function bindDelete(dom, drugId){
	dom.on("click", "> .workarea-commandbox [mc-name=deleteLink]", function(event){
		event.preventDefault();
		event.stopPropagation();
		if( !confirm("本当にこの薬剤を削除しますか？") ){
			return;
		}
		task.run(function(done){
			service.batchDeleteDrugs([drugId], done);
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("deleted", [drugId]);
		})
	});
}