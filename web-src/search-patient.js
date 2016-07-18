"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("./service");
var mUtil = require("../myclinic-util");

var tmplSrc = require("raw!./search-patient.html");
var tmpl = hogan.compile(tmplSrc);

var itemTmplSrc = require("raw!./search-patient-item.html");
var itemTmpl = hogan.compile(itemTmplSrc);

function SearchPatient(dom){
	this.dom = dom;
	this.bindButton();
	this.bindForm();
	this.bindOption();
}

SearchPatient.prototype.bindButton = function(){
	var self = this;
	this.dom.on("click", "[mc-name=button]", function(){
		var ws = self.getWorkspaceDom();
		if( ws.is(":visible") ){
			self.hideWorkspace();
		} else {
			ws.show();
			self.getInputDom().focus();
		}
	});
};

SearchPatient.prototype.bindForm = function(){
	var self = this;
	this.dom.on("submit", "form", function(){
		var text = self.getInputDom().val();
		if( text === "" ){
			return;
		}
		service.searchPatient(text, function(err, result){
			if( err ){
				alert(err);
				return;
			}
			var select = self.getSelectDom().html("");
			result.forEach(function(patient){
				var data = mUtil.assign({}, patient, {
					patient_id_label: mUtil.padNumber(patient.patient_id, 4)
				});
				var opt = itemTmpl.render(data);
				select.append(opt);
			});
		})
	});
};

SearchPatient.prototype.bindOption = function(){
	var self = this;
	this.dom.on("dblclick", "option", function(){
		var opt = $(this);
		var patientId = +opt.val();
		opt.trigger("start-patient", [patientId]);
		self.hideWorkspace();
	})
};

SearchPatient.prototype.hideWorkspace = function(){
	this.getWorkspaceDom().hide();
	this.getInputDom().val("");
	this.getSelectDom().html("");
};

SearchPatient.prototype.getWorkspaceDom = function(){
	return this.dom.find("[mc-name=workspace]");
};

SearchPatient.prototype.getInputDom = function(){
	return this.dom.find("[mc-name=searchForm] input.search-patient-input");
};

SearchPatient.prototype.getSelectDom = function(){
	return this.dom.find("select");
};

SearchPatient.prototype.update = function(){
	this.dom.html(tmpl.render({}));
	return this;
};

module.exports = SearchPatient;