"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var mUtil = require("../../myclinic-util");
var service = require("myclinic-service-api");
var task = require("../task");
var mConsts = require("myclinic-consts");
var kanjidate = require("kanjidate");

var tmplSrc = require("raw!./search-text.html");
var resultTmplSrc = require("raw!./search-text-search-result.html");
var resultTmpl = hogan.compile(resultTmplSrc);

var searchTextSelector = "> form[mc-name=searchForm] input[mc-name=searchText]";
var searchLinkSelector = "> form[mc-name=searchForm] [mc-name=searchLink]";
var searchResultSelector = "> [mc-name=resultWrapper]";

exports.create = function(patientId){
	var dom = $(tmplSrc);
	bindSearch(dom, patientId);
	return dom;
}

function bindSearch(dom, patientId){
	dom.on("click", searchLinkSelector, function(event){
		event.preventDefault();
		var text = dom.find(searchTextSelector).val().trim();
		if( text === "" ){
			return;
		}
		var searchResult;
		task.run([
			function(done){
				service.searchTextForPatient(patientId, text, function(err, result){
					if( err ){
						done(err);
						return;
					}
					searchResult = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			var list = searchResult.map(function(item){
				return {
					title: kanjidate.format(kanjidate.f5, item.v_datetime),
					content: item.content.replace(/\n/g, "<br />\n")
				}
			});
			dom.find(searchResultSelector).html(resultTmpl.render({list: list}));
		})
	})
}
