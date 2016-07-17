"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var service = require("./service");
var mUtil = require("../myclinic-util");
var Title = require("./record/title");
var Text = require("./record/text");
var Hoken = require("./record/hoken");
var DrugMenu = require("./record/drug-menu");
var Drug = require("./record/drug");

var recordTmplSrc = require("raw!./record.html");
var recordTmpl = hogan.compile(recordTmplSrc);

function makeRecord(visit){
	var e = $(recordTmpl.render(visit));
	new Title(e.find("[mc-name=title]")).render().update(visit.v_datetime);
	var textWrapper = e.find("[mc-name=texts]");
	visit.texts.forEach(function(text){
		var te = $("<div></div>");
		new Text(te).render().update(text.content);
		textWrapper.append(te);
	});
	new Hoken(e.find("[mc-name=hoken]")).render().update(mUtil.hokenRep(visit));
	new DrugMenu(e.find("[mc-name=drugMenu]")).render().update();
	var drugWrapper = e.find("[mc-name=drugs]");
	var drugIndex = 1;
	visit.drugs.forEach(function(drug){
		var de = $("<div></div>");
		new Drug(de).render().update(drugIndex++, mUtil.drugRep(drug));
		drugWrapper.append(de);
	});
	return e;
}

function RecordList(dom){
	this.dom = dom;
}

RecordList.prototype.render = function(){
	return this;
};

RecordList.prototype.update = function(patientId, offset, n, done){
	var wrapper = $("<div></div>");
	this.dom.html("").append(wrapper);
	service.listFullVisits(patientId, offset, n, function(err, result){
		if( err ){
			done(err);
			return;
		}
		result.forEach(function(data){
			var e = makeRecord(data);
			wrapper.append(e);
		});
		done();
	})
};

module.exports = RecordList;
