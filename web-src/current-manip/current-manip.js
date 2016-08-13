"use strict";

var $ = require("jquery");
var Account = require("./account");
var modal = require("../../hc-modal");
var task = require("../task");
var service = require("../service");

var tmplHtml = require("raw!./current-manip.html");

var accountLinkSelector = "[mc-name=accountButton]";

exports.setup = function(dom){
	dom.listen("rx-start-page", function(appData){
		if( appData.currentPatientId > 0 ){
			dom.html(tmplHtml);
		} else {
			dom.html("");
		}
	});
	dom.on("click", accountLinkSelector, function(event){
		event.preventDefault();
		doAccount(dom);
	})
	dom.on("click", "[mc-name=endPatientButton]", function(event){
		event.preventDefault();
		dom.trigger("end-patient");
	});
};

function doAccount(dom){
	var visitId = dom.inquire("fn-get-current-visit-id");
	if( !(visitId > 0) ){
		return;
	}
	var charge, meisai;
	task.run([
		function(done){
			service.findCharge(visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				charge = result;
				done();
			})
		},
		function(done){
			if( charge ){
				done();
			} else {
				service.calcMeisai(visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					meisai = result;
					done();
				})
			}
		}
	], function(err){
		if( err ){
			alert(err);
			return;
		}
		if( !meisai ){
			return;
		}
		var account = Account.create(meisai, visitId);
		modal.open("会計", account);
	})
}

// account dialog
$("body").on("0ms9b2wl-cancel", function(){
	modal.close();
})

// account dialog
$("body").on("0ms9b2wl-entered", function(event){
	modal.close();
	$("body").trigger("exam-ended");
});
