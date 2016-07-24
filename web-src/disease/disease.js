"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplHtml = require("raw!./disease.html");

var ListPane = require("./disease-list-pane")

exports.setup = function(dom){
	dom.listen("rx-start-page", function(appData){
		var patientId = appData.currentPatientId;
		if( patientId > 0 ){
			dom.html(tmplHtml);
			var ws = dom.find("[mc-name=workarea]");
			ListPane.setup(ws, appData.diseases);
		} else {
			dom.html("");
		}
	})
};



