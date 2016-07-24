"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplHtml = require("raw!./hoken-select-form.html");
var itemTmplSrc = require("raw!./hoken-select-form-item.html");
var itemTmpl = hogan.compile(itemTmplSrc);
var mUtil = require("../../myclinic-util");
var task = require("../task");
var service = require("../service");

exports.create = function(hoken, visit){
	var dom = $(tmplHtml);
	var wrapper = dom.find("[mc-name=checkboxes]").html("");
	hoken.shahokokuho_list.forEach(function(shahokokuho){
		var label = mUtil.shahokokuhoRep(shahokokuho.hokensha_bangou);
		if( shahokokuho.kourei > 0 ){
			label += "高齢・" + shahokokuho.kourei + "割";
		}
		var check = itemTmpl.render({
			label: label,
			kind: "shahokokuho",
			value: shahokokuho.shahokokuho_id,
			checked: shahokokuho.shahokokuho_id == visit.shahokokuho_id
		});
		wrapper.append(check);
	});
	hoken.koukikourei_list.forEach(function(koukikourei){
		var label = mUtil.koukikoureiRep(koukikourei.futan_wari);
		var check = itemTmpl.render({
			label: label,
			kind: "koukikourei",
			value: koukikourei.koukikourei_id,
			checked: koukikourei.koukikourei_id == visit.koukikourei_id
		});
		wrapper.append(check);
	});
	hoken.roujin_list.forEach(function(roujin){
		var label = mUtil.roujinRep(roujin.futan_wari);
		var check = itemTmpl.render({
			label: label,
			kind: "roujin",
			value: roujin.roujin_id,
			checked: roujin.roujin_id == visit.roujin_id
		});
		wrapper.append(check);
	});
	hoken.kouhi_list.forEach(function(kouhi){
		var label = mUtil.kouhiRep(kouhi.futansha);
		var check = itemTmpl.render({
			label: label,
			kind: "kouhi",
			value: kouhi.kouhi_id,
			checked: kouhi.kouhi_id == visit.kouhi_1_id || kouhi.kouhi_id == visit.kouhi_2_id || 
				kouhi.kouhi_id == visit.kouhi_3_id
		});
		wrapper.append(check);
	});
	bindEnter(dom, visit);
	bindCancel(dom);
	return dom;
};

function collectChecked(dom){
	var checked = {
		shahokokuho_list: [],
		koukikourei_list: [],
		roujin_list: [],
		kouhi_list: []
	};
	dom.find("input[type=checkbox][name=hoken]:checked").each(function(){
		var e = $(this);
		switch(e.data("kind")){
			case "shahokokuho": checked.shahokokuho_list.push(e.val()); break;
			case "koukikourei": checked.koukikourei_list.push(e.val()); break;
			case "roujin": checked.roujin_list.push(e.val()); break;
			case "kouhi": checked.kouhi_list.push(e.val()); break;
			default: alert("unknown kind " + e.data("kind")); break;
		}
	});
	return checked;
}

function bindEnter(dom, visit){
	dom.on("click", "[mc-name=enter]", function(event){
		event.preventDefault();
		var checked = collectChecked(dom);
		var data = {visit_id: visit.visit_id};
		if( checked.shahokokuho_list.length + checked.koukikourei_list.length >= 2 ){
			alert("社保国保と後期高齢はあわせてひとつしか選択できません。");
			return;
		}
		data.shahokokuho_id = checked.shahokokuho_list.length > 0 ? +checked.shahokokuho_list[0] : 0;
		data.koukikourei_id = checked.koukikourei_list.length > 0 ? +checked.koukikourei_list[0] : 0;
		data.roujin_id = checked.roujin_list.length > 0 ? +checked.roujin_list[0] : 0;
		data.kouhi_1_id = checked.kouhi_list.length > 0 ? +checked.kouhi_list[0] : 0;
		data.kouhi_2_id = checked.kouhi_list.length > 1 ? +checked.kouhi_list[1] : 0;
		data.kouhi_3_id = checked.kouhi_list.length > 2 ? +checked.kouhi_list[2] : 0;
		var updatedVisit;
		task.run([
			function(done){
				service.updateVisit(data, done);
			},
			function(done){
				service.getVisitWithFullHoken(visit.visit_id, function(err, result){
					if( err ){
						done(err);
						return;
					}
					updatedVisit = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("hoken-updated", [updatedVisit]);
		})
	});
}

function bindCancel(dom){
	dom.on("click", "[mc-name=cancel]", function(event){
		event.preventDefault();
		dom.trigger("cancel-edit");
	})
}