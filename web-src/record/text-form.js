"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./text-form.html");
var tmpl = hogan.compile(tmplSrc);
var task = require("../task");
var service = require("../service");
var mUtil = require("../../myclinic-util");

exports.create = function(text){
	var html = tmpl.render(mUtil.assign({}, text, {
		isEditing: text.text_id > 0,
		isEntering: text.text_id <= 0
	}));
	var dom = $(html);
	bindEnter(dom, text);
	bindCancel(dom);
	bindDelete(dom, text.text_id);
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