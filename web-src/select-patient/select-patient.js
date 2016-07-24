"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("../service");
var task = require("../task");
var SelectPatientItem = require("./select-patient-item");

var tmplHtml = require("raw!./select-patient.html");

exports.setup = function(dom){
	dom.html(tmplHtml);
	bindButton(dom);
	bindOption(dom);
};

function getWorkspaceDom(dom){
	return dom.find("[mc-name=selectWrapper]");
};

function getSelectDom(dom){
	return dom.find("[mc-name=selectWrapper] select");
}

function bindButton(dom){
	dom.on("click", "[mc-name=button]", function(event){
		event.preventDefault();
		var ws = getWorkspaceDom(dom);
		if( ws.is(":visible") ){
			getSelectDom(dom).html("");
			ws.hide();
		} else {
			var list;
			task.run(function(done){
				service.listFullWqueueForExam(function(err, result){
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
				var select = getSelectDom(dom).html("");
				list.forEach(function(wq){
					var e = $("<option></option>").val(wq.visit_id);
					var e = SelectPatientItem.create(wq);
					select.append(e);
				});
				ws.show();
			})
		}
	});
}

function bindOption(dom){
	dom.on("dblclick", "option", function(event){
		var opt = $(this);
		var values = opt.val().split(",");
		var patientId = +values[0];
		var visitId = +values[1];
		opt.trigger("start-exam", [patientId, visitId]);
	});
	dom.listen("rx-start-page", function(){
		getSelectDom(dom).html("");
		getWorkspaceDom(dom).hide();
	});
};

