"use strict";

var $ = require("jquery");
var Account = require("./account");

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
		console.log("account");
	})
	dom.on("click", "[mc-name=endPatientButton]", function(event){
		event.preventDefault();
		dom.trigger("end-patient");
	});
};
