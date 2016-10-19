"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./conduct-form-gazou-label-subform.html");
var tmpl = hogan.compile(tmplSrc);
var service = require("myclinic-service-api");
var task = require("../task");
var conti = require("conti");

var labelInputSelector = "input[mc-name=text]";
var suggestLinkSelector = "[mc-name=suggestLink]";
var examplesWrapperSelector = "[mc-name=selectWrapper]";
var examplesSelector = "select[mc-name=select]";
var enterSelector = "[mc-name=enter]";
var cancelSelector = "[mc-name=cancel]";

exports.create = function(conduct, at){
	var dom = $(tmpl.render(conduct));
	bindEnter(dom, conduct.id, at);
	bindCancel(dom);
	bindSuggest(dom);
	bindSuggestChange(dom);
	return dom;
};

function bindCancel(dom){
	dom.on("click", cancelSelector, function(event){
		event.preventDefault();
		dom.trigger("cancel");
	});
}

function bindEnter(dom, conductId, at){
	dom.on("click", enterSelector, function(event){
		event.preventDefault();
		dom.find(enterSelector).prop("disabled", true);
		var text = dom.find(labelInputSelector).val().trim();
		var newConduct;
		task.run([
			function(done){
				service.setGazouLabel(conductId, text, done);
			},
			function(done){
				service.getFullConduct(conductId, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newConduct = result;
					done();
				});
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("modified", [newConduct]);
		})
	});
}

function bindSuggest(dom){
	dom.on("click", suggestLinkSelector, function(event){
		event.preventDefault();
		dom.find(examplesWrapperSelector).toggle();
	})
}

function bindSuggestChange(dom){
	dom.on("change", examplesSelector, function(event){
		var label = dom.find(examplesSelector + " option:selected").val();
		dom.find(labelInputSelector).val(label);
	})
}
