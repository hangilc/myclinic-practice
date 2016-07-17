"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var kanjidate = require("kanjidate");
var myclinicUtil = require("../myclinic-util");

var tmplSrc = require("raw!./patient-info.html");
var tmpl = hogan.compile(tmplSrc);

function PatientInfo(dom){
	this.dom = dom;
}

PatientInfo.prototype.render = function(data){
	this.bindDetail();
	return this;
};

PatientInfo.prototype.bindDetail = function(){
	var self = this;
	this.dom.on("click", "[mc-name=detailLink]", function(event){
		event.preventDefault();
		self.dom.find("[mc-name=patientInfoDetail]").toggle();
	});
};

PatientInfo.prototype.update = function(data){
	if( !data ){
		this.dom.html("");
	} else {
		data = myclinicUtil.assign({}, data, {
			sex_as_kanji: myclinicUtil.sexToKanji(data.sex)
		});
		if( data.birth_day !== "0000-00-00" ){
			data.birthday_part = kanjidate.format("{G}{N}年{M}月{D}日生", data.birth_day);
			data.age_part = myclinicUtil.calcAge(data.birth_day) + "才";
		}
		this.dom.html(tmpl.render(data));
	}
};

module.exports = PatientInfo;
