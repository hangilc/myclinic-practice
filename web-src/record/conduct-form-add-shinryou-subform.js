"use strict";

var $ = require("jquery");
var hogan = require("hogan.js");
var tmplSrc = require("raw!./conduct-form-add-shinryou-subform.html");
var task = require("../task");
var service = require("myclinic-service-api");
var resultTmplSrc = require("raw!./conduct-form-add-shinryou-subform-search-result.html");
var resultTmpl = hogan.compile(resultTmplSrc);

exports.create = function(at, conductId){
	var dom = $(tmplSrc);
	var ctx = {
		shinryoucode: undefined
	};
	bindEnter(dom, conductId, at, ctx);
	bindCancel(dom);
	bindSearch(dom, at);
	bindSearchResultSelect(dom, at, ctx);
	return dom;
};

var nameSelector = "> [mc-name=disp-area] [mc-name=name]";
var enterSelector = "> .commandbox [mc-name=enterLink]";
var cancelSelector = "> .commandbox [mc-name=cancelLink]";
var searchFormSelector = "> form[mc-name=search-form]";
var searchTextSelector = "> form[mc-name=search-form] input[mc-name=searchText]";
var searchResultSelector = "> form[mc-name=search-form] select[mc-name=searchResult]";

function getSearchResultDom(dom){
	return dom.find(searchResultSelector);
}

function getSearchText(dom){
	return dom.find(searchTextSelector).val().trim();
}

function updateName(dom, name){
	dom.find(nameSelector).text(name);
}

function bindEnter(dom, conductId, at, ctx){
	dom.on("click", enterSelector, function(event){
		event.preventDefault();
		var shinryoucode = ctx.shinryoucode;
		if( !shinryoucode ){
			alert("診療行為が指定されていません。");
			return;
		}
		shinryoucode = +shinryoucode;
		var newConduct;
		task.run([
			function(done){
				service.enterConductShinryou({
					visit_conduct_id: conductId,
					shinryoucode: shinryoucode
				}, done);
			},
			function(done){
				service.getFullConduct(conductId, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newConduct = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("conduct-modified", [conductId, newConduct]);
		})
	});
}

function bindCancel(dom){
	dom.on("click", cancelSelector, function(event){
		event.preventDefault();
		dom.trigger("cancel");
	})
}

function bindSearch(dom, at){
	dom.on("submit", searchFormSelector, function(event){
		event.preventDefault();
		var text = getSearchText(dom);
		if( text === "" ){
			return;
		}
		var searchResult;
		task.run(function(done){
			service.searchShinryouMaster(text, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				searchResult = result;
				done();
			})
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			getSearchResultDom(dom).html(resultTmpl.render({list: searchResult}));
		})
	});
}

function setShinryou(dom, master, ctx){
	ctx.shinryoucode = master.shinryoucode;
	updateName(dom, master.name);
}

function bindSearchResultSelect(dom, at, ctx){
	dom.on("change", searchResultSelector, function(event){
		var shinryoucode = dom.find(searchResultSelector + " option:selected").val();
		var master;
		task.run(function(done){
			service.getShinryouMaster(shinryoucode, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				master = result;
				done();
			});
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			setShinryou(dom, master, ctx);
		})
	});
}

