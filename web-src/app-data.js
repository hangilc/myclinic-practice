"use strict";

var task = require("./task");
var service = require("./service");
var conti = require("conti");
var contiPara = require("../conti-para");
conti.para = contiPara.para;

function calcNumberOfPages(totalItems, itemsPerPage){
	return Math.floor((totalItems + itemsPerPage - 1)/itemsPerPage);
}

function adjustPage(page, numPages){
	if( numPages <= 0 ){
		page = 0;
	} else {
		if( page <= 0 ){
			page = 1;
		} else if( page > numPages ){
			page = numPages;
		}
	}
	return page;
}

function makeCalcVisitsLoader(pageData){
	var patientId = pageData.currentPatientId;
	return function(done){
		if( patientId > 0 ){
			service.calcVisits(patientId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				pageData.totalPages = calcNumberOfPages(result, pageData.itemsPerPage);
				pageData.currentPage = adjustPage(1, pageData.totalPages);
				done();
			});
		} else {
			pageData.totalPages = 0;
			pageData.currentPage = 0;
			done();
		}
	}
}

function makePatientLoader(pageData){
	var patientId = pageData.currentPatientId;
	return function(done){
		if( patientId > 0 ){
			service.getPatient(patientId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				pageData.currentPatient = result;
				done();
			})
		} else {
			pageData.currentPatient = null;
			done();
		}
	};
}

function makeFullVisitsLoader(pageData){
	var patientId = pageData.currentPatientId;
	return function(done){
		if( patientId > 0 && pageData.totalPages > 0 ){
			service.listFullVisits(patientId, 0, pageData.itemsPerPage, function(err, result){
				if( err ){
					done(err);
					return;
				}
				pageData.record_list = result;
				done();
			});
		} else {
			pageData.record_list = [];
			done();
		}
	}
}

function makeDiseasesLoader(pageData){
	var patientId = pageData.currentPatientId;
	return function(done){
		if( patientId > 0 ){
			service.listCurrentFullDiseases(patientId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				pageData.diseases = result;
				done();
			})
		} else {
			pageData.diseases = [];
			done();
		}
	}
}

function makeLoader(appData){
	return function(done){
		conti.exec([
			makePatientLoader(appData),
			makeCalcVisitsLoader(appData),
			makeFullVisitsLoader(appData),
			makeDiseasesLoader(appData)
		], done);
	}
}

function taskClearPage(appData){
	return function(done){
		conti.exec([
			function(done){
				if( appData.currentVisitId > 0 ){
					service.suspendExam(appData.currentVisitId, done)
				} else {
					done();
				}
			}
		], function(err){
			if( err ){
				done(err);
				return;
			}
			appData.clear();
			done();
		})
	}
}

function AppData(){
	this.clear();
}

AppData.prototype.clear = function(){
	this.currentPatientId = 0;
	this.currentVisitId = 0;
	this.tempVisitId = 0;
	this.currentPatient = null;
	this.itemsPerPage = 10;
	this.totalPages = 0;
	this.currentPage = 0;
	this.record_list = [];
	this.diseases = [];
};

AppData.prototype.startPage = function(patientId, visitId, done){
	var self = this;
	task.run(function(done){
		conti.exec([
			taskClearPage(self),
			function(done){
				self.currentPatientId = patientId;
				self.currentVisitId = visitId;
				done();
			},
			makeLoader(self)
		], done);
	}, done);
};

module.exports = AppData;