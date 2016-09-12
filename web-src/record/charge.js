"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var mUtil = require("../../myclinic-util");
var ChargeDisp = require("./charge-disp");
var ChargeForm = require("./charge-form");
var service = require("myclinic-service-api");
var task = require("../task");

exports.setup = function(dom, visitId, charge){
	if( dom.data("setup") ){
		throw new Error("duplicate setup in charge.js");
	}
	dom.data("setup", 1);
	// disp events
	dom.on("v7lug8he-start-edit", function(event){
		if( !charge ){
			return;
		}
		startEdit(dom, visitId, charge);
	});
	// form events
	dom.on("30g8sm2i-cancel", function(event){
		showDisp();
	});
	dom.on("30g8sm2i-modified", function(event, newCharge){
		charge = newCharge;
		showDisp();
	});
	// initial display
	showDisp();

	function showDisp(){
		dom.empty();
		dom.append(mkDisp(charge));
	}
};

function mkDisp(charge){
	return ChargeDisp.create(charge);
}

function startEdit(dom, visitId, charge){
	var meisai;
	task.run([
		function(done){
			service.calcMeisai(visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				meisai = result;
				done();
			});
		},
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		dom.empty();
		dom.append(ChargeForm.create(meisai, charge));
	});
}
