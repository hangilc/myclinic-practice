"use strict";

exports.para = function(funs, done){
	var funs = funs.slice();
	var n = funs.length;
	var no_more = false;
	funs.forEach(function(f){
		if( no_more ){
			return;
		}
		f(function(err){
			if( no_more ){
				return;
			}
			if( err ){
				no_more = true;
				done(err);
				return;
			}
			n -= 1;
			if( n === 0 ){
				done();
			}
		})
	})
};

