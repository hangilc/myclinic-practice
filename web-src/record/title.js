"use strict";

var kanjidate = require("kanjidate");
var $ = require("jquery");
var hogan = require("hogan");
var service = require("../service");

var tmplSrc = require("raw!./title.html");
var tmpl = hogan.compile(tmplSrc);

function RecordTitle(dom){
	this.dom = dom;
	this.bindClick();
	this.bindDeleteClick();
}

RecordTitle.prototype.getWorkspaceDom = function(){
	return this.dom.find("[mc-name=workarea]")
};

RecordTitle.prototype.bindClick = function(){
	var self = this;
	this.dom.on("click", "[mc-name=titleBox] a", function(event){
		event.preventDefault();
		var ws = self.getWorkspaceDom();
		if( ws.is(":visible") ){
			ws.hide();
		} else {
			ws.show();
		}
	});
};

RecordTitle.prototype.bindDeleteClick = function(){
	var self = this;
	this.dom.on("click", "a[mc-name=deleteVisitLink]", function(event){
		event.preventDefault();
		var visitId = self.visitId;
		if( !(visitId > 0) ){
			alert("invalid visit_id");
			return;
		}
		service.deleteVisit(visitId, function(err){
			if( err ){
				alert(err);
				return;
			}
			self.dom.trigger("visit-deleted", [visitId]);
		})
	});
};

RecordTitle.prototype.update = function(at, visitId){
	var label = kanjidate.format("{G}{N:2}年{M:2}月{D:2}日（{W}） {h:2}時{m:2}分", at);
	var data = {
		label: label
	};
	var html = tmpl.render(data);
	this.visitId = visitId;
	this.dom.html(html);
}

module.exports = RecordTitle;