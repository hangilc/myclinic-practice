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

exports.makeLoader = function(pageData){
	return function(done){
		conti.exec([
			makePatientLoader(pageData),
			makeCalcVisitsLoader(pageData),
			makeFullVisitsLoader(pageData)
		], done);
	}
}