"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./conduct-form.html");
var tmpl = hogan.compile(tmplSrc);
var shinryouTmplSrc = require("raw!./conduct-form-shinryou-list.html");
var shinryouTmpl = hogan.compile(shinryouTmplSrc);
var drugTmplSrc = require("raw!./conduct-form-drugs.html");
var drugTmpl = hogan.compile(drugTmplSrc);
var kizaiTmplSrc = require("raw!./conduct-form-kizai-list.html");
var kizaiTmpl = hogan.compile(kizaiTmplSrc);
var mUtil = require("../../myclinic-util");
var AddShinryouForm = require("./conduct-form-add-shinryou-subform");

exports.create = function(conductEx, at){
	var conductId = conductEx.id;
	var dom = $(tmpl.render(conductEx, {
		shinryouList: shinryouTmpl,
		drugs: drugTmpl,
		kizaiList: kizaiTmpl
	}));
	bindAddShinryou(dom, at, conductId);
	bindClose(dom);
	bindDelete(dom);
	dom.listen("rx-conduct-modified", function(targetConductId, newConductEx){
		if( conductId !== targetConductId ){
			return;
		}
		dom.replaceWith(exports.create(newConductEx, at));
	});
	return dom;
};

var addShinryouLinkSelector = "> [mc-name=main-area] > .menu-box [mc-name=addShinryou]";
var subformAreaSelector = "> [mc-name=main-area] > [mc-name=subwidget]";
var closeLinkSelector = "> [mc-name=main-area] > [mc-name=disp-area] > .workarea-commandbox [mc-name=closeLink]";
var deleteLinkSelector = "> [mc-name=main-area] > [mc-name=disp-area] > .workarea-commandbox [mc-name=deleteLink]";

function getSubformAreaDom(dom){
	return dom.find(subformAreaSelector);
}

function bindAddShinryou(dom, at, conductId){
	dom.on("click", addShinryouLinkSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		var area = getSubformAreaDom(dom);
		if( !area.is(":empty") ){
			return;
		}
		var form = AddShinryouForm.create(at, conductId);
		form.on("cancel", function(event){
			event.stopPropagation();
			getSubformAreaDom(dom).empty();
		});
		dom.find(subformAreaSelector).append(form);
	});
}

function bindClose(dom){
	dom.on("click", closeLinkSelector, function(event){
		event.preventDefault();
		dom.trigger("close");
	});
}

function bindDelete(dom){
	dom.on("click", deleteLinkSelector, function(event){
		event.preventDefault();
		if( !confirm("この処置を削除してもいいですか？") ){
			return;
		}
		dom.trigger("delete");
	});
}