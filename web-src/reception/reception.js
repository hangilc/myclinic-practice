"use strict";

var $ = require("jquery");
var modal = require("../../hc-modal");
var service = require("../service");
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

function bindEnter(dom){
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
			modal.close();
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
	modal.open("受付", function(dom){
		dom.width("260px");
		dom.html(mainTmpl.render({patient: {}}, {disp: dispTmpl}));
		bindSearchForm(dom);
		bindSelect(dom);
		bindPatientSelected(dom);
		bindEnter(dom);
		getSearchTextDom(dom).focus();
	});
}