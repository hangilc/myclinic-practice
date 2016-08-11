"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./conduct-add-inject-form.html");
var resultTmplSrc = require("raw!./conduct-add-inject-search-result.html");
var resultTmpl = hogan.compile(resultTmplSrc);
var task = require("../task");
var service = require("../service");
var mConsts = require("myclinic-consts");

exports.create = function(at){
	var dom = $(tmplSrc);
	var ctx = {
		iyakuhincode: undefined
	};
	bindSearch(dom, at);
	bindSearchResultSelect(dom, at, ctx);
	bindEnter(dom, ctx);
	bindCancel(dom);
	return dom;
};

var drugNameSelector = "> form[mc-name=main-form] [mc-name=name]";
var drugUnitSelector = "> form[mc-name=main-form] [mc-name=unit]";
var amountInputSelector = "> form[mc-name=main-form] input[mc-name=amount]";
var kindInputSelector = "> form[mc-name=main-form] input[type=radio][name=kind]";
var searchFormSelector = "> form[mc-name=search-form]";
var searchTextSelector = "> form[mc-name=search-form] input[mc-name=searchText]";
var searchResultSelector = "> form[mc-name=search-form] select";
var enterSelector = "> form[mc-name=main-form] .workarea-commandbox [mc-name=enter]";
var cancelSelector = "> form[mc-name=main-form] .workarea-commandbox [mc-name=cancel]";

var listOfConductKinds = [mConsts.ConductKindHikaChuusha, mConsts.ConductKindJoumyakuChuusha,
	mConsts.ConductKindOtherChuusha, mConsts.ConductKindGazou];

function getSearchResultDom(dom){
	return dom.find(searchResultSelector);
}

function getSearchText(dom){
	return dom.find(searchTextSelector).val();
}

function getAmount(dom){
	return dom.find(amountInputSelector).val();
}

function getKind(dom){
	return dom.find(kindInputSelector).filter(function(){
		return $(this).is(":checked");
	}).val();
}

function updateDrugName(dom, name){
	dom.find(drugNameSelector).text(name);
}

function updateDrugUnit(dom, unit){
	dom.find(drugUnitSelector).text(unit);
}

function updateSearchResult(dom, resultList){
	getSearchResultDom(dom).html(resultTmpl.render({
		list: resultList
	}));
}

function setDrug(dom, master, ctx){
	ctx.iyakuhincode = master.iyakuhincode;
	updateDrugName(dom, master.name);
	updateDrugUnit(dom, master.unit);
}

function bindSearch(dom, at){
	dom.on("submit", searchFormSelector, function(event){
		event.preventDefault();
		var text = getSearchText(dom).trim();
		if( text === "" ){
			return;
		}
		var searchResult;
		task.run([
			function(done){
				service.searchIyakuhinMaster(text, at, function(err, result){
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
			updateSearchResult(dom, searchResult);
		})
	});
}

function bindSearchResultSelect(dom, at, ctx){
	dom.on("change", searchResultSelector, function(event){
		var iyakuhincode = dom.find(searchResultSelector + " option:selected").val();
		var master;
		task.run([
			function(done){
				service.resolveIyakuhinMasterAt(iyakuhincode, at, function(err, result){
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
			setDrug(dom, master, ctx);
		})
	});
}

function bindEnter(dom, ctx){
	dom.on("click", enterSelector, function(event){
		event.preventDefault();
		var iyakuhincode = ctx.iyakuhincode;
		if( !iyakuhincode ){
			alert("薬剤が指定されていません。");
			return;
		}
		iyakuhincode = +iyakuhincode;
		var amount = +getAmount(dom);
		var kind = +getKind(dom);
		if( !(amount > 0) ){
			alert("用量が不適切です。");
			return;
		}
		if( listOfConductKinds.indexOf(kind) < 0 ){
			alert("invalid conduct kind: " + kind);
			return;
		}
		dom.trigger("enter", [iyakuhincode, amount, kind]);
	});
}

function bindCancel(dom){
	dom.on("click", cancelSelector, function(event){
		event.preventDefault();
		dom.trigger("cancel");
	});
}