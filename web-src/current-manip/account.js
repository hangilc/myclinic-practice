"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./account.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");
var task = require("../task");
var service = require("myclinic-service-api");

var chargeDispSelector = "[mc-name=charge-disp]";
var modifyLinkSelector = "[mc-name=modifyLink]";
var modifyWrapperSelector = "> [mc-name=modifyWrapper]";
var modifyInputSelector = "> [mc-name=modifyWrapper] input[mc-name=newCharge]";
var modifyFormSelector = "> [mc-name=modifyWrapper] form";
var modifyEnterLinkSelector = "> [mc-name=modifyWrapper] a[mc-name=modifyEnter]";
var modifyCancelLinkSelector = "> [mc-name=modifyWrapper] [mc-name=modifyCancel]";
var enterLinkSelector = "> .workarea-commandbox [mc-name=enterLink]";
var cancelLinkSelector = "> .workarea-commandbox [mc-name=cancelLink]";

exports.create = function(meisai, visitId){
	var sections = mUtil.meisaiSections.map(function(sect){
		return {
			name: sect,
			items: meisai.meisai[sect].map(function(item){
				return {
					label: item.label,
					tanka: mUtil.formatNumber(item.tanka),
					count: item.count,
					total: mUtil.formatNumber(item.tanka * item.count)
				}
			})
		};
	}).filter(function(sect){ return sect.items.length > 0; });
	var data = {
		sections: sections,
		total_ten: mUtil.formatNumber(meisai.totalTen),
		charge: mUtil.formatNumber(meisai.charge),
		futan_wari: meisai.futanWari
	};
	var dom = $(tmpl.render(data));
	dom.on("click", modifyLinkSelector, function(event){
		event.preventDefault();
		dom.find(modifyWrapperSelector).toggle();
	});
	dom.on("submit", modifyFormSelector, function(event){
		event.preventDefault();
		doModify(dom);
	});
	dom.on("click", modifyEnterLinkSelector, function(event){
		event.preventDefault();
		doModify(dom);
	});
	dom.on("click", modifyCancelLinkSelector, function(event){
		event.preventDefault();
		dom.find(modifyInputSelector).val("");
		dom.find(modifyWrapperSelector).hide();
	});
	dom.on("click", enterLinkSelector, function(event){
		event.preventDefault();
		dom.find(enterLinkSelector).prop("disabled", true);
		var value = getChargeValue(dom);
		doEnter(dom, visitId, value);
	});
	dom.on("click", cancelLinkSelector, function(event){
		event.preventDefault();
		dom.trigger("0ms9b2wl-cancel");
	})
	return dom;
};

function doModify(dom){
	var input = dom.find(modifyInputSelector).val().trim();
	if( !/^\d+$/.test(input) ){
		alert("金額の入力が不適切です。");
		return;
	}
	input = +input;
	dom.find(chargeDispSelector).text(mUtil.formatNumber(input));
	dom.find(modifyInputSelector).val("");
	dom.find(modifyWrapperSelector).hide();
}

function getChargeValue(dom){
	var text = dom.find(chargeDispSelector).text().trim();
	text = text.replace(/,/g, "");
	return +text;
}

function doEnter(dom, visitId, charge){
	task.run([
		function(done){
			service.endExam(visitId, charge, done);
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		dom.trigger("0ms9b2wl-entered");
	});
}