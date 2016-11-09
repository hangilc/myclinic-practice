"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./text-form.html");
var tmpl = hogan.compile(tmplSrc);
var task = require("../task");
var service = require("myclinic-service-api");
var mUtil = require("../../myclinic-util");
var conti = require("conti");
var rcptUtil = require("../../rcpt-util");
var moment = require("moment");
var modal = require("../../myclinic-modal");
var shohousenTmplSrc = require("raw!./shohousen-dialog.html");
var shohousenTmpl = hogan.compile(shohousenTmplSrc);

exports.create = function(text){
	var isEditing = text.text_id > 0;
	var html = tmpl.render(mUtil.assign({}, text, {
		isEditing: isEditing,
		isEntering: !isEditing,
		textId: text.text_id
	}));
	var dom = $(html);
	bindEnter(dom, text);
	bindCancel(dom);
	bindDelete(dom, text.text_id);
	if( isEditing ){
		bindShohousen(dom, text.visit_id, text.content);
		bindCopy(dom, text);
	}
	return dom;
};

function taskReloadText(ctx){
	return function(done){
		service.getText(ctx.text.text_id, function(err, result){
			if( err ){
				done(err);
				return;
			}
			ctx.text = result;
			done();
		})
	}
}

function bindUpdate(dom, text){
	dom.find("[mc-name=enterLink]").click(function(event){
		event.preventDefault();
		var ctx = {text: text};
		task.run([
			function(done){
				var content = dom.find("textarea[mc-name=content]").val().trim();
				ctx.text.content = content;
				service.updateText(ctx.text, done);
			},
			taskReloadText(ctx)
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("text-updated", [ctx.text]);
		})
	});
}

function bindNew(dom, visitId){
	dom.find("[mc-name=enterLink]").click(function(event){
		event.preventDefault();
		var ctx = {
			text: {
				visit_id: visitId,
				content: dom.find("textarea[mc-name=content]").val().trim()
			}
		};
		task.run([
			function(done){
				service.enterText(ctx.text, function(err, result){
					if( err ){
						done(err);
						return;
					}
					ctx.text.text_id = result;
					done();
				});
			},
			taskReloadText(ctx)
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("text-entered", [ctx.text]);
		})
	})
}

function bindEnter(dom, text){
	if( text.text_id > 0 ){
		bindUpdate(dom, text);
	} else if( !text.text_id && text.visit_id > 0 ) {
		bindNew(dom, text.visit_id);
	} else {
		alert("cannot bind enter in text form");
	}
}

function bindCancel(dom){
	dom.find("[mc-name=cancelLink]").click(function(event){
		event.preventDefault();
		dom.trigger("cancel-edit");
	});
}

function bindDelete(dom, textId){
	dom.find("[mc-name=deleteLink]").click(function(event){
		event.preventDefault();
		if( !confirm("この文章を削除していいですか？") ){
			return;
		}
		task.run(function(done){
			service.deleteText(textId, done);
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("text-deleted");
		});
	});
}

function fetchData(visitId, cb){
	var data = {};
	conti.exec([
		function(done){
			service.getVisitWithFullHoken(visitId, function(err, result){
				if( err ){
					done(err);
					return;
				}
				data.visit = result;
				done();
			})
		},
		function(done){
			service.getPatient(data.visit.patient_id, function(err, result){
				if( err ){
					done(err);
					return;
				}
				data.patient = result;
				done();
			})
		}
	], function(err){
		if( err ){
			cb(err);
			return;
		}
		data.futanWari = rcptUtil.calcFutanWari(data.visit, data.patient);
		cb(undefined, data);
	})
}

function extendShohousenData(data, dbData){
	var patient = dbData.patient;
	if( patient ){
		var lastName = patient.last_name || "";
		var firstName = patient.first_name || "";
		if( lastName || firstName ){
			data.shimei = lastName + firstName;
		}
		if( patient.birth_day && patient.birth_day !== "0000-00-00" ){
			var birthday = moment(patient.birth_day);
			if( birthday.isValid() ){
				data.birthday = [birthday.year(), birthday.month()+1, birthday.date()];
			}
		}
		if( patient.sex === "M" || patient.sex === "F" ){
			data.sex = patient.sex;
		}
	}
	var visit = dbData.visit;
	if( visit ){
		var shahokokuho = visit.shahokokuho;
		if( shahokokuho ){
			data["hokensha-bangou"] = "" + shahokokuho.hokensha_bangou;
			data.hihokensha = [shahokokuho.hihokensha_kigou || "", shahokokuho.hihokensha_bangou || ""].join(" ・ ");
			if( 0 === +shahokokuho.honnin ){
				data["kubun-hifuyousha"] = true;
			} else if( 1 === +shahokokuho.honnin ){
				data["kubun-hihokensha"] = true;
			}
		}
		var koukikourei = visit.koukikourei;
		if( koukikourei ){
			data["hokensha-bangou"] = "" + koukikourei.hokensha_bangou;
			data["hihokensha"] = "" + koukikourei.hihokensha_bangou;
		}
		var kouhi_list = visit.kouhi_list || [];
		if( kouhi_list.length > 0 ){
			data["kouhi-1-futansha"] = kouhi_list[0].futansha;
			data["kouhi-1-jukyuusha"] = kouhi_list[0].jukyuusha;
		}
		if( kouhi_list.length > 1 ){
			data["kouhi-2-futansha"] = kouhi_list[1].futansha;
			data["kouhi-2-jukyuusha"] = kouhi_list[1].jukyuusha;
		}
		// var at = moment(visit.v_datetime);
		var at = moment();
		data["koufu-date"] = [at.year(), at.month()+1, at.date()];
	}
}

function shohousenDialog(dom, data){
	modal.startModal({
		title: "処方箋発行",
		position: "fixed",
		init: function(content, close){
			var c = $(content);
			var jsonData = JSON.stringify(data);
			var html = shohousenTmpl.render({});
			c.html(html);
			c.find("input[name=json-data]").val(jsonData);
			c.find("button[mc-name=enter]").click(function(event){
				setImmediate(function(){
					close();
					dom.trigger("cancel-edit");
				})
			})
			c.find("button[mc-name=cancel]").click(function(event){
				event.preventDefault();
				event.stopPropagation();
				close();
				dom.trigger("cancel-edit");
			})
		}
	})

}

function bindShohousen(dom, visitId, content){
	dom.find("[mc-name=prescribeLink]").click(function(event){
		setImmediate(function(){
			close();
			dom.trigger("cancel-edit");
		});
//		event.preventDefault();
//		fetchData(visitId, function(err, result){
//			if( err ){
//				alert(err);
//				return;
//			}
//			var data = {
//				"drugs": content,
//				"futan-wari": result.futanWari
//			}
//			extendShohousenData(data, result);
//			shohousenDialog(dom, data);
//		})
	})
}

function bindCopy(dom, text){
	dom.find("[mc-name=copy]").click(function(event){
		event.preventDefault();
		var targetVisitId = dom.inquire("fn-get-target-visit-id");
		if( targetVisitId === 0 ){
			alert("現在（暫定）診察中でないため、コピーできません。");
			return;
		}
		if( targetVisitId === text.visit_id ){
			alert("自分自身にはコピーできません。");
			return;
		}
		var newText = {
			visit_id: targetVisitId,
			content: text.content
		};
		task.run([
			function(done){
				service.enterText(newText, function(err, textId){
					if( err ){
						done(err);
						return;
					}
					newText.text_id = textId;
					done();			
				});
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("texts-batch-entered", [targetVisitId, [newText]]);
			dom.trigger("cancel-edit");
		});
	});
}
