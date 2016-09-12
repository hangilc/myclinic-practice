"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("myclinic-service-api");
var task = require("../task");
var mUtil = require("../../myclinic-util");

var tmplHtml = require("raw!./search-patient.html");

var itemTmplSrc = require("raw!./search-patient-item.html");
var itemTmpl = hogan.compile(itemTmplSrc);

exports.setup = function(dom){
	dom.html(tmplHtml);
	bindButton(dom);
	bindForm(dom);
	bindOption(dom);
};

function hideWorkspace(dom){
	getWorkspaceDom(dom).hide();
	getInputDom(dom).val("");
	getSelectDom(dom).html("");
};

function getWorkspaceDom(dom){
	return dom.find("[mc-name=workspace]");
};

function getInputDom(dom){
	return dom.find("[mc-name=searchForm] input.search-patient-input");
};

function getSelectDom(dom){
	return dom.find("select");
};

function bindButton(dom){
	dom.on("click", "[mc-name=button]", function(){
		var ws = getWorkspaceDom(dom);
		if( ws.is(":visible") ){
			hideWorkspace(dom);
		} else {
			ws.show();
			getInputDom(dom).focus();
		}
	});
};

function bindForm(dom){
	dom.on("submit", "form", function(){
		var text = getInputDom(dom).val();
		if( text === "" ){
			return;
		}
		var list;
		task.run(function(done){
			service.searchPatient(text, function(err, result){
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
			if( list.length === 1 ){
				var patient = list[0];
				dom.trigger("start-patient", [patient.patient_id]);
			} else {
				var select = getSelectDom(dom).html("");
				list.forEach(function(patient){
					var data = mUtil.assign({}, patient, {
						patient_id_label: mUtil.padNumber(patient.patient_id, 4)
					});
					var opt = itemTmpl.render(data);
					select.append(opt);
				});
			}
		});
	});
}

function bindOption(dom){
	dom.on("dblclick", "option", function(){
		var opt = $(this);
		var patientId = +opt.val();
		opt.trigger("start-patient", [patientId]);
	});
	dom.listen("rx-start-page", function(){
		hideWorkspace(dom);
	});
}

