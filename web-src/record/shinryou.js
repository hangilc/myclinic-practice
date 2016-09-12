"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");
var ShinryouForm = require("./shinryou-form");
var task = require("../task");
var service = require("myclinic-service-api");

var tmplSrc = require("raw!./shinryou.html");
var tmpl = hogan.compile(tmplSrc);

exports.create = function(shinryou){
	var dom = $(tmpl.render({
		label: shinryou.name
	}));
	dom.listen("rx-shinryou-lookup-for-visit", function(targetVisitId){
		if( targetVisitId === shinryou.visit_id ){
			return {
				shinryou_id: shinryou.shinryou_id,
				shinryoucode: shinryou.shinryoucode,
				dom: dom
			};
		}
	});
	dom.listen("rx-shinryou-deleted", function(targetShinryouId){
		if( shinryou.shinryou_id === targetShinryouId ){
			dom.remove();
		}
	});
	bindClick(dom, shinryou);
	return dom;
};

var dispSelector = "> [mc-name=disp]";
var formSelector = "> [mc-name=form]";

function getDispDom(dom){
	return dom.find(dispSelector);
}

function getFormDom(dom){
	return dom.find(formSelector);
}

function taskDeleteShinryou(ctx, opt){
	opt = opt || {};
	var keyShinryouId = opt.shinryouId || "shinryouId";
	return function(done){
		var shinryouId = ctx[keyShinryouId];
		service.batchDeleteShinryou([shinryouId], done);
	}
}

function bindClick(dom, shinryou){
	dom.on("click", dispSelector, function(event){
		event.stopPropagation();
		event.preventDefault();
		if( !dom.inquire("fn-confirm-edit", [shinryou.visit_id, "現在（限定）診察中でありませんが、この診療行為を編集しますか？"]) ){
			return;
		}
		var form = ShinryouForm.create(shinryou);
		form.on("delete", function(event){
			event.stopPropagation();
			var ctx = {shinryouId: shinryou.shinryou_id};
			task.run(taskDeleteShinryou(ctx), function(err){
				dom.trigger("shinryou-batch-deleted", [shinryou.visit_id, [shinryou.shinryou_id]]);
			});
		});
		form.on("cancel", function(event){
			event.stopPropagation();
			getFormDom(dom).html("");
			getDispDom(dom).show();
		});
		getDispDom(dom).hide();
		getFormDom(dom).append(form);
	})
}


