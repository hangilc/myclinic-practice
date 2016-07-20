"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./record-nav.html");
var tmpl = hogan.compile(tmplSrc);

exports.setup = function(dom, itemsPerPage){
	dom.data("number-of-pages", 0);
	dom.data("page", 0);
	dom.addClass("rx-total-visits-changed");
	dom.data("rx-total-visits-changed", function(count){
		dom.data("total-items", count);
		var numPages = calcNumberOfPages(count, itemsPerPage);
		dom.data("number-of-pages", numPages);
		var page = dom.data("page");
		page = adjustPage(page, numPages);
		dom.data("page", page);
		render(dom);
	});
	dom.addClass("rx-goto-page");
	dom.data("rx-goto-page", function(page){
		var numPages = dom.data("number-of-pages");
		page = adjustPage(page, numPages);
		dom.data("page", page);
		render(dom);
	});
	bindGotoFirst(dom);
	bindGotoPrev(dom);
	bindGotoNext(dom);
	bindGotoLast(dom);
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

function render(dom){
	var numPages = dom.data("number-of-pages");
	var page = dom.data("page");
	if( numPages <= 1 ){
		dom.html("");
	} else {
		var data = {
			page: page,
			total: numPages
		};
		dom.html(tmpl.render(data));
	}
}

function calcNumberOfPages(totalItems, itemsPerPage){
	return Math.floor((totalItems + itemsPerPage - 1)/itemsPerPage);
}

function bindGotoFirst(dom){
	dom.on("click", "[mc-name=gotoFirst]", function(event){
		var numPages = dom.data("number-of-pages");
		var page = dom.data("page");
		event.preventDefault();
		if( page <= 1 ){
			return;
		}
		$("body").trigger("goto-page", [1]);
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
		$("body").trigger("goto-page", [page - 1]);
	});
};

function bindGotoNext(dom){
	dom.on("click", "[mc-name=gotoNext]", function(event){
		var numPages = dom.data("number-of-pages");
		var page = dom.data("page");
		event.preventDefault();
		console.log("goto-page", page, numPages);
		if( page >= numPages ){
			return;
		}
		$("body").trigger("goto-page", [page + 1]);
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
		$("body").trigger("goto-page", [numPages]);
	});
};

