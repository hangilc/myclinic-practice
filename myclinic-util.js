"use strict";

var moment = require("moment");

function repeat(ch, n){
    var parts = [], i;
    for(i=0;i<n;i++){
        parts.push(ch);
    }
    return parts.join("");
}

exports.padNumber = function(num, nDigits){
    var s = "" + num;
    if( s.length < nDigits ){
        return repeat("0", nDigits-s.length) + s;
    } else {
        return s;
    }
};

function assign2(dst, src){
	Object.keys(src).forEach(function(key){
		dst[key] = src[key];
	});
	return dst;
}

exports.assign = function(dst, src){
	var args = Array.prototype.slice.call(arguments, 1);
	var i;
	for(i=0;i<args.length;i++){
		dst = assign2(dst, args[i]);
	}
	return dst;
};

exports.calcAge = function(birthday, at){
    if( !moment.isMoment(birthday) ){
        birthday = moment(birthday);
    }
    if( !moment.isMoment(at) ){
    	at = moment(at);
    }
    return at.diff(birthday, "years");
};

exports.sexToKanji = function(sex){
	switch(sex){
		case "M": return "男";
		case "F": return "女";
		default: return "??";
	}
};