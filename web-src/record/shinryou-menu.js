"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");
var ShinryouAddForm = require("./shinryou-add-form");
var ShinryouSubmenu = require("./shinryou-submenu");

var tmplHtml = require("raw!./shinryou-menu.html");

exports.setup = function(dom, visitId, at){
	dom.html(tmplHtml);
	bindAddShinryou(dom, visitId, at);
	bindSubmenu(dom, visitId, at);
	setState(dom, "init");
}

var addShinryouSelector = "> [mc-name=addShinryouLink]";
var submenuLinkSelector = "> [mc-name=submenuLink]";
var submenuAreaSelector = "> [mc-name=submenu-area]";
var workAreaSelector = "> [mc-name=work-area]";

function bindAddShinryou(dom, visitId, at){
	dom.on("click", addShinryouSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		var state = getState(dom);
		if( state === "submenu" ){
			return;
		} else if( state === "add" ){
			endWork(dom);
		} else {
			var ok = dom.inquire("fn-confirm-edit", visitId, 
				"現在（暫定）診療中でありませんが、診療行為を追加しますか？");
			if( !ok ){
				return;
			}
			var form = ShinryouAddForm.create();
			startWork(dom, "add", form);
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
		} else {
			ShinryouSubmenu.setup(dom.find(submenuAreaSelector));
			setState(dom, "submenu");
		}
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



