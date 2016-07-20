"use strict";

var $ = require("jquery");

var tmplHtml = require("raw!./current-manip.html");

exports.setup = function(dom){
	dom.addClass("rx-visit-changed");
	dom.data("rx-visit-changed", function(patientId, visitId){
		if( patientId === 0 ){
			dom.html("");
		} else {
			dom.html(tmplHtml);
		}
	});
	dom.on("click", "[mc-name=endPatientButton]", function(event){
		event.preventDefault();
		dom.trigger("end-patient");
	})
};
