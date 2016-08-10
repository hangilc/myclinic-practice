"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");
var ConductSubmenu = require("./conduct-submenu");
var ConductAddXpForm = require("./conduct-add-xp-form");

var tmplHtml = require("raw!./conduct-menu.html");

exports.setup = function(dom, visitId){
	dom.html(tmplHtml);
	bindTopMenuClick(dom, visitId);
	setState(dom, "init");
}

function setState(dom, state){
	dom.data("state", state);
}

function getState(dom){
	return dom.data("state");
}

var topMenuSelector = "> [mc-name=top-menu-area] [mc-name=submenuLink]";
var submenuSelector = "> [mc-name=submenu-area]";
var workspaceSelector = "> [mc-name=workspace-area]";

function getSubmenuDom(dom){
	return dom.find(submenuSelector);
}

function getWorkspaceDom(dom){
	return dom.find(workspaceSelector);
}

function closeSubmenu(dom){
	getSubmenuDom(dom).html("");
}

function startWork(dom, state, form){
	closeSubmenu(dom);
	getWorkspaceDom(dom).append(form);
	setState(dom, state);
}

function endWork(dom){
	getWorkspaceDom(dom).html("");
	setState(dom, "init");
}

function bindTopMenuClick(dom, visitId){
	dom.on("click", topMenuSelector, function(event){
		event.preventDefault();
		var state = getState(dom);
		if( state === "init" ){
			var submenu = ConductSubmenu.create();
			bindSubmenu(dom, submenu, visitId);
			getSubmenuDom(dom).append(submenu);
			setState(dom, "submenu");
		} else if( state === "submenu" ){
			closeSubmenu(dom);
			setState(dom, "init");
		}
	});
}

function doAddXp(dom, visitId){
	var msg = "現在（暫定）診察中でありませんが、Ｘ線処置を追加しますか？";
	if( !dom.inquire("fn-confirm-edit", [visitId, msg]) ){
		return;
	}
	var form = ConductAddXpForm.create();
	form.on("enter", function(event, label, film){
		event.stopPropagation();
		console.log("enter-xp", label, film);
	})
	form.on("cancel", function(event){
		event.stopPropagation();
		endWork(dom);
	});
	startWork(dom, "add-xp", form);
}

function bindSubmenu(dom, submenu, visitId){
	submenu.on("add-xp", function(event){
		doAddXp(dom, visitId);
	});
	submenu.on("add-inject", function(event){
		console.log("add-inject");
	});
	submenu.on("copy-all", function(event){
		console.log("copy-all");
	});
	submenu.on("cancel", function(event){
		event.stopPropagation();
		closeSubmenu(dom);
		setState(dom, "init");
	});
}

