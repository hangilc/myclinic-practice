"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./shinryou-delete-selected-form.html");
var tmpl = hogan.compile(tmplSrc);
var task = require("../task");
var service = require("../service");

exports.create = function(shinryouList){
	var dom = $(tmpl.render({list: shinryouList}));
	bindSelectAll(dom);
	bindDeselectAll(dom);
	bindEnter(dom);
	bindCancel(dom);
	return dom;
};

function bindSelectAll(dom){
	dom.on("click", "> form [mc-name=selectAll]", function(event){
		event.preventDefault();
		dom.find("> form input[name=shinryou_id]").prop("checked", true);
	})
}

function bindDeselectAll(dom){
	dom.on("click", "> form [mc-name=deselectAll]", function(event){
		event.preventDefault();
		dom.find("> form input[name=shinryou_id]").prop("checked", false);
	})
}

function collectChecked(dom){
	return dom.find("> form input[name=shinryou_id]:checked").map(function(){
		return +$(this).val();
	}).get();
}

function bindEnter(dom){
	dom.on("click", "> form .workarea-commandbox [mc-name=enter]", function(event){
		event.preventDefault();
		var shinryouIds = collectChecked(dom);
		task.run(function(done){
			service.batchDeleteShinryou(shinryouIds, done);
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("shinryou-deleted", [shinryouIds]);
		})
	});
}

function bindCancel(dom){
	dom.on("click", "> form .workarea-commandbox [mc-name=cancel]", function(event){
		event.preventDefault();
		dom.trigger("close-workarea");
	});
}