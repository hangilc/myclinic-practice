"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./record-nav.html");
var tmpl = hogan.compile(tmplSrc);

function calcNumberOfPages(totalItems, itemsPerPage){
	return Math.floor((totalItems + itemsPerPage - 1)/itemsPerPage);
}

function RecordNav(dom, itemsPerPage){
	this.dom = dom;
	this.itemsPerPage = itemsPerPage;
	this.totalItems = 0;
	this.numberOfPages = 0;
	this.currentPage = 0;
}

RecordNav.prototype.render = function(){
	this.bindGotoFirst();
	this.bindGotoPrev();
	this.bindGotoNext();
	this.bindGotoLast();
	return this;
};

RecordNav.prototype.bindGotoFirst = function(){
	var self = this;
	if( this.numberOfPages < 1 ){
		return;
	}
	this.dom.on("click", "[mc-name=gotoFirst]", function(event){
		event.preventDefault();
		if( self.currentPage === 1 ){
			return;
		}
		$("body").trigger("goto-page", [1]);
	});
};

RecordNav.prototype.bindGotoPrev = function(){
	var self = this;
	this.dom.on("click", "[mc-name=gotoPrev]", function(event){
		event.preventDefault();
		if( self.currentPage <= 1 ){
			return;
		}
		$("body").trigger("goto-page", [self.currentPage - 1]);
	});
};

RecordNav.prototype.bindGotoNext = function(){
	var self = this;
	this.dom.on("click", "[mc-name=gotoNext]", function(event){
		event.preventDefault();
		if( self.currentPage >= self.numberOfPages ){
			return;
		}
		$("body").trigger("goto-page", [self.currentPage + 1]);
	});
};

RecordNav.prototype.bindGotoLast = function(){
	var self = this;
	if( this.numberOfPages < 1 ){
		return;
	}
	this.dom.on("click", "[mc-name=gotoLast]", function(event){
		event.preventDefault();
		if( self.currentPage === self.numberOfPages ){
			return;
		}
		$("body").trigger("goto-page", [self.numberOfPages]);
	});
};

RecordNav.prototype.setTotalItems = function(n){
	this.totalItems = +n;
	this.numberOfPages = calcNumberOfPages(n, this.itemsPerPage);
	return this;
};

RecordNav.prototype.update = function(page){
	if( this.numberOfPages <= 0 ){
		this.currentPage = 0;
		this.dom.html("");
	}
	if( this.numberOfPages === 1 ){
		this.currentPage = 1;
		this.dom.html("");
	} else {
		if( page < 1 ){
			page = 1;
		} else if( page > this.numberOfPages ){
			page = this.numberOfPages;
		}
		var data = {
			page: page,
			total: this.numberOfPages
		};
		this.currentPage = +page;
		this.dom.html(tmpl.render(data));
	}
}

module.exports = RecordNav;