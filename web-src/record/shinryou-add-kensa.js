"use strict";

var $ = require("jquery");
var tmplSrc = require("raw!./shinryou-add-kensa.html");
var task = require("../task");
var service = require("myclinic-service-api");
var conti = require("conti");

var inputSelector = "> form[mc-name=main-form] input[type=checkbox][name=kensa]";
var setKensaLinkSelector = "> form[mc-name=main-form] [mc-name=form-commands] [mc-name=setKensa]";
var clearKensaLinkSelector = "> form[mc-name=main-form] [mc-name=form-commands] [mc-name=clearKensa]";
var enterLinkSelector = "> form[mc-name=main-form] .workarea-commandbox [mc-name=enter]";
var cancelLinkSelector = "> form[mc-name=main-form] .workarea-commandbox [mc-name=cancel]";

exports.create = function(visitId, at){
	var dom = $(tmplSrc);
	bindSetKensa(dom);
	bindClearKensa(dom);
	bindEnter(dom, visitId, at);
	bindCancel(dom);
	return dom;
}

var kensaSetNames = ["血算", "ＨｂＡ１ｃ", "ＧＯＴ", "ＧＰＴ", "γＧＴＰ", "クレアチニン",
        "尿酸", "ＬＤＬ－コレステロール", "ＨＤＬ－コレステロール", "ＴＧ"];

function bindSetKensa(dom){
	dom.on("click", setKensaLinkSelector, function(event){
		event.preventDefault();
		dom.find(inputSelector).each(function(){
			var chk = $(this);
			if( kensaSetNames.indexOf(chk.val()) >= 0 ){
				chk.prop("checked", true);
			}
		})
	});
}

function bindClearKensa(dom){
	dom.on("click", clearKensaLinkSelector, function(event){
		event.preventDefault();
		dom.find(inputSelector).each(function(){
			var chk = $(this);
			chk.prop("checked", false);
		});
	});
}

function bindEnter(dom, visitId, at){
	dom.on("click", enterLinkSelector, function(event){
		event.preventDefault();
		var names = dom.find(inputSelector + ":checked").map(function(){
			return $(this).val();
		}).get();
		var shinryouIds, newShinryouList;
		task.run([
			function(done){
				service.enterShinryouByNames(visitId, names, function(err, result){
					if( err ){
						done(err);
						return;
					}
					shinryouIds = result.shinryou_ids;
					if( result.conduct_ids.length > 0 ){
						alert("WARNING: entered conducts were ignored");
					}
					done();
				});
			},
			function(done){
				conti.mapPara(shinryouIds, function(shinryouId, cb){
					service.getFullShinryou(shinryouId, at, cb);
				}, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newShinryouList = result;
					done();
				});
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("9y9h9nm8-entered", [newShinryouList]);
		})
	});
}

function bindCancel(dom){
	dom.on("click", cancelLinkSelector, function(event){
		event.preventDefault();
		dom.trigger("9y9h9nm8-cancel")
	})
}