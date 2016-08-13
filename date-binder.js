"use strict";

var $ = require("jquery");
var kanjidate = require("kanjidate");
var moment = require("moment");

exports.bind = function(domMap){
	return new DateBinder(domMap);
};

function DateBinder(domMap){
	this.domMap = domMap;
}

function analyzeDate(m){
	var result = {
		year: m.year(),
		month: m.month() + 1,
		day: m.date()
	};
	var g = kanjidate.toGengou(result.year, result.month, result.day);
	result.gengou = g.gengou;
	result.nen = g.nen;
	return result;
}

DateBinder.prototype.getGengou = function(){
	return this.domMap.gengouSelect.val();
}

DateBinder.prototype.setGengou = function(gengou){
	this.domMap.gengouSelect.val(gengou);
}

DateBinder.prototype.getNen = function(){
	return this.domMap.nenInput.val();
}

DateBinder.prototype.setNen = function(nen){
	this.domMap.nenInput.val(nen);
}

DateBinder.prototype.getMonth = function(){
	return this.domMap.monthInput.val();
}

DateBinder.prototype.setMonth = function(month){
	this.domMap.monthInput.val(month);
}

DateBinder.prototype.getDay = function(){
	return this.domMap.dayInput.val();
}

DateBinder.prototype.setDay = function(day){
	this.domMap.dayInput.val(day);
}

DateBinder.prototype.setDate = function(m){
	var d = analyzeDate(m);
	this.setGengou(d.gengou);
	this.setNen(d.nen);
	this.setMonth(d.month);
	this.setDay(d.day);
}

DateBinder.prototype.getDate = function(){
	var map = this.domMap;
	var gengou = this.getGengou();
	var nen = this.getNen();
	var month = this.getMonth();
	var day = this.getDay();
	var err = [];
	var allDigits = /^\d+$/;
	if( !allDigits.test(nen) ){
		err.push("年の入力が適切でありません。");
	}
	if( !allDigits.test(month) ){
		err.push("月の入力が適切でありません。");
	}
	if( !allDigits.test(day) ){
		err.push("日の入力が適切でありません。");
	}
	var year = kanjidate.fromGengou(gengou, +nen);
	var m = moment({year: year, month: month-1, day: day});
	if( err.length > 0 ){
		return {
			ok: false,
			error: err.join("\n"),
			isCleared: (nen === "" && month === "" && day === "")
		};
	} else {
		return {
			ok: true,
			date: m,
			sqlDate: m.format("YYYY-MM-DD")
		}
	}
}