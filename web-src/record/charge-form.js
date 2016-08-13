"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./charge-form.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");
var task = require("../task");
var service = require("../service");

var chargeInputSelector = "input[mc-name=newCharge]";
var enterLinkSelector = "[mc-name=enterLink]"
var cancelLinkSelector = "[mc-name=cancelLink]"

exports.create = function(meisai, currentCharge){
	var data = {
		total_ten: mUtil.formatNumber(meisai.totalTen),
		futan_wari: meisai.futanWari,
		current_charge: currentCharge ? mUtil.formatNumber(currentCharge.charge) : "",
		calc_charge: meisai.charge
	};
	var dom = $(tmpl.render(data));
	dom.on("click", enterLinkSelector, function(event){
		event.preventDefault();
		doEnter(dom, currentCharge.visit_id);
	})
	dom.on("click", cancelLinkSelector, function(event){
		event.preventDefault();
		dom.trigger("30g8sm2i-cancel");
	})
	return dom;
}

function doEnter(dom, visitId){
	var input = dom.find(chargeInputSelector).val().trim();
	if( input === "" ){
		alert("金額が入力されていません。");
		return;
	}
	if( !/^\d+$/.test(input) ){
		alert("金額の入力が不適切です。");
		return;
	}
	input = +input;
	var newCharge;
	task.run([
		function(done){
			service.endExam(visitId, input, done);
		},
		function(done){
			service.getCharge(visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				newCharge = result;
				done();
			})
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		dom.trigger("30g8sm2i-modified", [newCharge]);
	});
}