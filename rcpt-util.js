"use strict";

var mConsts = require("myclinic-consts");

    // exports.calcAge = function(birthday, at){
    //     if( !moment.isMoment(birthday) ){
    //         birthday = moment(birthday);
    //     }
    //     if( at === undefined ) at = moment();
    //     return at.diff(birthday, "years");
    // };

    // exports.isEmptyObject = function(obj){
    //     var name;
    //     for(name in obj){
    //         return false;
    //     }
    //     return true;
    // };

    // var seirekiToGengou = exports.seirekiToGengou = function (year, month, day) {
    //     if (year < 1867) {
    //         return { gengou:"西暦", nen:year };
    //     }
    //     else if (year < 1912 ||
    //         (year == 1912 && (month < 7 || (month == 7 && day <= 29)))) {
    //         return { gengou:"明治", nen:year - 1867 };
    //     }
    //     else if (year < 1926 ||
    //         (year == 1926 && (month < 12 || (month == 12 && day <= 24)))) {
    //         return { gengou:"大正", nen:year - 1911 };
    //     }
    //     else if (year < 1989 ||
    //         (year == 1989 && (month < 1 || (month == 1 && day <= 7)))) {
    //         return { gengou:"昭和", nen:year - 1925 };
    //     }
    //     else {
    //         return { gengou:"平成", nen:year - 1988 };
    //     }

    // };

    // var gengouToSeireki = exports.gengouToSeireki = function (gengou, nen) {
    //     nen = nen - 0;
    //     switch (gengou) {
    //         case "明治":
    //             return 1867 + nen;
    //         case "大正":
    //             return 1911 + nen;
    //         case "昭和":
    //             return 1925 + nen;
    //         case "平成":
    //             return 1988 + nen;
    //         case "西暦":
    //             return nen;
    //         default:
    //             throw new Error("invalid gengou: " + gengou);
    //     }
    // }

    // var gengouToAlpha = exports.gengouToAlpha = function (geng) {
    //     switch(geng){
    //         case "明治":
    //             return "M";
    //         case "大正":
    //             return "T";
    //         case "昭和":
    //             return "S";
    //         case "平成":
    //             return "H";
    //         default:
    //             throw new Error("invalid gengou: " + geng);
    //     }
    // };

    // var youbiList = ["日", "月", "火", "水", "木", "金", "土"];

    // function momentData(m){
    //     var d = {
    //         year: m.year(),
    //         month: m.month() + 1,
    //         day: m.date(),
    //         day_of_week: m.day(),
    //         hour: m.hour(),
    //         minute: m.minute(),
    //         second: m.second()
    //     };
    //     var g = seirekiToGengou(d.year, d.month, d.day);
    //     d.gengou = g.gengou;
    //     d.nen = g.nen;
    //     d.youbi = youbiList[d.day_of_week];
    //     return d;
    // }
    // exports.momentData = momentData;
    
    // exports.warekiToMoment = function(geng, nen, month, day){
    //     var year;
    //     year = gengouToSeireki(geng, nen);
    //     return moment({year: year, month: month-1, day: day});
    // }
    
    // exports.momentToSqlDate = function(m){
    //     return m.format("YYYY-MM-DD");
    // }

    // exports.dateToKanji = function(m, opt){
    //     var d;
    //     if( !opt ) opt = {};
    //     if( !moment.isMoment(m) ){
    //         m = moment(m);
    //     }
    //     d = momentData(m);
    //     var gengou = d.gengou;
    //     var nen = d.nen;
    //     var month = d.month;
    //     var day = d.day;
    //     if( opt.pad ){
    //         if( gengou === "西暦" ){
    //             nen = padNumber(nen, 4);
    //         } else {
    //             nen =padNumber(nen, 2);
    //         }
    //         month = padNumber(month, 2);
    //         day = padNumber(day, 2);
    //     }
    //     return gengou + nen + "年" + month + "月" + day + "日";
    // }
    
    // exports.dateToAlpha = function (d) {
    //     var data = momentData(moment(d));
    //     return gengouToAlpha(data.gengou) + data.nen + "." + data.month + "." + data.day;
    // };
    
    // exports.today = function(){
    //     return moment();
    // };
    
    // exports.recordTitleDate = function(m){
    //     var d;
    //     d = momentData(m);
    //     return d.gengou + padNumber(d.nen, 2) + "年" + 
    //         padNumber(d.month, 2) + "月" + 
    //         padNumber(d.day, 2) + "日" +
    //         " （" + d.youbi + "） " +
    //         ((d.hour <= 12) ? 
    //             ("午前" + padNumber(d.hour, 2) + "時" + padNumber(d.minute, 2) + "分") : 
    //             ("午後" + padNumber(d.hour-12, 2) + "時" + padNumber(d.minute, 2) + "分"));
    // }

    // var repeat = exports.repeat = function(ch, n){
    //     var parts = [], i;
    //     for(i=0;i<n;i++){
    //         parts.push(ch);
    //     }
    //     return parts.join("");
    // }

    // var padNumber = exports.padNumber = function(num, n){
    //     var s = "" + num;
    //     if( s.length < n ){
    //         return repeat("0", n-s.length) + s;
    //     } else {
    //         return s;
    //     }
    // }

    // exports.calcNumberOfPages = function(total, itemsPerPage){
    //     return Math.floor((total + itemsPerPage - 1) / itemsPerPage);
    // };

    // exports.fullName = function(patient, sep){
    //     if( sep == null ) sep = " ";
    //     return patient.last_name + sep + patient.first_name;
    // }

    // exports.fullNameYomi = function(patient, sep){
    //     if( sep == null ) sep = " ";
    //     return patient.last_name_yomi + sep + patient.first_name_yomi;
    // }
    
    // exports.patientOptionRep = function(patient){
    //     var idPart;
    //     idPart = "[" + padNumber(patient.patient_id, 4) + "]";
    //     return idPart + " " + patient.last_name + " " + patient.first_name;
    // }

    // exports.sexToKanji = function(sex, defaultValue){
    //     if( defaultValue === undefined ){
    //         defaultValue = "??";
    //     }
    //     switch(sex){
    //         case "M": return "男";
    //         case "F": return "女";
    //         default: return defaultValue;
    //     }
    // }

    // function hokenRep(visit){
    //     var terms = [];
    //     if( visit.shahokokuho ){
    //         var shahokokuho = visit.shahokokuho;
    //         terms.push(shahokokuhoRep(shahokokuho.hokensha_bangou));
    //         if( shahokokuho.kourei > 0 ){
    //             terms.push("高齢" + shahokokuho.kourei + "割");
    //         }
    //     } else if( visit.shahokokuho_id != 0 ){
    //         terms.push("orphan shahokokuho_id (" + visit.shahokokuho_id + ")");
    //     }
    //     if( visit.koukikourei ){
    //         var koukikourei = visit.koukikourei;
    //         terms.push(koukikoureiRep(koukikourei.futan_wari));
    //     } else if( visit.koukikourei_id != 0 ){
    //         terms.push("orphan koukikourei_id (" + visit.koukikourei_id + ")");
    //     }
    //     if( visit.roujin ){
    //         var roujin = visit.roujin;
    //         terms.push(roujinRep(roujin.futan_wari));
    //     } else if( visit.roujin_id != 0 ){
    //         terms.push("orphan roujin_id (" + visit.roujin_id + ")");
    //     }
    //     visit.kouhi_list.forEach(function(kouhi){
    //         terms.push(kouhiRep(kouhi.futansha));
    //     });
    //     return terms.length > 0 ? terms.join("・") : "保険なし";
    // }
    // exports.hokenRep = hokenRep;
    
    // function shahokokuhoRep(hokenshaBangou){
    //     var bangou = parseInt(hokenshaBangou, 10);
    //     if( bangou <= 9999 )
    //         return "政管健保";
    //     if( bangou <= 999999 )
    //         return "国保";
    //     switch(Math.floor(bangou/1000000)){
    //         case 1: return "協会けんぽ";
    //         case 2: return "船員";
    //         case 3: return "日雇一般";
    //         case 4: return "日雇特別";
    //         case 6: return "組合健保";
    //         case 7: return "自衛官";
    //         case 31: return "国家公務員共済";
    //         case 32: return "地方公務員共済";
    //         case 33: return "警察公務員共済";
    //         case 34: return "学校共済";
    //         case 63: return "特定健保退職";
    //         case 67: return "国保退職";
    //         case 72: return "国家公務員共済退職";
    //         case 73: return "地方公務員共済退職";
    //         case 74: return "警察公務員共済退職";
    //         case 75: return "学校共済退職";
    //         default: return "不明";
    //     }
    // }
    // exports.shahokokuhoRep = shahokokuhoRep;
    
    // function koukikoureiRep(futan_wari){
    //     return "後期高齢" + futan_wari + "割"
    // }
    // exports.koukikoureiRep = koukikoureiRep;
    
    // function roujinRep(futan_wari){
    //     return "老人" + futan_wari + "割";
    // }
    // exports.roujinRep = roujinRep;
    
    // function kouhiRep(futansha_bangou){
    //     futansha_bangou = parseInt(futansha_bangou, 10);
    //     if (Math.floor(futansha_bangou / 1000000)  == 41)
    //         return "マル福";
    //     else if (Math.floor(futansha_bangou / 1000) == 80136)
    //         return "マル障（１割負担）";
    //     else if (Math.floor(futansha_bangou / 1000) == 80137)
    //         return "マル障（負担なし）";
    //     else if (Math.floor(futansha_bangou / 1000) == 81136)
    //         return "マル親（１割負担）";
    //     else if (Math.floor(futansha_bangou / 1000) == 81137)
    //         return "マル親（負担なし）";
    //     else if (Math.floor(futansha_bangou / 1000000) == 88)
    //         return "マル乳";
    //     else
    //         return "公費負担";
    // }
    // exports.kouhiRep = kouhiRep;

    // var DrugCategoryNaifuku = exports.DrugCategoryNaifuku = 0;
    // var DrugCategoryTonpuku = exports.DrugCategoryTonpuku = 1;
    // var DrugCategoryGaiyou  = exports.DrugCategoryGaiyou  = 2;
    
    // function drugCategoryToKanji(category){
    //     switch(category){
    //         case DrugCategoryNaifuku: return "内服";
    //         case DrugCategoryTonpuku: return "頓服";
    //         case DrugCategoryGaiyou: return "外用";
    //         default: return "不明";
    //     }
    // }
    // exports.drugCategoryToKanji = drugCategoryToKanji;
    
    // function drugCategoryToSlug(category){
    //     switch(category){
    //         case DrugCategoryNaifuku: return "naifuku";
    //         case DrugCategoryTonpuku: return "tonpuku";
    //         case DrugCategoryGaiyou:  return "gaiyou";
    //         default: return "sonota";
    //     }
    // }
    // exports.drugCategoryToSlug = drugCategoryToSlug;

    // function drugRep(drug){
    //     var category = getCategory(drug);
    //     var amount = drug.amount || drug.d_amount;
    //     var usage = drug.usage || drug.d_usage;
    //     var days = drug.days || drug.d_days;
    //     switch(category){
    //         case DrugCategoryNaifuku:
    //             return drug.name + " " + amount + drug.unit + " " + usage + 
    //                 " " + days + "日分";
    //         case DrugCategoryTonpuku:
    //             return drug.name + " １回 " + amount + drug.unit + " " + usage +
    //                 " " + days + "回分";
    //         case DrugCategoryGaiyou:
    //             return drug.name + " " + amount + drug.unit + " " + usage;
    //         default:
    //             return drug.name + " " + amount + drug.unit;
    //     }

    //     function getCategory(drug){
    //         if( "category" in drug ){
    //             return parseInt(drug.category, 10);
    //         } else if( "d_category" in drug ){
    //             return parseInt(drug.d_category, 10);
    //         } else {
    //             return -1;
    //         }
    //     }
    // }
    // exports.drugRep = drugRep;
    
    // function conductDrugRep(drug){
    //   return drug.name + " " + drug.amount + drug.unit;
    // }
    // exports.conductDrugRep = conductDrugRep;

    // var ConductKindHikaChuusha = exports.ConductKindHikaChuusha = 0;
    // var ConductKindJoumyakuChuusha = exports.ConductKindJoumyakuChuusha = 1;
    // var ConductKindOtherChuusha = exports.ConductKindOtherChuusha = 2;
    // var ConductKindGazou = exports.ConductKindGazou = 3;

    // exports.ZaikeiNaifuku = 1;
    // exports.ZaikeiOther = 3;
    // exports.ZaikeiChuusha = 4;
    // var ZaikeiGaiyou = exports.ZaikeiGaiyou = 6;
    // exports.ZaikeiShikaYakuzai = 8;
    // exports.ZaikeiShikaTokutei = 9;

    // function conductKindToKanji(kind) {
    //     kind = parseInt(kind, 10);
    //     switch (kind) {
    //         case ConductKindHikaChuusha:
    //             return "皮下・筋肉注射";
    //         case ConductKindJoumyakuChuusha:
    //             return "静脈注射";
    //         case ConductKindOtherChuusha:
    //             return "その他注射";
    //         case ConductKindGazou:
    //             return "画像";
    //         default:
    //             return "不明";
    //     }
    // }
    // exports.conductKindToKanji = conductKindToKanji;

    // function conductKizaiRep(kizai){
    //   return kizai.name + " " + kizai.amount + kizai.unit;
    // }
    // exports.conductKizaiRep = conductKizaiRep;

    // function formatNumber(num, opts) {
    //     var preserveZeroFraction = opts && opts.preserveZeroFraction;
    //     var orig = num.toString();
    //     var match = /^(\d+)(\.\d+)?$/.exec(orig);
    //     if (!match) return orig;
    //     var left = match[1];
    //     var right = match[2];
    //     var left_part = "";
    //     if (left.length <= 3) {
    //         left_part = left;
    //     } else {
    //         var lead = left.length % 3;
    //         left_part = left.substr(0, lead);
    //         left = left.substr(lead);
    //         while (left.length > 3) {
    //             left_part += ",";
    //             left_part += left.substr(0, 3);
    //             left = left.substr(3);
    //         }
    //         left_part += "," + left;
    //     }
    //     var right_part = (right == null) ? "" : right;
    //     if (!preserveZeroFraction) {
    //         right_part = right_part.replace(/0+$/, "");
    //         if (right_part == ".") {
    //             right_part = "";
    //         }
    //     }
    //     return left_part + right_part;
    // }
    // exports.formatNumber = formatNumber;

    // var DiseaseEndReasonNotEnded = exports.DiseaseEndReasonNotEnded = "N";
    // var DiseaseEndReasonCured = exports.DiseaseEndReasonCured = "C";
    // var DiseaseEndReasonStopped = exports.DiseaseEndReasonStopped = "S";
    // var DiseaseEndReasonDead = exports.DiseaseEndReasonDead = "D";

    // function isPostfixShuushokugocode(shuushokugocode) {
    //     var code = shuushokugocode - 0;
    //     return code >= 8000 && code <= 8999;
    // }
    // exports.isPostfixShuushokugocode = isPostfixShuushokugocode;

    // function isPrefixShuushokugocode(shuushokugocode) {
    //     return !isPostfixShuushokugocode(shuushokugocode);
    // }
    // exports.isPrefixShuushokugocode = isPrefixShuushokugocode;

    // function diseaseFullName(shoubyoumei, adjList){
    //     var name = shoubyoumei ? shoubyoumei.name : "",
    //         pre = "",
    //         post = "";
    //     if( adjList ){
    //         adjList.forEach(function(adj){
    //             if( isPrefixShuushokugocode(adj.shuushokugocode) ){
    //                 pre += adj.name;
    //             } else {
    //                 post += adj.name;
    //             }
    //         })
    //     }
    //     return pre + name + post;
    // }
    // exports.diseaseFullName = diseaseFullName;

    // function endReasonToKanji(reason) {
    //     switch (reason) {
    //         case DiseaseEndReasonNotEnded:
    //             return "継続";
    //         case DiseaseEndReasonCured:
    //             return "治癒";
    //         case DiseaseEndReasonStopped:
    //             return "中止";
    //         case DiseaseEndReasonDead:
    //             return "死亡";
    //         default:
    //             throw new Error("unknown reason: " + reason);
    //     }
    // }
    // exports.endReasonToKanji = endReasonToKanji;

    // exports.formatDiseaseStartDate = function(startDate){
    //     var d = momentData(startDate);
    //     return gengouToAlpha(d.gengou) + d.nen + "." + d.month + "." + d.day;
    // }

    // var assign = exports.assign = function(){
    //     var dst, src, n, i;
    //     n = arguments.length;
    //     if( n === 0 ) return {};
    //     dst = arguments[0];
    //     for(i=1;i<n;i++){
    //         src = arguments[i];
    //         doAssign(dst, src);
    //     }
    //     return dst;

    //     function doAssign(dst, src){
    //         var key;
    //         for(key in src){
    //             if( src.hasOwnProperty(key) ){
    //                 dst[key] = src[key];
    //             }
    //         }
    //     }
    // };

    // function normalizeIyakuhinMaster(drug){
    //     var category = parseInt(drug.zaikei) === ZaikeiGaiyou ? 
    //             DrugCategoryGaiyou : DrugCategoryNaifuku;
    //     return {
    //         label: drug.name,
    //         iyakuhincode: drug.iyakuhincode,
    //         amount: "",
    //         unit: drug.unit,
    //         usage: "",
    //         category: category,
    //         days: ""
    //     };
    // }
    // exports.normalizeIyakuhinMaster = normalizeIyakuhinMaster;

    // function normalizeDrugStock(drug){
    //     var name;
    //     for(name in drug){
    //         if( drug.hasOwnProperty(name) && name.substr(0,2) == "m_" ){
    //             drug[name.substr(2)] = drug[name];
    //             delete drug[name];
    //         }
    //     }
    //     return {
    //         label: drugRep(drug),
    //         iyakuhincode: drug.iyakuhincode,
    //         amount: drug.amount,
    //         unit: drug.unit,
    //         usage: drug.usage,
    //         category: drug.category,
    //         days: drug.days
    //     }
    // }
    // exports.normalizeDrugStock = normalizeDrugStock;

    // function normalizeVisitDrug(drug){
    //     var name;
    //     drug = assign({}, drug);
    //     for(name in drug){
    //         if( drug.hasOwnProperty(name) && name.substr(0,2) == "d_" ){
    //             drug[name.substr(2)] = drug[name];
    //             delete drug[name];
    //         }
    //     }
    //     //drug.label = drugRep(drug);
    //     return drug;
    //     // return {
    //     //     label: drugRep(drug),
    //     //     visit_id: drug.visit_id,
    //     //     iyakuhincode: drug.iyakuhincode,
    //     //     amount: drug.amount,
    //     //     unit: drug.unit,
    //     //     usage: drug.usage,
    //     //     category: drug.category,
    //     //     days: drug.days
    //     // }
    // }
    // exports.normalizeVisitDrug = normalizeVisitDrug;

    // function serial(dataList, promiseMaker){
    //     var retlist = [];
        
    //     return iter(0);

    //     function iter(i){
    //         if( i >= dataList.length ){
    //             return Promise.resolve(retlist);
    //         }
    //         return promiseMaker(dataList[i]).then(function(retval){
    //             retlist.push(retval);
    //             return iter(i+1);
    //         });
    //     }
    // }
    // exports.serial = serial;
    
    // exports.meisaiSections = [
    //     "初・再診料", "医学管理等", "在宅医療", "検査", "画像診断",
    //     "投薬", "注射", "処置", "その他"       
    // ];

    // var SHUUKEI_SHOSHIN = "110";
    // var SHUUKEI_SAISHIN_SAISHIN = "120";
    // var SHUUKEI_SAISHIN_GAIRAIKANRI = "122";
    // var SHUUKEI_SAISHIN_JIKANGAI = "123";
    // var SHUUKEI_SAISHIN_KYUUJITSU = "124";
    // var SHUUKEI_SAISHIN_SHINYA = "125";
    // var SHUUKEI_SHIDO = "130";
    // var SHUUKEI_ZAITAKU = "140";
    // var SHUUKEI_TOYAKU_NAIFUKUTONPUKUCHOZAI = "210";
    // var SHUUKEI_TOYAKU_GAIYOCHOZAI = "230";
    // var SHUUKEI_TOYAKU_SHOHO = "250";
    // var SHUUKEI_TOYAKU_MADOKU = "260";
    // var SHUUKEI_TOYAKU_CHOKI = "270";
    // var SHUUKEI_CHUSHA_SEIBUTSUETC = "300";
    // var SHUUKEI_CHUSHA_HIKA = "311";
    // var SHUUKEI_CHUSHA_JOMYAKU = "321";
    // var SHUUKEI_CHUSHA_OTHERS = "331";
    // var SHUUKEI_SHOCHI = "400";
    // var SHUUKEI_SHUJUTSU_SHUJUTSU = "500";
    // var SHUUKEI_SHUJUTSU_YUKETSU = "502";
    // var SHUUKEI_MASUI = "540";
    // var SHUUKEI_KENSA = "600";
    // var SHUUKEI_GAZOSHINDAN = "700";
    // var SHUUKEI_OTHERS = "800";
    
    // used
    function shuukeiToMeisaiSection(shuukeisaki){
   		switch(shuukeisaki){
   			case mConsts.SHUUKEI_SHOSHIN:
   			case mConsts.SHUUKEI_SAISHIN_SAISHIN:
   			case mConsts.SHUUKEI_SAISHIN_GAIRAIKANRI:
   			case mConsts.SHUUKEI_SAISHIN_JIKANGAI:
   			case mConsts.SHUUKEI_SAISHIN_KYUUJITSU:
   			case mConsts.SHUUKEI_SAISHIN_SHINYA:
   				return "初・再診料";
   			case mConsts.SHUUKEI_SHIDO:
   				return "医学管理等";
   			case mConsts.SHUUKEI_ZAITAKU:
   				return "在宅医療";
   			case mConsts.SHUUKEI_KENSA:
   				return "検査";
   			case mConsts.SHUUKEI_GAZOSHINDAN:
   				return "画像診断";
   			case mConsts.SHUUKEI_TOYAKU_NAIFUKUTONPUKUCHOZAI:
   			case mConsts.SHUUKEI_TOYAKU_GAIYOCHOZAI:
   			case mConsts.SHUUKEI_TOYAKU_SHOHO:
   			case mConsts.SHUUKEI_TOYAKU_MADOKU:
   			case mConsts.SHUUKEI_TOYAKU_CHOKI:
   				return "投薬";
   			case mConsts.SHUUKEI_CHUSHA_SEIBUTSUETC:
   			case mConsts.SHUUKEI_CHUSHA_HIKA:
   			case mConsts.SHUUKEI_CHUSHA_JOMYAKU:
   			case mConsts.SHUUKEI_CHUSHA_OTHERS:
   				return "注射";
   			case mConsts.SHUUKEI_SHOCHI:
   				return "処置";
   			case mConsts.SHUUKEI_SHUJUTSU_SHUJUTSU:
   			case mConsts.SHUUKEI_SHUJUTSU_YUKETSU:
   			case mConsts.SHUUKEI_MASUI:
   			case mConsts.SHUUKEI_OTHERS:
   			default: return "その他";
   		}
   	}
    exports.shuukeiToMeisaiSection = shuukeiToMeisaiSection;
    
    // exports.HOUKATSU_NONE = '00';
    // exports.HOUKATSU_KETSUEKIKageKU = "01";
    // exports.HOUKATSU_ENDOCRINE = "02";
    // exports.HOUKATSU_HEPATITIS = "03";
    // exports.HOUKATSU_TUMOR = "04";
    // exports.HOUKATSU_TUMORMISC = "05";
    // exports.HOUKATSU_COAGULO = "06";
    // exports.HOUKATSU_AUTOANTIBODY = "07";
    // exports.HOUKATSU_TOLERANCE = "08";
    
    // used
    exports.touyakuKingakuToTen = function(kingaku){
        if( kingaku <= 15 ){
            return 1;
        } else {
            return Math.ceil((kingaku - 15)/10 + 1);
        }
    };
    
    // used
    exports.shochiKingakuToTen = function(kingaku){
   		if( kingaku <= 15 )
   			return 0;
   		else
   			return Math.ceil((kingaku - 15)/10 + 1);
    };
    
    // used
    exports.kizaiKingakuToTen = function(kingaku){
        return Math.round(kingaku/10.0);
    }
    
    // used
    exports.calcRcptAge = function(bdYear, bdMonth, bdDay, atYear, atMonth){
        var age;
		age = atYear - bdYear;
		if( atMonth < bdMonth ){
			age -= 1;
		} else if( atMonth === bdMonth ){
			if( bdDay != 1 ){
				age -= 1;
			}
		}
		return age;
    };
    
    // used
    exports.calcShahokokuhoFutanWariByAge = function(age){
        if( age < 3 )
            return 2;
        else if( age >= 70 )
            return 2;
        else
            return 3;
    };
    
    // used
    exports.kouhiFutanWari = function(futanshaBangou){
        futanshaBangou = Number(futanshaBangou);
		if( Math.floor(futanshaBangou / 1000000) === 41 )
			return 1;
		else if( Math.floor(futanshaBangou / 1000) === 80136 )
			return 1;
		else if( Math.floor(futanshaBangou / 1000) === 80137 )
			return 0;
		else if( Math.floor(futanshaBangou / 1000) === 81136 )
			return 1;
		else if( Math.floor(futanshaBangou / 1000) === 81137 )
			return 0;
		else if( Math.floor(futanshaBangou / 1000000) === 88 )
			return 0;
		else{
			console.log("unknown kouhi futansha: " + futanshaBangou);
			return 0;
		}
    };
    
    // used
    exports.calcCharge = function(ten, futanWari){
        var c, r;
		c = parseInt(ten) * parseInt(futanWari);
		r = c % 10;
		if( r < 5 )
			c -= r;
		else
			c += (10 - r);
		return c;
    }

    // var wqueueStateWaitExam = exports.wqueueStateWaitExam = 0;
    // var wqueueStateInExam = exports.wqueueStateInExam = 1;
    // var wqueueStateWaitCashier = exports.wqueueStateWaitCashier = 2;
    // var wqueueStateWaitDrug = exports.wqueueStateWaitDrug = 3;
    // var wqueueStateWaitReExam = exports.wqueueStateWaitReExam = 4;
    // var wqueueStateWaitAppoint = exports.wqueueStateWaitAppoint = 5;

    // exports.wqueueStateRep = function(wqState){
    //     switch(wqState){
    //         case wqueueStateWaitExam: return "診待";
    //         case wqueueStateInExam: return "診中";
    //         case wqueueStateWaitCashier: return "会待";
    //         case wqueueStateWaitDrug: return "薬待";
    //         case wqueueStateWaitReExam: return "再待";
    //         case wqueueStateWaitAppoint: return "予待";
    //         default: return "不明";
    //     }
    // };
    
    // exports.wqueueStateToSlug = function(wqState){
    //     switch(wqState){
    //         case wqueueStateWaitExam: return "wait-exam";
    //         case wqueueStateInExam: return "in-exam";
    //         case wqueueStateWaitCashier: return "wait-cashier";
    //         case wqueueStateWaitDrug: return "wait-drug";
    //         case wqueueStateWaitReExam: return "wait-re-exam";
    //         case wqueueStateWaitAppoint: return "wait-appointed-exam";
    //         default: return "unknown";
    //     }
    // };

    // exports.pharmaQueueStateWaitPack = 0;
    // exports.pharmaQueueStateInPack   = 1;
    // exports.pharmaQueueStatePackDone = 2;
