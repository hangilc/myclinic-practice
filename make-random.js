"use strict";

var n = 8;
var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
var rr = [];
var i;
for(i=0;i<n;i++){
	var j = Math.random()*chars.length | 0;
	console.log(j);
	if( j >= chars.length ){
		j = chars.length - 1;
	}
	rr.push(chars[j]);
}
console.log(rr.join(""));
