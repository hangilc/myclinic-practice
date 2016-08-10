"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var task = require("../task");
var service = require("../service");

var tmplSrc = require("raw!./shinryou-add-form.html");
var resultTmplSrc = require("raw!./shinryou-add-form-search-result.html");
var resultTmpl = hogan.compile(resultTmplSrc);

exports.create = function(visitId, at){
	var dom = $(tmplSrc);
	var ctx = {shinryoucode: undefined};
	bindEnter(dom, visitId, at, ctx);
	bindCancel(dom);
	bindSearch(dom, at);
	bindResult(dom, at, ctx);
	return dom;
}

var dispNameSelector = "> div[mc-name=disp-area] [mc-name=name]";
var enterSelector = "> .workarea-commandbox [mc-name=enter]";
var cancelSelector = "> .workarea-commandbox [mc-name=close]";
var searchTextInputSelector = "> form[mc-name=search-form] input[mc-name=text]";
var searchResultSelector = "> form[mc-name=search-form] select";

function updateDisp(dom, label){
	dom.find(dispNameSelector).text(label);
}

function bindEnter(dom, visitId, at, ctx){
	dom.on("click", enterSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		var shinryoucode = ctx.shinryoucode;
		if( !shinryoucode ){
			alert("診療行為が指定されていません。");
			return;
		}
		shinryoucode = +shinryoucode;
		var newShinryouId, newShinryou;
		task.run([
			function(done){
				service.batchEnterShinryou([{
					visit_id: visitId,
					shinryoucode: shinryoucode
				}], function(err, result){
					if( err ){
						done(err);
						return;
					}
					newShinryouId = result;
					done();
				})
			},
			function(done){
				service.getFullShinryou(newShinryouId, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newShinryou = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("shinryou-entered", [newShinryou]);
		});
	})
}

function bindCancel(dom){
	dom.on("click", cancelSelector, function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("cancel");
	});
}

function bindSearch(dom, at){
	dom.on("submit", "> form[mc-name=search-form]", function(event){
		event.preventDefault();
		event.stopPropagation();
		var text = dom.find(searchTextInputSelector).val().trim();
		if( text === "" ){
			return;
		}
		var list;
		task.run(function(done){
			service.searchShinryouMaster(text, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				list = result;
				done();
			});
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			var select = dom.find(searchResultSelector);
			select.html(resultTmpl.render({list: list}));
		});
	});
}

function bindResult(dom, at, ctx){
	dom.on("change", searchResultSelector, function(event){
		var shinryoucode = +dom.find(searchResultSelector + " option:selected").val();
		var master;
		task.run([
			function(done){
				service.resolveShinryouMasterAt(shinryoucode, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					master = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			ctx.shinryoucode = master.shinryoucode;
			updateDisp(dom, master.name);
		})
	});
}