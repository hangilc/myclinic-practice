"use strict";

var kanjidate = require("kanjidate");
var $ = require("jquery");
var hogan = require("hogan");
var service = require("../service");

var tmplSrc = require("raw!./title.html");
var tmpl = hogan.compile(tmplSrc);

exports.setup = function(dom, visit, currentVisitId, tempVisitId){
	var label = kanjidate.format("{G}{N:2}年{M:2}月{D:2}日（{W}） {h:2}時{m:2}分", visit.v_datetime);
	dom.data("label", label);
	dom.data("visit-id", visit.visit_id);
	dom.data("current-visit-id", currentVisitId);
	dom.data("temp-visit-id", tempVisitId);
	render(dom);
	bindClick(dom);
	bindDelete(dom);
};

function render(dom){
	var html = tmpl.render({
		label: dom.data("label")
	});
	dom.html(html);
	var dateDom = dom.find(".visit-date");
	dateDom.removeClass("current currentTmp");
	if( dom.data("visit-id") === dom.data("current-visit-id") ){
		dateDom.addClass("current");
	} else if( dom.data("visit-id") === dom.data("temp-visit-id") ){
		dateDom.addClass("currentTmp");
	}
}

function getWorkspaceDom(dom){
	return dom.find("[mc-name=workarea]")
};

function bindClick(dom){
	dom.on("click", "[mc-name=titleBox] a", function(event){
		event.preventDefault();
		var ws = getWorkspaceDom(dom);
		if( ws.is(":visible") ){
			ws.hide();
		} else {
			ws.show();
		}
	});
}

function bindDelete(dom){
	dom.on("click", "a[mc-name=deleteVisitLink]", function(event){
		event.preventDefault();
		var visitId = dom.data("visit-id");
		if( !(visitId > 0) ){
			alert("invalid visit_id");
			return;
		}
		service.deleteVisit(visitId, function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("visit-deleted", [visitId]);
		})
	});
}


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

//module.exports = RecordTitle;