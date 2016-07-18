"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("./service");
var mUtil = require("../myclinic-util");

var tmplSrc = require("raw!./todays-visits.html");
var tmpl = hogan.compile(tmplSrc);
var itemTmplSrc = require("raw!./todays-visits-item.html");
var itemTmpl = hogan.compile(itemTmplSrc);

function makeOption(data){
	data = mUtil.assign({}, data, {
		patient_id_label: mUtil.padNumber(+data.patient_id, 4)
	});
	return $(itemTmpl.render(data)).val(data.patient_id);
}

function TodaysVisits(dom){
	this.dom = dom;
	this.bindButton();
	this.bindOption();
}

TodaysVisits.prototype.bindButton = function(){
	var self = this;
	this.dom.on("click", "[mc-name=button]", function(){
		var ws = self.getWorkspaceDom();
		if( ws.is(":visible") ){
			ws.hide();
			self.getSelectDom().html("");
		} else {
			service.listTodaysVisits(function(err, result){
				if( err ){
					alert(err);
					return;
				}
				var select = self.getSelectDom().html("");
				result.forEach(function(data){
					var opt = makeOption(data);
					select.append(opt);
				})
				ws.show();
			})
		}
	})
};

TodaysVisits.prototype.bindOption = function(){
	this.dom.on("dblclick", "option", function(){
		var opt = $(this);
		var patientId = opt.val();
		opt.trigger("start-patient", [patientId]);
	});
};

TodaysVisits.prototype.getWorkspaceDom = function(){
	return this.dom.find("[mc-name=selectWrapper]");
};

TodaysVisits.prototype.getSelectDom = function(){
	return this.dom.find("select");
};

TodaysVisits.prototype.update = function(){
	this.dom.html(tmpl.render({}));
	return this;
};

module.exports = TodaysVisits;