"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./shinryou-add-regular.html");
var service = require("myclinic-service-api");
var task = require("../task");
var conti = require("conti");

// Helpers /////////////////////////////////////////////////////////////////////////////

function getInput(dom, value){
	return dom.find("input[type=checkbox][name=item][value=" + value + "]");
}

// Bindings ////////////////////////////////////////////////////////////////////////////

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

function bindShohou(dom){
	dom.on("change", "input[type=checkbox][name=item][value=処方料]", function(event){
		var shohou = $(event.target);
		var kasan = getInput(dom, "外来後発加算１");
		kasan.prop("checked", shohou.is(":checked")); 
	});
}

// Exports /////////////////////////////////////////////////////////////////////////////

exports.create = function(visitId, at){
	var dom = $(tmplSrc);
	bindEnter(dom, visitId, at);
	bindCancel(dom);
	bindShohou(dom);
	return dom;
}

