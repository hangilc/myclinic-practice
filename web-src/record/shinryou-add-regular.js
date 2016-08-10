"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./shinryou-add-regular.html");
var service = require("../service");
var task = require("../task");
var conti = require("conti");

exports.create = function(visitId, at){
	var dom = $(tmplSrc);
	bindEnter(dom, visitId, at);
	bindCancel(dom);
	return dom;
}

function bindEnter(dom, visitId, at){
	dom.on("click", "> form .workarea-commandbox [mc-name=enter]", function(event){
		event.preventDefault();
		event.stopPropagation();
		var names = dom.find("> form input[name=item]:checked").map(function(){
			return $(this).val();
		}).get();
		var shinryouList, newShinryouIds, newShinryouList = [];
		task.run([
			function(done){
				service.batchResolveShinryouNamesAt(names, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					var nameCodeMap = result;
					shinryouList = names.map(function(name){
						return {
							visit_id: visitId,
							shinryoucode: nameCodeMap[name]
						}
					});
					done();
				});
			},
			function(done){
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
				conti.forEachPara(newShinryouIds, function(shinryouId, done){
					service.getFullShinryou(shinryouId, at, function(err, result){
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
			dom.trigger("entered", [newShinryouList]);
		})
	})
}

function bindCancel(dom){
	dom.on("click", "> form .workarea-commandbox [mc-name=cancel]", function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.trigger("cancel");
	});
}