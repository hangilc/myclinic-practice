"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../../myclinic-util");
var ConductSubmenu = require("./conduct-submenu");
var ConductAddXpForm = require("./conduct-add-xp-form");
var conti = require("conti");
var service = require("../service");
var task = require("../task");
var mConsts = require("myclinic-consts");

var tmplHtml = require("raw!./conduct-menu.html");

exports.setup = function(dom, visitId, at){
	dom.html(tmplHtml);
	bindTopMenuClick(dom, visitId, at);
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

function bindTopMenuClick(dom, visitId, at){
	dom.on("click", topMenuSelector, function(event){
		event.preventDefault();
		var state = getState(dom);
		if( state === "init" ){
			var submenu = ConductSubmenu.create();
			bindSubmenu(dom, submenu, visitId, at);
			getSubmenuDom(dom).append(submenu);
			setState(dom, "submenu");
		} else if( state === "submenu" ){
			closeSubmenu(dom);
			setState(dom, "init");
		}
	});
}

function enterXp(visitId, at, label, film, cb){
	var conductId, kizaicode, shinryoucodes = [], newConduct;
	conti.exec([
		function(done){
			var conduct = {
				visit_id: visitId,
				kind: mConsts.ConductKindGazou
			}
			service.enterConduct(conduct, function(err, result){
				if( err ){
					done(err);
					return;
				}
				conductId = result;
				done();
			})
		},
		function(done){
			var gazouLabel = {
				visit_conduct_id: conductId,
				label: label
			};
			service.enterGazouLabel(gazouLabel, done);
		},
		function(done){
			service.resolveKizaiNameAt(film, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				kizaicode = result;
				done();
			})
		},
		function(done){
			var kizai = {
				visit_conduct_id: conductId,
				kizaicode: kizaicode,
				amount: 1
			};
			service.enterConductKizai(kizai, done);
		},
		function(done){
			var names = ['単純撮影', '単純撮影診断'];
			service.batchResolveShinryouNamesAt(names, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				names.forEach(function(name){
					var code = result[name];
					if( code > 0 ){
						shinryoucodes.push(code);
					}
				});
				done();
			})
		},
		function(done){
			var list = shinryoucodes.map(function(shinryoucode){
				return {
					visit_conduct_id: conductId,
					shinryoucode: shinryoucode
				};
			});
			service.batchEnterConductShinryou(list, done);
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
			cb(err);
			return;
		}
		cb(undefined, newConduct);
	});
}

function doAddXp(dom, visitId, at){
	var msg = "現在（暫定）診察中でありませんが、Ｘ線処置を追加しますか？";
	if( !dom.inquire("fn-confirm-edit", [visitId, msg]) ){
		return;
	}
	var form = ConductAddXpForm.create();
	form.on("enter", function(event, label, film){
		event.stopPropagation();
		var newConduct;
		task.run(function(done){
			enterXp(visitId, at, label, film, function(err, result){
				if( err ){
					done(err);
					return;
				}
				newConduct = result;
				done();
			})
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("conducts-batch-entered", [visitId, [newConduct]]);
			endWork(dom);
		})
	});
	form.on("cancel", function(event){
		event.stopPropagation();
		endWork(dom);
	});
	startWork(dom, "add-xp", form);
}

function bindSubmenu(dom, submenu, visitId, at){
	submenu.on("add-xp", function(event){
		doAddXp(dom, visitId, at);
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

