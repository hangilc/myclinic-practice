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
	bindSetTemp(dom);
	bindUnsetTemp(dom);
	dom.addClass("rx-set-temp-visit-id");
	dom.data("rx-set-temp-visit-id", function(newTempVisitId){
		dom.data("temp-visit-id", newTempVisitId);
		renderClass(dom);
	});
};

function renderClass(dom){
	var dateDom = dom.find(".visit-date");
	dateDom.removeClass("current currentTmp");
	if( dom.data("visit-id") === dom.data("current-visit-id") ){
		dateDom.addClass("current");
	} else if( dom.data("visit-id") === dom.data("temp-visit-id") ){
		dateDom.addClass("currentTmp");
	}
}

function render(dom){
	var html = tmpl.render({
		label: dom.data("label")
	});
	dom.html(html);
	renderClass(dom);
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

function bindSetTemp(dom){
	dom.on("click", "a[mc-name=setCurrentTmpVisitId]", function(event){
		event.preventDefault();
		dom.trigger("set-temp-visit-id", [dom.data("visit-id")]);
		getWorkspaceDom(dom).hide();
	})
}

function bindUnsetTemp(dom){
	dom.on("click", "a[mc-name=unsetCurrentTmpVisitId]", function(event){
		event.preventDefault();
		if( dom.data("visit-id") !== dom.data("temp-visit-id") ){
			return;
		}
		dom.trigger("set-temp-visit-id", [0]);
		getWorkspaceDom(dom).hide();
	})
}

