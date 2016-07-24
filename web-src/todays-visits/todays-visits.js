"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("../service");
var task = require("../task");
var mUtil = require("../../myclinic-util");

var tmplHtml = require("raw!./todays-visits.html");
var itemTmplSrc = require("raw!./todays-visits-item.html");
var itemTmpl = hogan.compile(itemTmplSrc);

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
				var select = getSelectDom(dom).html("");
				list.forEach(function(data){
					var opt = makeOption(data);
					select.append(opt);
				});
				ws.show();
			});
		}
	})
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

