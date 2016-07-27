"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var mUtil = require("../../../myclinic-util");
var service = require("../../service");
var task = require("../../task");
var mConsts = require("myclinic-consts");

var tmplSrc = require("raw!./drug-form.html");
var tmpl = hogan.compile(tmplSrc);
var itemTmplSrc = require("raw!./search-result-item.html");
var itemTmpl = hogan.compile(itemTmplSrc);

var Naifuku = mConsts.DrugCategoryNaifuku;
var Tonpuku = mConsts.DrugCategoryTonpuku;
var Gaiyou = mConsts.DrugCategoryGaiyou;

var ZaikeiGaiyou = mConsts.ZaikeiGaiyou;

exports.create = function(drug, at, patientId){
	var data;
	if( drug.drug_id ){
		data = {
			title: "処方の編集"
		}
	} else {
		data = {
			title: "新規処方の入力"
		}
	}
	var dom = $("<div></div>");
	dom.append(tmpl.render(data));
	bindSearchForm(dom, drug.visit_id, at, patientId);
	bindSearchResult(dom, at);
	return dom;
};

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

function updateDisplayCategory(dom, category){
	dom.find("> .drug-area input[type=radio][name=category][value=" + category + "]").prop("checked", true);
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

function updateDisplayDom(dom, data){
	getDisplayNameDom(dom).text(data.name);
	getDisplayAmountInputDom(dom).val(data.amount);
	getDisplayUnitDom(dom).text(data.unit);
	getDisplayUsageInputDom(dom).val(data.usage);
	getDisplayDaysInputDom(dom).val(data.days);
	updateDisplayCategory(dom, data.category);
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
		updateDisplayDom(dom, dispData);
	});
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
		if( text === "" ){
			return;
		}
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