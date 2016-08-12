"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./conduct-form.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");
var AddShinryouForm = require("./conduct-form-add-shinryou-subform");
var AddDrugForm = require("./conduct-form-add-drug-subform");
var AddKizaiForm = require("./conduct-form-add-kizai-subform");
var task = require("../task");
var service = require("../service");

exports.create = function(conductEx, at){
	var conductId = conductEx.id;
	var dom = $("<div></div>");
	dom.html(tmpl.render(conductEx));
	adaptToKind(dom, conductEx.kind);
	bindAddShinryou(dom, at, conductId);
	bindAddDrug(dom, at, conductId);
	bindAddKizai(dom, at, conductId);
	bindKindChange(dom, at, conductId);
	bindClose(dom);
	bindDelete(dom);
	dom.listen("rx-conduct-modified", function(targetConductId, newConductEx){
		if( conductId !== targetConductId ){
			return;
		}
		dom.html(tmpl.render(newConductEx));
		adaptToKind(dom, newConductEx.kind);
	});
	return dom;
};

var addShinryouLinkSelector = "> div > [mc-name=main-area] > .menu-box [mc-name=addShinryou]";
var addDrugLinkSelector = "> div > [mc-name=main-area] > .menu-box [mc-name=addDrug]";
var addKizaiLinkSelector = "> div > [mc-name=main-area] > .menu-box [mc-name=addKizai]";
var kindSelector = "> div > [mc-name=main-area] [mc-name=disp-area] select[mc-name=kind]";
var subformAreaSelector = "> div > [mc-name=main-area] > [mc-name=subwidget]";
var closeLinkSelector = "> div > [mc-name=main-area] > [mc-name=disp-area] > .workarea-commandbox [mc-name=closeLink]";
var deleteLinkSelector = "> div > [mc-name=main-area] > [mc-name=disp-area] > .workarea-commandbox [mc-name=deleteLink]";

function getSubformAreaDom(dom){
	return dom.find(subformAreaSelector);
}

function adaptToKind(dom, kind){
	dom.find(kindSelector + " option[value=" + kind + "]").prop("selected", true);
}

function getKind(dom){
	return dom.find(kindSelector + " option:selected").val();
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

function bindAddDrug(dom, at, conductId){
	dom.on("click", addDrugLinkSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		var area = getSubformAreaDom(dom);
		if( !area.is(":empty") ){
			return;
		}
		var form = AddDrugForm.create(at, conductId);
		form.on("cancel", function(event){
			event.stopPropagation();
			getSubformAreaDom(dom).empty();
		});
		dom.find(subformAreaSelector).append(form);
	})
}

function bindAddKizai(dom, at, conductId){
	dom.on("click", addKizaiLinkSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		var area = getSubformAreaDom(dom);
		if( !area.is(":empty") ){
			return;
		}
		var form = AddKizaiForm.create(at, conductId);
		form.on("cancel", function(event){
			event.stopPropagation();
			getSubformAreaDom(dom).empty();
		});
		dom.find(subformAreaSelector).append(form);
	})
}

function bindKindChange(dom, at, conductId){
	dom.on("change", kindSelector, function(event){
		var kind = getKind(dom);
		var newConduct;
		task.run([
			function(done){
				service.changeConductKind(conductId, kind, done);
			},
			function(done){
				service.getFullConduct(conductId, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newConduct = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("conduct-modified", [conductId, newConduct]);
		})
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