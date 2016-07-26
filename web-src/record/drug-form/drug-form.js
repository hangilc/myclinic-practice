"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var mUtil = require("../../../myclinic-util");
var service = require("../../service");
var task = require("../../task");

var tmplSrc = require("raw!./drug-form.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(drug, at, patientId){
	var data;
	if( drug.drug_id ){
		data = {
			title: "処方の編集"
		}
	} else {
		data = {
			title: "新規処方の入力"
		}
	}
	var dom = $(tmpl.render(data));
	bindSearchButton(dom, drug.visit_id, at);
	return dom;
};

function getSearchButtonDom(dom){
	return dom.find("[mc-name=searchLink]");
}

function getSearchTextDom(dom){
	return dom.find("[mc-name=searchText]");
}

function getSearchMode(dom){
	return dom.find("input[type=radio][name=search-mode]:checked").val();
}

function getSearchSelectDom(dom){
	return dom.find("select[mc-name=searchResult]");
}

function searchMaster(dom, text, at){
	var list;
	task.run(function(done){
		service.searchIyakuhinMaster(text, at, function(err, result){
			if( err ){
				done(err);
				return;
			}
			list = result;
			done();
		})
	}, function(err){
		if( err ){
			alert(err);
			return;
		}
		console.log(list);
	});
}

function searchStock(dom, text){
	var list;
	task.run(function(done){
		service.searchPrescExample(text, function(err, result){
			if( err ){
				done(err);
				return;
			}
			list = result;
			done();
		})
	}, function(err){
		if( err ){
			alert(err);
			return;
		}
		console.log(list);
	});
}

function searchPrev(dom, patientId, text){
	var list;
	task.run(function(done){
		service.searchFullDrugForPatient(patientId, text, function(err, result){
			if( err ){
				done(err);
				return;
			}
			list = result;
			done();
		})
	}, function(err){
		if( err ){
			alert(err);
			return;
		}
		console.log(list);
	});
}

function bindSearchButton(dom, visitId, at, patientId){
	var button = getSearchButtonDom(dom);
	button.click(function(event){
		event.preventDefault();
		event.stopPropagation();
		var text = getSearchTextDom(dom).val().trim();
		if( text === "" ){
			return;
		}
		var mode = getSearchMode(dom);
		console.log(mode, text);
		switch(mode){
			case "master": searchMaster(dom, text, at); break;
			case "stock": searchStock(dom, text); break;
			case "prev": searchPrev(dom, patientId, text); break;
			default: throw new Error("unknown search mode: " + mode); 
		}
	})
}