"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");
var AddRegularForm = require("./shinryou-add-regular");
var ShinryouAddForm = require("./shinryou-add-form");
var ShinryouDeleteSelectedForm = require("./shinryou-delete-selected-form");
var ShinryouSubmenu = require("./shinryou-submenu");
var service = require("../service");
var task = require("../task");

var tmplHtml = require("raw!./shinryou-menu.html");

exports.setup = function(dom, visitId, at){
	dom.html(tmplHtml);
	bindAddRegular(dom, visitId, at);
	bindSubmenu(dom, visitId, at);
	bindSubmenuAddForm(dom);
	bindSubmenuDeleteSelectedForm(dom, visitId, at);
	bindSubmenuCancel(dom);
	bindCloseWorkarea(dom);
	bindShinryouBatchEntered(dom);
	setState(dom, "init");
}

var addShinryouSelector = "> [mc-name=addShinryouLink]";
var submenuLinkSelector = "> [mc-name=submenuLink]";
var submenuAreaSelector = "> [mc-name=submenu-area]";
var workAreaSelector = "> [mc-name=work-area]";

function bindAddRegular(dom, visitId, at){
	dom.on("click", addShinryouSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		var state = getState(dom);
		if( state === "submenu" ){
			return;
		} else if( state === "add-regular" ){
			endWork(dom);
		} else {
			var ok = dom.inquire("fn-confirm-edit", [visitId, 
				"現在（暫定）診療中でありませんが、診療行為を追加しますか？"]);
			if( !ok ){
				return;
			}
			var form = AddRegularForm.create(visitId, at);
			startWork(dom, "add-regular", form);
		}
	})
}

function bindSubmenu(dom, visitId, at){
	dom.on("click", submenuLinkSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		var state = getState(dom);
		if( state === "submenu" ){
			closeSubmenu(dom);
			setState(dom, "init");
		} else if( state === "init" ) {
			ShinryouSubmenu.setup(dom.find(submenuAreaSelector), visitId, at);
			setState(dom, "submenu");
		}
	})
}

function bindSubmenuAddForm(dom){
	dom.on("submenu-add-form", function(event){
		event.stopPropagation();
		console.log("add-form");
	})
}

function bindSubmenuDeleteSelectedForm(dom, visitId, at){
	dom.on("submenu-delete-selected", function(event){
		event.stopPropagation();
		if( !dom.inquire("fn-confirm-edit", [visitId, "現在（暫定）診療中でありませんが、診療行為を削除しますか？"]) ){
			return;
		}
		var shinryouList;
		task.run(function(done){
			service.listFullShinryouForVisit(visitId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				shinryouList = result;
				done();
			})
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			var form = ShinryouDeleteSelectedForm.create(shinryouList);
			form.on("shinryou-deleted", function(event, deletedShinryouIds){
				dom.trigger("shinryou-batch-deleted", [visitId, deletedShinryouIds]);
				endWork(dom);
			});
			closeSubmenu(dom);
			startWork(dom, "delete-selected", form);
		})
	})
}

function bindSubmenuCancel(dom){
	dom.on("submenu-cancel", function(event){
		event.stopPropagation();
		closeSubmenu(dom);
		setState(dom, "init");
	})
}

function setState(dom, state){
	return dom.data("state", state);
}

function getState(dom){
	return dom.data("state");
}

function startWork(dom, state, e){
	setState(dom, state);
	dom.find(workAreaSelector).append(e);
}

function endWork(dom){
	dom.find(workAreaSelector).html("");
	setState(dom, "init");
}

function closeSubmenu(dom){
	dom.find(submenuAreaSelector).html("");
}

function bindCloseWorkarea(dom){
	dom.on("close-workarea", function(event){
		event.stopPropagation();
		endWork(dom);
	})
}

function bindShinryouBatchEntered(dom){
	dom.on("shiryou-batch-entered", function(event){
		endWork(dom);
	});
}


