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

exports.create = function(conduct){
	conduct = mUtil.assign({}, conduct);
	conduct.drugs = conduct.drugs.map(function(drug){
		return mUtil.assign({}, drug, {
			label: mUtil.conductDrugRep(drug)
		})
	});
	conduct.kizai_list = conduct.kizai_list.map(function(kizai){
		return mUtil.assign({}, kizai, {
			label: mUtil.conductKizaiRep(kizai)
		})
	});
	var dom = $(tmpl.render(conduct, {
		shinryouList: shinryouTmpl,
		drugs: drugTmpl,
		kizaiList: kizaiTmpl
	}));
	bindClose(dom);
	bindDelete(dom);
	return dom;
};

var closeLinkSelector = "> [mc-name=main-area] > [mc-name=disp-area] > .workarea-commandbox [mc-name=closeLink]";
var deleteLinkSelector = "> [mc-name=main-area] > [mc-name=disp-area] > .workarea-commandbox [mc-name=deleteLink]";

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