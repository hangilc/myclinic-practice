"use strict";

var $ = require("jquery");

var tmplHtml = require("raw!./current-manip.html");

exports.setup = function(dom){
	dom.listen("rx-start-page", function(appData){
		if( appData.currentPatientId > 0 ){
			dom.html(tmplHtml);
		} else {
			dom.html("");
		}
	})
	dom.on("click", "[mc-name=endPatientButton]", function(event){
		event.preventDefault();
		dom.trigger("end-patient");
	})
};
