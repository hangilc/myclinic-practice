"use strict";

var $ = require("jquery");
var kanjidate = require("kanjidate");
var moment = require("moment");

exports.bind = function(domMap){
	return new DateBinder(domMap);
};

function DateBinder(domMap){
	this.domMap = domMap;
	if( "dayLabel" in domMap ){
		this.bindDayClick(domMap.dayLabel);
	}
	if( "monthLabel" in domMap ){
		this.bindMonthClick(domMap.monthLabel);
	}
	if( "nenLabel" in domMap ){
		this.bindNenClick(domMap.nenLabel);
	}
	if( "weekLink" in domMap ){
		this.bindWeekClick(domMap.weekLink);
	}
	if( "todayLink" in domMap ){
		this.bindTodayClick(domMap.todayLink);
	}
	if( "monthLastDayLink" in domMap ){
		this.bindMonthLastDayClick(domMap.monthLastDayLink);
	}
	if( "lastMonthLastDayLink" in domMap ){
		this.bindLastMonthLastDayClick(domMap.lastMonthLastDayLink);
	}
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

DateBinder.prototype.bindDayClick = function(dayLabel){
	var self = this;
	dayLabel.on("click", function(event){
		event.preventDefault();
		var dateOpt = self.getDate();
		if( !dateOpt.ok ){
			return;
		}
		var m = dateOpt.date;
		var amount = 1;
		if( event.shiftKey ){
			amount = -amount;
		}
		m.add(amount, "days");
		self.setDate(m);
	});
	return this;
}

DateBinder.prototype.bindMonthClick = function(monthLabel){
	var self = this;
	monthLabel.on("click", function(event){
		event.preventDefault();
		var dateOpt = self.getDate();
		if( !dateOpt.ok ){
			return;
		}
		var m = dateOpt.date;
		var amount = 1;
		if( event.shiftKey ){
			amount = -amount;
		}
		m.add(amount, "months");
		self.setDate(m);
	});
	return this;
}

DateBinder.prototype.bindNenClick = function(nenLabel){
	var self = this;
	nenLabel.on("click", function(event){
		event.preventDefault();
		var dateOpt = self.getDate();
		if( !dateOpt.ok ){
			return;
		}
		var m = dateOpt.date;
		var amount = 1;
		if( event.shiftKey ){
			amount = -amount;
		}
		m.add(amount, "years");
		self.setDate(m);
	});
	return this;
}

DateBinder.prototype.bindWeekClick = function(weekLink){
	var self = this;
	weekLink.on("click", function(event){
		event.preventDefault();
		var dateOpt = self.getDate();
		if( !dateOpt.ok ){
			return;
		}
		var m = dateOpt.date;
		var amount = 1;
		if( event.shiftKey ){
			amount = -amount;
		}
		m.add(amount, "weeks");
		self.setDate(m);
	});
	return this;
}

DateBinder.prototype.bindTodayClick = function(todayLink){
	var self = this;
	todayLink.on("click", function(event){
		event.preventDefault();
		self.setDate(moment());
	});
	return this;
}

DateBinder.prototype.bindMonthLastDayClick = function(link){
	var self = this;
	link.on("click", function(event){
		event.preventDefault();
		var dateOpt = self.getDate();
		if( !dateOpt.ok ){
			return;
		}
		var m = dateOpt.date;
		m.date(1).add(1, "months").add(-1, "days");
		self.setDate(m);
	});
	return this;
}

DateBinder.prototype.bindLastMonthLastDayClick = function(link){
	var self = this;
	link.on("click", function(event){
		event.preventDefault();
		var m = moment();
		m.date(1).add(-1, "days");
		self.setDate(m);
	});
	return this;
}

DateBinder.prototype.getGengou = function(){
	return this.domMap.gengouSelect.val();
}

DateBinder.prototype.setGengou = function(gengou){
	this.domMap.gengouSelect.val(gengou);
	return this;
}

DateBinder.prototype.getNen = function(){
	return this.domMap.nenInput.val();
}

DateBinder.prototype.setNen = function(nen){
	this.domMap.nenInput.val(nen);
	return this;
}

DateBinder.prototype.getMonth = function(){
	return this.domMap.monthInput.val();
}

DateBinder.prototype.setMonth = function(month){
	this.domMap.monthInput.val(month);
	return this;
}

DateBinder.prototype.getDay = function(){
	return this.domMap.dayInput.val();
}

DateBinder.prototype.setDay = function(day){
	this.domMap.dayInput.val(day);
	return this;
}

DateBinder.prototype.setDate = function(m){
	var d = analyzeDate(m);
	this.setGengou(d.gengou);
	this.setNen(d.nen);
	this.setMonth(d.month);
	this.setDay(d.day);
	return this;
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
			isEmpty: (nen === "" && month === "" && day === "")
		};
	} else {
		return {
			ok: true,
			date: m,
			sqlDate: m.format("YYYY-MM-DD")
		}
	}
}

DateBinder.prototype.empty = function(gengouOpt){
	var map = this.domMap;
	if( gengouOpt ){
		map.gengouSelect.val(gengouOpt);
	}
	map.nenInput.val("");
	map.monthInput.val("");
	map.dayInput.val("");
	return this;
}