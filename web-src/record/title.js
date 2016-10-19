"use strict";

var kanjidate = require("kanjidate");
var $ = require("jquery");
var hogan = require("hogan.js");
var service = require("myclinic-service-api");
var task = require("../task");

var tmplSrc = require("raw!./title.html");
var tmpl = hogan.compile(tmplSrc);

exports.setup = function(dom, visit, currentVisitId, tempVisitId){
	var label = kanjidate.format("{G}{N:2}年{M:2}月{D:2}日（{W}） {h:2}時{m:2}分", visit.v_datetime);
	dom.data("visit-id", visit.visit_id);
	render(dom, label, currentVisitId, tempVisitId);
	bindClick(dom);
	bindDelete(dom);
	bindSetTemp(dom);
	bindUnsetTemp(dom);
};

function getDateDom(dom){
	return dom.find(".visit-date")
}

function renderClass(dom, currentVisitId, tempVisitId){
	var dateDom = getDateDom(dom);
	dateDom.removeClass("current currentTmp");
	if( dom.data("visit-id") === currentVisitId ){
		dateDom.addClass("current");
	} else if( dom.data("visit-id") === tempVisitId ){
		dateDom.addClass("currentTmp");
	}
}

function render(dom, label, currentVisitId, tempVisitId){
	var html = tmpl.render({
		label: label
	});
	dom.html(html);
	renderClass(dom, currentVisitId, tempVisitId);
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
		dom.trigger("delete-visit", [visitId]);
	});
}

function bindSetTemp(dom){
	dom.on("click", "a[mc-name=setCurrentTmpVisitId]", function(event){
		event.preventDefault();
		var visitId = dom.data("visit-id");
		dom.trigger("set-temp-visit-id", [visitId, function(err){
			if( err ){
				alert(err);
				return;
			}
			getWorkspaceDom(dom).hide();
		}]);
	});
	dom.listen("rx-set-temp-visit-id", function(appData){
		renderClass(dom, appData.currentVisitId, appData.tempVisitId);
	});
}

function bindUnsetTemp(dom){
	dom.on("click", "a[mc-name=unsetCurrentTmpVisitId]", function(event){
		event.preventDefault();
		if( !getDateDom(dom).hasClass("currentTmp") ){
			alert("暫定診察ではありません。")
			return;
		}
		dom.trigger("set-temp-visit-id", [0, function(err){
			if( err ){
				alert(err);
				return;
			}
			getWorkspaceDom(dom).hide();
		}]);
	})
}

