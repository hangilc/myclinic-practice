"use strict";

var $ = require("jquery");
var modal = require("../../myclinic-modal");
var service = require("myclinic-service-api");
var mUtil = require("../../myclinic-util");
var hogan = require("hogan");
var kanjidate = require("kanjidate");

var mainTmpl = hogan.compile(require("raw!./reception.html"));
var optionTmpl = hogan.compile(require("raw!./option.html"));
var dispTmpl = hogan.compile(require("raw!./disp.html"));

function getSearchTextDom(dom){
	return dom.find("input[mc-name=searchText]");
}

function getDispDom(dom){
	return dom.find("[mc-name=disp]");
}

function bindSelect(dom){
	dom.on("click", "select[mc-name=searchResult] option", function(){
		var opt = $(this);
		var patientId = opt.val();
		opt.trigger("patient-selected", [patientId]);
	});
}

function bindPatientSelected(dom){
	dom.on("patient-selected", function(event, patientId){
		event.stopPropagation();
		service.getPatient(patientId, function(err, result){
			if( err ){
				alert(err);
				return;
			}
			var data = makePatientData(result);
			updateDisp(dom, data);
		})
	});
}

function bindSearchForm(dom){
	dom.find("form[mc-name=searchForm]").submit(function(event){
		event.preventDefault();
		var text = getSearchTextDom(dom).val();
		if( text === "" ){
			return;
		}
		service.searchPatient(text, function(err, result){
			if( err ){
				alert(err);
				return;
			}
			var select = dom.find("select[mc-name=searchResult]").html("");
			result.forEach(function(item){
				var data = mUtil.assign({}, item, {
					patient_id_part: mUtil.padNumber(item.patient_id, 4)
				});
				var opt = optionTmpl.render(data);
				select.append(opt);
			});
		})
	});
}

function bindEnter(dom, close){
	dom.find("[mc-name=enterLink]").click(function(event){
		var patientId = dom.data("patient_id");
		if( !(patientId > 0) ){
			alert("患者番号が不適切です。");
			return;
		}
		service.startVisit(patientId, mUtil.nowAsSqlDatetime(), function(err){
			if( err ){
				alert(err);
				return;
			}
			close();
		})
	})
}

function makeBirthdayLabel(birthday){
	if( birthday && birthday !== "0000-00-00" ){
		return kanjidate.format("{G}{N}年{M}月{D}日", birthday) + 
			"（" + mUtil.calcAge(birthday) + "才）";
	} else {
		return "";
	}
}

function makePatientData(patient){
	return mUtil.assign({}, patient, {
		birthday_label: makeBirthdayLabel(patient.birth_day),
		sex_label: mUtil.sexToKanji(patient.sex)
	});
}

function updateDisp(dom, data){
	getDispDom(dom).html(dispTmpl.render(data));
	dom.data("patient_id", data.patient_id);
}

exports.open = function(){
	var dom = $("<div style='width:260px'></div>");
	dom.html(mainTmpl.render({patient: {}}, {disp: dispTmpl}));
	bindSearchForm(dom);
	bindSelect(dom);
	bindPatientSelected(dom);
	modal.startModal({
		title: "受付",
		init: function(content, close){
			content.appendChild(dom.get(0));
			bindEnter(dom, close);
			getSearchTextDom(dom).focus();
		}
	})
	//bindEnter(dom);
	//modal.open("受付", dom);
	//getSearchTextDom(dom).focus();
}