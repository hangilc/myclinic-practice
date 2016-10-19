"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var Shinryou = require("./shinryou");

exports.setup = function(dom, shinryouList, visitId, at, patientId){
	batchAdd(dom, shinryouList);
	respondToShinryouEntered(dom, visitId);
};

function batchAdd(dom, shinryouList){
	shinryouList.forEach(function(shinryou){
		var se = Shinryou.create(shinryou);
		dom.append(se);
	});
}

function lookupShinryou(dom, visitId){
	return dom.broadcast("rx-shinryou-lookup-for-visit", [visitId]);
}

function respondToShinryouEntered(dom, visitId){
	dom.listen("rx-shinryou-batch-entered", function(targetVisitId, shinryouList){
		if( visitId === targetVisitId ){
			var currentList = lookupShinryou(dom, visitId).slice();
			shinryouList = shinryouList.slice();
			while( currentList.length > 0 && shinryouList.length > 0 ){
				var curr = currentList[0];
				var shin = shinryouList[0];
				if( shin.shinryoucode < curr.shinryoucode ){
					curr.dom.before(Shinryou.create(shin));
					shinryouList.shift();
				} else {
					currentList.shift();
				}
			}
			if( currentList.length === 0 ){
				batchAdd(dom, shinryouList);
			}
		}
	})
}
