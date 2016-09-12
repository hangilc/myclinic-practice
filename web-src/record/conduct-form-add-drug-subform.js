"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./conduct-form-add-drug-subform.html");
var task = require("../task");
var service = require("myclinic-service-api");
var resultTmplSrc = require("raw!./conduct-form-add-drug-subform-search-result.html");
var resultTmpl = hogan.compile(resultTmplSrc);

exports.create = function(at, conductId){
	var dom = $(tmplSrc);
	var ctx = {
		iyakuhincode: undefined
	};
	bindEnter(dom, conductId, at, ctx);
	bindCancel(dom);
	bindSearch(dom, at);
	bindSearchResultSelect(dom, at, ctx);
	return dom;
};

var nameSelector = "> form[mc-name=main-form] [mc-name=name]";
var amountSelector = "> form[mc-name=main-form] input[mc-name=amount]";
var unitSelector = "> form[mc-name=main-form] [mc-name=unit]";
var enterSelector = "> .commandbox [mc-name=enterLink]";
var cancelSelector = "> .commandbox [mc-name=cancelLink]";
var searchFormSelector = "> form[mc-name=search-form]";
var searchTextSelector = "> form[mc-name=search-form] input[mc-name=searchText]";
var searchResultSelector = "> form[mc-name=search-form] select[mc-name=searchResult]";

function getSearchResultDom(dom){
	return dom.find(searchResultSelector);
}

function getSearchText(dom){
	return dom.find(searchTextSelector).val().trim();
}

function getAmount(dom){
	return dom.find(amountSelector).val().trim();
}

function updateName(dom, name){
	dom.find(nameSelector).text(name);
}

function updateUnit(dom, unit){
	dom.find(unitSelector).text(unit);
}

function bindEnter(dom, conductId, at, ctx){
	dom.on("click", enterSelector, function(event){
		event.preventDefault();
		var iyakuhincode = ctx.iyakuhincode;
		if( !iyakuhincode ){
			alert("薬剤が指定されていません。");
			return;
		}
		iyakuhincode = +iyakuhincode;
		var amount = getAmount(dom);
		if( amount === "" ){
			alert("用量が設定されていません。");
			return;
		}
		amount = +amount;
		var newConduct;
		task.run([
			function(done){
				service.enterConductDrug({
					visit_conduct_id: conductId,
					iyakuhincode: iyakuhincode,
					amount: amount
				}, done);
			},
			function(done){
				service.getFullConduct(conductId, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newConduct = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("conduct-modified", [conductId, newConduct]);
		})
	});
}

function bindCancel(dom){
	dom.on("click", cancelSelector, function(event){
		event.preventDefault();
		dom.trigger("cancel");
	})
}

function bindSearch(dom, at){
	dom.on("submit", searchFormSelector, function(event){
		event.preventDefault();
		var text = getSearchText(dom);
		if( text === "" ){
			return;
		}
		var searchResult;
		task.run(function(done){
			service.searchIyakuhinMaster(text, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				searchResult = result;
				done();
			})
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			getSearchResultDom(dom).html(resultTmpl.render({list: searchResult}));
		})
	});
}

function setDrug(dom, master, ctx){
	ctx.iyakuhincode = master.iyakuhincode;
	updateName(dom, master.name);
	updateUnit(dom, master.unit);
}

function bindSearchResultSelect(dom, at, ctx){
	dom.on("change", searchResultSelector, function(event){
		var iyakuhincode = dom.find(searchResultSelector + " option:selected").val();
		var master;
		task.run(function(done){
			service.getIyakuhinMaster(iyakuhincode, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				master = result;
				done();
			});
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			setDrug(dom, master, ctx);
		})
	});
}

