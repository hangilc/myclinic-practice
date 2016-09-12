"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");
var HokenSelectForm = require("./hoken-select-form");
var task = require("../task");
var service = require("myclinic-service-api");

var tmplSrc = require("raw!./hoken.html");
var tmpl = hogan.compile(tmplSrc);

exports.setup = function(dom, visit){
	update(dom, visit);
	bindClick(dom);
};

function update(dom, visit){
	var label = mUtil.hokenRep(visit);
	dom.html(tmpl.render({label: label}));
	dom.data("visit", visit);
};

function bindClick(dom){
	dom.on("click", "[mc-name=label]", function(event){
		event.preventDefault();
		var visit = dom.data("visit");
		var list;
		task.run(function(done){
			service.listAvailableHoken(visit.patient_id, visit.v_datetime, function(err, result){
				if( err ){
					done(err);
					return;
				}
				list = result;
				done();
			})
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			var form = HokenSelectForm.create(list, visit);
			bindForm(form, dom);
			dom.hide();
			dom.after(form);
		})
	});
}

function bindForm(form, dom){
	form.on("hoken-updated", function(event, visit){
		update(dom, visit);
		form.remove();
		dom.show();
	});
	form.on("cancel-edit", function(event){
		event.stopPropagation();
		form.remove();
		dom.show();
	})
}

