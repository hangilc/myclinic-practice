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
var conti = require("conti");

var tmplHtml = require("raw!./shinryou-menu.html");

exports.setup = function(dom, visitId, at){
	dom.html(tmplHtml);
	bindAddRegular(dom, visitId, at);
	bindSubmenu(dom, visitId, at);
	bindSubmenuAddForm(dom, visitId, at);
	bindSubmenuCopyAll(dom, visitId, at);
	bindSubmenuDeleteSelectedForm(dom, visitId, at);
	bindSubmenuCancel(dom);
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
			form.on("entered", function(event, newShinryouList){
				event.stopPropagation();
				endWork(dom);
				dom.trigger("shinryou-batch-entered", [visitId, newShinryouList]);
			});
			form.on("cancel", function(event){
				event.stopPropagation();
				endWork(dom);
			});
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
			dom.find(submenuAreaSelector).append(ShinryouSubmenu.create(visitId, at));
			setState(dom, "submenu");
		}
	})
}

function bindSubmenuAddForm(dom, visitId, at){
	dom.on("submenu-add-form", function(event){
		event.stopPropagation();
		if( !dom.inquire("fn-confirm-edit", [visitId, "現在（暫定）診療中でありませんが、診療行為を追加しますか？"]) ){
			return;
		}
		var form = ShinryouAddForm.create(visitId, at);
		form.on("shinryou-entered", function(event, newShinryou){
			event.stopPropagation();
			dom.trigger("shinryou-batch-entered", [visitId, [newShinryou]]);
		});
		form.on("cancel", function(event){
			event.stopPropagation();
			endWork(dom);
		})
		closeSubmenu(dom);
		startWork(dom, "add-search", form);
	})
}

function bindSubmenuCopyAll(dom, visitId, at){
	dom.on("submenu-copy-all", function(event){
		event.stopPropagation();
		var targetVisitId = dom.inquire("fn-get-target-visit-id");
		if( !(targetVisitId > 0) ){
			alert("現在（暫定）診療中でないので、コピーできません。");
			return;
		}
		var srcShinryouList, targetVisit, dstShinryouCodes = [], newShinryouIds, newShinryouList = [];
		task.run([
			function(done){
				service.listFullShinryouForVisit(visitId, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					srcShinryouList = result;
					done();
				})
			},
			function(done){
				service.getVisit(targetVisitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					targetVisit = result;
					done();
				})
			},
			function(done){
				var targetAt = targetVisit.v_datetime;
				conti.forEachPara(srcShinryouList, function(shinryou, done){
					service.resolveShinryouMasterAt(shinryou.shinryoucode, targetAt, function(err, result){
						if( err ){
							console.log(err);
							done("コピー先で有効でありません：" + shinryou.name);
							return;
						}
						dstShinryouCodes.push(result.shinryoucode);
						done();
					})
				}, done);
			},
			function(done){
				var shinryouList = dstShinryouCodes.map(function(shinryoucode){
					return {
						visit_id: targetVisitId,
						shinryoucode: shinryoucode
					};
				});
				service.batchEnterShinryou(shinryouList, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newShinryouIds = result;
					done();
				})
			},
			function(done){
				var targetAt = targetVisit.v_datetime;
				conti.forEach(newShinryouIds, function(shinryouId, done){
					service.getFullShinryou(shinryouId, targetAt, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newShinryouList.push(result);
						done();
					})
				}, done);
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			closeSubmenu(dom);
			setState(dom, "init");
			dom.trigger("shinryou-batch-entered", [targetVisitId, newShinryouList]);
		})
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
				event.stopPropagation();
				dom.trigger("shinryou-batch-deleted", [visitId, deletedShinryouIds]);
				endWork(dom);
			});
			form.on("cancel", function(event){
				event.stopPropagation();
				endWork(dom);
			})
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

// function bindCloseWorkarea(dom){
// 	dom.on("close-workarea", function(event){
// 		event.stopPropagation();
// 		endWork(dom);
// 	})
// }

// function bindShinryouBatchEntered(dom){
// 	dom.on("shiryou-batch-entered", function(event){
// 		endWork(dom);
// 	});
// }


