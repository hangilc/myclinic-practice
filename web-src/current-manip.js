"use strict";

var $ = require("jquery");
var hogan = require("hogan");

var tmplSrc = require("raw!./current-manip.html");
var tmpl = hogan.compile(tmplSrc);

function CurrentManip(dom){
	this.dom = dom;
}

CurrentManip.prototype.render = function(){
	this.bindEndPatient();
	return this;
};

CurrentManip.prototype.bindEndPatient = function(){
	var self = this;
	this.dom.on("click", "[mc-name=endPatientButton]", function(event){
		event.preventDefault();
		self.dom.trigger("end-patient");
	})
};

CurrentManip.prototype.update = function(patientId, visitId){
	this.patientId = patientId;
	this.visitId = visitId;
	this.dom.html("");
	if( patientId > 0 ){
		this.dom.html(tmpl.render({}));
	} else {
		this.dom.html("");
	}
};

module.exports = CurrentManip;
