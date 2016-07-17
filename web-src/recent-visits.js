"use strict";

var hogan = require("hogan");
var myclinicUtil = require("../myclinic-util");
var service = require("./service");
var $ = require("jquery");

var tmplSrc = require("raw!./recent-visits.html");
var listTmplSrc = require("raw!./recent-visits-list.html");

var tmpl = hogan.compile(tmplSrc);
var listTmpl = hogan.compile(listTmplSrc);

function RecentVisits(dom){
	this.dom = dom;
}

RecentVisits.prototype.getButtonDom = function(){
	return this.dom.find("[mc-name=button]");
};

RecentVisits.prototype.getSelectDom = function(){
	return this.dom.find("[mc-name=select]");
};

RecentVisits.prototype.render = function(data){
	this.dom.html(tmpl.render(data));
	this.bindButton();
	this.bindSelect();
	return this;
};

RecentVisits.prototype.bindButton = function(){
	var self = this;
	this.getButtonDom().click(function(){
		var select = self.getSelectDom();
		if( select.is(":visible") ){
			select.hide();
			select.html("");
		} else {
			service.recentVisits(function(err, list){
				if( err ){
					alert(err);
					return;
				}
				self.updateSelect(list);
				select.show();
			});
		}
	});
};

RecentVisits.prototype.bindSelect = function(){
	var self = this;
	this.getSelectDom().on("dblclick", "option", function(){
		var e = $(this);
		var patientId = e.val();
		$("body").trigger("start-patient", [patientId]);
		self.getSelectDom().hide().html("");
	});
};

RecentVisits.prototype.updateSelect = function(list){
	var data = list.map(function(item){
		return myclinicUtil.assign({}, item, {
			patient_id_part: myclinicUtil.padNumber(item.patient_id, 4)
		})
	});
	var html = listTmpl.render({list: data});
	this.getSelectDom().html(html);
};

module.exports = RecentVisits;
