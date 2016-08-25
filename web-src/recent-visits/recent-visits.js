"use strict";

var hogan = require("hogan");
var mUtil = require("../../myclinic-util");
var service = require("../service");
var $ = require("jquery");
require("../../jquery-broadcast");
var task = require("../task")

var tmplHtml = require("raw!./recent-visits.html");
var optionTmpl = hogan.compile(require("raw!./recent-visits-option.html"));

exports.setup = function(dom){
	dom.html(tmplHtml);
	bindButton(dom);
	bindOption(dom);
	dom.listen("rx-start-page", function(pageData){
		getSelectDom(dom).hide().html("");
	})
};

function getSelectDom(dom){
	return dom.find("select");
}

function bindButton(dom){
	dom.on("click", "button", function(){
		var select = getSelectDom(dom);
		if( select.is(":visible") ){
			select.hide().html("");
		} else {
			task.run(function(cb){
				service.recentVisits(cb);
			}, function(err, list){
				if( err ){
					alert(err);
					return;
				}
				updateSelect(select, list);
				select.show();
			});
		}
	});
}

function bindOption(dom){
	dom.on("dblclick", "option", function(){
		var patientId = $(this).val();
		dom.trigger("start-patient", [+patientId]);
	});
}

function updateSelect(select, list){
	list.forEach(function(data){
		data = mUtil.assign({}, data, {
			patient_id_part: mUtil.padNumber(data.patient_id, 4)
		});
		select.append(optionTmpl.render(data))
	});
}
