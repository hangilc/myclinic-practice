"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./record-nav.html");
var tmpl = hogan.compile(tmplSrc);

exports.setup = function(dom){
	dom.listen("rx-start-page", function(appData){
		var totalPages = appData.totalPages;
		var currentPage = appData.currentPage;
		dom.data("number-of-pages", totalPages);
		dom.data("page", currentPage);
		if( totalPages <= 1 ){
			dom.html("");
		} else {
			dom.html(tmpl.render({
				page: currentPage,
				total: totalPages
			}));
		}
	});
	dom.listen("rx-goto-page", function(appData){
		var totalPages = dom.data("number-of-pages");
		var currentPage = appData.currentPage;
		dom.data("page", currentPage);
		if( totalPages <= 1 ){
			dom.html("");
		} else {
			dom.html(tmpl.render({
				page: currentPage,
				total: totalPages
			}));
		}
	});
	bindGotoFirst(dom);
	bindGotoPrev(dom);
	bindGotoNext(dom);
	bindGotoLast(dom);
};

function bindGotoFirst(dom){
	dom.on("click", "[mc-name=gotoFirst]", function(event){
		var numPages = dom.data("number-of-pages");
		var page = dom.data("page");
		event.preventDefault();
		if( page <= 1 ){
			return;
		}
		dom.trigger("goto-page", [1]);
	});
};

function bindGotoPrev(dom){
	dom.on("click", "[mc-name=gotoPrev]", function(event){
		var numPages = dom.data("number-of-pages");
		var page = dom.data("page");
		event.preventDefault();
		if( page <= 1 ){
			return;
		}
		dom.trigger("goto-page", [page - 1]);
	});
};

function bindGotoNext(dom){
	dom.on("click", "[mc-name=gotoNext]", function(event){
		var numPages = dom.data("number-of-pages");
		var page = dom.data("page");
		event.preventDefault();
		if( page >= numPages ){
			return;
		}
		dom.trigger("goto-page", [page + 1]);
	});
};

function bindGotoLast(dom){
	dom.on("click", "[mc-name=gotoLast]", function(event){
		var numPages = dom.data("number-of-pages");
		var page = dom.data("page");
		event.preventDefault();
		if( page >= numPages ){
			return;
		}
		dom.trigger("goto-page", [numPages]);
	});
};

