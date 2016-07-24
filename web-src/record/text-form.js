"use strict";

var $ = require("jquery");
var hogan = require("hogan");
var tmplSrc = require("raw!./text-form.html");
var tmpl = hogan.compile(tmplSrc);
var task = require("../task");
var service = require("../service");

exports.create = function(text){
	var html = tmpl.render(text);
	var dom = $(html);
	bindEnter(dom, text.text_id);
	bindCancel(dom);
	bindDelete(dom, text.text_id);
	return dom;
};

function bindEnter(dom, textId){
	dom.find("[mc-name=enterLink]").click(function(event){
		var text;
		task.run([
			function(done){
				service.getText(textId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					text = result;
					done();
				})
			},
			function(done){
				var content = dom.find("textarea[mc-name=content]").val().trim();
				text.content = content;
				service.updateText(text, done);
			},
			function(done){
				service.getText(textId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					text = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("text-updated", [text]);
		})
	});
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