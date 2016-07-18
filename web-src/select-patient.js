"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("./service");
var SelectPatientItem = require("./select-patient-item");

var tmplSrc = require("raw!./select-patient.html");
var tmpl = hogan.compile(tmplSrc);

function SelectPatient(dom){
	this.dom = dom;
	this.bindButton();
	this.bindOption();
}

SelectPatient.prototype.bindButton = function(){
	var self = this;
	this.dom.on("click", "[mc-name=button]", function(event){
		event.preventDefault();
		var ws = self.getWorkspaceDom();
		if( ws.is(":visible") ){
			self.getSelectDom().html("");
			ws.hide();
		} else {
			service.listFullWqueueForExam(function(err, result){
				if( err ){
					alert(err);
					return;
				}
				var select = self.getSelectDom().html("");
				result.forEach(function(wq){
					var e = $("<option></option>").val(wq.visit_id);
					new SelectPatientItem(e).update(wq);
					select.append(e);
				});
				ws.show();
			});
		}
	});
};

SelectPatient.prototype.bindOption = function(){
	var self = this;
	this.dom.on("dblclick", "option", function(event){
		var opt = $(this);
		var visit_id = opt.val();
		opt.trigger("start-exam", [visit_id]);
		self.getSelectDom().html("");
		self.getWorkspaceDom().hide();
	})
};

SelectPatient.prototype.getWorkspaceDom = function(){
	return this.dom.find("[mc-name=selectWrapper]");
};

SelectPatient.prototype.getSelectDom = function(){
	return this.dom.find("[mc-name=selectWrapper] select");
}

SelectPatient.prototype.update = function(){
	this.dom.html(tmpl.render({}));
	return this;
};

module.exports = SelectPatient;
