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
	var selector = "> form .workarea-commandbox [mc-name=enter]";
	dom.on("click", selector, function(event){
		event.preventDefault();
		event.stopPropagation();
		dom.find(selector).prop("disabled", true);
		var names = dom.find("> form input[name=item]:checked").map(function(){
			return $(this).val();
		}).get();
		var newShinryouIds, newConductIds;
		var newShinryouList = [], newConductList = [];
		task.run([
			function(done){
				service.enterShinryouByNames(visitId, names, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newShinryouIds = result.shinryou_ids;
					newConductIds = result.conduct_ids;
					done();
				})
			},
			function(done){
				conti.forEach(newShinryouIds, function(newShinryouId, done){
					service.getFullShinryou(newShinryouId, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newShinryouList.push(result);
						done();
					})
				}, done);
			},
			function(done){
				conti.forEach(newConductIds, function(newConductId, done){
					service.getFullConduct(newConductId, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newConductList.push(result);
						done();
					})
				}, done);
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("entered", [newShinryouList, newConductList]);
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