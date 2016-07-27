"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");
var Submenu = require("./drug-submenu");
var DrugForm = require("./drug-form/drug-form");

var tmplHtml = require("raw!./drug-menu.html");

exports.setup = function(dom, visit){
	dom.html(tmplHtml);
	bindAddDrug(dom, visit);
	bindSubmenu(dom);
	bindSubmenuClick(dom);
	Submenu.setup(getSubmenuDom(dom), visit.visit_id, visit.v_datetime);
};

function getSubmenuDom(dom){
	return dom.find(".drug-submenu");
}

function getWorkareaDom(dom){
	return dom.find(".workarea");
}

function setWorkarea(dom, kind, content){
	var wa = getWorkareaDom(dom);
	wa.data("kind", kind);
	wa.html("").append(content);
	wa.show();
}

function clearWorkarea(dom){
	var wa = getWorkareaDom(dom);
	wa.removeData("kind");
	wa.hide().html("");
}

function bindAddDrug(dom, visit){
	dom.find("[mc-name=addDrugLink]").click(function(event){
		event.preventDefault();
		var submenu = getSubmenuDom(dom);
		if( Submenu.isVisible(submenu) ){
			return;
		}
		var wa = getWorkareaDom(dom);
		var kind = wa.data("kind");
		if( kind === "add-drug" ){
			clearWorkarea(dom);
			return;
		}
		wa.html("");
		var form = DrugForm.createAddForm(visit.visit_id, visit.v_datetime, visit.patient_id);
		bindAddForm(dom, form);
		setWorkarea(dom, "add-drug", form);
	});
}

function bindAddForm(dom, form){
	form.on("cancel-form", function(event){
		event.stopPropagation();
		clearWorkarea(dom);
	});
}

function bindSubmenu(dom){
	var submenu = getSubmenuDom(dom);
}

function bindSubmenuClick(dom){
	dom.on("click", "[mc-name=drugSubmenuLink]", function(event){
		event.preventDefault();
		var wa = getWorkareaDom(dom);
		if( wa.data("kind") ){
			return;
		}
		var submenu = getSubmenuDom(dom);
		if( Submenu.isVisible(submenu) ){
			Submenu.hide(submenu);
		} else {
			Submenu.show(submenu);
		}
	});
}

