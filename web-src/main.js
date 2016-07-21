"use strict";

var $ = require("jquery");
var conti = require("conti");
var mUtil = require("../myclinic-util");
var task = require("./task");
var service = require("./service");

var RecentVisits = require("./recent-visits/recent-visits");

RecentVisits.setup($("#recent-visits-wrapper"));

var pageData = {
	currentPatientId: 0,
	currentVisitId: 0,
	tempVisitId: 0,
	currentPage: 0,
	totalPages: 0
};

var itemsPerPage = 10;

function loadPageData(cb){
	var ret = mUtil.assign({}, pageData);
	conti.exec([
		function(done){
			if( ret.currentPatientId > 0 ){
				service.getPatient(ret.currentPatientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					ret.currentPatient = result;
					done();
				})
			} else {
				ret.currentPatient = null;
				done();
			}
		}
	], function(err){
		if( err ){
			cb(err);
			return;
		}
		cb(undefined, ret);
	})
}

$("body").on("start-patient", function(event, patientId){
	task.run(loadPageData, function(err, pageData){
		if( err ){
			alert(err);
			return;
		}
		$("body").broadcast("rx-page-start", pageData);
	});
});