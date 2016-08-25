"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("../service");
var task = require("../task");
var mUtil = require("../../myclinic-util");

var tmplHtml = require("raw!./todays-visits.html");
var resultTmplSrc = require("raw!./todays-visits-search-result.html");
var resultTmpl = hogan.compile(resultTmplSrc);

exports.setup = function(dom){
	dom.html(tmplHtml);
	bindButton(dom);
	bindOption(dom);
};

function getWorkspaceDom(dom){
	return dom.find("[mc-name=selectWrapper]");
};

function getSelectDom(dom){
	return dom.find("select");
};

function bindButton(dom){
	dom.on("click", "[mc-name=button]", function(){
		var ws = getWorkspaceDom(dom);
		if( ws.length === 0 ){
			console.log("TODAYS-VISITS: cannot find workspace dom");
		}
		if( ws.is(":visible") ){
			ws.hide();
			getSelectDom(dom).html("");
		} else {
			var list;
			task.run(function(done){
				service.listTodaysVisits(function(err, result){
					if( err ){
						done(err);
						return;
					}
					list = result;
					done();
				})
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				var select = getSelectDom(dom);
				if( select.length === 0 ){
					console.log("TODAYS-VISITS: cannot find ")
				}
				select.html(searchResult(list));
				ws = getWorkspaceDom(dom);
				if( ws.length === 0 ){
					console.log("TODAYS-VISITS: cannot find workspace (2)")
				}
				ws.show();
			});
		}
	})
}

function searchResult(list){
	var data = list.map(function(item){
		return {
			patient_id: item.patient_id,
			patient_id_label: mUtil.padNumber(item.patient_id, 4),
			last_name: item.last_name,
			first_name: item.first_name
		};
	})
	return resultTmpl.render({list: data});
}

function bindOption(dom){
	dom.on("dblclick", "option", function(){
		var opt = $(this);
		var patientId = opt.val();
		opt.trigger("start-patient", [patientId]);
	});
	dom.listen("rx-start-page", function(appData){
		if( appData.currentPatientId === 0 ){
			getWorkspaceDom(dom).hide();
			getSelectDom(dom).hide();
		}
	})
}

