"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");
var Submenu = require("./drug-submenu");
var DrugForm = require("./drug-form/drug-form");

var tmplHtml = require("raw!./drug-menu.html");

exports.setup = function(dom){
	dom.html(tmplHtml);
	bindAddDrug(dom);
	bindSubmenu(dom);
	bindSubmenuClick(dom);
	Submenu.setup(getSubmenuDom(dom));
};

function getSubmenuDom(dom){
	return dom.find(".drug-submenu");
}

function getWorkareaDom(dom){
	return dom.find(".workarea");
}

function bindAddDrug(dom){
	dom.find("[mc-name=addDrugLink]").click(function(event){
		event.preventDefault();
		var wa = getWorkareaDom(dom);
		wa.html("");
		var form = DrugForm.create();
		wa.append(form).show();
	});
}

function bindSubmenu(dom){
	var submenu = getSubmenuDom(dom);
	submenu.on("cancel-submenu", function(event){
		event.stopPropagation();
		Submenu.hide(submenu);
	});
}

function bindSubmenuClick(dom){
	dom.on("click", "[mc-name=drugSubmenuLink]", function(event){
		event.preventDefault();
		var submenu = getSubmenuDom(dom);
		if( Submenu.isVisible(submenu) ){
			Submenu.hide(submenu);
		} else {
			Submenu.show(submenu);
		}
	});
}

