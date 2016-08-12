"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");
var Submenu = require("./drug-submenu");
var DrugForm = require("./drug-form");

var tmplHtml = require("raw!./drug-menu.html");

var CopySelected = require("./drug-copy-selected-form");
var ModifyDays = require("./drug-modify-days-form");
var DeleteSelected = require("./drug-delete-selected-form");

var task = require("../task");
var service = require("../service");

exports.setup = function(dom, visit){
	dom.html(tmplHtml);
	bindAddDrug(dom, visit);
	bindSubmenuClick(dom);
	bindCopySelected(dom, visit.visit_id, visit.v_datetime);
	bindModifyDays(dom, visit.visit_id, visit.v_datetime);
	bindDeleteSelected(dom, visit.visit_id, visit.v_datetime);
	bindWorkareaCancel(dom);
	bindWorkareaClose(dom);
	Submenu.setup(getSubmenuDom(dom), visit.visit_id, visit.v_datetime);
};

function getSubmenuDom(dom){
	return dom.find(".drug-submenu");
}

function getWorkareaDom(dom){
	return dom.find("> [mc-name=workarea]");
}

function setWorkarea(dom, kind, content){
	var wa = getWorkareaDom(dom);
	wa.data("kind", kind);
	wa.append(content);
}

function clearWorkarea(dom){
	var wa = getWorkareaDom(dom);
	wa.removeData("kind");
	wa.html("");
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
		} else if( kind ){
			return;
		}
		var msg = "（暫定）診察中ではありませんが、薬剤を追加しますか？";
		if( !dom.inquire("fn-confirm-edit", [visit.visit_id, msg]) ){
			return;
		}
		wa.html("");
		var form = DrugForm.createAddForm(visit.visit_id, visit.v_datetime, visit.patient_id);
		form.on("entered", function(event, newDrug){
			event.stopPropagation();
			dom.trigger("drug-entered", [newDrug]);
		});
		form.on("cancel", function(event){
			event.stopPropagation();
			clearWorkarea(dom);
		});
		setWorkarea(dom, "add-drug", form);
	});
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

function bindCopySelected(dom, visitId, at){
	var submenu = getSubmenuDom(dom);
	submenu.on("submenu-copy-selected", function(event, targetVisitId){
		event.stopPropagation();
		task.run(function(done){
			service.listFullDrugsForVisit(visitId, at, done);
		}, function(err, drugs){
			if( err ){
				alert(err);
				return;
			}
			var form = CopySelected.create(drugs, at);
			Submenu.hide(submenu);
			setWorkarea(dom, "copy-selected", form);
		})
	})
}

function bindModifyDays(dom, visitId, at){
	var submenu = getSubmenuDom(dom);
	submenu.on("submenu-modify-days", function(event){
		event.stopPropagation();
		task.run(function(done){
			service.listFullDrugsForVisit(visitId, at, done);
		}, function(err, drugs){
			if( err ){
				alert(err);
				return;
			}
			var form = ModifyDays.create(drugs, visitId, at);
			Submenu.hide(submenu);
			setWorkarea(dom, "modify-days", form);
		})
	})
}

function bindDeleteSelected(dom, visitId, at){
	var submenu = getSubmenuDom(dom);
	submenu.on("submenu-delete-selected", function(event){
		event.stopPropagation();
		task.run(function(done){
			service.listFullDrugsForVisit(visitId, at, done);
		}, function(err, drugs){
			if( err ){
				alert(err);
				return;
			}
			var form = DeleteSelected.create(drugs, visitId, at);
			Submenu.hide(submenu);
			setWorkarea(dom, "delete-selected", form);
		})
	})
}

function bindWorkareaCancel(dom){
	dom.on("cancel-workarea", function(event){
		event.stopPropagation();
		clearWorkarea(dom);
	});
}

function bindWorkareaClose(dom){
	dom.on("close-workarea", function(event){
		event.stopPropagation();
		clearWorkarea(dom);
	})
}