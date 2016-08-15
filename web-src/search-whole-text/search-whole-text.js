"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./search-whole-text.html");
var resultTmplSrc = require("raw!./search-whole-text-search-result.html");
var resultTmpl = hogan.compile(resultTmplSrc);
var modal = require("../../hc-modal");
var task = require("../task");
var service = require("../service");
var kanjidate = require("kanjidate");

var searchTextSelector = "> form[mc-name=search-form] input[mc-name=searchText]";
var searchLinkSelector = "> form[mc-name=search-form] [mc-name=searchButton]";
var searchResultSelector = "> [mc-name=resultBox]";

exports.setup = function(dom){
	dom.on("click", function(event){
		event.preventDefault();
		var form = $(tmplSrc);
		form.on("click", searchLinkSelector, function(event){
			event.preventDefault();
			var text = form.find(searchTextSelector).val().trim();
			if( text === "" ){
				return;
			}
			doSearch(form, text);
		})
		modal.open("全文検索", form);
	})
}

function prepContent(content, searchText){
	if( searchText !== "" && searchText.indexOf("<") < 0 ){
		content = content.split(searchText).join('<span style="color:#f00">' + searchText + '</span>');
	}
	content = content.replace(/\n/g, "<br />\n");
	return content;
}

function doSearch(form, text){
	var searchResult;
	task.run([
		function(done){
			service.searchWholeText(text, function(err, result){
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
				patient_id: item.patient_id,
				last_name: item.last_name,
				first_name: item.first_name,
				date_label: kanjidate.format(kanjidate.f5, item.v_datetime),
				content: prepContent(item.content, text)
			}
		})
		form.find(searchResultSelector).html(resultTmpl.render({list: list}));
	})
}