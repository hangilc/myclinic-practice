"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");
var ConductShinryouList = require("./conduct-shinryou-list");
var ConductDrugList = require("./conduct-drug-list");
var ConductKizaiList = require("./conduct-kizai-list");
var ConductForm = require("./conduct-form");
var task = require("../task");
var service = require("../service");

var tmplSrc = require("raw!./conduct.html");
var tmpl = hogan.compile(tmplSrc);
var dispTmplSrc = require("raw!./conduct-disp.html");
var dispTmpl = hogan.compile(dispTmplSrc);

var dispAreaSelector = "> [mc-name=disp-area]";
var workAreaSelector = "> [mc-name=work-area]";

exports.create = function(conduct){
	var visitId = conduct.visit_id;
	var conductId = conduct.id;
	var data = mUtil.assign({}, conduct, {
		kind_label: mUtil.conductKindToKanji(conduct.kind)
	})
	var dom = $(tmpl.render(data, {disp: dispTmpl}));
	ConductShinryouList.setup(dom.find("> [mc-name=disp-area] [mc-name=shinryouList]"), conduct.shinryou_list);
	ConductDrugList.setup(dom.find("> [mc-name=disp-area] [mc-name=drugs]"), conduct.drugs);
	ConductKizaiList.setup(dom.find("> [mc-name=disp-area] [mc-name=kizaiList]"), conduct.kizai_list);
	bindClick(dom, visitId, conductId);
	return dom;
};

function getDispAreaDom(dom){
	return dom.find(dispAreaSelector);
}

function getWorkAreaDom(dom){
	return dom.find(workAreaSelector);
}

function bindClick(dom, visitId, conductId){
	dom.on("click", dispAreaSelector, function(event){
		event.preventDefault();
		var msg = "現在（暫定）診察中でありませんが、この処置を変更しますか？";
		if( !dom.inquire("fn-confirm-edit", [visitId, msg]) ){
			return;
		}
		var form = ConductForm.create();
		form.on("close", function(event){
			event.stopPropagation();
			getWorkAreaDom(dom).html("");
			getDispAreaDom(dom).show();
		});
		form.on("delete", function(event){
			event.stopPropagation();
			task.run(function(done){
				service.deleteConduct(conductId, done);
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.remove();
			})
		})
		getDispAreaDom(dom).hide();
		getWorkAreaDom(dom).append(form);
	});
}

