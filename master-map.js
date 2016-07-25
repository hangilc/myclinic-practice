"use strict";

var fs = require("fs");

var ymap = [];
var ymap_keys = {};
var smap = [];
var smap_keys = {};
var kmap = [];
var kmap_keys = {};

var content = fs.readFileSync("master-map.txt", {encoding: "UTF-8"});
var lines = content.split(/\r\n|\r|\n/);
var m;
for(var i=0;i<lines.length;i++){
	var line = lines[i];
	if( line === "__END__" ){
		break;
	}
	if( m = line.match(/^([YSK]),(\d{9}),(\d{4}-\d{2}-\d{2}),(\d{9})(\D|$)/) ){
		var kind = m[1];
		var entry = {
			from: +m[2],
			at: m[3],
			to: +m[4],
		};	
		if( kind === "Y" ){
			ymap.push(entry);
			ymap_keys[entry.from] = true;
		} else if( kind === "S" ){
			smap.push(entry);
			smap_keys[entry.from] = true;
		} else if( kind === "K" ){
			kmap.push(entry);
			kmap_keys[entry.from] = true;
		} else {
			throw new Error("unknown kind: " + kind);
		}
	} else if( line[0] === ";" ){
		// nop
	} else if( line.match(/^\s*$/) ){
		// nop
	} else {
		throw new Error("invalid line in master_map:", line);
	}
}

function mapIyakuhinMaster(iyakuhincode, at){
	iyakuhincode = +iyakuhincode;
	at = at.slice(0, 10);
	if( ymap_keys[iyakuhincode] ){
		ymap.forEach(function(entry){
			if( entry.from === iyakuhincode && entry.at <= at ){
				iyakuhincode = entry.to;
			}
		})
	}
	return iyakuhincode;
}

console.log(mapIyakuhinMaster(611140694, "2016-07-25 19:41:12"));