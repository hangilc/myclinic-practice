"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./conduct-form.html");
var tmpl = hogan.compile(tmplSrc);
var mUtil = require("../../myclinic-util");
var AddShinryouForm = require("./conduct-form-add-shinryou-subform");
var AddDrugForm = require("./conduct-form-add-drug-subform");
var AddKizaiForm = require("./conduct-form-add-kizai-subform");
var GazouLabelForm = require("./conduct-form-gazou-label-subform");
var task = require("../task");
var service = require("../service");

exports.create = function(conductEx, at){
	var conductId = conductEx.id;
	var dom = $("<div></div>");
	dom.html(tmpl.render(conductEx));
	adaptToKind(dom, conductEx.kind);
	var ctx = {
		conduct: conductEx
	};
	bindAddShinryou(dom, at, conductId);
	bindAddDrug(dom, at, conductId);
	bindAddKizai(dom, at, conductId);
	bindKindChange(dom, at, conductId);
	bindGazouLabel(dom, at, ctx);
	bindDeleteShinryou(dom, conductId, at);
	bindClose(dom);
	bindDelete(dom);
	dom.listen("rx-conduct-modified", function(targetConductId, newConductEx){
		if( conductId === targetConductId ){
			ctx.conduct = newConductEx;
			dom.html(tmpl.render(newConductEx));
			adaptToKind(dom, newConductEx.kind);
		}
	});
	return dom;
};

var addShinryouLinkSelector = "> div > [mc-name=main-area] > .menu-box [mc-name=addShinryou]";
var addDrugLinkSelector = "> div > [mc-name=main-area] > .menu-box [mc-name=addDrug]";
var addKizaiLinkSelector = "> div > [mc-name=main-area] > .menu-box [mc-name=addKizai]";
var kindSelector = "> div > [mc-name=main-area] [mc-name=disp-area] select[mc-name=kind]";
var gazouLabelDispSelector = "> div > [mc-name=main-area] [mc-name=disp-area] [mc-name=gazou-label-disp]";
var gazouLabelFormSelector = "> div > [mc-name=main-area] [mc-name=disp-area] [mc-name=gazou-label-form]";
var editGazouLabelLinkSelector = "> div > [mc-name=main-area] [mc-name=disp-area] [mc-name=editGazouLabelLink]";
var subformAreaSelector = "> div > [mc-name=main-area] > [mc-name=subwidget]";
var closeLinkSelector = "> div > [mc-name=main-area] > [mc-name=disp-area] > .workarea-commandbox [mc-name=closeLink]";
var deleteLinkSelector = "> div > [mc-name=main-area] > [mc-name=disp-area] > .workarea-commandbox [mc-name=deleteLink]";
var deleteShinryouLinkSelector = "> div > [mc-name=main-area] [mc-name=shinryouList] [mc-name=deleteShinryouLink]";
var deleteDrugLinkSelector = "> div > [mc-name=main-area] [mc-name=drugList] [mc-name=deleteDrugLink]";
var deleteKizaiLinkSelector = "> div > [mc-name=main-area] [mc-name=kizaiList] [mc-name=deleteKizaiLink]";

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

function bindGazouLabel(dom, at, ctx){
	dom.on("click", editGazouLabelLinkSelector, function(event){
		event.preventDefault();
		var dispArea = dom.find(gazouLabelDispSelector);
		var formArea = dom.find(gazouLabelFormSelector);
		var form = GazouLabelForm.create(ctx.conduct, at);
		form.on("modified", function(event, newConduct){
			event.stopPropagation();
			dom.trigger("conduct-modified", [ctx.conduct.id, newConduct]);
		})
		form.on("cancel", function(event){
			event.stopPropagation();
			formArea.empty();
			dispArea.show();
		})
		dispArea.hide();
		formArea.append(form);
	})
}

function bindDeleteShinryou(dom, conductId, at){
	dom.on("click", deleteShinryouLinkSelector, function(event){
		event.preventDefault();
		if( !confirm("この処置診療行為を削除しますか？") ){
			return;
		}
		var e = $(this);
		e.prop("disabled", true);
		var id = e.attr("id-value");
		var newConduct;
		task.run([
			function(done){
				service.deleteConductShinryou(id, done);
			},
			function(done){
				service.getFullConduct(conductId, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newConduct = result;
					done();
				});
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("conduct-modified", [conductId, newConduct]);
		})
	})
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