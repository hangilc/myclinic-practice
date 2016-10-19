"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var kanjidate = require("kanjidate");
var mUtil = require("../../myclinic-util");

var tmplSrc = require("raw!./patient-info.html");
var tmpl = hogan.compile(tmplSrc);

exports.setup = function(dom){
	dom.listen("rx-start-page", function(appData){
		if( appData.currentPatientId > 0 ){
			var data = appData.currentPatient;
			var data = mUtil.assign({}, data, {
				sex_as_kanji: mUtil.sexToKanji(data.sex)
			});
			if( data.birth_day !== "0000-00-00" ){
				data.birthday_part = kanjidate.format("{G}{N}年{M}月{D}日生", data.birth_day);
				data.age_part = mUtil.calcAge(data.birth_day) + "才";
			}
			dom.html(tmpl.render(data));
		} else {
			dom.html("");
		}
	})
	dom.on("click", "[mc-name=detailLink]", function(event){
		event.preventDefault();
		dom.find("[mc-name=patientInfoDetail]").toggle();
	});
};
