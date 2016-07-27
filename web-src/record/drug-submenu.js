"use strict";

var $ = require("jquery");
var tmplHtml = require("raw!./drug-submenu.html");
var task = require("../task");
var service = require("../service");
var mUtil = require("../../myclinic-util");
var conti = require("conti");

exports.setup = function(dom, visitId, at){
	dom.data("visible", false);
	bindCopyAll(dom, visitId, at);
	bindCopySelected(dom);
	bindModifyDays(dom);
	bindDeleteSelected(dom);
	bindCancel(dom);
};

exports.isVisible = function(dom){
	return dom.data("visible");
};

exports.show = function(dom){
	dom.data("visible", true);
	dom.html(tmplHtml);
};

exports.hide = function(dom){
	dom.data("visible", false);
	dom.html("");
};

function bindCopyAll(dom, visitId, at){
	dom.on("click", "[mc-name=copyAll]", function(event){
		event.preventDefault();
		event.stopPropagation();
		var targetVisitId = window.getCurrentVisitId() || window.getTempVisitId();
		if( targetVisitId === 0 ){
			alert("現在（暫定）診察中でないため、コピーできません。");
			return;
		}
		if( targetVisitId === visitId ){
			alert("自分自身にはコピーできません。");
			return;
		}
		var drugs;
		task.run([
			function(done){
				service.listFullDrugsForVisit(visitId, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					drugs = result;
					done();
				})
			},
			function(done){
				conti.forEach(drugs, function(drug, done){
					service.resolveIyakuhinMasterAt(drug.d_iyakuhincode, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						mUtil.assign(drug, result);
						done();
					})
				}, done);
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			console.log(drugs);
		})
	});
}

function bindCopySelected(dom){

}

function bindModifyDays(dom){

}

function bindDeleteSelected(dom){

}

function bindCancel(dom){
	dom.on("click", "[mc-name=cancel]", function(event){
		event.preventDefault();
		exports.hide(dom);
	});
}