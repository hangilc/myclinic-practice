/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	var conti = __webpack_require__(4);
	var mUtil = __webpack_require__(5);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var AppData = __webpack_require__(11);

	var PatientInfo = __webpack_require__(12);
	var CurrentManip = __webpack_require__(18);
	var RecordNav = __webpack_require__(26);
	var RecordList = __webpack_require__(28);
	var Disease = __webpack_require__(122);
	var SelectPatient = __webpack_require__(139);
	var SearchPatient = __webpack_require__(143);
	var RecentVisits = __webpack_require__(146);
	var TodaysVisits = __webpack_require__(149);
	var Reception = __webpack_require__(152);
	var SearchWholeText = __webpack_require__(156);

	PatientInfo.setup($("#patient-info-wrapper"));
	CurrentManip.setup($("#current-manip-pane"));
	$(".record-nav-wrapper").each(function(i){
		RecordNav.setup($(this), i);
	});
	RecordList.setup($("#record-list"));
	Disease.setup($("#disease-wrapper"));
	SelectPatient.setup($("#select-patient-wrapper"));
	SearchPatient.setup($("#search-patient-wrapper"));
	RecentVisits.setup($("#recent-visits-wrapper"));
	TodaysVisits.setup($("#todays-visits-wrapper"));
	$("#reception-link").click(function(event){
		event.preventDefault();
		Reception.open();
	});
	SearchWholeText.setup($("#all-text-search-link"));

	var appData = new AppData();

	function startPage(patientId, visitId){
		appData.startPage(patientId, visitId, function(err){
			if( err ){
				alert(err);
				return;
			}
			var data = mUtil.assign({}, appData);
			updateTitle(data.currentPatient);
			$("body").broadcast("rx-start-page", [data]);
		});
	}

	$("body").on("start-patient", function(event, patientId){
		startPage(patientId, 0);
	});

	$("body").on("start-exam", function(event, patientId, visitId){
		startPage(patientId, visitId);
	});

	$("body").on("end-patient", function(event){
		startPage(0, 0);
	});

	$("body").on("exam-ended", function(event){
		appData.clear();
		startPage(0, 0);
	});

	$("body").on("goto-page", function(event, page){
		appData.gotoPage(page, function(err){
			if( err ){
				alert(err);
				return;
			}
			var data = mUtil.assign({}, appData);
			$("body").broadcast("rx-goto-page", [data]);
		})
	});

	$("body").on("delete-visit", function(event, visitId){
		appData.deleteVisit(visitId, function(err){
			if( err ){
				alert(err);
				return;
			}
			var data = mUtil.assign({}, appData);
			$("body").broadcast("rx-delete-visit", [data]);
		})	
	});

	$("body").on("set-temp-visit-id", function(event, visitId, done){
		if( appData.currentVisitId > 0 ){
			done("現在診察中なので、暫定診察を設定できません。");
			return;
		}
		appData.tempVisitId = visitId;
		$("body").broadcast("rx-set-temp-visit-id", [appData]);
		done();
	});

	$("body").reply("fn-get-target-visit-id", function(){
		return appData.currentVisitId || appData.tempVisitId;
	});

	$("body").reply("fn-confirm-edit", function(visitId, message){
		if( visitId === appData.currentVisitId || visitId === appData.tempVisitId ){
			return true;
		} else {
			return confirm(message);
		}
	});

	$("body").reply("fn-get-current-visit-id", function(){
		return appData.currentVisitId;
	});

	$("body").reply("fn-get-temp-visit-id", function(){
		return appData.tempVisitId;
	});


	function updateTitle(patient){
		if( patient ){
			document.title = "診察 (" + patient.patient_id + ") " + patient.last_name + patient.first_name;
		} else {
			document.title = "診察";
		}
	}



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*eslint-disable no-unused-vars*/
	/*!
	 * jQuery JavaScript Library v3.1.0
	 * https://jquery.com/
	 *
	 * Includes Sizzle.js
	 * https://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * https://jquery.org/license
	 *
	 * Date: 2016-07-07T21:44Z
	 */
	( function( global, factory ) {

		"use strict";

		if ( typeof module === "object" && typeof module.exports === "object" ) {

			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}

	// Pass this if window is not defined yet
	} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

	// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
	// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
	// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
	// enough that all such attempts are guarded in a try block.
	"use strict";

	var arr = [];

	var document = window.document;

	var getProto = Object.getPrototypeOf;

	var slice = arr.slice;

	var concat = arr.concat;

	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var fnToString = hasOwn.toString;

	var ObjectFunctionString = fnToString.call( Object );

	var support = {};



		function DOMEval( code, doc ) {
			doc = doc || document;

			var script = doc.createElement( "script" );

			script.text = code;
			doc.head.appendChild( script ).parentNode.removeChild( script );
		}
	/* global Symbol */
	// Defining this global in .eslintrc would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module



	var
		version = "3.1.0",

		// Define a local copy of jQuery
		jQuery = function( selector, context ) {

			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},

		// Support: Android <=4.0 only
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([a-z])/g,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function() {
			return slice.call( this );
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num != null ?

				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :

				// Return all the elements in a clean array
				slice.call( this );
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},

		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},

		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},

		first: function() {
			return this.eq( 0 );
		},

		last: function() {
			return this.eq( -1 );
		},

		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},

		end: function() {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {

			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {

				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {

						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend( {

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function( msg ) {
			throw new Error( msg );
		},

		noop: function() {},

		isFunction: function( obj ) {
			return jQuery.type( obj ) === "function";
		},

		isArray: Array.isArray,

		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},

		isNumeric: function( obj ) {

			// As of jQuery 3.0, isNumeric is limited to
			// strings and numbers (primitives or objects)
			// that can be coerced to finite numbers (gh-2662)
			var type = jQuery.type( obj );
			return ( type === "number" || type === "string" ) &&

				// parseFloat NaNs numeric-cast false positives ("")
				// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
				// subtraction forces infinities to NaN
				!isNaN( obj - parseFloat( obj ) );
		},

		isPlainObject: function( obj ) {
			var proto, Ctor;

			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if ( !obj || toString.call( obj ) !== "[object Object]" ) {
				return false;
			}

			proto = getProto( obj );

			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if ( !proto ) {
				return true;
			}

			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
			return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
		},

		isEmptyObject: function( obj ) {

			/* eslint-disable no-unused-vars */
			// See https://github.com/eslint/eslint/issues/6125
			var name;

			for ( name in obj ) {
				return false;
			}
			return true;
		},

		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}

			// Support: Android <=2.3 only (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},

		// Evaluates a script in a global context
		globalEval: function( code ) {
			DOMEval( code );
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE <=9 - 11, Edge 12 - 13
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},

		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		each: function( obj, callback ) {
			var length, i = 0;

			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android <=4.0 only
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}

			return ret;
		},

		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},

		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;

			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}

			first.length = i;

			return first;
		},

		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];

			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}

			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply( [], ret );
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var tmp, args, proxy;

			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}

			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );

	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
	}

	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

	function isArrayLike( obj ) {

		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type( obj );

		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.3.0
	 * https://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-01-04
	 */
	(function( window ) {

	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,

		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,

		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},

		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// https://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",

		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",

		pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		rnative = /^[^{]+\{\s*\[native \w/,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rsibling = /[+~]/,

		// CSS escapes
		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},

		// CSS string/identifier serialization
		// https://drafts.csswg.org/cssom/#common-serializing-idioms
		rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,
		fcssescape = function( ch, asCodePoint ) {
			if ( asCodePoint ) {

				// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
				if ( ch === "\0" ) {
					return "\uFFFD";
				}

				// Control characters and (dependent upon position) numbers get escaped as code points
				return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
			}

			// Other potentially-special ASCII characters get backslash-escaped
			return "\\" + ch;
		},

		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		},

		disabledAncestor = addCombinator(
			function( elem ) {
				return elem.disabled === true;
			},
			{ dir: "parentNode", next: "legend" }
		);

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :

			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, match, groups, newSelector,
			newContext = context && context.ownerDocument,

			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;

		results = results || [];

		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

			return results;
		}

		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {

			if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
				setDocument( context );
			}
			context = context || document;

			if ( documentIsHTML ) {

				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

					// ID selector
					if ( (m = match[1]) ) {

						// Document context
						if ( nodeType === 9 ) {
							if ( (elem = context.getElementById( m )) ) {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}

						// Element context
						} else {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && (elem = newContext.getElementById( m )) &&
								contains( context, elem ) &&
								elem.id === m ) {

								results.push( elem );
								return results;
							}
						}

					// Type selector
					} else if ( match[2] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;

					// Class selector
					} else if ( (m = match[3]) && support.getElementsByClassName &&
						context.getElementsByClassName ) {

						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}

				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!compilerCache[ selector + " " ] &&
					(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

					if ( nodeType !== 1 ) {
						newContext = context;
						newSelector = selector;

					// qSA looks outside Element context, which is not what we want
					// Thanks to Andrew Dupont for this workaround technique
					// Support: IE <=8
					// Exclude object elements
					} else if ( context.nodeName.toLowerCase() !== "object" ) {

						// Capture the context ID, setting it first if necessary
						if ( (nid = context.getAttribute( "id" )) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", (nid = expando) );
						}

						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						while ( i-- ) {
							groups[i] = "#" + nid + " " + toSelector( groups[i] );
						}
						newSelector = groups.join( "," );

						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
					}

					if ( newSelector ) {
						try {
							push.apply( results,
								newContext.querySelectorAll( newSelector )
							);
							return results;
						} catch ( qsaError ) {
						} finally {
							if ( nid === expando ) {
								context.removeAttribute( "id" );
							}
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];

		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}

	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created element and returns a boolean result
	 */
	function assert( fn ) {
		var el = document.createElement("fieldset");

		try {
			return !!fn( el );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( el.parentNode ) {
				el.parentNode.removeChild( el );
			}
			// release memory in IE
			el = null;
		}
	}

	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = arr.length;

		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}

	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				a.sourceIndex - b.sourceIndex;

		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}

		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for :enabled/:disabled
	 * @param {Boolean} disabled true for :disabled; false for :enabled
	 */
	function createDisabledPseudo( disabled ) {
		// Known :disabled false positives:
		// IE: *[disabled]:not(button, input, select, textarea, optgroup, option, menuitem, fieldset)
		// not IE: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
		return function( elem ) {

			// Check form elements and option elements for explicit disabling
			return "label" in elem && elem.disabled === disabled ||
				"form" in elem && elem.disabled === disabled ||

				// Check non-disabled form elements for fieldset[disabled] ancestors
				"form" in elem && elem.disabled === false && (
					// Support: IE6-11+
					// Ancestry is covered for us
					elem.isDisabled === disabled ||

					// Otherwise, assume any non-<option> under fieldset[disabled] is disabled
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						("label" in elem || !disabledAncestor( elem )) !== disabled
				);
		};
	}

	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, subWindow,
			doc = node ? node.ownerDocument || node : preferredDoc;

		// Return early if doc is invalid or already selected
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );

		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ( preferredDoc !== document &&
			(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

			// Support: IE 11, Edge
			if ( subWindow.addEventListener ) {
				subWindow.addEventListener( "unload", unloadHandler, false );

			// Support: IE 9 - 10 only
			} else if ( subWindow.attachEvent ) {
				subWindow.attachEvent( "onunload", unloadHandler );
			}
		}

		/* Attributes
		---------------------------------------------------------------------- */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( el ) {
			el.className = "i";
			return !el.getAttribute("className");
		});

		/* getElement(s)By*
		---------------------------------------------------------------------- */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( el ) {
			el.appendChild( document.createComment("") );
			return !el.getElementsByTagName("*").length;
		});

		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programmatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( el ) {
			docElem.appendChild( el ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		});

		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var m = context.getElementById( id );
					return m ? [ m ] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];

			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );

				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :

			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		/* QSA/matchesSelector
		---------------------------------------------------------------------- */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See https://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( el ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// https://bugs.jquery.com/ticket/12359
				docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";

				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( el.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !el.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}

				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}

				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !el.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}

				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibling-combinator selector` fails
				if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});

			assert(function( el ) {
				el.innerHTML = "<a href='' disabled='disabled'></a>" +
					"<select disabled='disabled'><option/></select>";

				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute( "type", "hidden" );
				el.appendChild( input ).setAttribute( "name", "D" );

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( el.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( el.querySelectorAll(":enabled").length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Support: IE9-11+
				// IE's :disabled selector does not pick up the children of disabled fieldsets
				docElem.appendChild( el ).disabled = true;
				if ( el.querySelectorAll(":disabled").length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Opera 10-11 does not throw on post-comma invalid pseudos
				el.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {

			assert(function( el ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( el, "*" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( el, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );

		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};

		/* Sorting
		---------------------------------------------------------------------- */

		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :

				// Otherwise we know they are disconnected
				1;

			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];

			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === document ? -1 :
					b === document ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;

			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}

			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}

			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};

		return document;
	};

	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};

	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );

		if ( support.matchesSelector && documentIsHTML &&
			!compilerCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}

		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};

	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};

	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;

		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};

	Sizzle.escape = function( sel ) {
		return (sel + "").replace( rcssescape, fcssescape );
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}

				return match.slice( 0, 4 );
			},

			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();

				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}

				return match;
			},

			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];

				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},

			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},

			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},

			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {

											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {

								// Seek `elem` from a previously-cached index

								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( (node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {

									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							} else {
								// Use previously-cached element index if available
								if ( useCache ) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || (node[ expando ] = {});

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										(outerCache[ node.uniqueID ] = {});

									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}

								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
									// Use the same loop as above to seek `elem` from the start
									while ( (node = ++nodeIndex && node && node[ dir ] ||
										(diff = nodeIndex = 0) || start.pop()) ) {

										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {

											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] || (node[ expando ] = {});

												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													(outerCache[ node.uniqueID ] = {});

												uniqueCache[ type ] = [ dirruns, diff ];
											}

											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );

				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),

			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),

			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),

			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			"root": function( elem ) {
				return elem === docElem;
			},

			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": createDisabledPseudo( false ),
			"disabled": createDisabledPseudo( true ),

			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},

			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},

			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},

			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},

			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},

			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),

			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),

			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),

			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};

	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}

			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			skip = combinator.next,
			key = skip || dir,
			checkNonElements = base && key === "parentNode",
			doneName = done++;

		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];

				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

							if ( skip && skip === elem.nodeName.toLowerCase() ) {
								elem = elem[ dir ] || elem;
							} else if ( (oldCache = uniqueCache[ key ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ key ] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,

				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

						// ...intermediate processing is necessary
						[] :

						// ...otherwise use results directly
						results :
					matcherIn;

			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];

		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;

				if ( outermost ) {
					outermostContext = context === document || context || outermost;
				}

				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						if ( !context && elem.ownerDocument !== document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context || document, xml) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;

				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						Sizzle.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};

	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );

		results = results || [];

		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {

			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;

				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}

		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( el ) {
		// Should return 1, but returns 4 (following)
		return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
	});

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( el ) {
		el.innerHTML = "<a href='#'></a>";
		return el.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( el ) {
		el.innerHTML = "<input/>";
		el.firstChild.setAttribute( "value", "" );
		return el.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( el ) {
		return el.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}

	return Sizzle;

	})( window );



	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;

	// Deprecated
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	jQuery.escapeSelector = Sizzle.escape;




	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};


	var siblings = function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	};


	var rneedsContext = jQuery.expr.match.needsContext;

	var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				return !!qualifier.call( elem, i, elem ) !== not;
			} );

		}

		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );

		}

		if ( typeof qualifier === "string" ) {
			if ( risSimple.test( qualifier ) ) {
				return jQuery.filter( qualifier, elements, not );
			}

			qualifier = jQuery.filter( qualifier, elements );
		}

		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
		} );
	}

	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			} ) );
	};

	jQuery.fn.extend( {
		find: function( selector ) {
			var i, ret,
				len = this.length,
				self = this;

			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}

			ret = this.pushStack( [] );

			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}

			return len > 1 ? jQuery.uniqueSort( ret ) : ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );


	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,

		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		// Shortcut simple #id case for speed
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}

			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;

			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[ 0 ] === "<" &&
					selector[ selector.length - 1 ] === ">" &&
					selector.length >= 3 ) {

					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];

				} else {
					match = rquickExpr.exec( selector );
				}

				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {

					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );

						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {

								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );

								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}

						return this;

					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );

						if ( elem ) {

							// Inject the element directly into the jQuery object
							this[ 0 ] = elem;
							this.length = 1;
						}
						return this;
					}

				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}

			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this[ 0 ] = selector;
				this.length = 1;
				return this;

			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return root.ready !== undefined ?
					root.ready( selector ) :

					// Execute immediately if ready is not present
					selector( jQuery );
			}

			return jQuery.makeArray( selector, this );
		};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery( document );


	var rparentsprev = /^(?:parents|prev(?:Until|All))/,

		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend( {
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;

			return this.filter( function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},

		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				targets = typeof selectors !== "string" && jQuery( selectors );

			// Positional selectors never match, since there's no _selection_ context
			if ( !rneedsContext.test( selectors ) ) {
				for ( ; i < l; i++ ) {
					for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

						// Always skip document fragments
						if ( cur.nodeType < 11 && ( targets ?
							targets.index( cur ) > -1 :

							// Don't pass non-elements to Sizzle
							cur.nodeType === 1 &&
								jQuery.find.matchesSelector( cur, selectors ) ) ) {

							matched.push( cur );
							break;
						}
					}
				}
			}

			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},

		// Determine the position of an element within the set
		index: function( elem ) {

			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}

			// Locate the position of the desired element
			return indexOf.call( this,

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},

		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},

		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );

	function sibling( cur, dir ) {
		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
		return cur;
	}

	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			return elem.contentDocument || jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );

			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}

			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}

			if ( this.length > 1 ) {

				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.uniqueSort( matched );
				}

				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}

			return this.pushStack( matched );
		};
	} );
	var rnotwhite = ( /\S+/g );



	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );

		var // Flag to know if list is currently firing
			firing,

			// Last fire value for non-forgettable lists
			memory,

			// Flag to know if list was already fired
			fired,

			// Flag to prevent firing
			locked,

			// Actual callback list
			list = [],

			// Queue of execution data for repeatable lists
			queue = [],

			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,

			// Fire callbacks
			fire = function() {

				// Enforce single-firing
				locked = options.once;

				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {

						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {

							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}

				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}

				firing = false;

				// Clean up if we're done firing for good
				if ( locked ) {

					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];

					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},

			// Actual Callbacks object
			self = {

				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {

						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}

						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( jQuery.isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );

						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},

				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );

							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},

				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},

				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},

				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},

				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = queue = [];
					if ( !memory && !firing ) {
						list = memory = "";
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},

				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},

				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},

				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};


	function Identity( v ) {
		return v;
	}
	function Thrower( ex ) {
		throw ex;
	}

	function adoptValue( value, resolve, reject ) {
		var method;

		try {

			// Check for promise aspect first to privilege synchronous behavior
			if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
				method.call( value ).done( resolve ).fail( reject );

			// Other thenables
			} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
				method.call( value, resolve, reject );

			// Other non-thenables
			} else {

				// Support: Android 4.0 only
				// Strict mode functions invoked without .call/.apply get global-object context
				resolve.call( undefined, value );
			}

		// For Promises/A+, convert exceptions into rejections
		// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
		// Deferred#then to conditionally suppress rejection.
		} catch ( value ) {

			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			reject.call( undefined, value );
		}
	}

	jQuery.extend( {

		Deferred: function( func ) {
			var tuples = [

					// action, add listener, callbacks,
					// ... .then handlers, argument index, [final state]
					[ "notify", "progress", jQuery.Callbacks( "memory" ),
						jQuery.Callbacks( "memory" ), 2 ],
					[ "resolve", "done", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 0, "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 1, "rejected" ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					"catch": function( fn ) {
						return promise.then( null, fn );
					},

					// Keep pipe for back-compat
					pipe: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;

						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {

								// Map tuples (progress, done, fail) to arguments (done, fail, progress)
								var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

								// deferred.progress(function() { bind to newDefer or newDefer.notify })
								// deferred.done(function() { bind to newDefer or newDefer.resolve })
								// deferred.fail(function() { bind to newDefer or newDefer.reject })
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},
					then: function( onFulfilled, onRejected, onProgress ) {
						var maxDepth = 0;
						function resolve( depth, deferred, handler, special ) {
							return function() {
								var that = this,
									args = arguments,
									mightThrow = function() {
										var returned, then;

										// Support: Promises/A+ section 2.3.3.3.3
										// https://promisesaplus.com/#point-59
										// Ignore double-resolution attempts
										if ( depth < maxDepth ) {
											return;
										}

										returned = handler.apply( that, args );

										// Support: Promises/A+ section 2.3.1
										// https://promisesaplus.com/#point-48
										if ( returned === deferred.promise() ) {
											throw new TypeError( "Thenable self-resolution" );
										}

										// Support: Promises/A+ sections 2.3.3.1, 3.5
										// https://promisesaplus.com/#point-54
										// https://promisesaplus.com/#point-75
										// Retrieve `then` only once
										then = returned &&

											// Support: Promises/A+ section 2.3.4
											// https://promisesaplus.com/#point-64
											// Only check objects and functions for thenability
											( typeof returned === "object" ||
												typeof returned === "function" ) &&
											returned.then;

										// Handle a returned thenable
										if ( jQuery.isFunction( then ) ) {

											// Special processors (notify) just wait for resolution
											if ( special ) {
												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special )
												);

											// Normal processors (resolve) also hook into progress
											} else {

												// ...and disregard older resolution values
												maxDepth++;

												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special ),
													resolve( maxDepth, deferred, Identity,
														deferred.notifyWith )
												);
											}

										// Handle all other returned values
										} else {

											// Only substitute handlers pass on context
											// and multiple values (non-spec behavior)
											if ( handler !== Identity ) {
												that = undefined;
												args = [ returned ];
											}

											// Process the value(s)
											// Default process is resolve
											( special || deferred.resolveWith )( that, args );
										}
									},

									// Only normal processors (resolve) catch and reject exceptions
									process = special ?
										mightThrow :
										function() {
											try {
												mightThrow();
											} catch ( e ) {

												if ( jQuery.Deferred.exceptionHook ) {
													jQuery.Deferred.exceptionHook( e,
														process.stackTrace );
												}

												// Support: Promises/A+ section 2.3.3.3.4.1
												// https://promisesaplus.com/#point-61
												// Ignore post-resolution exceptions
												if ( depth + 1 >= maxDepth ) {

													// Only substitute handlers pass on context
													// and multiple values (non-spec behavior)
													if ( handler !== Thrower ) {
														that = undefined;
														args = [ e ];
													}

													deferred.rejectWith( that, args );
												}
											}
										};

								// Support: Promises/A+ section 2.3.3.3.1
								// https://promisesaplus.com/#point-57
								// Re-resolve promises immediately to dodge false rejection from
								// subsequent errors
								if ( depth ) {
									process();
								} else {

									// Call an optional hook to record the stack, in case of exception
									// since it's otherwise lost when execution goes async
									if ( jQuery.Deferred.getStackHook ) {
										process.stackTrace = jQuery.Deferred.getStackHook();
									}
									window.setTimeout( process );
								}
							};
						}

						return jQuery.Deferred( function( newDefer ) {

							// progress_handlers.add( ... )
							tuples[ 0 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onProgress ) ?
										onProgress :
										Identity,
									newDefer.notifyWith
								)
							);

							// fulfilled_handlers.add( ... )
							tuples[ 1 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onFulfilled ) ?
										onFulfilled :
										Identity
								)
							);

							// rejected_handlers.add( ... )
							tuples[ 2 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onRejected ) ?
										onRejected :
										Thrower
								)
							);
						} ).promise();
					},

					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};

			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 5 ];

				// promise.progress = list.add
				// promise.done = list.add
				// promise.fail = list.add
				promise[ tuple[ 1 ] ] = list.add;

				// Handle state
				if ( stateString ) {
					list.add(
						function() {

							// state = "resolved" (i.e., fulfilled)
							// state = "rejected"
							state = stateString;
						},

						// rejected_callbacks.disable
						// fulfilled_callbacks.disable
						tuples[ 3 - i ][ 2 ].disable,

						// progress_callbacks.lock
						tuples[ 0 ][ 2 ].lock
					);
				}

				// progress_handlers.fire
				// fulfilled_handlers.fire
				// rejected_handlers.fire
				list.add( tuple[ 3 ].fire );

				// deferred.notify = function() { deferred.notifyWith(...) }
				// deferred.resolve = function() { deferred.resolveWith(...) }
				// deferred.reject = function() { deferred.rejectWith(...) }
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
					return this;
				};

				// deferred.notifyWith = list.fireWith
				// deferred.resolveWith = list.fireWith
				// deferred.rejectWith = list.fireWith
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );

			// Make the deferred a promise
			promise.promise( deferred );

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( singleValue ) {
			var

				// count of uncompleted subordinates
				remaining = arguments.length,

				// count of unprocessed arguments
				i = remaining,

				// subordinate fulfillment data
				resolveContexts = Array( i ),
				resolveValues = slice.call( arguments ),

				// the master Deferred
				master = jQuery.Deferred(),

				// subordinate callback factory
				updateFunc = function( i ) {
					return function( value ) {
						resolveContexts[ i ] = this;
						resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( !( --remaining ) ) {
							master.resolveWith( resolveContexts, resolveValues );
						}
					};
				};

			// Single- and empty arguments are adopted like Promise.resolve
			if ( remaining <= 1 ) {
				adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject );

				// Use .then() to unwrap secondary thenables (cf. gh-3000)
				if ( master.state() === "pending" ||
					jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

					return master.then();
				}
			}

			// Multiple arguments are aggregated like Promise.all array elements
			while ( i-- ) {
				adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
			}

			return master.promise();
		}
	} );


	// These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

	jQuery.Deferred.exceptionHook = function( error, stack ) {

		// Support: IE 8 - 9 only
		// Console exists when dev tools are open, which can happen at any time
		if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
			window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
		}
	};




	jQuery.readyException = function( error ) {
		window.setTimeout( function() {
			throw error;
		} );
	};




	// The deferred used on DOM ready
	var readyList = jQuery.Deferred();

	jQuery.fn.ready = function( fn ) {

		readyList
			.then( fn )

			// Wrap jQuery.readyException in a function so that the lookup
			// happens at the time of error handling instead of callback
			// registration.
			.catch( function( error ) {
				jQuery.readyException( error );
			} );

		return this;
	};

	jQuery.extend( {

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},

		// Handle when the DOM is ready
		ready: function( wait ) {

			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
		}
	} );

	jQuery.ready.then = readyList.then;

	// The ready event handler and self cleanup method
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );
		jQuery.ready();
	}

	// Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if ( document.readyState === "complete" ||
		( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

		// Handle it asynchronously to allow scripts the opportunity to delay ready
		window.setTimeout( jQuery.ready );

	} else {

		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", completed );

		// A fallback to window.onload, that will always work
		window.addEventListener( "load", completed );
	}




	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {

				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn(
						elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				len ? fn( elems[ 0 ], key ) : emptyGet;
	};
	var acceptData = function( owner ) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};




	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		cache: function( owner ) {

			// Check if the owner object already has a cache
			var value = owner[ this.expando ];

			// If not, create one
			if ( !value ) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if ( acceptData( owner ) ) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if ( owner.nodeType ) {
						owner[ this.expando ] = value;

					// Otherwise secure it in a non-enumerable property
					// configurable must be true to allow the property to be
					// deleted when data is removed
					} else {
						Object.defineProperty( owner, this.expando, {
							value: value,
							configurable: true
						} );
					}
				}
			}

			return value;
		},
		set: function( owner, data, value ) {
			var prop,
				cache = this.cache( owner );

			// Handle: [ owner, key, value ] args
			// Always use camelCase key (gh-2257)
			if ( typeof data === "string" ) {
				cache[ jQuery.camelCase( data ) ] = value;

			// Handle: [ owner, { properties } ] args
			} else {

				// Copy the properties one-by-one to the cache object
				for ( prop in data ) {
					cache[ jQuery.camelCase( prop ) ] = data[ prop ];
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			return key === undefined ?
				this.cache( owner ) :

				// Always use camelCase key (gh-2257)
				owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
		},
		access: function( owner, key, value ) {

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {

				return this.get( owner, key );
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i,
				cache = owner[ this.expando ];

			if ( cache === undefined ) {
				return;
			}

			if ( key !== undefined ) {

				// Support array or space separated string of keys
				if ( jQuery.isArray( key ) ) {

					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map( jQuery.camelCase );
				} else {
					key = jQuery.camelCase( key );

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ?
						[ key ] :
						( key.match( rnotwhite ) || [] );
				}

				i = key.length;

				while ( i-- ) {
					delete cache[ key[ i ] ];
				}
			}

			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	var dataPriv = new Data();

	var dataUser = new Data();



	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;

	function dataAttr( elem, key, data ) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
			data = elem.getAttribute( name );

			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :

						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test( data ) ? JSON.parse( data ) :
						data;
				} catch ( e ) {}

				// Make sure we set the data so it isn't changed later
				dataUser.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend( {
		hasData: function( elem ) {
			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
		},

		data: function( elem, name, data ) {
			return dataUser.access( elem, name, data );
		},

		removeData: function( elem, name ) {
			dataUser.remove( elem, name );
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return dataPriv.access( elem, name, data );
		},

		_removeData: function( elem, name ) {
			dataPriv.remove( elem, name );
		}
	} );

	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;

			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = dataUser.get( elem );

					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {

							// Support: IE 11 only
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						dataPriv.set( elem, "hasDataAttrs", true );
					}
				}

				return data;
			}

			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					dataUser.set( this, key );
				} );
			}

			return access( this, function( value ) {
				var data;

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {

					// Attempt to get data from the cache
					// The key will always be camelCased in Data
					data = dataUser.get( elem, key );
					if ( data !== undefined ) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, key );
					if ( data !== undefined ) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				this.each( function() {

					// We always store the camelCased key
					dataUser.set( this, key, value );
				} );
			}, null, value, arguments.length > 1, null, true );
		},

		removeData: function( key ) {
			return this.each( function() {
				dataUser.remove( this, key );
			} );
		}
	} );


	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;

			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = dataPriv.get( elem, type );

				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},

		dequeue: function( elem, type ) {
			type = type || "fx";

			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}

			if ( fn ) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}

			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					dataPriv.remove( elem, [ type + "queue", key ] );
				} )
			} );
		}
	} );

	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;

			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}

			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}

			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );

					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );

					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};

			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while ( i-- ) {
				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

	var isHiddenWithinTree = function( elem, el ) {

			// isHiddenWithinTree might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;

			// Inline style trumps all
			return elem.style.display === "none" ||
				elem.style.display === "" &&

				// Otherwise, check computed style
				// Support: Firefox <=43 - 45
				// Disconnected elements can have computed display: none, so first confirm that elem is
				// in the document.
				jQuery.contains( elem.ownerDocument, elem ) &&

				jQuery.css( elem, "display" ) === "none";
		};

	var swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	};




	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function() {
					return tween.cur();
				} :
				function() {
					return jQuery.css( elem, prop, "" );
				},
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

			// Starting value computation is required for potential unit mismatches
			initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );

		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			do {

				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";

				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style( elem, prop, initialInUnit + unit );

			// Update scale, tolerating zero or NaN from tween.cur()
			// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
			);
		}

		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}


	var defaultDisplayMap = {};

	function getDefaultDisplay( elem ) {
		var temp,
			doc = elem.ownerDocument,
			nodeName = elem.nodeName,
			display = defaultDisplayMap[ nodeName ];

		if ( display ) {
			return display;
		}

		temp = doc.body.appendChild( doc.createElement( nodeName ) ),
		display = jQuery.css( temp, "display" );

		temp.parentNode.removeChild( temp );

		if ( display === "none" ) {
			display = "block";
		}
		defaultDisplayMap[ nodeName ] = display;

		return display;
	}

	function showHide( elements, show ) {
		var display, elem,
			values = [],
			index = 0,
			length = elements.length;

		// Determine new display value for elements that need to change
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}

			display = elem.style.display;
			if ( show ) {

				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
				// check is required in this first loop unless we have a nonempty display value (either
				// inline or about-to-be-restored)
				if ( display === "none" ) {
					values[ index ] = dataPriv.get( elem, "display" ) || null;
					if ( !values[ index ] ) {
						elem.style.display = "";
					}
				}
				if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
					values[ index ] = getDefaultDisplay( elem );
				}
			} else {
				if ( display !== "none" ) {
					values[ index ] = "none";

					// Remember what we're overwriting
					dataPriv.set( elem, "display", display );
				}
			}
		}

		// Set the display of the elements in a second loop to avoid constant reflow
		for ( index = 0; index < length; index++ ) {
			if ( values[ index ] != null ) {
				elements[ index ].style.display = values[ index ];
			}
		}

		return elements;
	}

	jQuery.fn.extend( {
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}

			return this.each( function() {
				if ( isHiddenWithinTree( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );
	var rcheckableType = ( /^(?:checkbox|radio)$/i );

	var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

	var rscriptType = ( /^$|\/(?:java|ecma)script/i );



	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {

		// Support: IE <=9 only
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

	// Support: IE <=9 only
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;


	function getAll( context, tag ) {

		// Support: IE <=9 - 11 only
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName( tag || "*" ) :
				typeof context.querySelectorAll !== "undefined" ?
					context.querySelectorAll( tag || "*" ) :
				[];

		return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
			jQuery.merge( [ context ], ret ) :
			ret;
	}


	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			dataPriv.set(
				elems[ i ],
				"globalEval",
				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
			);
		}
	}


	var rhtml = /<|&#?\w+;/;

	function buildFragment( elems, context, scripts, selection, ignored ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {

			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	}


	( function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );

		// Support: Android 4.0 - 4.3 only
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );

		div.appendChild( input );

		// Support: Android <=4.1 only
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

		// Support: IE <=11 only
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	} )();
	var documentElement = document.documentElement;



	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE <=9 only
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}

	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {

			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}

		if ( data == null && fn == null ) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {

				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		global: {},

		add: function( elem, types, handler, data, selector ) {

			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get( elem );

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Ensure that invalid selectors throw exceptions at attach time
			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
			if ( selector ) {
				jQuery.find.matchesSelector( documentElement, selector );
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = {};
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );

				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle );
						}
					}
				}

				if ( special.add ) {
					special.add.call( elem, handleObj );

					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}

		},

		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {

			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}

				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];

					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );

						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

						jQuery.removeEvent( elem, type, elemData.handle );
					}

					delete events[ type ];
				}
			}

			// Remove data and the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				dataPriv.remove( elem, "handle events" );
			}
		},

		dispatch: function( nativeEvent ) {

			// Make a writable jQuery.Event from the native event object
			var event = jQuery.event.fix( nativeEvent );

			var i, j, ret, matched, handleObj, handlerQueue,
				args = new Array( arguments.length ),
				handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;

			for ( i = 1; i < arguments.length; i++ ) {
				args[ i ] = arguments[ i ];
			}

			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;

				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );

						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}

			return event.result;
		},

		handlers: function( event, handlers ) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Support: IE <=9
			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			//
			// Support: Firefox <=42
			// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
			if ( delegateCount && cur.nodeType &&
				( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

				for ( ; cur !== this; cur = cur.parentNode || this ) {

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
						matches = [];
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if ( matches[ sel ] === undefined ) {
								matches[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matches[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push( { elem: cur, handlers: matches } );
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
			}

			return handlerQueue;
		},

		addProp: function( name, hook ) {
			Object.defineProperty( jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,

				get: jQuery.isFunction( hook ) ?
					function() {
						if ( this.originalEvent ) {
								return hook( this.originalEvent );
						}
					} :
					function() {
						if ( this.originalEvent ) {
								return this.originalEvent[ name ];
						}
					},

				set: function( value ) {
					Object.defineProperty( this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					} );
				}
			} );
		},

		fix: function( originalEvent ) {
			return originalEvent[ jQuery.expando ] ?
				originalEvent :
				new jQuery.Event( originalEvent );
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {

				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {

				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},

			beforeunload: {
				postDispatch: function( event ) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	jQuery.removeEvent = function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	};

	jQuery.Event = function( src, props ) {

		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}

		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&

					// Support: Android <=2.3 only
					src.returnValue === false ?
				returnTrue :
				returnFalse;

			// Create target properties
			// Support: Safari <=6 - 7 only
			// Target should not be a text node (#504, #13143)
			this.target = ( src.target && src.target.nodeType === 3 ) ?
				src.target.parentNode :
				src.target;

			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;

		// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,

		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if ( e && !this.isSimulated ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if ( e && !this.isSimulated ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if ( e && !this.isSimulated ) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each( {
		altKey: true,
		bubbles: true,
		cancelable: true,
		changedTouches: true,
		ctrlKey: true,
		detail: true,
		eventPhase: true,
		metaKey: true,
		pageX: true,
		pageY: true,
		shiftKey: true,
		view: true,
		"char": true,
		charCode: true,
		key: true,
		keyCode: true,
		button: true,
		buttons: true,
		clientX: true,
		clientY: true,
		offsetX: true,
		offsetY: true,
		pointerId: true,
		pointerType: true,
		screenX: true,
		screenY: true,
		targetTouches: true,
		toElement: true,
		touches: true,

		which: function( event ) {
			var button = event.button;

			// Add which for key events
			if ( event.which == null && rkeyEvent.test( event.type ) ) {
				return event.charCode != null ? event.charCode : event.keyCode;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
				return ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event.which;
		}
	}, jQuery.event.addProp );

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,

			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );

	jQuery.fn.extend( {

		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {

				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		}
	} );


	var

		/* eslint-disable max-len */

		// See https://github.com/eslint/eslint/issues/3229
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

		/* eslint-enable */

		// Support: IE <=10 - 11, Edge 12 - 13
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,

		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	function manipulationTarget( elem, content ) {
		if ( jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

			return elem.getElementsByTagName( "tbody" )[ 0 ] || elem;
		}

		return elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );

		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute( "type" );
		}

		return elem;
	}

	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if ( dest.nodeType !== 1 ) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if ( dataPriv.hasData( src ) ) {
			pdataOld = dataPriv.access( src );
			pdataCur = dataPriv.set( dest, pdataOld );
			events = pdataOld.events;

			if ( events ) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}

		// 2. Copy user data
		if ( dataUser.hasData( src ) ) {
			udataOld = dataUser.access( src );
			udataCur = jQuery.extend( {}, udataOld );

			dataUser.set( dest, udataCur );
		}
	}

	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;

		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip( collection, args, callback, ignored ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}

		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {

							// Support: Android <=4.0 only, PhantomJS 1 only
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( collection[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!dataPriv.access( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {

							if ( node.src ) {

								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function remove( elem, selector, keepData ) {
		var node,
			nodes = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;

		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}

			if ( node.parentNode ) {
				if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}

		return elem;
	}

	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html.replace( rxhtmlTag, "<$1></$2>" );
		},

		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = jQuery.contains( elem.ownerDocument, elem );

			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {

				// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}

			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );

					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}

			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function( elems ) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;

			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
				if ( acceptData( elem ) ) {
					if ( ( data = elem[ dataPriv.expando ] ) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );

								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataPriv.expando ] = undefined;
					}
					if ( elem[ dataUser.expando ] ) {

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataUser.expando ] = undefined;
					}
				}
			}
		}
	} );

	jQuery.fn.extend( {
		detach: function( selector ) {
			return remove( this, selector, true );
		},

		remove: function( selector ) {
			return remove( this, selector );
		},

		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each( function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					} );
			}, null, value, arguments.length );
		},

		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},

		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},

		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},

		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},

		empty: function() {
			var elem,
				i = 0;

			for ( ; ( elem = this[ i ] ) != null; i++ ) {
				if ( elem.nodeType === 1 ) {

					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},

		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;

				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

					value = jQuery.htmlPrefilter( value );

					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};

							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}

						elem = 0;

					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}

				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},

		replaceWith: function() {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;

				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}

			// Force callback invocation
			}, ignored );
		}
	} );

	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;

			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );

				// Support: Android <=4.0 only, PhantomJS 1 only
				// .get() because push.apply(_, arraylike) throws on ancient WebKit
				push.apply( ret, elems.get() );
			}

			return this.pushStack( ret );
		};
	} );
	var rmargin = ( /^margin/ );

	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

	var getStyles = function( elem ) {

			// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;

			if ( !view || !view.opener ) {
				view = window;
			}

			return view.getComputedStyle( elem );
		};



	( function() {

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {

			// This is a singleton, we need to execute it only once
			if ( !div ) {
				return;
			}

			div.style.cssText =
				"box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild( container );

			var divStyle = window.getComputedStyle( div );
			pixelPositionVal = divStyle.top !== "1%";

			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";

			documentElement.removeChild( container );

			// Nullify the div so it wouldn't be stored in the memory and
			// it will also be a sign that checks already performed
			div = null;
		}

		var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );

		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}

		// Support: IE <=9 - 11 only
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		container.appendChild( div );

		jQuery.extend( support, {
			pixelPosition: function() {
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelMarginRight: function() {
				computeStyleTests();
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function() {
				computeStyleTests();
				return reliableMarginLeftVal;
			}
		} );
	} )();


	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// Support: IE <=9 only
		// getPropertyValue is only needed for .css('filter') (#12537)
		if ( computed ) {
			ret = computed.getPropertyValue( name ) || computed[ name ];

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// https://drafts.csswg.org/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?

			// Support: IE <=9 - 11 only
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}


	function addGetHookIf( conditionFn, hookFn ) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}


	var

		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},

		cssPrefixes = [ "Webkit", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style;

	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {

		// Shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}

		// Check for vendor prefixed names
		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;

		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}

	function setPositiveNumber( elem, value, subtract ) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec( value );
		return matches ?

			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
			value;
	}

	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i = extra === ( isBorderBox ? "border" : "content" ) ?

			// If we already have the right measurement, avoid augmentation
			4 :

			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,

			val = 0;

		for ( ; i < 4; i += 2 ) {

			// Both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}

			if ( isBorderBox ) {

				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}

				// At this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {

				// At this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

				// At this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}

		return val;
	}

	function getWidthOrHeight( elem, name, extra ) {

		// Start with offset property, which is equivalent to the border-box value
		var val,
			valueIsBorderBox = true,
			styles = getStyles( elem ),
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Support: IE <=11 only
		// Running getBoundingClientRect on a disconnected node
		// in IE throws an error.
		if ( elem.getClientRects().length ) {
			val = elem.getBoundingClientRect()[ name ];
		}

		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {

			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}

			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test( val ) ) {
				return val;
			}

			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );

			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}

		// Use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}

	jQuery.extend( {

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {

						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},

		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {

			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;

			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;

				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				if ( type === "number" ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}

				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {

					style[ name ] = value;
				}

			} else {

				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},

		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = jQuery.camelCase( name );

			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}

			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}

			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
			return val;
		}
	} );

	jQuery.each( [ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

						// Support: Safari 8+
						// Table columns in Safari have non-zero offsetWidth & zero
						// getBoundingClientRect().width unless display is changed.
						// Support: IE <=11 only
						// Running getBoundingClientRect on a disconnected node
						// in IE throws an error.
						( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
							swap( elem, cssShow, function() {
								return getWidthOrHeight( elem, name, extra );
							} ) :
							getWidthOrHeight( elem, name, extra );
				}
			},

			set: function( elem, value, extra ) {
				var matches,
					styles = extra && getStyles( elem ),
					subtract = extra && augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					);

				// Convert to pixels if value adjustment is needed
				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
					( matches[ 3 ] || "px" ) !== "px" ) {

					elem.style[ name ] = value;
					value = jQuery.css( elem, name );
				}

				return setPositiveNumber( elem, value, subtract );
			}
		};
	} );

	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} )
					) + "px";
			}
		}
	);

	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},

					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];

				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}

				return expanded;
			}
		};

		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );

	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;

				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;

					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}

					return map;
				}

				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		}
	} );


	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];

			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];

			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;

			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}

			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {

				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 &&
					( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
						jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};

	// Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back compat <1.8 extension point
	jQuery.fx.step = {};




	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;

	function raf() {
		if ( timerId ) {
			window.requestAnimationFrame( raf );
			jQuery.fx.tick();
		}
	}

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = jQuery.now() );
	}

	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}

		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter( elem, props, opts ) {
		var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
			isBox = "width" in props || "height" in props,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHiddenWithinTree( elem ),
			dataShow = dataPriv.get( elem, "fxshow" );

		// Queue-skipping animations hijack the fx hooks
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always( function() {

				// Ensure the complete handler is called before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}

		// Detect show/hide animations
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.test( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {

					// Pretend to be hidden if this is a "show" and
					// there is still data from a stopped show/hide
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;

					// Ignore all other no-op show/hide data
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
			}
		}

		// Bail out if this is a no-op like .hide().hide()
		propTween = !jQuery.isEmptyObject( props );
		if ( !propTween && jQuery.isEmptyObject( orig ) ) {
			return;
		}

		// Restrict "overflow" and "display" styles during box animations
		if ( isBox && elem.nodeType === 1 ) {

			// Support: IE <=9 - 11, Edge 12 - 13
			// Record all 3 overflow attributes because IE does not infer the shorthand
			// from identically-valued overflowX and overflowY
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

			// Identify a display type, preferring old show/hide data over the CSS cascade
			restoreDisplay = dataShow && dataShow.display;
			if ( restoreDisplay == null ) {
				restoreDisplay = dataPriv.get( elem, "display" );
			}
			display = jQuery.css( elem, "display" );
			if ( display === "none" ) {
				if ( restoreDisplay ) {
					display = restoreDisplay;
				} else {

					// Get nonempty value(s) by temporarily forcing visibility
					showHide( [ elem ], true );
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css( elem, "display" );
					showHide( [ elem ] );
				}
			}

			// Animate inline elements as inline-block
			if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
				if ( jQuery.css( elem, "float" ) === "none" ) {

					// Restore the original display value at the end of pure show/hide animations
					if ( !propTween ) {
						anim.done( function() {
							style.display = restoreDisplay;
						} );
						if ( restoreDisplay == null ) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}
					style.display = "inline-block";
				}
			}
		}

		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}

		// Implement show/hide animations
		propTween = false;
		for ( prop in orig ) {

			// General show/hide setup for this element animation
			if ( !propTween ) {
				if ( dataShow ) {
					if ( "hidden" in dataShow ) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
				}

				// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
				if ( toggle ) {
					dataShow.hidden = !hidden;
				}

				// Show elements before animating them
				if ( hidden ) {
					showHide( [ elem ], true );
				}

				/* eslint-disable no-loop-func */

				anim.done( function() {

				/* eslint-enable no-loop-func */

					// The final step of a "hide" animation is actually hiding the element
					if ( !hidden ) {
						showHide( [ elem ] );
					}
					dataPriv.remove( elem, "fxshow" );
					for ( prop in orig ) {
						jQuery.style( elem, prop, orig[ prop ] );
					}
				} );
			}

			// Per-property setup
			propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = propTween.start;
				if ( hidden ) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}

	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}

			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}

			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}

	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {

				// Don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

					// Support: Android 2.3 only
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( percent );
				}

				deferred.notifyWith( elem, [ animation, percent, remaining ] );

				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,

						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length; index++ ) {
						animation.tweens[ index ].run( 1 );
					}

					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;

		propFilter( props, animation.opts.specialEasing );

		for ( ; index < length; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( jQuery.isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						jQuery.proxy( result.stop, result );
				}
				return result;
			}
		}

		jQuery.map( props, createTween, animation );

		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}

		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);

		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}

	jQuery.Animation = jQuery.extend( Animation, {

		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},

		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnotwhite );
			}

			var prop,
				index = 0,
				length = props.length;

			for ( ; index < length; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},

		prefilters: [ defaultPrefilter ],

		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );

	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		// Go to the end state if fx are off or if document is hidden
		if ( jQuery.fx.off || document.hidden ) {
			opt.duration = 0;

		} else {
			opt.duration = typeof opt.duration === "number" ?
				opt.duration : opt.duration in jQuery.fx.speeds ?
					jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;
		}

		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};

		return opt;
	};

	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {

			// Show any hidden elements after setting opacity to 0
			return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

				// Animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {

					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );

					// Empty animations, or finishing resolves immediately
					if ( empty || dataPriv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;

			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};

			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}

			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get( this );

				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}

				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {

						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = dataPriv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue( this, type, [] );

				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}

				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}

				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}

				// Turn off finishing flag
				delete data.finish;
			} );
		}
	} );

	jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );

	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );

	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;

		fxNow = jQuery.now();

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];

			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = window.requestAnimationFrame ?
				window.requestAnimationFrame( raf ) :
				window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};

	jQuery.fx.stop = function() {
		if ( window.cancelAnimationFrame ) {
			window.cancelAnimationFrame( timerId );
		} else {
			window.clearInterval( timerId );
		}

		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};


	// Based off of the plugin by Clint Helfers, with permission.
	// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};


	( function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );

		input.type = "checkbox";

		// Support: Android <=4.3 only
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE <=11 only
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: IE <=11 only
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	} )();


	var boolHook,
		attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},

		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );

	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}

			// Attribute hooks are determined by the lowercase version
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
			}

			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}

				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				elem.setAttribute( name, value + "" );
				return value;
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		removeAttr: function( elem, value ) {
			var name,
				i = 0,
				attrNames = value && value.match( rnotwhite );

			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					elem.removeAttribute( name );
				}
			}
		}
	} );

	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};

	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;

		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle,
				lowercaseName = name.toLowerCase();

			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ lowercaseName ];
				attrHandle[ lowercaseName ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					lowercaseName :
					null;
				attrHandle[ lowercaseName ] = handle;
			}
			return ret;
		};
	} );




	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},

		removeProp: function( name ) {
			return this.each( function() {
				delete this[ jQuery.propFix[ name ] || name ];
			} );
		}
	} );

	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}

			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				return ( elem[ name ] = value );
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			return elem[ name ];
		},

		propHooks: {
			tabIndex: {
				get: function( elem ) {

					// Support: IE <=9 - 11 only
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );

					return tabindex ?
						parseInt( tabindex, 10 ) :
						rfocusable.test( elem.nodeName ) ||
							rclickable.test( elem.nodeName ) && elem.href ?
								0 :
								-1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );

	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function( elem ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;

					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );




	var rclass = /[\t\r\n\f]/g;

	function getClass( elem ) {
		return elem.getAttribute && elem.getAttribute( "class" ) || "";
	}

	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];

				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}

			if ( typeof value === "string" && value ) {
				classes = value.match( rnotwhite ) || [];

				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 &&
						( " " + curValue + " " ).replace( rclass, " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {

							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		toggleClass: function( value, stateVal ) {
			var type = typeof value;

			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}

			return this.each( function() {
				var className, i, self, classNames;

				if ( type === "string" ) {

					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = value.match( rnotwhite ) || [];

					while ( ( className = classNames[ i++ ] ) ) {

						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}

				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {

						// Store className if set
						dataPriv.set( this, "__className__", className );
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if ( this.setAttribute ) {
						this.setAttribute( "class",
							className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
						);
					}
				}
			} );
		},

		hasClass: function( selector ) {
			var className, elem,
				i = 0;

			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + getClass( elem ) + " " ).replace( rclass, " " )
						.indexOf( className ) > -1
				) {
					return true;
				}
			}

			return false;
		}
	} );




	var rreturn = /\r/g,
		rspaces = /[\x20\t\r\n\f]+/g;

	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[ 0 ];

			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];

					if ( hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ?

						// Handle most common string cases
						ret.replace( rreturn, "" ) :

						// Handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction( value );

			return this.each( function( i ) {
				var val;

				if ( this.nodeType !== 1 ) {
					return;
				}

				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";

				} else if ( typeof val === "number" ) {
					val += "";

				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}

				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );

	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {

					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :

						// Support: IE <=10 - 11 only
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						jQuery.trim( jQuery.text( elem ) ).replace( rspaces, " " );
				}
			},
			select: {
				get: function( elem ) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one",
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
							max :
							one ? index : 0;

					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];

						// Support: IE <=9 only
						// IE8-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&

								// Don't return options that are disabled or in a disabled optgroup
								!option.disabled &&
								( !option.parentNode.disabled ||
									!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

							// Get the specific value for the option
							value = jQuery( option ).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				},

				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;

					while ( i-- ) {
						option = options[ i ];

						/* eslint-disable no-cond-assign */

						if ( option.selected =
							jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
						) {
							optionSet = true;
						}

						/* eslint-enable no-cond-assign */
					}

					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	} );

	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );




	// Return jQuery for attributes-only inclusion


	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

	jQuery.extend( jQuery.event, {

		trigger: function( event, data, elem, onlyHandlers ) {

			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}

			if ( type.indexOf( "." ) > -1 ) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );

			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// jQuery handler
				handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
					dataPriv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}

				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {

				if ( ( !special._default ||
					special._default.apply( eventPath.pop(), data ) === false ) &&
					acceptData( elem ) ) {

					// Call a native DOM method on the target with the same name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];

						if ( tmp ) {
							elem[ ontype ] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;

						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
				}
			);

			jQuery.event.trigger( e, null, elem );
		}

	} );

	jQuery.fn.extend( {

		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );


	jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup contextmenu" ).split( " " ),
		function( i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );

	jQuery.fn.extend( {
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );




	support.focusin = "onfocusin" in window;


	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};

			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix );

					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix ) - 1;

					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						dataPriv.remove( doc, fix );

					} else {
						dataPriv.access( doc, fix, attaches );
					}
				}
			};
		} );
	}
	var location = window.location;

	var nonce = jQuery.now();

	var rquery = ( /\?/ );



	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE 9 - 11 only
		// IE throws on parseFromString with invalid input.
		try {
			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};


	var
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams( prefix, obj, traditional, add ) {
		var name;

		if ( jQuery.isArray( obj ) ) {

			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {

					// Treat each array item as a scalar.
					add( prefix, v );

				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );

		} else if ( !traditional && jQuery.type( obj ) === "object" ) {

			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}

		} else {

			// Serialize scalar item.
			add( prefix, obj );
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, valueOrFunction ) {

				// If value is a function, invoke it and use its return value
				var value = jQuery.isFunction( valueOrFunction ) ?
					valueOrFunction() :
					valueOrFunction;

				s[ s.length ] = encodeURIComponent( key ) + "=" +
					encodeURIComponent( value == null ? "" : value );
			};

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );

		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" );
	};

	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} )
			.filter( function() {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} )
			.map( function( i, elem ) {
				var val = jQuery( this ).val();

				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val ) {
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						} ) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );


	var
		r20 = /%20/g,
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),

		// Anchor tag for parsing the document origin
		originAnchor = document.createElement( "a" );
		originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {

		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {

			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

			if ( jQuery.isFunction( func ) ) {

				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {

					// Prepend if requested
					if ( dataType[ 0 ] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

		var inspected = {},
			seekingTransport = ( structure === transports );

		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}

		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}

		return target;
	}

	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {

		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}

		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {

			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}

	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},

			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while ( current ) {

			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}

			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}

			prev = current;
			current = dataTypes.shift();

			if ( current ) {

				// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {

					current = prev;

				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {

					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];

					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {

							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {

								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {

									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];

									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if ( conv !== true ) {

						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s.throws ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend( {

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test( location.protocol ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",

			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": JSON.parse,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?

				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},

		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),

		// Main method
		ajax: function( url, options ) {

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,

				// URL without anti-cache param
				cacheURL,

				// Response headers
				responseHeadersString,
				responseHeaders,

				// timeout handle
				timeoutTimer,

				// Url cleanup var
				urlAnchor,

				// Request state (becomes false upon send and true upon completion)
				completed,

				// To know if global events are to be dispatched
				fireGlobals,

				// Loop variable
				i,

				// uncached part of the url
				uncached,

				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),

				// Callbacks context
				callbackContext = s.context || s,

				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) :
						jQuery.event,

				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),

				// Status-dependent callbacks
				statusCode = s.statusCode || {},

				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},

				// Default abort message
				strAbort = "canceled",

				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( completed ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},

					// Raw string
					getAllResponseHeaders: function() {
						return completed ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function( name, value ) {
						if ( completed == null ) {
							name = requestHeadersNames[ name.toLowerCase() ] =
								requestHeadersNames[ name.toLowerCase() ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( completed == null ) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( completed ) {

								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							} else {

								// Lazy-add the new callbacks in a way that preserves old ones
								for ( code in map ) {
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							}
						}
						return this;
					},

					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};

			// Attach deferreds
			deferred.promise( jqXHR );

			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || location.href ) + "" )
				.replace( rprotocol, location.protocol + "//" );

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if ( s.crossDomain == null ) {
				urlAnchor = document.createElement( "a" );

				// Support: IE <=8 - 11, Edge 12 - 13
				// IE throws exception on accessing the href property if url is malformed,
				// e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE <=8 - 11 only
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch ( e ) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}

			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

			// If request was aborted inside a prefilter, stop there
			if ( completed ) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			// Remove hash to simplify url manipulation
			cacheURL = s.url.replace( rhash, "" );

			// More options handling for requests with no content
			if ( !s.hasContent ) {

				// Remember the hash so we can put it back
				uncached = s.url.slice( cacheURL.length );

				// If data is available, append data to url
				if ( s.data ) {
					cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add anti-cache in uncached url if needed
				if ( s.cache === false ) {
					cacheURL = cacheURL.replace( rts, "" );
					uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
				}

				// Put hash and anti-cache on the URL that will be requested (gh-1732)
				s.url = cacheURL + uncached;

			// Change '%20' to '+' if this is encoded form body content (gh-2658)
			} else if ( s.data && s.processData &&
				( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
				s.data = s.data.replace( r20, "+" );
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}

			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);

			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}

			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			completeDeferred.add( s.complete );
			jqXHR.done( s.success );
			jqXHR.fail( s.error );

			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}

				// If request was aborted inside ajaxSend, stop there
				if ( completed ) {
					return jqXHR;
				}

				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}

				try {
					completed = false;
					transport.send( requestHeaders, done );
				} catch ( e ) {

					// Rethrow post-completion exceptions
					if ( completed ) {
						throw e;
					}

					// Propagate others as results
					done( -1, e );
				}
			}

			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Ignore repeat invocations
				if ( completed ) {
					return;
				}

				completed = true;

				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );

				// If successful, handle type chaining
				if ( isSuccess ) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}

					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";

					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";

					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";

				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}

				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;

				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}

				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}

			return jqXHR;
		},

		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},

		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );

	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {

			// Shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );


	jQuery._evalUrl = function( url ) {
		return jQuery.ajax( {
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			"throws": true
		} );
	};


	jQuery.fn.extend( {
		wrapAll: function( html ) {
			var wrap;

			if ( this[ 0 ] ) {
				if ( jQuery.isFunction( html ) ) {
					html = html.call( this[ 0 ] );
				}

				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}

				wrap.map( function() {
					var elem = this;

					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}

					return elem;
				} ).append( this );
			}

			return this;
		},

		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}

			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();

				if ( contents.length ) {
					contents.wrapAll( html );

				} else {
					self.append( html );
				}
			} );
		},

		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );

			return this.each( function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
			} );
		},

		unwrap: function( selector ) {
			this.parent( selector ).not( "body" ).each( function() {
				jQuery( this ).replaceWith( this.childNodes );
			} );
			return this;
		}
	} );


	jQuery.expr.pseudos.hidden = function( elem ) {
		return !jQuery.expr.pseudos.visible( elem );
	};
	jQuery.expr.pseudos.visible = function( elem ) {
		return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
	};




	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	};

	var xhrSuccessStatus = {

			// File protocol always yields status code 0, assume 200
			0: 200,

			// Support: IE <=9 only
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();

	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport( function( options ) {
		var callback, errorCallback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr();

					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}

					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {

									// Support: IE <=9 only
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if ( typeof xhr.status !== "number" ) {
										complete( 0, "error" );
									} else {
										complete(

											// File: protocol always yields status 0; see #8605, #14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,

										// Support: IE <=9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										( xhr.responseType || "text" ) !== "text"  ||
										typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};

					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = callback( "error" );

					// Support: IE 9 only
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if ( xhr.onabort !== undefined ) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {

							// Check readyState before timeout as it changes
							if ( xhr.readyState === 4 ) {

								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout( function() {
									if ( callback ) {
										errorCallback();
									}
								} );
							}
						};
					}

					// Create the abort callback
					callback = callback( "abort" );

					try {

						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {

						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},

				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter( function( s ) {
		if ( s.crossDomain ) {
			s.contents.script = false;
		}
	} );

	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	} );

	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {

		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery( "<script>" ).prop( {
						charset: s.scriptCharset,
						src: s.url
					} ).on(
						"load error",
						callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						}
					);

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;

			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};

			// Force json dataType
			s.dataTypes[ 0 ] = "json";

			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always( function() {

				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );

				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}

				// Save back as free
				if ( s[ callbackName ] ) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push( callbackName );
				}

				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}

				responseContainer = overwritten = undefined;
			} );

			// Delegate to script
			return "script";
		}
	} );




	// Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = ( function() {
		var body = document.implementation.createHTMLDocument( "" ).body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	} )();


	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( typeof data !== "string" ) {
			return [];
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}

		var base, parsed, scripts;

		if ( !context ) {

			// Stop scripts or inline event handlers from being executed immediately
			// by using document.implementation
			if ( support.createHTMLDocument ) {
				context = document.implementation.createHTMLDocument( "" );

				// Set the base href for the created document
				// so any parsed elements with URLs
				// are based on the document's URL (gh-2965)
				base = context.createElement( "base" );
				base.href = document.location.href;
				context.head.appendChild( base );
			} else {
				context = document;
			}
		}

		parsed = rsingleTag.exec( data );
		scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}

		parsed = buildFragment( [ data ], context, scripts );

		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	};


	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		var selector, type, response,
			self = this,
			off = url.indexOf( " " );

		if ( off > -1 ) {
			selector = jQuery.trim( url.slice( off ) );
			url = url.slice( 0, off );
		}

		// If it's a function
		if ( jQuery.isFunction( params ) ) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {

				// Save response for use in complete callback
				response = arguments;

				self.html( selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

					// Otherwise use the full result
					responseText );

			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}

		return this;
	};




	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );




	jQuery.expr.pseudos.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};




	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}

	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};

			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;

			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}

			if ( jQuery.isFunction( options ) ) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}

			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}

			if ( "using" in options ) {
				options.using.call( elem, props );

			} else {
				curElem.css( props );
			}
		}
	};

	jQuery.fn.extend( {
		offset: function( options ) {

			// Preserve chaining for setter
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}

			var docElem, win, rect, doc,
				elem = this[ 0 ];

			if ( !elem ) {
				return;
			}

			// Support: IE <=11 only
			// Running getBoundingClientRect on a
			// disconnected node in IE throws an error
			if ( !elem.getClientRects().length ) {
				return { top: 0, left: 0 };
			}

			rect = elem.getBoundingClientRect();

			// Make sure element is not hidden (display: none)
			if ( rect.width || rect.height ) {
				doc = elem.ownerDocument;
				win = getWindow( doc );
				docElem = doc.documentElement;

				return {
					top: rect.top + win.pageYOffset - docElem.clientTop,
					left: rect.left + win.pageXOffset - docElem.clientLeft
				};
			}

			// Return zeros for disconnected and hidden elements (gh-2310)
			return rect;
		},

		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}

			var offsetParent, offset,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {

				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();

			} else {

				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset = {
					top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
					left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
				};
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;

				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			} );
		}
	} );

	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;

		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );

				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}

				if ( win ) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);

				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length );
		};
	} );

	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );

					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );


	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
			function( defaultExtra, funcName ) {

			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

				return access( this, function( elem, type, value ) {
					var doc;

					if ( jQuery.isWindow( elem ) ) {

						// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
						return funcName.indexOf( "outer" ) === 0 ?
							elem[ "inner" + name ] :
							elem.document.documentElement[ "client" + name ];
					}

					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}

					return value === undefined ?

						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :

						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable );
			};
		} );
	} );


	jQuery.fn.extend( {

		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		}
	} );

	jQuery.parseJSON = JSON.parse;




	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}





	var

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( !noGlobal ) {
		window.jQuery = window.$ = jQuery;
	}


	return jQuery;
	} );


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);

	$.fn.broadcast = function(key, args){
		if( args === undefined ){
			args = [];
		}
		return this.map(function(){
			var e = $(this);
			return e.find("." + key).map(function(){
				var listener = $(this);
				var cb = listener.data(key);
				if( typeof cb === "function" ){
					return cb.apply(listener, args);
				} else {
					throw new Error("cannot find function while broadcasting: " + key);
				}
			}).get();
		}).get();
	};

	$.fn.listen = function(key, cb){
		this.each(function(){
			var e = $(this);
			e.addClass(key);
			if( e.data(key) ){
				console.warn("There is already a listener.", e);
			}
			e.data(key, cb);
		});
		return this;
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);

	function makeToken(key){
		return "jquery-inquire-" + key;
	}

	$.fn.reply = function(key, fn){
		var e = this;
		var t = makeToken(key);
		e.addClass(t);
		e.data(t, fn);
		return this;
	};

	$.fn.inquire = function(key, args){
		var t = makeToken(key);
		var fn = this.closest("." + t).data(t);
		return fn.apply(undefined, args);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	(function(exports){

	function iterExec(i, funs, done){
		if( i >= funs.length ){
			done();
			return;
		}
		var f = funs[i];
		f(function(err){
			if( err ){
				done(err);
				return;
			}
			iterExec(i+1, funs, done);
		})
	}

	exports.exec = function(funs, done){
		funs = funs.slice();
		iterExec(0, funs, done);
	};

	exports.execPara = function(funs, done){
		if( funs.length === 0 ){
			done();
			return;
		}
		funs = funs.slice();
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
	}

	function iterForEach(i, arr, fn, done){
		if( i >= arr.length ){
			done();
			return;
		}
		fn(arr[i], function(err){
			if( err ){
				done(err);
				return;
			}
			iterForEach(i+1, arr, fn, done);
		})
	}

	exports.forEach = function(arr, fn, done){
		arr = arr.slice();
		iterForEach(0, arr, fn, done);
	};

	exports.forEachPara = function(arr, fn, done){
		if( arr.length === 0 ){
			done();
			return;
		}
		arr = arr.slice();
		var n = arr.length;
		var no_more = false;
		arr.forEach(function(ele){
			if( no_more ){
				return;
			}
			fn(ele, function(err){
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
		});
	};

	function Queue(){
		this.queue = [];
	}

	Queue.prototype.push = function(fn, cb){
		this.queue.push({
			fn: fn,
			cb: cb
		});
		if( this.queue.length === 1 ){
			this.run();
		}
	}

	Queue.prototype.run = function(){
		if( this.queue.length === 0 ){
			return;
		}
		var entry = this.queue[0];
		var fn = entry.fn;
		var cb = entry.cb;
		var self = this;
		fn(function(){
			var args = [].slice.call(arguments);
			cb.apply(undefined, args);
			if( self.queue.length > 0 && self.queue[0] === entry ){
				self.queue.shift();
				self.run();
			}
		})
	}

	var theQueue = new Queue();

	exports.enqueue = function(fn, cb){
		theQueue.push(fn, cb);
	};

	exports.mapPara = function(arr, fn, cb){
		var index = 0;
		var dataArr = arr.map(function(value){
			return {
				index: index++,
				value: value
			}
		});
		var retArr = [];
		exports.forEachPara(dataArr, function(data, done){
			var value = fn(data.value, function(err, result){
				if( err ){
					done(err);
					return;
				}
				retArr[data.index] = result;
				done();
			});
		}, function(err){
			if( err ){
				cb(err);
				return;
			}
			cb(undefined, retArr);
		})
	};

	exports.fetch = function(url, opt, op, cb){
		fetch(url, opt)
		.then(function(response){
			if( response.ok ){
				response[op]()
				.then(function(result){
					cb(undefined, result);
				})
				.catch(function(err){
					cb(err.message);
				})
			} else { 
				response.text()
				.then(function(text){
					cb(text);
				})
				.catch(function(err){
					cb(err.message);
				})
			}
		})
		.catch(function(err){
			cb(err.message);
		})
	}

	exports.fetchJson = function (url, opt, cb){
		exports.fetch(url, opt, "json", cb);
	}

	exports.fetchText = function (url, opt, cb){
		exports.fetch(url, opt, "text", cb);
	}

	})( true ? exports : (window.conti = {}));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var moment = __webpack_require__(6);
	var mConsts = __webpack_require__(8);

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

	exports.formatNumber = function(num){
		return Number(num).toLocaleString();
	};

	exports.toSqlDate = function(m){
		m = moment(m);
		return m.format("YYYY-MM-DD");
	}

	exports.todayAsSqldate = function(){
		return exports.toSqlDate(moment());
	};

	exports.toSqlDatetime = function(m){
		m = moment(m);
		return m.format("YYYY-MM-DD HH:mm:ss");
	};

	exports.nowAsSqlDatetime = function(m){
		return exports.toSqlDatetime(moment());
	}

	function assign2(dst, src){
		if( src === null || src === undefined ){
			return dst;
		}
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

	exports.hokenRep = function(visit){
		var terms = [];
		if( visit.shahokokuho ){
			var shahokokuho = visit.shahokokuho;
			terms.push(exports.shahokokuhoRep(shahokokuho.hokensha_bangou));
			if( shahokokuho.kourei > 0 ){
				terms.push("高齢" + shahokokuho.kourei + "割");
			}
		} else if( visit.shahokokuho_id != 0 ){
			terms.push("orphan shahokokuho_id (" + visit.shahokokuho_id + ")");
		}
		if( visit.koukikourei ){
			var koukikourei = visit.koukikourei;
			terms.push(exports.koukikoureiRep(koukikourei.futan_wari));
		} else if( visit.koukikourei_id != 0 ){
			terms.push("orphan koukikourei_id (" + visit.koukikourei_id + ")");
		}
		if( visit.roujin ){
			var roujin = visit.roujin;
			terms.push(exports.roujinRep(roujin.futan_wari));
		} else if( visit.roujin_id != 0 ){
			terms.push("orphan roujin_id (" + visit.roujin_id + ")");
		}
		visit.kouhi_list.forEach(function(kouhi){
			terms.push(exports.kouhiRep(kouhi.futansha));
		});
		return terms.length > 0 ? terms.join("・") : "保険なし";
	}

	exports.shahokokuhoRep = function(hokenshaBangou){
		var bangou = parseInt(hokenshaBangou, 10);
		if( bangou <= 9999 )
			return "政管健保";
		if( bangou <= 999999 )
			return "国保";
		switch(Math.floor(bangou/1000000)){
			case 1: return "協会けんぽ";
			case 2: return "船員";
			case 3: return "日雇一般";
			case 4: return "日雇特別";
			case 6: return "組合健保";
			case 7: return "自衛官";
			case 31: return "国家公務員共済";
			case 32: return "地方公務員共済";
			case 33: return "警察公務員共済";
			case 34: return "学校共済";
			case 63: return "特定健保退職";
			case 67: return "国保退職";
			case 72: return "国家公務員共済退職";
			case 73: return "地方公務員共済退職";
			case 74: return "警察公務員共済退職";
			case 75: return "学校共済退職";
			default: return "不明";
		}
	}

	exports.koukikoureiRep = function(futan_wari){
		return "後期高齢" + futan_wari + "割"
	}

	exports.roujinRep = function(futan_wari){
		return "老人" + futan_wari + "割";
	}

	exports.kouhiRep = function(futansha_bangou){
		futansha_bangou = parseInt(futansha_bangou, 10);
		if (Math.floor(futansha_bangou / 1000000)  == 41)
			return "マル福";
		else if (Math.floor(futansha_bangou / 1000) == 80136)
			return "マル障（１割負担）";
		else if (Math.floor(futansha_bangou / 1000) == 80137)
			return "マル障（負担なし）";
		else if (Math.floor(futansha_bangou / 1000) == 81136)
			return "マル親（１割負担）";
		else if (Math.floor(futansha_bangou / 1000) == 81137)
			return "マル親（負担なし）";
		else if (Math.floor(futansha_bangou / 1000000) == 88)
			return "マル乳";
		else
			return "公費負担";
	}

	exports.drugRep = function(drug){
		var category = parseInt(drug.d_category, 10);
		switch(category){
			case mConsts.DrugCategoryNaifuku:
				return drug.name + " " + drug.d_amount + drug.unit + " " + drug.d_usage + 
					" " + drug.d_days + "日分";
			case mConsts.DrugCategoryTonpuku:
				return drug.name + " １回 " + drug.d_amount + drug.unit + " " + drug.d_usage +
					" " + drug.d_days + "回分";
			case mConsts.DrugCategoryGaiyou:
				return drug.name + " " + drug.d_amount + drug.unit + " " + drug.d_usage;
			default:
				return drug.name + " " + drug.d_amount + drug.unit;
		}
	};

	exports.conductDrugRep = function(drug){
	  return drug.name + " " + drug.amount + drug.unit;
	};

	exports.conductKindToKanji = function(kind) {
	    kind = parseInt(kind, 10);
	    switch (kind) {
	        case mConsts.ConductKindHikaChuusha:
	            return "皮下・筋肉注射";
	        case mConsts.ConductKindJoumyakuChuusha:
	            return "静脈注射";
	        case mConsts.ConductKindOtherChuusha:
	            return "その他注射";
	        case mConsts.ConductKindGazou:
	            return "画像";
	        default:
	            return "不明";
	    }
	};

	exports.conductKizaiRep = function(kizai){
		return kizai.name + " " + kizai.amount + kizai.unit;
	};

	exports.diseaseFullName = function(disease) {
	    var name = (disease ? disease.name : ""), pre = "", post = "";
	    disease.adj_list.forEach(function (a) {
	        if (mConsts.SmallestPostfixShuushokugoCode > a.shuushokugocode) {
	            pre += a.name;
	        } else {
	            post += a.name;
	        }
	    });
	    return pre + name + post;
	};

	exports.diseaseEndReasonToKanji = function(reason){
		switch(reason){
			case mConsts.DiseaseEndReasonNotEnded: return "継続";
			case mConsts.DiseaseEndReasonCured: return "治癒";
			case mConsts.DiseaseEndReasonStopped: return "中止";
			case mConsts.DiseaseEndReasonDead: return "死亡";
			default: return "不明";
		}
	}

	exports.wqueueStateToKanji = function(wqState) {
	    var state = wqState - 0;
	    if (state == mConsts.WqueueStateWaitExam) return "診待";
	    if (state == mConsts.WqueueStateInExam) return "診中";
	    if (state == mConsts.WqueueStateWaitCashier) return "会待";
	    if (state == mConsts.WqueueStateWaitDrug) return "薬待";
	    if (state == mConsts.WqueueStateWaitReExam) return "再待";
	    if (state == mConsts.WqueueStateWaitAppointedExam) return "予待";
	    if (state == mConsts.WqueueStateWaitReAppointedExam) return "予再";
	    return "不明";
	};

	exports.wqueueStateToName = function(wqState){
	    var state = wqState - 0;
	    if (state == mConsts.WqueueStateWaitExam) return "waitExam";
	    if (state == mConsts.WqueueStateInExam) return "inExam";
	    if (state == mConsts.WqueueStateWaitCashier) return "waitCashier";
	    if (state == mConsts.WqueueStateWaitDrug) return "waitDrug";
	    if (state == mConsts.WqueueStateWaitReExam) return "waitReExam";
	    if (state == mConsts.WqueueStateWaitAppointedExam) return "waitAppointedExam";
	    if (state == mConsts.WqueueStateWaitReAppointedExam) return "waitReAppointedExam";
	    return "unknown";
	};

	exports.meisaiSections = [
	    "初・再診料", "医学管理等", "在宅医療", "検査", "画像診断",
	    "投薬", "注射", "処置", "その他"       
	];

	exports.shuukeiToMeisaiSection = function(shuukeisaki){
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

	exports.touyakuKingakuToTen = function(kingaku){
	    if( kingaku <= 15 ){
	        return 1;
	    } else {
	        return Math.ceil((kingaku - 15)/10 + 1);
	    }
	};

	exports.shochiKingakuToTen = function(kingaku){
			if( kingaku <= 15 )
				return 0;
			else
				return Math.ceil((kingaku - 15)/10 + 1);
	};

	exports.kizaiKingakuToTen = function(kingaku){
	    return Math.round(kingaku/10.0);
	}

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

	exports.calcShahokokuhoFutanWariByAge = function(age){
	    if( age < 3 )
	        return 2;
	    else if( age >= 70 )
	        return 2;
	    else
	        return 3;
	};

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



/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {//! moment.js
	//! version : 2.15.0
	//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
	//! license : MIT
	//! momentjs.com

	;(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    global.moment = factory()
	}(this, function () { 'use strict';

	    var hookCallback;

	    function utils_hooks__hooks () {
	        return hookCallback.apply(null, arguments);
	    }

	    // This is done to register the method called with moment()
	    // without creating circular dependencies.
	    function setHookCallback (callback) {
	        hookCallback = callback;
	    }

	    function isArray(input) {
	        return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
	    }

	    function isObject(input) {
	        // IE8 will treat undefined and null as object if it wasn't for
	        // input != null
	        return input != null && Object.prototype.toString.call(input) === '[object Object]';
	    }

	    function isObjectEmpty(obj) {
	        var k;
	        for (k in obj) {
	            // even if its not own property I'd still call it non-empty
	            return false;
	        }
	        return true;
	    }

	    function isDate(input) {
	        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
	    }

	    function map(arr, fn) {
	        var res = [], i;
	        for (i = 0; i < arr.length; ++i) {
	            res.push(fn(arr[i], i));
	        }
	        return res;
	    }

	    function hasOwnProp(a, b) {
	        return Object.prototype.hasOwnProperty.call(a, b);
	    }

	    function extend(a, b) {
	        for (var i in b) {
	            if (hasOwnProp(b, i)) {
	                a[i] = b[i];
	            }
	        }

	        if (hasOwnProp(b, 'toString')) {
	            a.toString = b.toString;
	        }

	        if (hasOwnProp(b, 'valueOf')) {
	            a.valueOf = b.valueOf;
	        }

	        return a;
	    }

	    function create_utc__createUTC (input, format, locale, strict) {
	        return createLocalOrUTC(input, format, locale, strict, true).utc();
	    }

	    function defaultParsingFlags() {
	        // We need to deep clone this object.
	        return {
	            empty           : false,
	            unusedTokens    : [],
	            unusedInput     : [],
	            overflow        : -2,
	            charsLeftOver   : 0,
	            nullInput       : false,
	            invalidMonth    : null,
	            invalidFormat   : false,
	            userInvalidated : false,
	            iso             : false,
	            parsedDateParts : [],
	            meridiem        : null
	        };
	    }

	    function getParsingFlags(m) {
	        if (m._pf == null) {
	            m._pf = defaultParsingFlags();
	        }
	        return m._pf;
	    }

	    var some;
	    if (Array.prototype.some) {
	        some = Array.prototype.some;
	    } else {
	        some = function (fun) {
	            var t = Object(this);
	            var len = t.length >>> 0;

	            for (var i = 0; i < len; i++) {
	                if (i in t && fun.call(this, t[i], i, t)) {
	                    return true;
	                }
	            }

	            return false;
	        };
	    }

	    function valid__isValid(m) {
	        if (m._isValid == null) {
	            var flags = getParsingFlags(m);
	            var parsedParts = some.call(flags.parsedDateParts, function (i) {
	                return i != null;
	            });
	            var isNowValid = !isNaN(m._d.getTime()) &&
	                flags.overflow < 0 &&
	                !flags.empty &&
	                !flags.invalidMonth &&
	                !flags.invalidWeekday &&
	                !flags.nullInput &&
	                !flags.invalidFormat &&
	                !flags.userInvalidated &&
	                (!flags.meridiem || (flags.meridiem && parsedParts));

	            if (m._strict) {
	                isNowValid = isNowValid &&
	                    flags.charsLeftOver === 0 &&
	                    flags.unusedTokens.length === 0 &&
	                    flags.bigHour === undefined;
	            }

	            if (Object.isFrozen == null || !Object.isFrozen(m)) {
	                m._isValid = isNowValid;
	            }
	            else {
	                return isNowValid;
	            }
	        }
	        return m._isValid;
	    }

	    function valid__createInvalid (flags) {
	        var m = create_utc__createUTC(NaN);
	        if (flags != null) {
	            extend(getParsingFlags(m), flags);
	        }
	        else {
	            getParsingFlags(m).userInvalidated = true;
	        }

	        return m;
	    }

	    function isUndefined(input) {
	        return input === void 0;
	    }

	    // Plugins that add properties should also add the key here (null value),
	    // so we can properly clone ourselves.
	    var momentProperties = utils_hooks__hooks.momentProperties = [];

	    function copyConfig(to, from) {
	        var i, prop, val;

	        if (!isUndefined(from._isAMomentObject)) {
	            to._isAMomentObject = from._isAMomentObject;
	        }
	        if (!isUndefined(from._i)) {
	            to._i = from._i;
	        }
	        if (!isUndefined(from._f)) {
	            to._f = from._f;
	        }
	        if (!isUndefined(from._l)) {
	            to._l = from._l;
	        }
	        if (!isUndefined(from._strict)) {
	            to._strict = from._strict;
	        }
	        if (!isUndefined(from._tzm)) {
	            to._tzm = from._tzm;
	        }
	        if (!isUndefined(from._isUTC)) {
	            to._isUTC = from._isUTC;
	        }
	        if (!isUndefined(from._offset)) {
	            to._offset = from._offset;
	        }
	        if (!isUndefined(from._pf)) {
	            to._pf = getParsingFlags(from);
	        }
	        if (!isUndefined(from._locale)) {
	            to._locale = from._locale;
	        }

	        if (momentProperties.length > 0) {
	            for (i in momentProperties) {
	                prop = momentProperties[i];
	                val = from[prop];
	                if (!isUndefined(val)) {
	                    to[prop] = val;
	                }
	            }
	        }

	        return to;
	    }

	    var updateInProgress = false;

	    // Moment prototype object
	    function Moment(config) {
	        copyConfig(this, config);
	        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
	        // Prevent infinite loop in case updateOffset creates new moment
	        // objects.
	        if (updateInProgress === false) {
	            updateInProgress = true;
	            utils_hooks__hooks.updateOffset(this);
	            updateInProgress = false;
	        }
	    }

	    function isMoment (obj) {
	        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
	    }

	    function absFloor (number) {
	        if (number < 0) {
	            // -0 -> 0
	            return Math.ceil(number) || 0;
	        } else {
	            return Math.floor(number);
	        }
	    }

	    function toInt(argumentForCoercion) {
	        var coercedNumber = +argumentForCoercion,
	            value = 0;

	        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
	            value = absFloor(coercedNumber);
	        }

	        return value;
	    }

	    // compare two arrays, return the number of differences
	    function compareArrays(array1, array2, dontConvert) {
	        var len = Math.min(array1.length, array2.length),
	            lengthDiff = Math.abs(array1.length - array2.length),
	            diffs = 0,
	            i;
	        for (i = 0; i < len; i++) {
	            if ((dontConvert && array1[i] !== array2[i]) ||
	                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
	                diffs++;
	            }
	        }
	        return diffs + lengthDiff;
	    }

	    function warn(msg) {
	        if (utils_hooks__hooks.suppressDeprecationWarnings === false &&
	                (typeof console !==  'undefined') && console.warn) {
	            console.warn('Deprecation warning: ' + msg);
	        }
	    }

	    function deprecate(msg, fn) {
	        var firstTime = true;

	        return extend(function () {
	            if (utils_hooks__hooks.deprecationHandler != null) {
	                utils_hooks__hooks.deprecationHandler(null, msg);
	            }
	            if (firstTime) {
	                var args = [];
	                var arg;
	                for (var i = 0; i < arguments.length; i++) {
	                    arg = '';
	                    if (typeof arguments[i] === 'object') {
	                        arg += '\n[' + i + '] ';
	                        for (var key in arguments[0]) {
	                            arg += key + ': ' + arguments[0][key] + ', ';
	                        }
	                        arg = arg.slice(0, -2); // Remove trailing comma and space
	                    } else {
	                        arg = arguments[i];
	                    }
	                    args.push(arg);
	                }
	                warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
	                firstTime = false;
	            }
	            return fn.apply(this, arguments);
	        }, fn);
	    }

	    var deprecations = {};

	    function deprecateSimple(name, msg) {
	        if (utils_hooks__hooks.deprecationHandler != null) {
	            utils_hooks__hooks.deprecationHandler(name, msg);
	        }
	        if (!deprecations[name]) {
	            warn(msg);
	            deprecations[name] = true;
	        }
	    }

	    utils_hooks__hooks.suppressDeprecationWarnings = false;
	    utils_hooks__hooks.deprecationHandler = null;

	    function isFunction(input) {
	        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
	    }

	    function locale_set__set (config) {
	        var prop, i;
	        for (i in config) {
	            prop = config[i];
	            if (isFunction(prop)) {
	                this[i] = prop;
	            } else {
	                this['_' + i] = prop;
	            }
	        }
	        this._config = config;
	        // Lenient ordinal parsing accepts just a number in addition to
	        // number + (possibly) stuff coming from _ordinalParseLenient.
	        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
	    }

	    function mergeConfigs(parentConfig, childConfig) {
	        var res = extend({}, parentConfig), prop;
	        for (prop in childConfig) {
	            if (hasOwnProp(childConfig, prop)) {
	                if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
	                    res[prop] = {};
	                    extend(res[prop], parentConfig[prop]);
	                    extend(res[prop], childConfig[prop]);
	                } else if (childConfig[prop] != null) {
	                    res[prop] = childConfig[prop];
	                } else {
	                    delete res[prop];
	                }
	            }
	        }
	        for (prop in parentConfig) {
	            if (hasOwnProp(parentConfig, prop) &&
	                    !hasOwnProp(childConfig, prop) &&
	                    isObject(parentConfig[prop])) {
	                // make sure changes to properties don't modify parent config
	                res[prop] = extend({}, res[prop]);
	            }
	        }
	        return res;
	    }

	    function Locale(config) {
	        if (config != null) {
	            this.set(config);
	        }
	    }

	    var keys;

	    if (Object.keys) {
	        keys = Object.keys;
	    } else {
	        keys = function (obj) {
	            var i, res = [];
	            for (i in obj) {
	                if (hasOwnProp(obj, i)) {
	                    res.push(i);
	                }
	            }
	            return res;
	        };
	    }

	    var defaultCalendar = {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    };

	    function locale_calendar__calendar (key, mom, now) {
	        var output = this._calendar[key] || this._calendar['sameElse'];
	        return isFunction(output) ? output.call(mom, now) : output;
	    }

	    var defaultLongDateFormat = {
	        LTS  : 'h:mm:ss A',
	        LT   : 'h:mm A',
	        L    : 'MM/DD/YYYY',
	        LL   : 'MMMM D, YYYY',
	        LLL  : 'MMMM D, YYYY h:mm A',
	        LLLL : 'dddd, MMMM D, YYYY h:mm A'
	    };

	    function longDateFormat (key) {
	        var format = this._longDateFormat[key],
	            formatUpper = this._longDateFormat[key.toUpperCase()];

	        if (format || !formatUpper) {
	            return format;
	        }

	        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
	            return val.slice(1);
	        });

	        return this._longDateFormat[key];
	    }

	    var defaultInvalidDate = 'Invalid date';

	    function invalidDate () {
	        return this._invalidDate;
	    }

	    var defaultOrdinal = '%d';
	    var defaultOrdinalParse = /\d{1,2}/;

	    function ordinal (number) {
	        return this._ordinal.replace('%d', number);
	    }

	    var defaultRelativeTime = {
	        future : 'in %s',
	        past   : '%s ago',
	        s  : 'a few seconds',
	        m  : 'a minute',
	        mm : '%d minutes',
	        h  : 'an hour',
	        hh : '%d hours',
	        d  : 'a day',
	        dd : '%d days',
	        M  : 'a month',
	        MM : '%d months',
	        y  : 'a year',
	        yy : '%d years'
	    };

	    function relative__relativeTime (number, withoutSuffix, string, isFuture) {
	        var output = this._relativeTime[string];
	        return (isFunction(output)) ?
	            output(number, withoutSuffix, string, isFuture) :
	            output.replace(/%d/i, number);
	    }

	    function pastFuture (diff, output) {
	        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
	        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
	    }

	    var aliases = {};

	    function addUnitAlias (unit, shorthand) {
	        var lowerCase = unit.toLowerCase();
	        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
	    }

	    function normalizeUnits(units) {
	        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
	    }

	    function normalizeObjectUnits(inputObject) {
	        var normalizedInput = {},
	            normalizedProp,
	            prop;

	        for (prop in inputObject) {
	            if (hasOwnProp(inputObject, prop)) {
	                normalizedProp = normalizeUnits(prop);
	                if (normalizedProp) {
	                    normalizedInput[normalizedProp] = inputObject[prop];
	                }
	            }
	        }

	        return normalizedInput;
	    }

	    var priorities = {};

	    function addUnitPriority(unit, priority) {
	        priorities[unit] = priority;
	    }

	    function getPrioritizedUnits(unitsObj) {
	        var units = [];
	        for (var u in unitsObj) {
	            units.push({unit: u, priority: priorities[u]});
	        }
	        units.sort(function (a, b) {
	            return a.priority - b.priority;
	        });
	        return units;
	    }

	    function makeGetSet (unit, keepTime) {
	        return function (value) {
	            if (value != null) {
	                get_set__set(this, unit, value);
	                utils_hooks__hooks.updateOffset(this, keepTime);
	                return this;
	            } else {
	                return get_set__get(this, unit);
	            }
	        };
	    }

	    function get_set__get (mom, unit) {
	        return mom.isValid() ?
	            mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
	    }

	    function get_set__set (mom, unit, value) {
	        if (mom.isValid()) {
	            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
	        }
	    }

	    // MOMENTS

	    function stringGet (units) {
	        units = normalizeUnits(units);
	        if (isFunction(this[units])) {
	            return this[units]();
	        }
	        return this;
	    }


	    function stringSet (units, value) {
	        if (typeof units === 'object') {
	            units = normalizeObjectUnits(units);
	            var prioritized = getPrioritizedUnits(units);
	            for (var i = 0; i < prioritized.length; i++) {
	                this[prioritized[i].unit](units[prioritized[i].unit]);
	            }
	        } else {
	            units = normalizeUnits(units);
	            if (isFunction(this[units])) {
	                return this[units](value);
	            }
	        }
	        return this;
	    }

	    function zeroFill(number, targetLength, forceSign) {
	        var absNumber = '' + Math.abs(number),
	            zerosToFill = targetLength - absNumber.length,
	            sign = number >= 0;
	        return (sign ? (forceSign ? '+' : '') : '-') +
	            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
	    }

	    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

	    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

	    var formatFunctions = {};

	    var formatTokenFunctions = {};

	    // token:    'M'
	    // padded:   ['MM', 2]
	    // ordinal:  'Mo'
	    // callback: function () { this.month() + 1 }
	    function addFormatToken (token, padded, ordinal, callback) {
	        var func = callback;
	        if (typeof callback === 'string') {
	            func = function () {
	                return this[callback]();
	            };
	        }
	        if (token) {
	            formatTokenFunctions[token] = func;
	        }
	        if (padded) {
	            formatTokenFunctions[padded[0]] = function () {
	                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
	            };
	        }
	        if (ordinal) {
	            formatTokenFunctions[ordinal] = function () {
	                return this.localeData().ordinal(func.apply(this, arguments), token);
	            };
	        }
	    }

	    function removeFormattingTokens(input) {
	        if (input.match(/\[[\s\S]/)) {
	            return input.replace(/^\[|\]$/g, '');
	        }
	        return input.replace(/\\/g, '');
	    }

	    function makeFormatFunction(format) {
	        var array = format.match(formattingTokens), i, length;

	        for (i = 0, length = array.length; i < length; i++) {
	            if (formatTokenFunctions[array[i]]) {
	                array[i] = formatTokenFunctions[array[i]];
	            } else {
	                array[i] = removeFormattingTokens(array[i]);
	            }
	        }

	        return function (mom) {
	            var output = '', i;
	            for (i = 0; i < length; i++) {
	                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
	            }
	            return output;
	        };
	    }

	    // format date using native date object
	    function formatMoment(m, format) {
	        if (!m.isValid()) {
	            return m.localeData().invalidDate();
	        }

	        format = expandFormat(format, m.localeData());
	        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

	        return formatFunctions[format](m);
	    }

	    function expandFormat(format, locale) {
	        var i = 5;

	        function replaceLongDateFormatTokens(input) {
	            return locale.longDateFormat(input) || input;
	        }

	        localFormattingTokens.lastIndex = 0;
	        while (i >= 0 && localFormattingTokens.test(format)) {
	            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
	            localFormattingTokens.lastIndex = 0;
	            i -= 1;
	        }

	        return format;
	    }

	    var match1         = /\d/;            //       0 - 9
	    var match2         = /\d\d/;          //      00 - 99
	    var match3         = /\d{3}/;         //     000 - 999
	    var match4         = /\d{4}/;         //    0000 - 9999
	    var match6         = /[+-]?\d{6}/;    // -999999 - 999999
	    var match1to2      = /\d\d?/;         //       0 - 99
	    var match3to4      = /\d\d\d\d?/;     //     999 - 9999
	    var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
	    var match1to3      = /\d{1,3}/;       //       0 - 999
	    var match1to4      = /\d{1,4}/;       //       0 - 9999
	    var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

	    var matchUnsigned  = /\d+/;           //       0 - inf
	    var matchSigned    = /[+-]?\d+/;      //    -inf - inf

	    var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
	    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

	    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

	    // any word (or two) characters or numbers including two/three word month in arabic.
	    // includes scottish gaelic two word and hyphenated months
	    var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


	    var regexes = {};

	    function addRegexToken (token, regex, strictRegex) {
	        regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
	            return (isStrict && strictRegex) ? strictRegex : regex;
	        };
	    }

	    function getParseRegexForToken (token, config) {
	        if (!hasOwnProp(regexes, token)) {
	            return new RegExp(unescapeFormat(token));
	        }

	        return regexes[token](config._strict, config._locale);
	    }

	    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	    function unescapeFormat(s) {
	        return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
	            return p1 || p2 || p3 || p4;
	        }));
	    }

	    function regexEscape(s) {
	        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	    }

	    var tokens = {};

	    function addParseToken (token, callback) {
	        var i, func = callback;
	        if (typeof token === 'string') {
	            token = [token];
	        }
	        if (typeof callback === 'number') {
	            func = function (input, array) {
	                array[callback] = toInt(input);
	            };
	        }
	        for (i = 0; i < token.length; i++) {
	            tokens[token[i]] = func;
	        }
	    }

	    function addWeekParseToken (token, callback) {
	        addParseToken(token, function (input, array, config, token) {
	            config._w = config._w || {};
	            callback(input, config._w, config, token);
	        });
	    }

	    function addTimeToArrayFromToken(token, input, config) {
	        if (input != null && hasOwnProp(tokens, token)) {
	            tokens[token](input, config._a, config, token);
	        }
	    }

	    var YEAR = 0;
	    var MONTH = 1;
	    var DATE = 2;
	    var HOUR = 3;
	    var MINUTE = 4;
	    var SECOND = 5;
	    var MILLISECOND = 6;
	    var WEEK = 7;
	    var WEEKDAY = 8;

	    var indexOf;

	    if (Array.prototype.indexOf) {
	        indexOf = Array.prototype.indexOf;
	    } else {
	        indexOf = function (o) {
	            // I know
	            var i;
	            for (i = 0; i < this.length; ++i) {
	                if (this[i] === o) {
	                    return i;
	                }
	            }
	            return -1;
	        };
	    }

	    function daysInMonth(year, month) {
	        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	    }

	    // FORMATTING

	    addFormatToken('M', ['MM', 2], 'Mo', function () {
	        return this.month() + 1;
	    });

	    addFormatToken('MMM', 0, 0, function (format) {
	        return this.localeData().monthsShort(this, format);
	    });

	    addFormatToken('MMMM', 0, 0, function (format) {
	        return this.localeData().months(this, format);
	    });

	    // ALIASES

	    addUnitAlias('month', 'M');

	    // PRIORITY

	    addUnitPriority('month', 8);

	    // PARSING

	    addRegexToken('M',    match1to2);
	    addRegexToken('MM',   match1to2, match2);
	    addRegexToken('MMM',  function (isStrict, locale) {
	        return locale.monthsShortRegex(isStrict);
	    });
	    addRegexToken('MMMM', function (isStrict, locale) {
	        return locale.monthsRegex(isStrict);
	    });

	    addParseToken(['M', 'MM'], function (input, array) {
	        array[MONTH] = toInt(input) - 1;
	    });

	    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
	        var month = config._locale.monthsParse(input, token, config._strict);
	        // if we didn't find a month name, mark the date as invalid.
	        if (month != null) {
	            array[MONTH] = month;
	        } else {
	            getParsingFlags(config).invalidMonth = input;
	        }
	    });

	    // LOCALES

	    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
	    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
	    function localeMonths (m, format) {
	        if (!m) {
	            return this._months;
	        }
	        return isArray(this._months) ? this._months[m.month()] :
	            this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
	    }

	    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	    function localeMonthsShort (m, format) {
	        if (!m) {
	            return this._monthsShort;
	        }
	        return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
	            this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
	    }

	    function units_month__handleStrictParse(monthName, format, strict) {
	        var i, ii, mom, llc = monthName.toLocaleLowerCase();
	        if (!this._monthsParse) {
	            // this is not used
	            this._monthsParse = [];
	            this._longMonthsParse = [];
	            this._shortMonthsParse = [];
	            for (i = 0; i < 12; ++i) {
	                mom = create_utc__createUTC([2000, i]);
	                this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
	                this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
	            }
	        }

	        if (strict) {
	            if (format === 'MMM') {
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._longMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        } else {
	            if (format === 'MMM') {
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._longMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._longMonthsParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortMonthsParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        }
	    }

	    function localeMonthsParse (monthName, format, strict) {
	        var i, mom, regex;

	        if (this._monthsParseExact) {
	            return units_month__handleStrictParse.call(this, monthName, format, strict);
	        }

	        if (!this._monthsParse) {
	            this._monthsParse = [];
	            this._longMonthsParse = [];
	            this._shortMonthsParse = [];
	        }

	        // TODO: add sorting
	        // Sorting makes sure if one month (or abbr) is a prefix of another
	        // see sorting in computeMonthsParse
	        for (i = 0; i < 12; i++) {
	            // make the regex if we don't have it already
	            mom = create_utc__createUTC([2000, i]);
	            if (strict && !this._longMonthsParse[i]) {
	                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
	                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
	            }
	            if (!strict && !this._monthsParse[i]) {
	                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
	                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
	            }
	            // test the regex
	            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
	                return i;
	            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
	                return i;
	            } else if (!strict && this._monthsParse[i].test(monthName)) {
	                return i;
	            }
	        }
	    }

	    // MOMENTS

	    function setMonth (mom, value) {
	        var dayOfMonth;

	        if (!mom.isValid()) {
	            // No op
	            return mom;
	        }

	        if (typeof value === 'string') {
	            if (/^\d+$/.test(value)) {
	                value = toInt(value);
	            } else {
	                value = mom.localeData().monthsParse(value);
	                // TODO: Another silent failure?
	                if (typeof value !== 'number') {
	                    return mom;
	                }
	            }
	        }

	        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
	        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
	        return mom;
	    }

	    function getSetMonth (value) {
	        if (value != null) {
	            setMonth(this, value);
	            utils_hooks__hooks.updateOffset(this, true);
	            return this;
	        } else {
	            return get_set__get(this, 'Month');
	        }
	    }

	    function getDaysInMonth () {
	        return daysInMonth(this.year(), this.month());
	    }

	    var defaultMonthsShortRegex = matchWord;
	    function monthsShortRegex (isStrict) {
	        if (this._monthsParseExact) {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                computeMonthsParse.call(this);
	            }
	            if (isStrict) {
	                return this._monthsShortStrictRegex;
	            } else {
	                return this._monthsShortRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_monthsShortRegex')) {
	                this._monthsShortRegex = defaultMonthsShortRegex;
	            }
	            return this._monthsShortStrictRegex && isStrict ?
	                this._monthsShortStrictRegex : this._monthsShortRegex;
	        }
	    }

	    var defaultMonthsRegex = matchWord;
	    function monthsRegex (isStrict) {
	        if (this._monthsParseExact) {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                computeMonthsParse.call(this);
	            }
	            if (isStrict) {
	                return this._monthsStrictRegex;
	            } else {
	                return this._monthsRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_monthsRegex')) {
	                this._monthsRegex = defaultMonthsRegex;
	            }
	            return this._monthsStrictRegex && isStrict ?
	                this._monthsStrictRegex : this._monthsRegex;
	        }
	    }

	    function computeMonthsParse () {
	        function cmpLenRev(a, b) {
	            return b.length - a.length;
	        }

	        var shortPieces = [], longPieces = [], mixedPieces = [],
	            i, mom;
	        for (i = 0; i < 12; i++) {
	            // make the regex if we don't have it already
	            mom = create_utc__createUTC([2000, i]);
	            shortPieces.push(this.monthsShort(mom, ''));
	            longPieces.push(this.months(mom, ''));
	            mixedPieces.push(this.months(mom, ''));
	            mixedPieces.push(this.monthsShort(mom, ''));
	        }
	        // Sorting makes sure if one month (or abbr) is a prefix of another it
	        // will match the longer piece.
	        shortPieces.sort(cmpLenRev);
	        longPieces.sort(cmpLenRev);
	        mixedPieces.sort(cmpLenRev);
	        for (i = 0; i < 12; i++) {
	            shortPieces[i] = regexEscape(shortPieces[i]);
	            longPieces[i] = regexEscape(longPieces[i]);
	        }
	        for (i = 0; i < 24; i++) {
	            mixedPieces[i] = regexEscape(mixedPieces[i]);
	        }

	        this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	        this._monthsShortRegex = this._monthsRegex;
	        this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	        this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	    }

	    // FORMATTING

	    addFormatToken('Y', 0, 0, function () {
	        var y = this.year();
	        return y <= 9999 ? '' + y : '+' + y;
	    });

	    addFormatToken(0, ['YY', 2], 0, function () {
	        return this.year() % 100;
	    });

	    addFormatToken(0, ['YYYY',   4],       0, 'year');
	    addFormatToken(0, ['YYYYY',  5],       0, 'year');
	    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

	    // ALIASES

	    addUnitAlias('year', 'y');

	    // PRIORITIES

	    addUnitPriority('year', 1);

	    // PARSING

	    addRegexToken('Y',      matchSigned);
	    addRegexToken('YY',     match1to2, match2);
	    addRegexToken('YYYY',   match1to4, match4);
	    addRegexToken('YYYYY',  match1to6, match6);
	    addRegexToken('YYYYYY', match1to6, match6);

	    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
	    addParseToken('YYYY', function (input, array) {
	        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
	    });
	    addParseToken('YY', function (input, array) {
	        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
	    });
	    addParseToken('Y', function (input, array) {
	        array[YEAR] = parseInt(input, 10);
	    });

	    // HELPERS

	    function daysInYear(year) {
	        return isLeapYear(year) ? 366 : 365;
	    }

	    function isLeapYear(year) {
	        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	    }

	    // HOOKS

	    utils_hooks__hooks.parseTwoDigitYear = function (input) {
	        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
	    };

	    // MOMENTS

	    var getSetYear = makeGetSet('FullYear', true);

	    function getIsLeapYear () {
	        return isLeapYear(this.year());
	    }

	    function createDate (y, m, d, h, M, s, ms) {
	        //can't just apply() to create a date:
	        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
	        var date = new Date(y, m, d, h, M, s, ms);

	        //the date constructor remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
	            date.setFullYear(y);
	        }
	        return date;
	    }

	    function createUTCDate (y) {
	        var date = new Date(Date.UTC.apply(null, arguments));

	        //the Date.UTC function remaps years 0-99 to 1900-1999
	        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
	            date.setUTCFullYear(y);
	        }
	        return date;
	    }

	    // start-of-first-week - start-of-year
	    function firstWeekOffset(year, dow, doy) {
	        var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
	            fwd = 7 + dow - doy,
	            // first-week day local weekday -- which local weekday is fwd
	            fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

	        return -fwdlw + fwd - 1;
	    }

	    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
	        var localWeekday = (7 + weekday - dow) % 7,
	            weekOffset = firstWeekOffset(year, dow, doy),
	            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
	            resYear, resDayOfYear;

	        if (dayOfYear <= 0) {
	            resYear = year - 1;
	            resDayOfYear = daysInYear(resYear) + dayOfYear;
	        } else if (dayOfYear > daysInYear(year)) {
	            resYear = year + 1;
	            resDayOfYear = dayOfYear - daysInYear(year);
	        } else {
	            resYear = year;
	            resDayOfYear = dayOfYear;
	        }

	        return {
	            year: resYear,
	            dayOfYear: resDayOfYear
	        };
	    }

	    function weekOfYear(mom, dow, doy) {
	        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
	            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
	            resWeek, resYear;

	        if (week < 1) {
	            resYear = mom.year() - 1;
	            resWeek = week + weeksInYear(resYear, dow, doy);
	        } else if (week > weeksInYear(mom.year(), dow, doy)) {
	            resWeek = week - weeksInYear(mom.year(), dow, doy);
	            resYear = mom.year() + 1;
	        } else {
	            resYear = mom.year();
	            resWeek = week;
	        }

	        return {
	            week: resWeek,
	            year: resYear
	        };
	    }

	    function weeksInYear(year, dow, doy) {
	        var weekOffset = firstWeekOffset(year, dow, doy),
	            weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
	        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
	    }

	    // FORMATTING

	    addFormatToken('w', ['ww', 2], 'wo', 'week');
	    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

	    // ALIASES

	    addUnitAlias('week', 'w');
	    addUnitAlias('isoWeek', 'W');

	    // PRIORITIES

	    addUnitPriority('week', 5);
	    addUnitPriority('isoWeek', 5);

	    // PARSING

	    addRegexToken('w',  match1to2);
	    addRegexToken('ww', match1to2, match2);
	    addRegexToken('W',  match1to2);
	    addRegexToken('WW', match1to2, match2);

	    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
	        week[token.substr(0, 1)] = toInt(input);
	    });

	    // HELPERS

	    // LOCALES

	    function localeWeek (mom) {
	        return weekOfYear(mom, this._week.dow, this._week.doy).week;
	    }

	    var defaultLocaleWeek = {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    };

	    function localeFirstDayOfWeek () {
	        return this._week.dow;
	    }

	    function localeFirstDayOfYear () {
	        return this._week.doy;
	    }

	    // MOMENTS

	    function getSetWeek (input) {
	        var week = this.localeData().week(this);
	        return input == null ? week : this.add((input - week) * 7, 'd');
	    }

	    function getSetISOWeek (input) {
	        var week = weekOfYear(this, 1, 4).week;
	        return input == null ? week : this.add((input - week) * 7, 'd');
	    }

	    // FORMATTING

	    addFormatToken('d', 0, 'do', 'day');

	    addFormatToken('dd', 0, 0, function (format) {
	        return this.localeData().weekdaysMin(this, format);
	    });

	    addFormatToken('ddd', 0, 0, function (format) {
	        return this.localeData().weekdaysShort(this, format);
	    });

	    addFormatToken('dddd', 0, 0, function (format) {
	        return this.localeData().weekdays(this, format);
	    });

	    addFormatToken('e', 0, 0, 'weekday');
	    addFormatToken('E', 0, 0, 'isoWeekday');

	    // ALIASES

	    addUnitAlias('day', 'd');
	    addUnitAlias('weekday', 'e');
	    addUnitAlias('isoWeekday', 'E');

	    // PRIORITY
	    addUnitPriority('day', 11);
	    addUnitPriority('weekday', 11);
	    addUnitPriority('isoWeekday', 11);

	    // PARSING

	    addRegexToken('d',    match1to2);
	    addRegexToken('e',    match1to2);
	    addRegexToken('E',    match1to2);
	    addRegexToken('dd',   function (isStrict, locale) {
	        return locale.weekdaysMinRegex(isStrict);
	    });
	    addRegexToken('ddd',   function (isStrict, locale) {
	        return locale.weekdaysShortRegex(isStrict);
	    });
	    addRegexToken('dddd',   function (isStrict, locale) {
	        return locale.weekdaysRegex(isStrict);
	    });

	    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
	        var weekday = config._locale.weekdaysParse(input, token, config._strict);
	        // if we didn't get a weekday name, mark the date as invalid
	        if (weekday != null) {
	            week.d = weekday;
	        } else {
	            getParsingFlags(config).invalidWeekday = input;
	        }
	    });

	    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
	        week[token] = toInt(input);
	    });

	    // HELPERS

	    function parseWeekday(input, locale) {
	        if (typeof input !== 'string') {
	            return input;
	        }

	        if (!isNaN(input)) {
	            return parseInt(input, 10);
	        }

	        input = locale.weekdaysParse(input);
	        if (typeof input === 'number') {
	            return input;
	        }

	        return null;
	    }

	    function parseIsoWeekday(input, locale) {
	        if (typeof input === 'string') {
	            return locale.weekdaysParse(input) % 7 || 7;
	        }
	        return isNaN(input) ? null : input;
	    }

	    // LOCALES

	    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
	    function localeWeekdays (m, format) {
	        if (!m) {
	            return this._weekdays;
	        }
	        return isArray(this._weekdays) ? this._weekdays[m.day()] :
	            this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
	    }

	    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
	    function localeWeekdaysShort (m) {
	        return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
	    }

	    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
	    function localeWeekdaysMin (m) {
	        return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
	    }

	    function day_of_week__handleStrictParse(weekdayName, format, strict) {
	        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
	        if (!this._weekdaysParse) {
	            this._weekdaysParse = [];
	            this._shortWeekdaysParse = [];
	            this._minWeekdaysParse = [];

	            for (i = 0; i < 7; ++i) {
	                mom = create_utc__createUTC([2000, 1]).day(i);
	                this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
	                this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
	                this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
	            }
	        }

	        if (strict) {
	            if (format === 'dddd') {
	                ii = indexOf.call(this._weekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else if (format === 'ddd') {
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        } else {
	            if (format === 'dddd') {
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else if (format === 'ddd') {
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            } else {
	                ii = indexOf.call(this._minWeekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._weekdaysParse, llc);
	                if (ii !== -1) {
	                    return ii;
	                }
	                ii = indexOf.call(this._shortWeekdaysParse, llc);
	                return ii !== -1 ? ii : null;
	            }
	        }
	    }

	    function localeWeekdaysParse (weekdayName, format, strict) {
	        var i, mom, regex;

	        if (this._weekdaysParseExact) {
	            return day_of_week__handleStrictParse.call(this, weekdayName, format, strict);
	        }

	        if (!this._weekdaysParse) {
	            this._weekdaysParse = [];
	            this._minWeekdaysParse = [];
	            this._shortWeekdaysParse = [];
	            this._fullWeekdaysParse = [];
	        }

	        for (i = 0; i < 7; i++) {
	            // make the regex if we don't have it already

	            mom = create_utc__createUTC([2000, 1]).day(i);
	            if (strict && !this._fullWeekdaysParse[i]) {
	                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
	                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
	                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
	            }
	            if (!this._weekdaysParse[i]) {
	                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
	                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
	            }
	            // test the regex
	            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
	                return i;
	            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
	                return i;
	            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
	                return i;
	            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
	                return i;
	            }
	        }
	    }

	    // MOMENTS

	    function getSetDayOfWeek (input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
	        if (input != null) {
	            input = parseWeekday(input, this.localeData());
	            return this.add(input - day, 'd');
	        } else {
	            return day;
	        }
	    }

	    function getSetLocaleDayOfWeek (input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
	        return input == null ? weekday : this.add(input - weekday, 'd');
	    }

	    function getSetISODayOfWeek (input) {
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }

	        // behaves the same as moment#day except
	        // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	        // as a setter, sunday should belong to the previous week.

	        if (input != null) {
	            var weekday = parseIsoWeekday(input, this.localeData());
	            return this.day(this.day() % 7 ? weekday : weekday - 7);
	        } else {
	            return this.day() || 7;
	        }
	    }

	    var defaultWeekdaysRegex = matchWord;
	    function weekdaysRegex (isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysStrictRegex;
	            } else {
	                return this._weekdaysRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                this._weekdaysRegex = defaultWeekdaysRegex;
	            }
	            return this._weekdaysStrictRegex && isStrict ?
	                this._weekdaysStrictRegex : this._weekdaysRegex;
	        }
	    }

	    var defaultWeekdaysShortRegex = matchWord;
	    function weekdaysShortRegex (isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysShortStrictRegex;
	            } else {
	                return this._weekdaysShortRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysShortRegex')) {
	                this._weekdaysShortRegex = defaultWeekdaysShortRegex;
	            }
	            return this._weekdaysShortStrictRegex && isStrict ?
	                this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
	        }
	    }

	    var defaultWeekdaysMinRegex = matchWord;
	    function weekdaysMinRegex (isStrict) {
	        if (this._weekdaysParseExact) {
	            if (!hasOwnProp(this, '_weekdaysRegex')) {
	                computeWeekdaysParse.call(this);
	            }
	            if (isStrict) {
	                return this._weekdaysMinStrictRegex;
	            } else {
	                return this._weekdaysMinRegex;
	            }
	        } else {
	            if (!hasOwnProp(this, '_weekdaysMinRegex')) {
	                this._weekdaysMinRegex = defaultWeekdaysMinRegex;
	            }
	            return this._weekdaysMinStrictRegex && isStrict ?
	                this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
	        }
	    }


	    function computeWeekdaysParse () {
	        function cmpLenRev(a, b) {
	            return b.length - a.length;
	        }

	        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
	            i, mom, minp, shortp, longp;
	        for (i = 0; i < 7; i++) {
	            // make the regex if we don't have it already
	            mom = create_utc__createUTC([2000, 1]).day(i);
	            minp = this.weekdaysMin(mom, '');
	            shortp = this.weekdaysShort(mom, '');
	            longp = this.weekdays(mom, '');
	            minPieces.push(minp);
	            shortPieces.push(shortp);
	            longPieces.push(longp);
	            mixedPieces.push(minp);
	            mixedPieces.push(shortp);
	            mixedPieces.push(longp);
	        }
	        // Sorting makes sure if one weekday (or abbr) is a prefix of another it
	        // will match the longer piece.
	        minPieces.sort(cmpLenRev);
	        shortPieces.sort(cmpLenRev);
	        longPieces.sort(cmpLenRev);
	        mixedPieces.sort(cmpLenRev);
	        for (i = 0; i < 7; i++) {
	            shortPieces[i] = regexEscape(shortPieces[i]);
	            longPieces[i] = regexEscape(longPieces[i]);
	            mixedPieces[i] = regexEscape(mixedPieces[i]);
	        }

	        this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	        this._weekdaysShortRegex = this._weekdaysRegex;
	        this._weekdaysMinRegex = this._weekdaysRegex;

	        this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	        this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	        this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
	    }

	    // FORMATTING

	    function hFormat() {
	        return this.hours() % 12 || 12;
	    }

	    function kFormat() {
	        return this.hours() || 24;
	    }

	    addFormatToken('H', ['HH', 2], 0, 'hour');
	    addFormatToken('h', ['hh', 2], 0, hFormat);
	    addFormatToken('k', ['kk', 2], 0, kFormat);

	    addFormatToken('hmm', 0, 0, function () {
	        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
	    });

	    addFormatToken('hmmss', 0, 0, function () {
	        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
	            zeroFill(this.seconds(), 2);
	    });

	    addFormatToken('Hmm', 0, 0, function () {
	        return '' + this.hours() + zeroFill(this.minutes(), 2);
	    });

	    addFormatToken('Hmmss', 0, 0, function () {
	        return '' + this.hours() + zeroFill(this.minutes(), 2) +
	            zeroFill(this.seconds(), 2);
	    });

	    function meridiem (token, lowercase) {
	        addFormatToken(token, 0, 0, function () {
	            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
	        });
	    }

	    meridiem('a', true);
	    meridiem('A', false);

	    // ALIASES

	    addUnitAlias('hour', 'h');

	    // PRIORITY
	    addUnitPriority('hour', 13);

	    // PARSING

	    function matchMeridiem (isStrict, locale) {
	        return locale._meridiemParse;
	    }

	    addRegexToken('a',  matchMeridiem);
	    addRegexToken('A',  matchMeridiem);
	    addRegexToken('H',  match1to2);
	    addRegexToken('h',  match1to2);
	    addRegexToken('HH', match1to2, match2);
	    addRegexToken('hh', match1to2, match2);

	    addRegexToken('hmm', match3to4);
	    addRegexToken('hmmss', match5to6);
	    addRegexToken('Hmm', match3to4);
	    addRegexToken('Hmmss', match5to6);

	    addParseToken(['H', 'HH'], HOUR);
	    addParseToken(['a', 'A'], function (input, array, config) {
	        config._isPm = config._locale.isPM(input);
	        config._meridiem = input;
	    });
	    addParseToken(['h', 'hh'], function (input, array, config) {
	        array[HOUR] = toInt(input);
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('hmm', function (input, array, config) {
	        var pos = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos));
	        array[MINUTE] = toInt(input.substr(pos));
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('hmmss', function (input, array, config) {
	        var pos1 = input.length - 4;
	        var pos2 = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos1));
	        array[MINUTE] = toInt(input.substr(pos1, 2));
	        array[SECOND] = toInt(input.substr(pos2));
	        getParsingFlags(config).bigHour = true;
	    });
	    addParseToken('Hmm', function (input, array, config) {
	        var pos = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos));
	        array[MINUTE] = toInt(input.substr(pos));
	    });
	    addParseToken('Hmmss', function (input, array, config) {
	        var pos1 = input.length - 4;
	        var pos2 = input.length - 2;
	        array[HOUR] = toInt(input.substr(0, pos1));
	        array[MINUTE] = toInt(input.substr(pos1, 2));
	        array[SECOND] = toInt(input.substr(pos2));
	    });

	    // LOCALES

	    function localeIsPM (input) {
	        // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	        // Using charAt should be more compatible.
	        return ((input + '').toLowerCase().charAt(0) === 'p');
	    }

	    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
	    function localeMeridiem (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'pm' : 'PM';
	        } else {
	            return isLower ? 'am' : 'AM';
	        }
	    }


	    // MOMENTS

	    // Setting the hour should keep the time, because the user explicitly
	    // specified which hour he wants. So trying to maintain the same hour (in
	    // a new timezone) makes sense. Adding/subtracting hours does not follow
	    // this rule.
	    var getSetHour = makeGetSet('Hours', true);

	    var baseConfig = {
	        calendar: defaultCalendar,
	        longDateFormat: defaultLongDateFormat,
	        invalidDate: defaultInvalidDate,
	        ordinal: defaultOrdinal,
	        ordinalParse: defaultOrdinalParse,
	        relativeTime: defaultRelativeTime,

	        months: defaultLocaleMonths,
	        monthsShort: defaultLocaleMonthsShort,

	        week: defaultLocaleWeek,

	        weekdays: defaultLocaleWeekdays,
	        weekdaysMin: defaultLocaleWeekdaysMin,
	        weekdaysShort: defaultLocaleWeekdaysShort,

	        meridiemParse: defaultLocaleMeridiemParse
	    };

	    // internal storage for locale config files
	    var locales = {};
	    var globalLocale;

	    function normalizeLocale(key) {
	        return key ? key.toLowerCase().replace('_', '-') : key;
	    }

	    // pick the locale from the array
	    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	    function chooseLocale(names) {
	        var i = 0, j, next, locale, split;

	        while (i < names.length) {
	            split = normalizeLocale(names[i]).split('-');
	            j = split.length;
	            next = normalizeLocale(names[i + 1]);
	            next = next ? next.split('-') : null;
	            while (j > 0) {
	                locale = loadLocale(split.slice(0, j).join('-'));
	                if (locale) {
	                    return locale;
	                }
	                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
	                    //the next array item is better than a shallower substring of this one
	                    break;
	                }
	                j--;
	            }
	            i++;
	        }
	        return null;
	    }

	    function loadLocale(name) {
	        var oldLocale = null;
	        // TODO: Find a better way to register and load all the locales in Node
	        if (!locales[name] && (typeof module !== 'undefined') &&
	                module && module.require) {
	            try {
	                oldLocale = globalLocale._abbr;
	                module.require('./locale/' + name);
	                // because defineLocale currently also sets the global locale, we
	                // want to undo that for lazy loaded locales
	                locale_locales__getSetGlobalLocale(oldLocale);
	            } catch (e) { }
	        }
	        return locales[name];
	    }

	    // This function will load locale and then set the global locale.  If
	    // no arguments are passed in, it will simply return the current global
	    // locale key.
	    function locale_locales__getSetGlobalLocale (key, values) {
	        var data;
	        if (key) {
	            if (isUndefined(values)) {
	                data = locale_locales__getLocale(key);
	            }
	            else {
	                data = defineLocale(key, values);
	            }

	            if (data) {
	                // moment.duration._locale = moment._locale = data;
	                globalLocale = data;
	            }
	        }

	        return globalLocale._abbr;
	    }

	    function defineLocale (name, config) {
	        if (config !== null) {
	            var parentConfig = baseConfig;
	            config.abbr = name;
	            if (locales[name] != null) {
	                deprecateSimple('defineLocaleOverride',
	                        'use moment.updateLocale(localeName, config) to change ' +
	                        'an existing locale. moment.defineLocale(localeName, ' +
	                        'config) should only be used for creating a new locale ' +
	                        'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
	                parentConfig = locales[name]._config;
	            } else if (config.parentLocale != null) {
	                if (locales[config.parentLocale] != null) {
	                    parentConfig = locales[config.parentLocale]._config;
	                } else {
	                    // treat as if there is no base config
	                    deprecateSimple('parentLocaleUndefined',
	                            'specified parentLocale is not defined yet. See http://momentjs.com/guides/#/warnings/parent-locale/');
	                }
	            }
	            locales[name] = new Locale(mergeConfigs(parentConfig, config));

	            // backwards compat for now: also set the locale
	            locale_locales__getSetGlobalLocale(name);

	            return locales[name];
	        } else {
	            // useful for testing
	            delete locales[name];
	            return null;
	        }
	    }

	    function updateLocale(name, config) {
	        if (config != null) {
	            var locale, parentConfig = baseConfig;
	            // MERGE
	            if (locales[name] != null) {
	                parentConfig = locales[name]._config;
	            }
	            config = mergeConfigs(parentConfig, config);
	            locale = new Locale(config);
	            locale.parentLocale = locales[name];
	            locales[name] = locale;

	            // backwards compat for now: also set the locale
	            locale_locales__getSetGlobalLocale(name);
	        } else {
	            // pass null for config to unupdate, useful for tests
	            if (locales[name] != null) {
	                if (locales[name].parentLocale != null) {
	                    locales[name] = locales[name].parentLocale;
	                } else if (locales[name] != null) {
	                    delete locales[name];
	                }
	            }
	        }
	        return locales[name];
	    }

	    // returns locale data
	    function locale_locales__getLocale (key) {
	        var locale;

	        if (key && key._locale && key._locale._abbr) {
	            key = key._locale._abbr;
	        }

	        if (!key) {
	            return globalLocale;
	        }

	        if (!isArray(key)) {
	            //short-circuit everything else
	            locale = loadLocale(key);
	            if (locale) {
	                return locale;
	            }
	            key = [key];
	        }

	        return chooseLocale(key);
	    }

	    function locale_locales__listLocales() {
	        return keys(locales);
	    }

	    function checkOverflow (m) {
	        var overflow;
	        var a = m._a;

	        if (a && getParsingFlags(m).overflow === -2) {
	            overflow =
	                a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
	                a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
	                a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
	                a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
	                a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
	                a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
	                -1;

	            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
	                overflow = DATE;
	            }
	            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
	                overflow = WEEK;
	            }
	            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
	                overflow = WEEKDAY;
	            }

	            getParsingFlags(m).overflow = overflow;
	        }

	        return m;
	    }

	    // iso 8601 regex
	    // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
	    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
	    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;

	    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

	    var isoDates = [
	        ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
	        ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
	        ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
	        ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
	        ['YYYY-DDD', /\d{4}-\d{3}/],
	        ['YYYY-MM', /\d{4}-\d\d/, false],
	        ['YYYYYYMMDD', /[+-]\d{10}/],
	        ['YYYYMMDD', /\d{8}/],
	        // YYYYMM is NOT allowed by the standard
	        ['GGGG[W]WWE', /\d{4}W\d{3}/],
	        ['GGGG[W]WW', /\d{4}W\d{2}/, false],
	        ['YYYYDDD', /\d{7}/]
	    ];

	    // iso time formats and regexes
	    var isoTimes = [
	        ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
	        ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
	        ['HH:mm:ss', /\d\d:\d\d:\d\d/],
	        ['HH:mm', /\d\d:\d\d/],
	        ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
	        ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
	        ['HHmmss', /\d\d\d\d\d\d/],
	        ['HHmm', /\d\d\d\d/],
	        ['HH', /\d\d/]
	    ];

	    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

	    // date from iso format
	    function configFromISO(config) {
	        var i, l,
	            string = config._i,
	            match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
	            allowTime, dateFormat, timeFormat, tzFormat;

	        if (match) {
	            getParsingFlags(config).iso = true;

	            for (i = 0, l = isoDates.length; i < l; i++) {
	                if (isoDates[i][1].exec(match[1])) {
	                    dateFormat = isoDates[i][0];
	                    allowTime = isoDates[i][2] !== false;
	                    break;
	                }
	            }
	            if (dateFormat == null) {
	                config._isValid = false;
	                return;
	            }
	            if (match[3]) {
	                for (i = 0, l = isoTimes.length; i < l; i++) {
	                    if (isoTimes[i][1].exec(match[3])) {
	                        // match[2] should be 'T' or space
	                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
	                        break;
	                    }
	                }
	                if (timeFormat == null) {
	                    config._isValid = false;
	                    return;
	                }
	            }
	            if (!allowTime && timeFormat != null) {
	                config._isValid = false;
	                return;
	            }
	            if (match[4]) {
	                if (tzRegex.exec(match[4])) {
	                    tzFormat = 'Z';
	                } else {
	                    config._isValid = false;
	                    return;
	                }
	            }
	            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
	            configFromStringAndFormat(config);
	        } else {
	            config._isValid = false;
	        }
	    }

	    // date from iso format or fallback
	    function configFromString(config) {
	        var matched = aspNetJsonRegex.exec(config._i);

	        if (matched !== null) {
	            config._d = new Date(+matched[1]);
	            return;
	        }

	        configFromISO(config);
	        if (config._isValid === false) {
	            delete config._isValid;
	            utils_hooks__hooks.createFromInputFallback(config);
	        }
	    }

	    utils_hooks__hooks.createFromInputFallback = deprecate(
	        'value provided is not in a recognized ISO format. moment construction falls back to js Date(), ' +
	        'which is not reliable across all browsers and versions. Non ISO date formats are ' +
	        'discouraged and will be removed in an upcoming major release. Please refer to ' +
	        'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
	        function (config) {
	            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
	        }
	    );

	    // Pick the first defined of two or three arguments.
	    function defaults(a, b, c) {
	        if (a != null) {
	            return a;
	        }
	        if (b != null) {
	            return b;
	        }
	        return c;
	    }

	    function currentDateArray(config) {
	        // hooks is actually the exported moment object
	        var nowValue = new Date(utils_hooks__hooks.now());
	        if (config._useUTC) {
	            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
	        }
	        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
	    }

	    // convert an array to a date.
	    // the array should mirror the parameters below
	    // note: all values past the year are optional and will default to the lowest possible value.
	    // [year, month, day , hour, minute, second, millisecond]
	    function configFromArray (config) {
	        var i, date, input = [], currentDate, yearToUse;

	        if (config._d) {
	            return;
	        }

	        currentDate = currentDateArray(config);

	        //compute day of the year from weeks and weekdays
	        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
	            dayOfYearFromWeekInfo(config);
	        }

	        //if the day of the year is set, figure out what it is
	        if (config._dayOfYear) {
	            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

	            if (config._dayOfYear > daysInYear(yearToUse)) {
	                getParsingFlags(config)._overflowDayOfYear = true;
	            }

	            date = createUTCDate(yearToUse, 0, config._dayOfYear);
	            config._a[MONTH] = date.getUTCMonth();
	            config._a[DATE] = date.getUTCDate();
	        }

	        // Default to current date.
	        // * if no year, month, day of month are given, default to today
	        // * if day of month is given, default month and year
	        // * if month is given, default only year
	        // * if year is given, don't default anything
	        for (i = 0; i < 3 && config._a[i] == null; ++i) {
	            config._a[i] = input[i] = currentDate[i];
	        }

	        // Zero out whatever was not defaulted, including time
	        for (; i < 7; i++) {
	            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
	        }

	        // Check for 24:00:00.000
	        if (config._a[HOUR] === 24 &&
	                config._a[MINUTE] === 0 &&
	                config._a[SECOND] === 0 &&
	                config._a[MILLISECOND] === 0) {
	            config._nextDay = true;
	            config._a[HOUR] = 0;
	        }

	        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
	        // Apply timezone offset from input. The actual utcOffset can be changed
	        // with parseZone.
	        if (config._tzm != null) {
	            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
	        }

	        if (config._nextDay) {
	            config._a[HOUR] = 24;
	        }
	    }

	    function dayOfYearFromWeekInfo(config) {
	        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

	        w = config._w;
	        if (w.GG != null || w.W != null || w.E != null) {
	            dow = 1;
	            doy = 4;

	            // TODO: We need to take the current isoWeekYear, but that depends on
	            // how we interpret now (local, utc, fixed offset). So create
	            // a now version of current config (take local/utc/offset flags, and
	            // create now).
	            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
	            week = defaults(w.W, 1);
	            weekday = defaults(w.E, 1);
	            if (weekday < 1 || weekday > 7) {
	                weekdayOverflow = true;
	            }
	        } else {
	            dow = config._locale._week.dow;
	            doy = config._locale._week.doy;

	            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
	            week = defaults(w.w, 1);

	            if (w.d != null) {
	                // weekday -- low day numbers are considered next week
	                weekday = w.d;
	                if (weekday < 0 || weekday > 6) {
	                    weekdayOverflow = true;
	                }
	            } else if (w.e != null) {
	                // local weekday -- counting starts from begining of week
	                weekday = w.e + dow;
	                if (w.e < 0 || w.e > 6) {
	                    weekdayOverflow = true;
	                }
	            } else {
	                // default to begining of week
	                weekday = dow;
	            }
	        }
	        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
	            getParsingFlags(config)._overflowWeeks = true;
	        } else if (weekdayOverflow != null) {
	            getParsingFlags(config)._overflowWeekday = true;
	        } else {
	            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
	            config._a[YEAR] = temp.year;
	            config._dayOfYear = temp.dayOfYear;
	        }
	    }

	    // constant that refers to the ISO standard
	    utils_hooks__hooks.ISO_8601 = function () {};

	    // date from string and format string
	    function configFromStringAndFormat(config) {
	        // TODO: Move this to another part of the creation flow to prevent circular deps
	        if (config._f === utils_hooks__hooks.ISO_8601) {
	            configFromISO(config);
	            return;
	        }

	        config._a = [];
	        getParsingFlags(config).empty = true;

	        // This array is used to make a Date, either with `new Date` or `Date.UTC`
	        var string = '' + config._i,
	            i, parsedInput, tokens, token, skipped,
	            stringLength = string.length,
	            totalParsedInputLength = 0;

	        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

	        for (i = 0; i < tokens.length; i++) {
	            token = tokens[i];
	            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
	            // console.log('token', token, 'parsedInput', parsedInput,
	            //         'regex', getParseRegexForToken(token, config));
	            if (parsedInput) {
	                skipped = string.substr(0, string.indexOf(parsedInput));
	                if (skipped.length > 0) {
	                    getParsingFlags(config).unusedInput.push(skipped);
	                }
	                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
	                totalParsedInputLength += parsedInput.length;
	            }
	            // don't parse if it's not a known token
	            if (formatTokenFunctions[token]) {
	                if (parsedInput) {
	                    getParsingFlags(config).empty = false;
	                }
	                else {
	                    getParsingFlags(config).unusedTokens.push(token);
	                }
	                addTimeToArrayFromToken(token, parsedInput, config);
	            }
	            else if (config._strict && !parsedInput) {
	                getParsingFlags(config).unusedTokens.push(token);
	            }
	        }

	        // add remaining unparsed input length to the string
	        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
	        if (string.length > 0) {
	            getParsingFlags(config).unusedInput.push(string);
	        }

	        // clear _12h flag if hour is <= 12
	        if (config._a[HOUR] <= 12 &&
	            getParsingFlags(config).bigHour === true &&
	            config._a[HOUR] > 0) {
	            getParsingFlags(config).bigHour = undefined;
	        }

	        getParsingFlags(config).parsedDateParts = config._a.slice(0);
	        getParsingFlags(config).meridiem = config._meridiem;
	        // handle meridiem
	        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

	        configFromArray(config);
	        checkOverflow(config);
	    }


	    function meridiemFixWrap (locale, hour, meridiem) {
	        var isPm;

	        if (meridiem == null) {
	            // nothing to do
	            return hour;
	        }
	        if (locale.meridiemHour != null) {
	            return locale.meridiemHour(hour, meridiem);
	        } else if (locale.isPM != null) {
	            // Fallback
	            isPm = locale.isPM(meridiem);
	            if (isPm && hour < 12) {
	                hour += 12;
	            }
	            if (!isPm && hour === 12) {
	                hour = 0;
	            }
	            return hour;
	        } else {
	            // this is not supposed to happen
	            return hour;
	        }
	    }

	    // date from string and array of format strings
	    function configFromStringAndArray(config) {
	        var tempConfig,
	            bestMoment,

	            scoreToBeat,
	            i,
	            currentScore;

	        if (config._f.length === 0) {
	            getParsingFlags(config).invalidFormat = true;
	            config._d = new Date(NaN);
	            return;
	        }

	        for (i = 0; i < config._f.length; i++) {
	            currentScore = 0;
	            tempConfig = copyConfig({}, config);
	            if (config._useUTC != null) {
	                tempConfig._useUTC = config._useUTC;
	            }
	            tempConfig._f = config._f[i];
	            configFromStringAndFormat(tempConfig);

	            if (!valid__isValid(tempConfig)) {
	                continue;
	            }

	            // if there is any input that was not parsed add a penalty for that format
	            currentScore += getParsingFlags(tempConfig).charsLeftOver;

	            //or tokens
	            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

	            getParsingFlags(tempConfig).score = currentScore;

	            if (scoreToBeat == null || currentScore < scoreToBeat) {
	                scoreToBeat = currentScore;
	                bestMoment = tempConfig;
	            }
	        }

	        extend(config, bestMoment || tempConfig);
	    }

	    function configFromObject(config) {
	        if (config._d) {
	            return;
	        }

	        var i = normalizeObjectUnits(config._i);
	        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
	            return obj && parseInt(obj, 10);
	        });

	        configFromArray(config);
	    }

	    function createFromConfig (config) {
	        var res = new Moment(checkOverflow(prepareConfig(config)));
	        if (res._nextDay) {
	            // Adding is smart enough around DST
	            res.add(1, 'd');
	            res._nextDay = undefined;
	        }

	        return res;
	    }

	    function prepareConfig (config) {
	        var input = config._i,
	            format = config._f;

	        config._locale = config._locale || locale_locales__getLocale(config._l);

	        if (input === null || (format === undefined && input === '')) {
	            return valid__createInvalid({nullInput: true});
	        }

	        if (typeof input === 'string') {
	            config._i = input = config._locale.preparse(input);
	        }

	        if (isMoment(input)) {
	            return new Moment(checkOverflow(input));
	        } else if (isArray(format)) {
	            configFromStringAndArray(config);
	        } else if (isDate(input)) {
	            config._d = input;
	        } else if (format) {
	            configFromStringAndFormat(config);
	        }  else {
	            configFromInput(config);
	        }

	        if (!valid__isValid(config)) {
	            config._d = null;
	        }

	        return config;
	    }

	    function configFromInput(config) {
	        var input = config._i;
	        if (input === undefined) {
	            config._d = new Date(utils_hooks__hooks.now());
	        } else if (isDate(input)) {
	            config._d = new Date(input.valueOf());
	        } else if (typeof input === 'string') {
	            configFromString(config);
	        } else if (isArray(input)) {
	            config._a = map(input.slice(0), function (obj) {
	                return parseInt(obj, 10);
	            });
	            configFromArray(config);
	        } else if (typeof(input) === 'object') {
	            configFromObject(config);
	        } else if (typeof(input) === 'number') {
	            // from milliseconds
	            config._d = new Date(input);
	        } else {
	            utils_hooks__hooks.createFromInputFallback(config);
	        }
	    }

	    function createLocalOrUTC (input, format, locale, strict, isUTC) {
	        var c = {};

	        if (typeof(locale) === 'boolean') {
	            strict = locale;
	            locale = undefined;
	        }

	        if ((isObject(input) && isObjectEmpty(input)) ||
	                (isArray(input) && input.length === 0)) {
	            input = undefined;
	        }
	        // object construction must be done this way.
	        // https://github.com/moment/moment/issues/1423
	        c._isAMomentObject = true;
	        c._useUTC = c._isUTC = isUTC;
	        c._l = locale;
	        c._i = input;
	        c._f = format;
	        c._strict = strict;

	        return createFromConfig(c);
	    }

	    function local__createLocal (input, format, locale, strict) {
	        return createLocalOrUTC(input, format, locale, strict, false);
	    }

	    var prototypeMin = deprecate(
	        'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
	        function () {
	            var other = local__createLocal.apply(null, arguments);
	            if (this.isValid() && other.isValid()) {
	                return other < this ? this : other;
	            } else {
	                return valid__createInvalid();
	            }
	        }
	    );

	    var prototypeMax = deprecate(
	        'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
	        function () {
	            var other = local__createLocal.apply(null, arguments);
	            if (this.isValid() && other.isValid()) {
	                return other > this ? this : other;
	            } else {
	                return valid__createInvalid();
	            }
	        }
	    );

	    // Pick a moment m from moments so that m[fn](other) is true for all
	    // other. This relies on the function fn to be transitive.
	    //
	    // moments should either be an array of moment objects or an array, whose
	    // first element is an array of moment objects.
	    function pickBy(fn, moments) {
	        var res, i;
	        if (moments.length === 1 && isArray(moments[0])) {
	            moments = moments[0];
	        }
	        if (!moments.length) {
	            return local__createLocal();
	        }
	        res = moments[0];
	        for (i = 1; i < moments.length; ++i) {
	            if (!moments[i].isValid() || moments[i][fn](res)) {
	                res = moments[i];
	            }
	        }
	        return res;
	    }

	    // TODO: Use [].sort instead?
	    function min () {
	        var args = [].slice.call(arguments, 0);

	        return pickBy('isBefore', args);
	    }

	    function max () {
	        var args = [].slice.call(arguments, 0);

	        return pickBy('isAfter', args);
	    }

	    var now = function () {
	        return Date.now ? Date.now() : +(new Date());
	    };

	    function Duration (duration) {
	        var normalizedInput = normalizeObjectUnits(duration),
	            years = normalizedInput.year || 0,
	            quarters = normalizedInput.quarter || 0,
	            months = normalizedInput.month || 0,
	            weeks = normalizedInput.week || 0,
	            days = normalizedInput.day || 0,
	            hours = normalizedInput.hour || 0,
	            minutes = normalizedInput.minute || 0,
	            seconds = normalizedInput.second || 0,
	            milliseconds = normalizedInput.millisecond || 0;

	        // representation for dateAddRemove
	        this._milliseconds = +milliseconds +
	            seconds * 1e3 + // 1000
	            minutes * 6e4 + // 1000 * 60
	            hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
	        // Because of dateAddRemove treats 24 hours as different from a
	        // day when working around DST, we need to store them separately
	        this._days = +days +
	            weeks * 7;
	        // It is impossible translate months into days without knowing
	        // which months you are are talking about, so we have to store
	        // it separately.
	        this._months = +months +
	            quarters * 3 +
	            years * 12;

	        this._data = {};

	        this._locale = locale_locales__getLocale();

	        this._bubble();
	    }

	    function isDuration (obj) {
	        return obj instanceof Duration;
	    }

	    function absRound (number) {
	        if (number < 0) {
	            return Math.round(-1 * number) * -1;
	        } else {
	            return Math.round(number);
	        }
	    }

	    // FORMATTING

	    function offset (token, separator) {
	        addFormatToken(token, 0, 0, function () {
	            var offset = this.utcOffset();
	            var sign = '+';
	            if (offset < 0) {
	                offset = -offset;
	                sign = '-';
	            }
	            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
	        });
	    }

	    offset('Z', ':');
	    offset('ZZ', '');

	    // PARSING

	    addRegexToken('Z',  matchShortOffset);
	    addRegexToken('ZZ', matchShortOffset);
	    addParseToken(['Z', 'ZZ'], function (input, array, config) {
	        config._useUTC = true;
	        config._tzm = offsetFromString(matchShortOffset, input);
	    });

	    // HELPERS

	    // timezone chunker
	    // '+10:00' > ['10',  '00']
	    // '-1530'  > ['-15', '30']
	    var chunkOffset = /([\+\-]|\d\d)/gi;

	    function offsetFromString(matcher, string) {
	        var matches = ((string || '').match(matcher) || []);
	        var chunk   = matches[matches.length - 1] || [];
	        var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
	        var minutes = +(parts[1] * 60) + toInt(parts[2]);

	        return parts[0] === '+' ? minutes : -minutes;
	    }

	    // Return a moment from input, that is local/utc/zone equivalent to model.
	    function cloneWithOffset(input, model) {
	        var res, diff;
	        if (model._isUTC) {
	            res = model.clone();
	            diff = (isMoment(input) || isDate(input) ? input.valueOf() : local__createLocal(input).valueOf()) - res.valueOf();
	            // Use low-level api, because this fn is low-level api.
	            res._d.setTime(res._d.valueOf() + diff);
	            utils_hooks__hooks.updateOffset(res, false);
	            return res;
	        } else {
	            return local__createLocal(input).local();
	        }
	    }

	    function getDateOffset (m) {
	        // On Firefox.24 Date#getTimezoneOffset returns a floating point.
	        // https://github.com/moment/moment/pull/1871
	        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
	    }

	    // HOOKS

	    // This function will be called whenever a moment is mutated.
	    // It is intended to keep the offset in sync with the timezone.
	    utils_hooks__hooks.updateOffset = function () {};

	    // MOMENTS

	    // keepLocalTime = true means only change the timezone, without
	    // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	    // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	    // +0200, so we adjust the time as needed, to be valid.
	    //
	    // Keeping the time actually adds/subtracts (one hour)
	    // from the actual represented time. That is why we call updateOffset
	    // a second time. In case it wants us to change the offset again
	    // _changeInProgress == true case, then we have to adjust, because
	    // there is no such time in the given timezone.
	    function getSetOffset (input, keepLocalTime) {
	        var offset = this._offset || 0,
	            localAdjust;
	        if (!this.isValid()) {
	            return input != null ? this : NaN;
	        }
	        if (input != null) {
	            if (typeof input === 'string') {
	                input = offsetFromString(matchShortOffset, input);
	            } else if (Math.abs(input) < 16) {
	                input = input * 60;
	            }
	            if (!this._isUTC && keepLocalTime) {
	                localAdjust = getDateOffset(this);
	            }
	            this._offset = input;
	            this._isUTC = true;
	            if (localAdjust != null) {
	                this.add(localAdjust, 'm');
	            }
	            if (offset !== input) {
	                if (!keepLocalTime || this._changeInProgress) {
	                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
	                } else if (!this._changeInProgress) {
	                    this._changeInProgress = true;
	                    utils_hooks__hooks.updateOffset(this, true);
	                    this._changeInProgress = null;
	                }
	            }
	            return this;
	        } else {
	            return this._isUTC ? offset : getDateOffset(this);
	        }
	    }

	    function getSetZone (input, keepLocalTime) {
	        if (input != null) {
	            if (typeof input !== 'string') {
	                input = -input;
	            }

	            this.utcOffset(input, keepLocalTime);

	            return this;
	        } else {
	            return -this.utcOffset();
	        }
	    }

	    function setOffsetToUTC (keepLocalTime) {
	        return this.utcOffset(0, keepLocalTime);
	    }

	    function setOffsetToLocal (keepLocalTime) {
	        if (this._isUTC) {
	            this.utcOffset(0, keepLocalTime);
	            this._isUTC = false;

	            if (keepLocalTime) {
	                this.subtract(getDateOffset(this), 'm');
	            }
	        }
	        return this;
	    }

	    function setOffsetToParsedOffset () {
	        if (this._tzm) {
	            this.utcOffset(this._tzm);
	        } else if (typeof this._i === 'string') {
	            var tZone = offsetFromString(matchOffset, this._i);

	            if (tZone === 0) {
	                this.utcOffset(0, true);
	            } else {
	                this.utcOffset(offsetFromString(matchOffset, this._i));
	            }
	        }
	        return this;
	    }

	    function hasAlignedHourOffset (input) {
	        if (!this.isValid()) {
	            return false;
	        }
	        input = input ? local__createLocal(input).utcOffset() : 0;

	        return (this.utcOffset() - input) % 60 === 0;
	    }

	    function isDaylightSavingTime () {
	        return (
	            this.utcOffset() > this.clone().month(0).utcOffset() ||
	            this.utcOffset() > this.clone().month(5).utcOffset()
	        );
	    }

	    function isDaylightSavingTimeShifted () {
	        if (!isUndefined(this._isDSTShifted)) {
	            return this._isDSTShifted;
	        }

	        var c = {};

	        copyConfig(c, this);
	        c = prepareConfig(c);

	        if (c._a) {
	            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
	            this._isDSTShifted = this.isValid() &&
	                compareArrays(c._a, other.toArray()) > 0;
	        } else {
	            this._isDSTShifted = false;
	        }

	        return this._isDSTShifted;
	    }

	    function isLocal () {
	        return this.isValid() ? !this._isUTC : false;
	    }

	    function isUtcOffset () {
	        return this.isValid() ? this._isUTC : false;
	    }

	    function isUtc () {
	        return this.isValid() ? this._isUTC && this._offset === 0 : false;
	    }

	    // ASP.NET json date format regex
	    var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

	    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	    // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	    // and further modified to allow for strings containing both week and day
	    var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

	    function create__createDuration (input, key) {
	        var duration = input,
	            // matching against regexp is expensive, do it on demand
	            match = null,
	            sign,
	            ret,
	            diffRes;

	        if (isDuration(input)) {
	            duration = {
	                ms : input._milliseconds,
	                d  : input._days,
	                M  : input._months
	            };
	        } else if (typeof input === 'number') {
	            duration = {};
	            if (key) {
	                duration[key] = input;
	            } else {
	                duration.milliseconds = input;
	            }
	        } else if (!!(match = aspNetRegex.exec(input))) {
	            sign = (match[1] === '-') ? -1 : 1;
	            duration = {
	                y  : 0,
	                d  : toInt(match[DATE])                         * sign,
	                h  : toInt(match[HOUR])                         * sign,
	                m  : toInt(match[MINUTE])                       * sign,
	                s  : toInt(match[SECOND])                       * sign,
	                ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
	            };
	        } else if (!!(match = isoRegex.exec(input))) {
	            sign = (match[1] === '-') ? -1 : 1;
	            duration = {
	                y : parseIso(match[2], sign),
	                M : parseIso(match[3], sign),
	                w : parseIso(match[4], sign),
	                d : parseIso(match[5], sign),
	                h : parseIso(match[6], sign),
	                m : parseIso(match[7], sign),
	                s : parseIso(match[8], sign)
	            };
	        } else if (duration == null) {// checks for null or undefined
	            duration = {};
	        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
	            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));

	            duration = {};
	            duration.ms = diffRes.milliseconds;
	            duration.M = diffRes.months;
	        }

	        ret = new Duration(duration);

	        if (isDuration(input) && hasOwnProp(input, '_locale')) {
	            ret._locale = input._locale;
	        }

	        return ret;
	    }

	    create__createDuration.fn = Duration.prototype;

	    function parseIso (inp, sign) {
	        // We'd normally use ~~inp for this, but unfortunately it also
	        // converts floats to ints.
	        // inp may be undefined, so careful calling replace on it.
	        var res = inp && parseFloat(inp.replace(',', '.'));
	        // apply sign while we're at it
	        return (isNaN(res) ? 0 : res) * sign;
	    }

	    function positiveMomentsDifference(base, other) {
	        var res = {milliseconds: 0, months: 0};

	        res.months = other.month() - base.month() +
	            (other.year() - base.year()) * 12;
	        if (base.clone().add(res.months, 'M').isAfter(other)) {
	            --res.months;
	        }

	        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

	        return res;
	    }

	    function momentsDifference(base, other) {
	        var res;
	        if (!(base.isValid() && other.isValid())) {
	            return {milliseconds: 0, months: 0};
	        }

	        other = cloneWithOffset(other, base);
	        if (base.isBefore(other)) {
	            res = positiveMomentsDifference(base, other);
	        } else {
	            res = positiveMomentsDifference(other, base);
	            res.milliseconds = -res.milliseconds;
	            res.months = -res.months;
	        }

	        return res;
	    }

	    // TODO: remove 'name' arg after deprecation is removed
	    function createAdder(direction, name) {
	        return function (val, period) {
	            var dur, tmp;
	            //invert the arguments, but complain about it
	            if (period !== null && !isNaN(+period)) {
	                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
	                'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
	                tmp = val; val = period; period = tmp;
	            }

	            val = typeof val === 'string' ? +val : val;
	            dur = create__createDuration(val, period);
	            add_subtract__addSubtract(this, dur, direction);
	            return this;
	        };
	    }

	    function add_subtract__addSubtract (mom, duration, isAdding, updateOffset) {
	        var milliseconds = duration._milliseconds,
	            days = absRound(duration._days),
	            months = absRound(duration._months);

	        if (!mom.isValid()) {
	            // No op
	            return;
	        }

	        updateOffset = updateOffset == null ? true : updateOffset;

	        if (milliseconds) {
	            mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
	        }
	        if (days) {
	            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
	        }
	        if (months) {
	            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
	        }
	        if (updateOffset) {
	            utils_hooks__hooks.updateOffset(mom, days || months);
	        }
	    }

	    var add_subtract__add      = createAdder(1, 'add');
	    var add_subtract__subtract = createAdder(-1, 'subtract');

	    function getCalendarFormat(myMoment, now) {
	        var diff = myMoment.diff(now, 'days', true);
	        return diff < -6 ? 'sameElse' :
	                diff < -1 ? 'lastWeek' :
	                diff < 0 ? 'lastDay' :
	                diff < 1 ? 'sameDay' :
	                diff < 2 ? 'nextDay' :
	                diff < 7 ? 'nextWeek' : 'sameElse';
	    }

	    function moment_calendar__calendar (time, formats) {
	        // We want to compare the start of today, vs this.
	        // Getting start-of-today depends on whether we're local/utc/offset or not.
	        var now = time || local__createLocal(),
	            sod = cloneWithOffset(now, this).startOf('day'),
	            format = utils_hooks__hooks.calendarFormat(this, sod) || 'sameElse';

	        var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

	        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
	    }

	    function clone () {
	        return new Moment(this);
	    }

	    function isAfter (input, units) {
	        var localInput = isMoment(input) ? input : local__createLocal(input);
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	        if (units === 'millisecond') {
	            return this.valueOf() > localInput.valueOf();
	        } else {
	            return localInput.valueOf() < this.clone().startOf(units).valueOf();
	        }
	    }

	    function isBefore (input, units) {
	        var localInput = isMoment(input) ? input : local__createLocal(input);
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	        if (units === 'millisecond') {
	            return this.valueOf() < localInput.valueOf();
	        } else {
	            return this.clone().endOf(units).valueOf() < localInput.valueOf();
	        }
	    }

	    function isBetween (from, to, units, inclusivity) {
	        inclusivity = inclusivity || '()';
	        return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
	            (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
	    }

	    function isSame (input, units) {
	        var localInput = isMoment(input) ? input : local__createLocal(input),
	            inputMs;
	        if (!(this.isValid() && localInput.isValid())) {
	            return false;
	        }
	        units = normalizeUnits(units || 'millisecond');
	        if (units === 'millisecond') {
	            return this.valueOf() === localInput.valueOf();
	        } else {
	            inputMs = localInput.valueOf();
	            return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
	        }
	    }

	    function isSameOrAfter (input, units) {
	        return this.isSame(input, units) || this.isAfter(input,units);
	    }

	    function isSameOrBefore (input, units) {
	        return this.isSame(input, units) || this.isBefore(input,units);
	    }

	    function diff (input, units, asFloat) {
	        var that,
	            zoneDelta,
	            delta, output;

	        if (!this.isValid()) {
	            return NaN;
	        }

	        that = cloneWithOffset(input, this);

	        if (!that.isValid()) {
	            return NaN;
	        }

	        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

	        units = normalizeUnits(units);

	        if (units === 'year' || units === 'month' || units === 'quarter') {
	            output = monthDiff(this, that);
	            if (units === 'quarter') {
	                output = output / 3;
	            } else if (units === 'year') {
	                output = output / 12;
	            }
	        } else {
	            delta = this - that;
	            output = units === 'second' ? delta / 1e3 : // 1000
	                units === 'minute' ? delta / 6e4 : // 1000 * 60
	                units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
	                units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
	                units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
	                delta;
	        }
	        return asFloat ? output : absFloor(output);
	    }

	    function monthDiff (a, b) {
	        // difference in months
	        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
	            // b is in (anchor - 1 month, anchor + 1 month)
	            anchor = a.clone().add(wholeMonthDiff, 'months'),
	            anchor2, adjust;

	        if (b - anchor < 0) {
	            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
	            // linear across the month
	            adjust = (b - anchor) / (anchor - anchor2);
	        } else {
	            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
	            // linear across the month
	            adjust = (b - anchor) / (anchor2 - anchor);
	        }

	        //check for negative zero, return zero if negative zero
	        return -(wholeMonthDiff + adjust) || 0;
	    }

	    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
	    utils_hooks__hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

	    function toString () {
	        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
	    }

	    function moment_format__toISOString () {
	        var m = this.clone().utc();
	        if (0 < m.year() && m.year() <= 9999) {
	            if (isFunction(Date.prototype.toISOString)) {
	                // native implementation is ~50x faster, use it when we can
	                return this.toDate().toISOString();
	            } else {
	                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	            }
	        } else {
	            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	        }
	    }

	    function format (inputString) {
	        if (!inputString) {
	            inputString = this.isUtc() ? utils_hooks__hooks.defaultFormatUtc : utils_hooks__hooks.defaultFormat;
	        }
	        var output = formatMoment(this, inputString);
	        return this.localeData().postformat(output);
	    }

	    function from (time, withoutSuffix) {
	        if (this.isValid() &&
	                ((isMoment(time) && time.isValid()) ||
	                 local__createLocal(time).isValid())) {
	            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
	        } else {
	            return this.localeData().invalidDate();
	        }
	    }

	    function fromNow (withoutSuffix) {
	        return this.from(local__createLocal(), withoutSuffix);
	    }

	    function to (time, withoutSuffix) {
	        if (this.isValid() &&
	                ((isMoment(time) && time.isValid()) ||
	                 local__createLocal(time).isValid())) {
	            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
	        } else {
	            return this.localeData().invalidDate();
	        }
	    }

	    function toNow (withoutSuffix) {
	        return this.to(local__createLocal(), withoutSuffix);
	    }

	    // If passed a locale key, it will set the locale for this
	    // instance.  Otherwise, it will return the locale configuration
	    // variables for this instance.
	    function locale (key) {
	        var newLocaleData;

	        if (key === undefined) {
	            return this._locale._abbr;
	        } else {
	            newLocaleData = locale_locales__getLocale(key);
	            if (newLocaleData != null) {
	                this._locale = newLocaleData;
	            }
	            return this;
	        }
	    }

	    var lang = deprecate(
	        'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
	        function (key) {
	            if (key === undefined) {
	                return this.localeData();
	            } else {
	                return this.locale(key);
	            }
	        }
	    );

	    function localeData () {
	        return this._locale;
	    }

	    function startOf (units) {
	        units = normalizeUnits(units);
	        // the following switch intentionally omits break keywords
	        // to utilize falling through the cases.
	        switch (units) {
	            case 'year':
	                this.month(0);
	                /* falls through */
	            case 'quarter':
	            case 'month':
	                this.date(1);
	                /* falls through */
	            case 'week':
	            case 'isoWeek':
	            case 'day':
	            case 'date':
	                this.hours(0);
	                /* falls through */
	            case 'hour':
	                this.minutes(0);
	                /* falls through */
	            case 'minute':
	                this.seconds(0);
	                /* falls through */
	            case 'second':
	                this.milliseconds(0);
	        }

	        // weeks are a special case
	        if (units === 'week') {
	            this.weekday(0);
	        }
	        if (units === 'isoWeek') {
	            this.isoWeekday(1);
	        }

	        // quarters are also special
	        if (units === 'quarter') {
	            this.month(Math.floor(this.month() / 3) * 3);
	        }

	        return this;
	    }

	    function endOf (units) {
	        units = normalizeUnits(units);
	        if (units === undefined || units === 'millisecond') {
	            return this;
	        }

	        // 'date' is an alias for 'day', so it should be considered as such.
	        if (units === 'date') {
	            units = 'day';
	        }

	        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
	    }

	    function to_type__valueOf () {
	        return this._d.valueOf() - ((this._offset || 0) * 60000);
	    }

	    function unix () {
	        return Math.floor(this.valueOf() / 1000);
	    }

	    function toDate () {
	        return new Date(this.valueOf());
	    }

	    function toArray () {
	        var m = this;
	        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
	    }

	    function toObject () {
	        var m = this;
	        return {
	            years: m.year(),
	            months: m.month(),
	            date: m.date(),
	            hours: m.hours(),
	            minutes: m.minutes(),
	            seconds: m.seconds(),
	            milliseconds: m.milliseconds()
	        };
	    }

	    function toJSON () {
	        // new Date(NaN).toJSON() === null
	        return this.isValid() ? this.toISOString() : null;
	    }

	    function moment_valid__isValid () {
	        return valid__isValid(this);
	    }

	    function parsingFlags () {
	        return extend({}, getParsingFlags(this));
	    }

	    function invalidAt () {
	        return getParsingFlags(this).overflow;
	    }

	    function creationData() {
	        return {
	            input: this._i,
	            format: this._f,
	            locale: this._locale,
	            isUTC: this._isUTC,
	            strict: this._strict
	        };
	    }

	    // FORMATTING

	    addFormatToken(0, ['gg', 2], 0, function () {
	        return this.weekYear() % 100;
	    });

	    addFormatToken(0, ['GG', 2], 0, function () {
	        return this.isoWeekYear() % 100;
	    });

	    function addWeekYearFormatToken (token, getter) {
	        addFormatToken(0, [token, token.length], 0, getter);
	    }

	    addWeekYearFormatToken('gggg',     'weekYear');
	    addWeekYearFormatToken('ggggg',    'weekYear');
	    addWeekYearFormatToken('GGGG',  'isoWeekYear');
	    addWeekYearFormatToken('GGGGG', 'isoWeekYear');

	    // ALIASES

	    addUnitAlias('weekYear', 'gg');
	    addUnitAlias('isoWeekYear', 'GG');

	    // PRIORITY

	    addUnitPriority('weekYear', 1);
	    addUnitPriority('isoWeekYear', 1);


	    // PARSING

	    addRegexToken('G',      matchSigned);
	    addRegexToken('g',      matchSigned);
	    addRegexToken('GG',     match1to2, match2);
	    addRegexToken('gg',     match1to2, match2);
	    addRegexToken('GGGG',   match1to4, match4);
	    addRegexToken('gggg',   match1to4, match4);
	    addRegexToken('GGGGG',  match1to6, match6);
	    addRegexToken('ggggg',  match1to6, match6);

	    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
	        week[token.substr(0, 2)] = toInt(input);
	    });

	    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
	        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
	    });

	    // MOMENTS

	    function getSetWeekYear (input) {
	        return getSetWeekYearHelper.call(this,
	                input,
	                this.week(),
	                this.weekday(),
	                this.localeData()._week.dow,
	                this.localeData()._week.doy);
	    }

	    function getSetISOWeekYear (input) {
	        return getSetWeekYearHelper.call(this,
	                input, this.isoWeek(), this.isoWeekday(), 1, 4);
	    }

	    function getISOWeeksInYear () {
	        return weeksInYear(this.year(), 1, 4);
	    }

	    function getWeeksInYear () {
	        var weekInfo = this.localeData()._week;
	        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
	    }

	    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
	        var weeksTarget;
	        if (input == null) {
	            return weekOfYear(this, dow, doy).year;
	        } else {
	            weeksTarget = weeksInYear(input, dow, doy);
	            if (week > weeksTarget) {
	                week = weeksTarget;
	            }
	            return setWeekAll.call(this, input, week, weekday, dow, doy);
	        }
	    }

	    function setWeekAll(weekYear, week, weekday, dow, doy) {
	        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
	            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

	        this.year(date.getUTCFullYear());
	        this.month(date.getUTCMonth());
	        this.date(date.getUTCDate());
	        return this;
	    }

	    // FORMATTING

	    addFormatToken('Q', 0, 'Qo', 'quarter');

	    // ALIASES

	    addUnitAlias('quarter', 'Q');

	    // PRIORITY

	    addUnitPriority('quarter', 7);

	    // PARSING

	    addRegexToken('Q', match1);
	    addParseToken('Q', function (input, array) {
	        array[MONTH] = (toInt(input) - 1) * 3;
	    });

	    // MOMENTS

	    function getSetQuarter (input) {
	        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
	    }

	    // FORMATTING

	    addFormatToken('D', ['DD', 2], 'Do', 'date');

	    // ALIASES

	    addUnitAlias('date', 'D');

	    // PRIOROITY
	    addUnitPriority('date', 9);

	    // PARSING

	    addRegexToken('D',  match1to2);
	    addRegexToken('DD', match1to2, match2);
	    addRegexToken('Do', function (isStrict, locale) {
	        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
	    });

	    addParseToken(['D', 'DD'], DATE);
	    addParseToken('Do', function (input, array) {
	        array[DATE] = toInt(input.match(match1to2)[0], 10);
	    });

	    // MOMENTS

	    var getSetDayOfMonth = makeGetSet('Date', true);

	    // FORMATTING

	    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

	    // ALIASES

	    addUnitAlias('dayOfYear', 'DDD');

	    // PRIORITY
	    addUnitPriority('dayOfYear', 4);

	    // PARSING

	    addRegexToken('DDD',  match1to3);
	    addRegexToken('DDDD', match3);
	    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
	        config._dayOfYear = toInt(input);
	    });

	    // HELPERS

	    // MOMENTS

	    function getSetDayOfYear (input) {
	        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
	        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
	    }

	    // FORMATTING

	    addFormatToken('m', ['mm', 2], 0, 'minute');

	    // ALIASES

	    addUnitAlias('minute', 'm');

	    // PRIORITY

	    addUnitPriority('minute', 14);

	    // PARSING

	    addRegexToken('m',  match1to2);
	    addRegexToken('mm', match1to2, match2);
	    addParseToken(['m', 'mm'], MINUTE);

	    // MOMENTS

	    var getSetMinute = makeGetSet('Minutes', false);

	    // FORMATTING

	    addFormatToken('s', ['ss', 2], 0, 'second');

	    // ALIASES

	    addUnitAlias('second', 's');

	    // PRIORITY

	    addUnitPriority('second', 15);

	    // PARSING

	    addRegexToken('s',  match1to2);
	    addRegexToken('ss', match1to2, match2);
	    addParseToken(['s', 'ss'], SECOND);

	    // MOMENTS

	    var getSetSecond = makeGetSet('Seconds', false);

	    // FORMATTING

	    addFormatToken('S', 0, 0, function () {
	        return ~~(this.millisecond() / 100);
	    });

	    addFormatToken(0, ['SS', 2], 0, function () {
	        return ~~(this.millisecond() / 10);
	    });

	    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
	    addFormatToken(0, ['SSSS', 4], 0, function () {
	        return this.millisecond() * 10;
	    });
	    addFormatToken(0, ['SSSSS', 5], 0, function () {
	        return this.millisecond() * 100;
	    });
	    addFormatToken(0, ['SSSSSS', 6], 0, function () {
	        return this.millisecond() * 1000;
	    });
	    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
	        return this.millisecond() * 10000;
	    });
	    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
	        return this.millisecond() * 100000;
	    });
	    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
	        return this.millisecond() * 1000000;
	    });


	    // ALIASES

	    addUnitAlias('millisecond', 'ms');

	    // PRIORITY

	    addUnitPriority('millisecond', 16);

	    // PARSING

	    addRegexToken('S',    match1to3, match1);
	    addRegexToken('SS',   match1to3, match2);
	    addRegexToken('SSS',  match1to3, match3);

	    var token;
	    for (token = 'SSSS'; token.length <= 9; token += 'S') {
	        addRegexToken(token, matchUnsigned);
	    }

	    function parseMs(input, array) {
	        array[MILLISECOND] = toInt(('0.' + input) * 1000);
	    }

	    for (token = 'S'; token.length <= 9; token += 'S') {
	        addParseToken(token, parseMs);
	    }
	    // MOMENTS

	    var getSetMillisecond = makeGetSet('Milliseconds', false);

	    // FORMATTING

	    addFormatToken('z',  0, 0, 'zoneAbbr');
	    addFormatToken('zz', 0, 0, 'zoneName');

	    // MOMENTS

	    function getZoneAbbr () {
	        return this._isUTC ? 'UTC' : '';
	    }

	    function getZoneName () {
	        return this._isUTC ? 'Coordinated Universal Time' : '';
	    }

	    var momentPrototype__proto = Moment.prototype;

	    momentPrototype__proto.add               = add_subtract__add;
	    momentPrototype__proto.calendar          = moment_calendar__calendar;
	    momentPrototype__proto.clone             = clone;
	    momentPrototype__proto.diff              = diff;
	    momentPrototype__proto.endOf             = endOf;
	    momentPrototype__proto.format            = format;
	    momentPrototype__proto.from              = from;
	    momentPrototype__proto.fromNow           = fromNow;
	    momentPrototype__proto.to                = to;
	    momentPrototype__proto.toNow             = toNow;
	    momentPrototype__proto.get               = stringGet;
	    momentPrototype__proto.invalidAt         = invalidAt;
	    momentPrototype__proto.isAfter           = isAfter;
	    momentPrototype__proto.isBefore          = isBefore;
	    momentPrototype__proto.isBetween         = isBetween;
	    momentPrototype__proto.isSame            = isSame;
	    momentPrototype__proto.isSameOrAfter     = isSameOrAfter;
	    momentPrototype__proto.isSameOrBefore    = isSameOrBefore;
	    momentPrototype__proto.isValid           = moment_valid__isValid;
	    momentPrototype__proto.lang              = lang;
	    momentPrototype__proto.locale            = locale;
	    momentPrototype__proto.localeData        = localeData;
	    momentPrototype__proto.max               = prototypeMax;
	    momentPrototype__proto.min               = prototypeMin;
	    momentPrototype__proto.parsingFlags      = parsingFlags;
	    momentPrototype__proto.set               = stringSet;
	    momentPrototype__proto.startOf           = startOf;
	    momentPrototype__proto.subtract          = add_subtract__subtract;
	    momentPrototype__proto.toArray           = toArray;
	    momentPrototype__proto.toObject          = toObject;
	    momentPrototype__proto.toDate            = toDate;
	    momentPrototype__proto.toISOString       = moment_format__toISOString;
	    momentPrototype__proto.toJSON            = toJSON;
	    momentPrototype__proto.toString          = toString;
	    momentPrototype__proto.unix              = unix;
	    momentPrototype__proto.valueOf           = to_type__valueOf;
	    momentPrototype__proto.creationData      = creationData;

	    // Year
	    momentPrototype__proto.year       = getSetYear;
	    momentPrototype__proto.isLeapYear = getIsLeapYear;

	    // Week Year
	    momentPrototype__proto.weekYear    = getSetWeekYear;
	    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;

	    // Quarter
	    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;

	    // Month
	    momentPrototype__proto.month       = getSetMonth;
	    momentPrototype__proto.daysInMonth = getDaysInMonth;

	    // Week
	    momentPrototype__proto.week           = momentPrototype__proto.weeks        = getSetWeek;
	    momentPrototype__proto.isoWeek        = momentPrototype__proto.isoWeeks     = getSetISOWeek;
	    momentPrototype__proto.weeksInYear    = getWeeksInYear;
	    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;

	    // Day
	    momentPrototype__proto.date       = getSetDayOfMonth;
	    momentPrototype__proto.day        = momentPrototype__proto.days             = getSetDayOfWeek;
	    momentPrototype__proto.weekday    = getSetLocaleDayOfWeek;
	    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
	    momentPrototype__proto.dayOfYear  = getSetDayOfYear;

	    // Hour
	    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;

	    // Minute
	    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;

	    // Second
	    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;

	    // Millisecond
	    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;

	    // Offset
	    momentPrototype__proto.utcOffset            = getSetOffset;
	    momentPrototype__proto.utc                  = setOffsetToUTC;
	    momentPrototype__proto.local                = setOffsetToLocal;
	    momentPrototype__proto.parseZone            = setOffsetToParsedOffset;
	    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
	    momentPrototype__proto.isDST                = isDaylightSavingTime;
	    momentPrototype__proto.isLocal              = isLocal;
	    momentPrototype__proto.isUtcOffset          = isUtcOffset;
	    momentPrototype__proto.isUtc                = isUtc;
	    momentPrototype__proto.isUTC                = isUtc;

	    // Timezone
	    momentPrototype__proto.zoneAbbr = getZoneAbbr;
	    momentPrototype__proto.zoneName = getZoneName;

	    // Deprecations
	    momentPrototype__proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
	    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
	    momentPrototype__proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
	    momentPrototype__proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
	    momentPrototype__proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

	    var momentPrototype = momentPrototype__proto;

	    function moment__createUnix (input) {
	        return local__createLocal(input * 1000);
	    }

	    function moment__createInZone () {
	        return local__createLocal.apply(null, arguments).parseZone();
	    }

	    function preParsePostFormat (string) {
	        return string;
	    }

	    var prototype__proto = Locale.prototype;

	    prototype__proto.calendar        = locale_calendar__calendar;
	    prototype__proto.longDateFormat  = longDateFormat;
	    prototype__proto.invalidDate     = invalidDate;
	    prototype__proto.ordinal         = ordinal;
	    prototype__proto.preparse        = preParsePostFormat;
	    prototype__proto.postformat      = preParsePostFormat;
	    prototype__proto.relativeTime    = relative__relativeTime;
	    prototype__proto.pastFuture      = pastFuture;
	    prototype__proto.set             = locale_set__set;

	    // Month
	    prototype__proto.months            =        localeMonths;
	    prototype__proto.monthsShort       =        localeMonthsShort;
	    prototype__proto.monthsParse       =        localeMonthsParse;
	    prototype__proto.monthsRegex       = monthsRegex;
	    prototype__proto.monthsShortRegex  = monthsShortRegex;

	    // Week
	    prototype__proto.week = localeWeek;
	    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
	    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;

	    // Day of Week
	    prototype__proto.weekdays       =        localeWeekdays;
	    prototype__proto.weekdaysMin    =        localeWeekdaysMin;
	    prototype__proto.weekdaysShort  =        localeWeekdaysShort;
	    prototype__proto.weekdaysParse  =        localeWeekdaysParse;

	    prototype__proto.weekdaysRegex       =        weekdaysRegex;
	    prototype__proto.weekdaysShortRegex  =        weekdaysShortRegex;
	    prototype__proto.weekdaysMinRegex    =        weekdaysMinRegex;

	    // Hours
	    prototype__proto.isPM = localeIsPM;
	    prototype__proto.meridiem = localeMeridiem;

	    function lists__get (format, index, field, setter) {
	        var locale = locale_locales__getLocale();
	        var utc = create_utc__createUTC().set(setter, index);
	        return locale[field](utc, format);
	    }

	    function listMonthsImpl (format, index, field) {
	        if (typeof format === 'number') {
	            index = format;
	            format = undefined;
	        }

	        format = format || '';

	        if (index != null) {
	            return lists__get(format, index, field, 'month');
	        }

	        var i;
	        var out = [];
	        for (i = 0; i < 12; i++) {
	            out[i] = lists__get(format, i, field, 'month');
	        }
	        return out;
	    }

	    // ()
	    // (5)
	    // (fmt, 5)
	    // (fmt)
	    // (true)
	    // (true, 5)
	    // (true, fmt, 5)
	    // (true, fmt)
	    function listWeekdaysImpl (localeSorted, format, index, field) {
	        if (typeof localeSorted === 'boolean') {
	            if (typeof format === 'number') {
	                index = format;
	                format = undefined;
	            }

	            format = format || '';
	        } else {
	            format = localeSorted;
	            index = format;
	            localeSorted = false;

	            if (typeof format === 'number') {
	                index = format;
	                format = undefined;
	            }

	            format = format || '';
	        }

	        var locale = locale_locales__getLocale(),
	            shift = localeSorted ? locale._week.dow : 0;

	        if (index != null) {
	            return lists__get(format, (index + shift) % 7, field, 'day');
	        }

	        var i;
	        var out = [];
	        for (i = 0; i < 7; i++) {
	            out[i] = lists__get(format, (i + shift) % 7, field, 'day');
	        }
	        return out;
	    }

	    function lists__listMonths (format, index) {
	        return listMonthsImpl(format, index, 'months');
	    }

	    function lists__listMonthsShort (format, index) {
	        return listMonthsImpl(format, index, 'monthsShort');
	    }

	    function lists__listWeekdays (localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
	    }

	    function lists__listWeekdaysShort (localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
	    }

	    function lists__listWeekdaysMin (localeSorted, format, index) {
	        return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
	    }

	    locale_locales__getSetGlobalLocale('en', {
	        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
	        ordinal : function (number) {
	            var b = number % 10,
	                output = (toInt(number % 100 / 10) === 1) ? 'th' :
	                (b === 1) ? 'st' :
	                (b === 2) ? 'nd' :
	                (b === 3) ? 'rd' : 'th';
	            return number + output;
	        }
	    });

	    // Side effect imports
	    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
	    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);

	    var mathAbs = Math.abs;

	    function duration_abs__abs () {
	        var data           = this._data;

	        this._milliseconds = mathAbs(this._milliseconds);
	        this._days         = mathAbs(this._days);
	        this._months       = mathAbs(this._months);

	        data.milliseconds  = mathAbs(data.milliseconds);
	        data.seconds       = mathAbs(data.seconds);
	        data.minutes       = mathAbs(data.minutes);
	        data.hours         = mathAbs(data.hours);
	        data.months        = mathAbs(data.months);
	        data.years         = mathAbs(data.years);

	        return this;
	    }

	    function duration_add_subtract__addSubtract (duration, input, value, direction) {
	        var other = create__createDuration(input, value);

	        duration._milliseconds += direction * other._milliseconds;
	        duration._days         += direction * other._days;
	        duration._months       += direction * other._months;

	        return duration._bubble();
	    }

	    // supports only 2.0-style add(1, 's') or add(duration)
	    function duration_add_subtract__add (input, value) {
	        return duration_add_subtract__addSubtract(this, input, value, 1);
	    }

	    // supports only 2.0-style subtract(1, 's') or subtract(duration)
	    function duration_add_subtract__subtract (input, value) {
	        return duration_add_subtract__addSubtract(this, input, value, -1);
	    }

	    function absCeil (number) {
	        if (number < 0) {
	            return Math.floor(number);
	        } else {
	            return Math.ceil(number);
	        }
	    }

	    function bubble () {
	        var milliseconds = this._milliseconds;
	        var days         = this._days;
	        var months       = this._months;
	        var data         = this._data;
	        var seconds, minutes, hours, years, monthsFromDays;

	        // if we have a mix of positive and negative values, bubble down first
	        // check: https://github.com/moment/moment/issues/2166
	        if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
	                (milliseconds <= 0 && days <= 0 && months <= 0))) {
	            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
	            days = 0;
	            months = 0;
	        }

	        // The following code bubbles up values, see the tests for
	        // examples of what that means.
	        data.milliseconds = milliseconds % 1000;

	        seconds           = absFloor(milliseconds / 1000);
	        data.seconds      = seconds % 60;

	        minutes           = absFloor(seconds / 60);
	        data.minutes      = minutes % 60;

	        hours             = absFloor(minutes / 60);
	        data.hours        = hours % 24;

	        days += absFloor(hours / 24);

	        // convert days to months
	        monthsFromDays = absFloor(daysToMonths(days));
	        months += monthsFromDays;
	        days -= absCeil(monthsToDays(monthsFromDays));

	        // 12 months -> 1 year
	        years = absFloor(months / 12);
	        months %= 12;

	        data.days   = days;
	        data.months = months;
	        data.years  = years;

	        return this;
	    }

	    function daysToMonths (days) {
	        // 400 years have 146097 days (taking into account leap year rules)
	        // 400 years have 12 months === 4800
	        return days * 4800 / 146097;
	    }

	    function monthsToDays (months) {
	        // the reverse of daysToMonths
	        return months * 146097 / 4800;
	    }

	    function as (units) {
	        var days;
	        var months;
	        var milliseconds = this._milliseconds;

	        units = normalizeUnits(units);

	        if (units === 'month' || units === 'year') {
	            days   = this._days   + milliseconds / 864e5;
	            months = this._months + daysToMonths(days);
	            return units === 'month' ? months : months / 12;
	        } else {
	            // handle milliseconds separately because of floating point math errors (issue #1867)
	            days = this._days + Math.round(monthsToDays(this._months));
	            switch (units) {
	                case 'week'   : return days / 7     + milliseconds / 6048e5;
	                case 'day'    : return days         + milliseconds / 864e5;
	                case 'hour'   : return days * 24    + milliseconds / 36e5;
	                case 'minute' : return days * 1440  + milliseconds / 6e4;
	                case 'second' : return days * 86400 + milliseconds / 1000;
	                // Math.floor prevents floating point math errors here
	                case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
	                default: throw new Error('Unknown unit ' + units);
	            }
	        }
	    }

	    // TODO: Use this.as('ms')?
	    function duration_as__valueOf () {
	        return (
	            this._milliseconds +
	            this._days * 864e5 +
	            (this._months % 12) * 2592e6 +
	            toInt(this._months / 12) * 31536e6
	        );
	    }

	    function makeAs (alias) {
	        return function () {
	            return this.as(alias);
	        };
	    }

	    var asMilliseconds = makeAs('ms');
	    var asSeconds      = makeAs('s');
	    var asMinutes      = makeAs('m');
	    var asHours        = makeAs('h');
	    var asDays         = makeAs('d');
	    var asWeeks        = makeAs('w');
	    var asMonths       = makeAs('M');
	    var asYears        = makeAs('y');

	    function duration_get__get (units) {
	        units = normalizeUnits(units);
	        return this[units + 's']();
	    }

	    function makeGetter(name) {
	        return function () {
	            return this._data[name];
	        };
	    }

	    var milliseconds = makeGetter('milliseconds');
	    var seconds      = makeGetter('seconds');
	    var minutes      = makeGetter('minutes');
	    var hours        = makeGetter('hours');
	    var days         = makeGetter('days');
	    var months       = makeGetter('months');
	    var years        = makeGetter('years');

	    function weeks () {
	        return absFloor(this.days() / 7);
	    }

	    var round = Math.round;
	    var thresholds = {
	        s: 45,  // seconds to minute
	        m: 45,  // minutes to hour
	        h: 22,  // hours to day
	        d: 26,  // days to month
	        M: 11   // months to year
	    };

	    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
	        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	    }

	    function duration_humanize__relativeTime (posNegDuration, withoutSuffix, locale) {
	        var duration = create__createDuration(posNegDuration).abs();
	        var seconds  = round(duration.as('s'));
	        var minutes  = round(duration.as('m'));
	        var hours    = round(duration.as('h'));
	        var days     = round(duration.as('d'));
	        var months   = round(duration.as('M'));
	        var years    = round(duration.as('y'));

	        var a = seconds < thresholds.s && ['s', seconds]  ||
	                minutes <= 1           && ['m']           ||
	                minutes < thresholds.m && ['mm', minutes] ||
	                hours   <= 1           && ['h']           ||
	                hours   < thresholds.h && ['hh', hours]   ||
	                days    <= 1           && ['d']           ||
	                days    < thresholds.d && ['dd', days]    ||
	                months  <= 1           && ['M']           ||
	                months  < thresholds.M && ['MM', months]  ||
	                years   <= 1           && ['y']           || ['yy', years];

	        a[2] = withoutSuffix;
	        a[3] = +posNegDuration > 0;
	        a[4] = locale;
	        return substituteTimeAgo.apply(null, a);
	    }

	    // This function allows you to set the rounding function for relative time strings
	    function duration_humanize__getSetRelativeTimeRounding (roundingFunction) {
	        if (roundingFunction === undefined) {
	            return round;
	        }
	        if (typeof(roundingFunction) === 'function') {
	            round = roundingFunction;
	            return true;
	        }
	        return false;
	    }

	    // This function allows you to set a threshold for relative time strings
	    function duration_humanize__getSetRelativeTimeThreshold (threshold, limit) {
	        if (thresholds[threshold] === undefined) {
	            return false;
	        }
	        if (limit === undefined) {
	            return thresholds[threshold];
	        }
	        thresholds[threshold] = limit;
	        return true;
	    }

	    function humanize (withSuffix) {
	        var locale = this.localeData();
	        var output = duration_humanize__relativeTime(this, !withSuffix, locale);

	        if (withSuffix) {
	            output = locale.pastFuture(+this, output);
	        }

	        return locale.postformat(output);
	    }

	    var iso_string__abs = Math.abs;

	    function iso_string__toISOString() {
	        // for ISO strings we do not use the normal bubbling rules:
	        //  * milliseconds bubble up until they become hours
	        //  * days do not bubble at all
	        //  * months bubble up until they become years
	        // This is because there is no context-free conversion between hours and days
	        // (think of clock changes)
	        // and also not between days and months (28-31 days per month)
	        var seconds = iso_string__abs(this._milliseconds) / 1000;
	        var days         = iso_string__abs(this._days);
	        var months       = iso_string__abs(this._months);
	        var minutes, hours, years;

	        // 3600 seconds -> 60 minutes -> 1 hour
	        minutes           = absFloor(seconds / 60);
	        hours             = absFloor(minutes / 60);
	        seconds %= 60;
	        minutes %= 60;

	        // 12 months -> 1 year
	        years  = absFloor(months / 12);
	        months %= 12;


	        // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	        var Y = years;
	        var M = months;
	        var D = days;
	        var h = hours;
	        var m = minutes;
	        var s = seconds;
	        var total = this.asSeconds();

	        if (!total) {
	            // this is the same as C#'s (Noda) and python (isodate)...
	            // but not other JS (goog.date)
	            return 'P0D';
	        }

	        return (total < 0 ? '-' : '') +
	            'P' +
	            (Y ? Y + 'Y' : '') +
	            (M ? M + 'M' : '') +
	            (D ? D + 'D' : '') +
	            ((h || m || s) ? 'T' : '') +
	            (h ? h + 'H' : '') +
	            (m ? m + 'M' : '') +
	            (s ? s + 'S' : '');
	    }

	    var duration_prototype__proto = Duration.prototype;

	    duration_prototype__proto.abs            = duration_abs__abs;
	    duration_prototype__proto.add            = duration_add_subtract__add;
	    duration_prototype__proto.subtract       = duration_add_subtract__subtract;
	    duration_prototype__proto.as             = as;
	    duration_prototype__proto.asMilliseconds = asMilliseconds;
	    duration_prototype__proto.asSeconds      = asSeconds;
	    duration_prototype__proto.asMinutes      = asMinutes;
	    duration_prototype__proto.asHours        = asHours;
	    duration_prototype__proto.asDays         = asDays;
	    duration_prototype__proto.asWeeks        = asWeeks;
	    duration_prototype__proto.asMonths       = asMonths;
	    duration_prototype__proto.asYears        = asYears;
	    duration_prototype__proto.valueOf        = duration_as__valueOf;
	    duration_prototype__proto._bubble        = bubble;
	    duration_prototype__proto.get            = duration_get__get;
	    duration_prototype__proto.milliseconds   = milliseconds;
	    duration_prototype__proto.seconds        = seconds;
	    duration_prototype__proto.minutes        = minutes;
	    duration_prototype__proto.hours          = hours;
	    duration_prototype__proto.days           = days;
	    duration_prototype__proto.weeks          = weeks;
	    duration_prototype__proto.months         = months;
	    duration_prototype__proto.years          = years;
	    duration_prototype__proto.humanize       = humanize;
	    duration_prototype__proto.toISOString    = iso_string__toISOString;
	    duration_prototype__proto.toString       = iso_string__toISOString;
	    duration_prototype__proto.toJSON         = iso_string__toISOString;
	    duration_prototype__proto.locale         = locale;
	    duration_prototype__proto.localeData     = localeData;

	    // Deprecations
	    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
	    duration_prototype__proto.lang = lang;

	    // Side effect imports

	    // FORMATTING

	    addFormatToken('X', 0, 0, 'unix');
	    addFormatToken('x', 0, 0, 'valueOf');

	    // PARSING

	    addRegexToken('x', matchSigned);
	    addRegexToken('X', matchTimestamp);
	    addParseToken('X', function (input, array, config) {
	        config._d = new Date(parseFloat(input, 10) * 1000);
	    });
	    addParseToken('x', function (input, array, config) {
	        config._d = new Date(toInt(input));
	    });

	    // Side effect imports


	    utils_hooks__hooks.version = '2.15.0';

	    setHookCallback(local__createLocal);

	    utils_hooks__hooks.fn                    = momentPrototype;
	    utils_hooks__hooks.min                   = min;
	    utils_hooks__hooks.max                   = max;
	    utils_hooks__hooks.now                   = now;
	    utils_hooks__hooks.utc                   = create_utc__createUTC;
	    utils_hooks__hooks.unix                  = moment__createUnix;
	    utils_hooks__hooks.months                = lists__listMonths;
	    utils_hooks__hooks.isDate                = isDate;
	    utils_hooks__hooks.locale                = locale_locales__getSetGlobalLocale;
	    utils_hooks__hooks.invalid               = valid__createInvalid;
	    utils_hooks__hooks.duration              = create__createDuration;
	    utils_hooks__hooks.isMoment              = isMoment;
	    utils_hooks__hooks.weekdays              = lists__listWeekdays;
	    utils_hooks__hooks.parseZone             = moment__createInZone;
	    utils_hooks__hooks.localeData            = locale_locales__getLocale;
	    utils_hooks__hooks.isDuration            = isDuration;
	    utils_hooks__hooks.monthsShort           = lists__listMonthsShort;
	    utils_hooks__hooks.weekdaysMin           = lists__listWeekdaysMin;
	    utils_hooks__hooks.defineLocale          = defineLocale;
	    utils_hooks__hooks.updateLocale          = updateLocale;
	    utils_hooks__hooks.locales               = locale_locales__listLocales;
	    utils_hooks__hooks.weekdaysShort         = lists__listWeekdaysShort;
	    utils_hooks__hooks.normalizeUnits        = normalizeUnits;
	    utils_hooks__hooks.relativeTimeRounding = duration_humanize__getSetRelativeTimeRounding;
	    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
	    utils_hooks__hooks.calendarFormat        = getCalendarFormat;
	    utils_hooks__hooks.prototype             = momentPrototype;

	    var _moment = utils_hooks__hooks;

	    return _moment;

	}));
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)(module)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	exports.WqueueStateWaitExam = 0;
	exports.WqueueStateInExam = 1;
	exports.WqueueStateWaitCashier = 2;
	exports.WqueueStateWaitDrug = 3;
	exports.WqueueStateWaitReExam = 4;
	exports.WqueueStateWaitAppoint = 5;

	exports.PharmaQueueStateWaitPack = 0;
	exports.PharmaQueueStateInPack   = 1;
	exports.PharmaQueueStatePackDone = 2;

	exports.DiseaseEndReasonNotEnded = "N";
	exports.DiseaseEndReasonCured = "C";
	exports.DiseaseEndReasonStopped = "S";
	exports.DiseaseEndReasonDead = "D";

	exports.DrugCategoryNaifuku = 0;
	exports.DrugCategoryTonpuku = 1;
	exports.DrugCategoryGaiyou  = 2;

	exports.ConductKindHikaChuusha = 0;
	exports.ConductKindJoumyakuChuusha = 1;
	exports.ConductKindOtherChuusha = 2;
	exports.ConductKindGazou = 3;

	exports.ZaikeiNaifuku = 1;
	exports.ZaikeiOther = 3;
	exports.ZaikeiChuusha = 4;
	exports.ZaikeiGaiyou = 6;
	exports.ZaikeiShikaYakuzai = 8;
	exports.ZaikeiShikaTokutei = 9;

	exports.SmallestPostfixShuushokugoCode = 8000;
	exports.LargestPostfixShuushookugoCode = 8999;

	exports.MeisaiSections = [
	        "初・再診料", "医学管理等", "在宅医療", "検査", "画像診断",
	        "投薬", "注射", "処置", "その他"       
	    ];

	exports.SHUUKEI_SHOSHIN = "110";
	exports.SHUUKEI_SAISHIN_SAISHIN = "120";
	exports.SHUUKEI_SAISHIN_GAIRAIKANRI = "122";
	exports.SHUUKEI_SAISHIN_JIKANGAI = "123";
	exports.SHUUKEI_SAISHIN_KYUUJITSU = "124";
	exports.SHUUKEI_SAISHIN_SHINYA = "125";
	exports.SHUUKEI_SHIDO = "130";
	exports.SHUUKEI_ZAITAKU = "140";
	exports.SHUUKEI_TOYAKU_NAIFUKUTONPUKUCHOZAI = "210";
	exports.SHUUKEI_TOYAKU_GAIYOCHOZAI = "230";
	exports.SHUUKEI_TOYAKU_SHOHO = "250";
	exports.SHUUKEI_TOYAKU_MADOKU = "260";
	exports.SHUUKEI_TOYAKU_CHOKI = "270";
	exports.SHUUKEI_CHUSHA_SEIBUTSUETC = "300";
	exports.SHUUKEI_CHUSHA_HIKA = "311";
	exports.SHUUKEI_CHUSHA_JOMYAKU = "321";
	exports.SHUUKEI_CHUSHA_OTHERS = "331";
	exports.SHUUKEI_SHOCHI = "400";
	exports.SHUUKEI_SHUJUTSU_SHUJUTSU = "500";
	exports.SHUUKEI_SHUJUTSU_YUKETSU = "502";
	exports.SHUUKEI_MASUI = "540";
	exports.SHUUKEI_KENSA = "600";
	exports.SHUUKEI_GAZOSHINDAN = "700";
	exports.SHUUKEI_OTHERS = "800";

	exports.HOUKATSU_NONE = '00';
	exports.HOUKATSU_KETSUEKIKageKU = "01";
	exports.HOUKATSU_ENDOCRINE = "02";
	exports.HOUKATSU_HEPATITIS = "03";
	exports.HOUKATSU_TUMOR = "04";
	exports.HOUKATSU_TUMORMISC = "05";
	exports.HOUKATSU_COAGULO = "06";
	exports.HOUKATSU_AUTOANTIBODY = "07";
	exports.HOUKATSU_TOLERANCE = "08";


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var conti = __webpack_require__(4);

	exports.run = function(fun, cb){
		var f;
		if( fun instanceof Array ){
			f = function(done){
				conti.exec(fun, done);
			};
		} else {
			f = fun;
		}
		conti.enqueue(f, cb);
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var conti = __webpack_require__(4);

	var timeout = 15000;

	function request(service, data, method, cb){
		data = data || {};
		method = method || "GET";
		//var url = new URL(window.location.origin + "/service");
		var url = window.location.origin + "/service";
		var searchParams = new URLSearchParams();
		searchParams.append("_q", service);
		//url.searchParams.append("_q", service);
		var opt = {
			method: method,
			headers: {}
		};
		if( method === "GET" ){
			Object.keys(data).forEach(function(key){
				searchParams.append(key, data[key]);
			});
		}
		if( method === "POST" ){
			if( typeof data === "string" ){
				opt.body = data;
			} else {
				opt.body = JSON.stringify(data);
			}
			opt.headers["content-type"] = "application/json";
		}
		var done = false;
		var timer = setTimeout(function(){
			timer = null;
			if( !done ){
				done = true;
				cb("TIMEOUT");
			}
		}, timeout);
		url += "?" + searchParams.toString();
		conti.fetchJson(url, opt, function(err, result){
			if( timer ){
				clearTimeout()
			}
			if( !done ){
				done = true;
				cb(err, result);
			}
		});
	}

	// function request(service, data, method, cb){
	// 	data = data || {};
	// 	method = method || "GET";
	// 	var config = {
	// 		url: "./service?_q=" + service,
	//         type: method,
	// 		data: data,
	// 		dataType: "json",
	// 		success: function(list){
	// 			cb(undefined, list);
	// 		},
	// 		error: function(xhr, err, errThrown){
	// 			cb("ERROR: " + (xhr.responseText || err || errThrown));
	// 		},
	// 		timeout: 10000
	// 	};
	// 	if( method === "POST" && typeof data === "string" ){
	// 		config.contentType = "application/json";
	// 	}
	// 	$.ajax(config);
	// }

	exports.recentVisits = function(cb){
		request("recent_visits", "", "GET", cb);
	};

	exports.getPatient = function(patientId, cb){
		request("get_patient", {patient_id: patientId}, "GET", cb);
	};

	exports.calcVisits = function(patientId, cb){
		request("calc_visits", {patient_id: patientId}, "GET", cb);
	};

	exports.listFullVisits = function(patientId, offset, n, cb){
		request("list_full_visits", {patient_id: patientId, offset: offset, n: n}, "GET", cb);
	};

	exports.startExam = function(visitId, done){
		request("start_exam", {visit_id: visitId}, "POST", done);
	};

	exports.suspendExam = function(visitId, done){
		request("suspend_exam", {visit_id: visitId}, "POST", done);
	};

	exports.endExam = function(visitId, charge, done){
		request("end_exam", {visit_id: visitId, charge: charge}, "POST", done);
	};

	exports.listCurrentFullDiseases = function(patientId, cb){
		request("list_current_full_diseases", {patient_id: patientId}, "GET", cb);
	};

	exports.listFullWqueueForExam = function(cb){
		request("list_full_wqueue_for_exam", {}, "GET", cb);
	};

	exports.getVisit = function(visitId, cb){
		request("get_visit", {visit_id: +visitId}, "GET", cb);
	};

	exports.searchPatient = function(text, cb){
		request("search_patient", {text: text}, "GET", cb);
	};

	exports.listTodaysVisits = function(cb){
		request("list_todays_visits", {}, "GET", cb);
	};

	exports.startVisit = function(patientId, at, done){
		request("start_visit", {patient_id: patientId, at: at}, "POST", done);
	};

	exports.deleteVisit = function(visitId, done){
		request("delete_visit", {visit_id: visitId}, "POST", done);
	};

	exports.getText = function(textId, cb){
		request("get_text", {text_id: textId}, "GET", cb);
	};

	exports.updateText = function(text, done){
		request("update_text", text, "POST", done);
	};

	exports.deleteText = function(textId, done){
		request("delete_text", {text_id: textId}, "POST", done);
	};

	exports.enterText = function(text, cb){
		request("enter_text", text, "POST", cb);
	};

	exports.listAvailableHoken = function(patientId, at, cb){
		request("list_available_hoken", {patient_id: patientId, at: at}, "GET", cb);
	};

	exports.updateVisit = function(visit, done){
		request("update_visit", visit, "POST", done);
	};

	exports.getVisitWithFullHoken = function(visitId, cb){
		request("get_visit_with_full_hoken", {visit_id: visitId}, "GET", cb);
	};

	exports.searchIyakuhinMaster = function(text, at, cb){
		request("search_iyakuhin_master", {text: text, at: at}, "GET", cb);
	};

	exports.searchPrescExample = function(text, cb){
		request("search_presc_example", {text: text}, "GET", cb);
	};

	exports.searchFullDrugForPatient = function(patientId, text, cb){
		request("search_full_drug_for_patient", {patient_id: patientId, text: text}, "GET", cb);
	};

	exports.resolveIyakuhinMasterAt = function(iyakuhincode, at, cb){
		request("resolve_iyakuhin_master_at", {iyakuhincode: iyakuhincode, at: at}, "GET", cb);
	};

	exports.getIyakuhinMaster = function(iyakuhincode, at, cb){
		request("get_iyakuhin_master", {iyakuhincode: iyakuhincode, at: at}, "GET", cb);
	};

	exports.enterDrug = function(drug, cb){
		request("enter_drug", drug, "POST", cb);
	};

	exports.getFullDrug = function(drugId, at, cb){
		request("get_full_drug", {drug_id: drugId, at: at}, "GET", cb);
	};

	exports.listFullDrugsForVisit = function(visitId, at, cb){
		request("list_full_drugs_for_visit", {visit_id: visitId, at: at}, "GET", cb);
	};

	exports.batchEnterDrugs = function(drugs, cb){
		request("batch_enter_drugs", JSON.stringify(drugs), "POST", cb);
	};

	exports.batchDeleteDrugs = function(drugIds, done){
		request("batch_delete_drugs", JSON.stringify(drugIds), "POST", done);
	};

	exports.batchUpdateDrugsDays = function(drugIds, days, done){
		var data = {
			drug_ids: drugIds,
			days: days
		};
		request("batch_update_drugs_days", JSON.stringify(data), "POST", done);
	};

	exports.modifyDrug = function(drug, done){
		request("modify_drug", JSON.stringify(drug), "POST", done);
	};

	exports.batchResolveShinryouNamesAt = function(names, at, cb){
		var body = JSON.stringify({
			names: names,
			at: at
		});
		request("batch_resolve_shinryou_names_at", body, "POST", cb);
	};

	exports.batchEnterShinryou = function(shinryouList, cb){
		var body = JSON.stringify(shinryouList);
		request("batch_enter_shinryou", body, "POST", cb);
	};

	exports.getShinryou = function(shinryouId, cb){
		request("get_shinryou", {shinryou_id: shinryouId}, "GET", cb);
	};

	exports.getFullShinryou = function(shinryouId, at, cb){
		request("get_full_shinryou", {shinryou_id: shinryouId, at: at}, "GET", cb);
	};

	exports.listFullShinryouForVisit = function(visitId, at, cb){
		request("list_full_shinryou_for_visit", {visit_id: visitId, at: at}, "GET", cb);
	};

	exports.batchDeleteShinryou = function(shinryouIds, done){
		request("batch_delete_shinryou", JSON.stringify(shinryouIds), "POST", done);
	};

	exports.searchShinryouMaster = function(text, at, cb){
		request("search_shinryou_master", {text: text, at: at}, "GET", cb);
	};

	exports.resolveShinryouMasterAt = function(shinryoucode, at, cb){
		request("resolve_shinryou_master_at", {shinryoucode: shinryoucode, at: at}, "GET", cb);
	};

	exports.getShinryouMaster = function(shinryoucode, at, cb){
		request("get_shinryou_master", {shinryoucode: shinryoucode, at: at}, "GET", cb);
	};

	exports.enterConduct = function(conduct, cb){
		request("enter_conduct", JSON.stringify(conduct), "POST", cb);
	};

	exports.enterGazouLabel = function(gazouLabel, done){
		request("enter_gazou_label", JSON.stringify(gazouLabel), "POST", done);
	};

	exports.enterConductDrug = function(conductDrug, cb){
		request("enter_conduct_drug", JSON.stringify(conductDrug), "POST", cb);
	};

	exports.enterConductKizai = function(conductKizai, cb){
		request("enter_conduct_kizai", JSON.stringify(conductKizai), "POST", cb);
	};

	exports.resolveKizaiNameAt = function(name, at, cb){
		var data = {
			name: name,
			at: at
		};
		request("resolve_kizai_name_at", data, "GET", cb);
	};

	exports.batchEnterConductShinryou = function(conductShinryouList, cb){
		request("batch_enter_conduct_shinryou", JSON.stringify(conductShinryouList), "POST", cb);
	};

	exports.getFullConduct = function(conductId, at, cb){
		request("get_full_conduct", {conduct_id: conductId, at: at}, "GET", cb);
	};

	exports.enterConductShinryou = function(conductShinryou, cb){
		request("enter_conduct_shinryou", JSON.stringify(conductShinryou), "POST", cb);
	};

	exports.enterConductDrug = function(conductDrug, cb){
		request("enter_conduct_drug", JSON.stringify(conductDrug), "POST", cb);
	};

	exports.copyConducts = function(srcVisitId, dstVisitId, cb){
		request("copy_conducts", {src_visit_id: srcVisitId, dst_visit_id: dstVisitId}, "POST", cb);
	};

	exports.deleteConduct = function(conductId, done){
		request("delete_conduct", {conduct_id: conductId}, "POST", done);
	};

	exports.deleteConductShinryou = function(conductShinryouId, done){
		request("delete_conduct_shinryou", {conduct_shinryou_id: conductShinryouId}, "POST", done);
	}

	exports.deleteConductDrug = function(conductDrugId, done){
		request("delete_conduct_drug", {conduct_drug_id: conductDrugId}, "POST", done);
	}

	exports.deleteConductKizai = function(conductKizaiId, done){
		request("delete_conduct_kizai", {conduct_kizai_id: conductKizaiId}, "POST", done);
	}

	exports.getKizaiMaster = function(kizaicode, at, cb){
		request("get_kizai_master", {kizaicode: kizaicode, at: at}, "GET", cb);
	};

	exports.searchKizaiMaster = function(text, at, cb){
		request("search_kizai_master", {text: text, at: at}, "GET", cb);
	};

	exports.changeConductKind = function(conductId, kind, done){
		request("change_conduct_kind", {conduct_id: conductId, kind: kind}, "POST", done);
	};

	exports.setGazouLabel = function(conductId, label, done){
		request("set_gazou_label", {conduct_id: conductId, label: label}, "POST", done);
	};

	exports.enterShinryouByNames = function(visitId, names, cb){
		var data = {
			visit_id: visitId,
			names: names
		};
		request("enter_shinryou_by_names", JSON.stringify(data), "POST", cb);
	};

	exports.calcMeisai = function(visitId, cb){
		request("calc_meisai", {visit_id: visitId}, "GET", cb);
	};

	exports.findCharge = function(visitId, cb){
		request("find_charge", {visit_id: visitId}, "GET", cb);
	};

	exports.updateCharge = function(charge, done){
		request("update_charge", JSON.stringify(charge), "POST", done);
	};

	exports.getCharge = function(visitId, cb){
		request("get_charge", {visit_id: visitId}, "GET", cb);
	};

	exports.searchShoubyoumeiMaster = function(text, at, cb){
		request("search_shoubyoumei_master", {text: text, at: at}, "GET", cb);
	};

	exports.searchShuushokugoMaster = function(text, cb){
		request("search_shuushokugo_master", {text: text}, "GET", cb);
	};

	exports.getShoubyoumeiMaster = function(shoubyoumeicode, at, cb){
		request("get_shoubyoumei_master", {shoubyoumeicode: shoubyoumeicode, at: at}, "GET", cb);
	};

	exports.getShuushokugoMaster = function(shuushokugocode, cb){
		request("get_shuushokugo_master", {shuushokugocode: shuushokugocode}, "GET", cb);
	};

	exports.getShoubyoumeiMasterByName = function(name, at, cb){
		request("get_shoubyoumei_master_by_name", {name: name, at: at}, "GET", cb);
	};

	exports.getShuushokugoMasterByName = function(name, cb){
		request("get_shuushokugo_master_by_name", {name: name}, "GET", cb);
	};

	exports.enterDisease = function(shoubyoumeicode, patientId, startDate, shuushokugocodes, cb){
		var data = {
			shoubyoumeicode: shoubyoumeicode,
			patient_id: patientId,
			start_date: startDate,
			shuushokugocodes: shuushokugocodes
		};
		request("enter_disease", JSON.stringify(data), "POST", cb);
	};

	exports.getFullDisease = function(diseaseId, cb){
		request("get_full_disease", {disease_id: diseaseId}, "GET", cb);
	};

	exports.getDisease = function(diseaseId, cb){
		request("get_disease", {disease_id: diseaseId}, "GET", cb);
	};

	exports.batchUpdateDiseases = function(diseases, done){
		request("batch_update_diseases", JSON.stringify(diseases), "POST", done);
	};

	exports.listAllFullDiseases = function(patientId, cb){
		request("list_all_full_diseases", {patient_id: patientId}, "GET", cb);
	};

	exports.updateDiseaseWithAdj = function(disease, done){
		request("update_disease_with_adj", JSON.stringify(disease), "POST", done);
	};

	exports.deleteDiseaseWithAdj = function(diseaseId, done){
		request("delete_disease_with_adj", {disease_id: diseaseId}, "POST", done);
	};

	exports.searchTextForPatient = function(patientId, text, cb){
		request("search_text_for_patient", {patient_id: patientId, text: text}, "GET", cb);
	};

	exports.searchWholeText = function(text, cb){
		request("search_whole_text", {text: text}, "GET", cb);
	};






/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var conti = __webpack_require__(4);

	function calcNumberOfPages(totalItems, itemsPerPage){
		return Math.floor((totalItems + itemsPerPage - 1)/itemsPerPage);
	}

	function adjustPage(page, numPages){
		if( numPages <= 0 ){
			page = 0;
		} else {
			if( page <= 0 ){
				page = 1;
			} else if( page > numPages ){
				page = numPages;
			}
		}
		return page;
	}

	function taskStartExam(pageData){
		return function(done){
			var visitId = pageData.currentVisitId;
			if( visitId > 0 ){
				service.startExam(visitId, done);
			} else {
				done();
			}
		};
	}

	function makePatientLoader(pageData){
		var patientId = pageData.currentPatientId;
		return function(done){
			if( patientId > 0 ){
				service.getPatient(patientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					pageData.currentPatient = result;
					done();
				})
			} else {
				pageData.currentPatient = null;
				done();
			}
		};
	}

	function makeCalcVisitsLoader(pageData){
		var patientId = pageData.currentPatientId;
		return function(done){
			if( patientId > 0 ){
				service.calcVisits(patientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					pageData.totalPages = calcNumberOfPages(result, pageData.itemsPerPage);
					pageData.currentPage = adjustPage(pageData.currentPage, pageData.totalPages);
					done();
				});
			} else {
				pageData.totalPages = 0;
				pageData.currentPage = 0;
				done();
			}
		}
	}

	function makeFullVisitsLoader(pageData){
		var patientId = pageData.currentPatientId;
		return function(done){
			if( patientId > 0 && pageData.totalPages > 0 ){
				var offset = (pageData.currentPage - 1) * pageData.itemsPerPage;
				service.listFullVisits(patientId, offset, pageData.itemsPerPage, function(err, result){
					if( err ){
						done(err);
						return;
					}
					pageData.record_list = result;
					done();
				});
			} else {
				pageData.record_list = [];
				done();
			}
		}
	}

	function makeDiseasesLoader(pageData){
		var patientId = pageData.currentPatientId;
		return function(done){
			if( patientId > 0 ){
				service.listCurrentFullDiseases(patientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					pageData.diseases = result;
					done();
				})
			} else {
				pageData.diseases = [];
				done();
			}
		}
	}

	function makeLoader(appData){
		return function(done){
			conti.exec([
				taskStartExam(appData),
				makePatientLoader(appData),
				makeCalcVisitsLoader(appData),
				makeFullVisitsLoader(appData),
				makeDiseasesLoader(appData)
			], done);
		}
	}

	function taskClearPage(appData){
		return function(done){
			conti.exec([
				function(done){
					if( appData.currentVisitId > 0 ){
						service.suspendExam(appData.currentVisitId, done)
					} else {
						done();
					}
				}
			], function(err){
				if( err ){
					done(err);
					return;
				}
				appData.clear();
				done();
			})
		}
	}

	function AppData(){
		this.clear();
	}

	AppData.prototype.clear = function(){
		this.currentPatientId = 0;
		this.currentVisitId = 0;
		this.tempVisitId = 0;
		this.currentPatient = null;
		this.itemsPerPage = 10;
		this.totalPages = 0;
		this.currentPage = 0;
		this.record_list = [];
		this.diseases = [];
	};

	AppData.prototype.startPage = function(patientId, visitId, done){
		var self = this;
		task.run(function(done){
			conti.exec([
				taskClearPage(self),
				function(done){
					self.currentPatientId = patientId;
					self.currentVisitId = visitId;
					done();
				},
				makeLoader(self)
			], done);
		}, done);
	};

	AppData.prototype.gotoPage = function(page, done){
		if( page === 0 ){
			if( this.totalPages === 0 ){
				this.record_list = [];
				done();
			} else {
				done("invalid number of pages");
			}
		} else if( page >= 1 && page <= this.totalPages ){
			this.currentPage = page;
			task.run(makeFullVisitsLoader(this), done);
		} else {
			done("invalid page");
		}
	};

	AppData.prototype.deleteVisit = function(visitId, done){
		var self = this;
		task.run(function(done){
			conti.exec([
				function(done){
					service.deleteVisit(visitId, done);
				},
				function(done){
					if( self.currentVisitId === visitId ){
						self.currentVisitId = 0;
					} else if( self.tempVisitId === visitId ){
						self.tempVisitId = 0;
					}
					done();
				},
				makeCalcVisitsLoader(self),
				makeFullVisitsLoader(self)
			], done);
		}, done);
	};

	module.exports = AppData;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var kanjidate = __webpack_require__(16);
	var mUtil = __webpack_require__(5);

	var tmplSrc = __webpack_require__(17);
	var tmpl = hogan.compile(tmplSrc);

	exports.setup = function(dom){
		dom.listen("rx-start-page", function(appData){
			if( appData.currentPatientId > 0 ){
				var data = appData.currentPatient;
				var data = mUtil.assign({}, data, {
					sex_as_kanji: mUtil.sexToKanji(data.sex)
				});
				if( data.birth_day !== "0000-00-00" ){
					data.birthday_part = kanjidate.format("{G}{N}年{M}月{D}日生", data.birth_day);
					data.age_part = mUtil.calcAge(data.birth_day) + "才";
				}
				dom.html(tmpl.render(data));
			} else {
				dom.html("");
			}
		})
		dom.on("click", "[mc-name=detailLink]", function(event){
			event.preventDefault();
			dom.find("[mc-name=patientInfoDetail]").toggle();
		});
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	// This file is for use with Node.js. See dist/ for browser files.

	var Hogan = __webpack_require__(14);
	Hogan.Template = __webpack_require__(15).Template;
	Hogan.template = Hogan.Template;
	module.exports = Hogan;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	(function (Hogan) {
	  // Setup regex  assignments
	  // remove whitespace according to Mustache spec
	  var rIsWhitespace = /\S/,
	      rQuot = /\"/g,
	      rNewline =  /\n/g,
	      rCr = /\r/g,
	      rSlash = /\\/g,
	      rLineSep = /\u2028/,
	      rParagraphSep = /\u2029/;

	  Hogan.tags = {
	    '#': 1, '^': 2, '<': 3, '$': 4,
	    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,
	    '{': 10, '&': 11, '_t': 12
	  };

	  Hogan.scan = function scan(text, delimiters) {
	    var len = text.length,
	        IN_TEXT = 0,
	        IN_TAG_TYPE = 1,
	        IN_TAG = 2,
	        state = IN_TEXT,
	        tagType = null,
	        tag = null,
	        buf = '',
	        tokens = [],
	        seenTag = false,
	        i = 0,
	        lineStart = 0,
	        otag = '{{',
	        ctag = '}}';

	    function addBuf() {
	      if (buf.length > 0) {
	        tokens.push({tag: '_t', text: new String(buf)});
	        buf = '';
	      }
	    }

	    function lineIsWhitespace() {
	      var isAllWhitespace = true;
	      for (var j = lineStart; j < tokens.length; j++) {
	        isAllWhitespace =
	          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||
	          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);
	        if (!isAllWhitespace) {
	          return false;
	        }
	      }

	      return isAllWhitespace;
	    }

	    function filterLine(haveSeenTag, noNewLine) {
	      addBuf();

	      if (haveSeenTag && lineIsWhitespace()) {
	        for (var j = lineStart, next; j < tokens.length; j++) {
	          if (tokens[j].text) {
	            if ((next = tokens[j+1]) && next.tag == '>') {
	              // set indent to token value
	              next.indent = tokens[j].text.toString()
	            }
	            tokens.splice(j, 1);
	          }
	        }
	      } else if (!noNewLine) {
	        tokens.push({tag:'\n'});
	      }

	      seenTag = false;
	      lineStart = tokens.length;
	    }

	    function changeDelimiters(text, index) {
	      var close = '=' + ctag,
	          closeIndex = text.indexOf(close, index),
	          delimiters = trim(
	            text.substring(text.indexOf('=', index) + 1, closeIndex)
	          ).split(' ');

	      otag = delimiters[0];
	      ctag = delimiters[delimiters.length - 1];

	      return closeIndex + close.length - 1;
	    }

	    if (delimiters) {
	      delimiters = delimiters.split(' ');
	      otag = delimiters[0];
	      ctag = delimiters[1];
	    }

	    for (i = 0; i < len; i++) {
	      if (state == IN_TEXT) {
	        if (tagChange(otag, text, i)) {
	          --i;
	          addBuf();
	          state = IN_TAG_TYPE;
	        } else {
	          if (text.charAt(i) == '\n') {
	            filterLine(seenTag);
	          } else {
	            buf += text.charAt(i);
	          }
	        }
	      } else if (state == IN_TAG_TYPE) {
	        i += otag.length - 1;
	        tag = Hogan.tags[text.charAt(i + 1)];
	        tagType = tag ? text.charAt(i + 1) : '_v';
	        if (tagType == '=') {
	          i = changeDelimiters(text, i);
	          state = IN_TEXT;
	        } else {
	          if (tag) {
	            i++;
	          }
	          state = IN_TAG;
	        }
	        seenTag = i;
	      } else {
	        if (tagChange(ctag, text, i)) {
	          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
	                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});
	          buf = '';
	          i += ctag.length - 1;
	          state = IN_TEXT;
	          if (tagType == '{') {
	            if (ctag == '}}') {
	              i++;
	            } else {
	              cleanTripleStache(tokens[tokens.length - 1]);
	            }
	          }
	        } else {
	          buf += text.charAt(i);
	        }
	      }
	    }

	    filterLine(seenTag, true);

	    return tokens;
	  }

	  function cleanTripleStache(token) {
	    if (token.n.substr(token.n.length - 1) === '}') {
	      token.n = token.n.substring(0, token.n.length - 1);
	    }
	  }

	  function trim(s) {
	    if (s.trim) {
	      return s.trim();
	    }

	    return s.replace(/^\s*|\s*$/g, '');
	  }

	  function tagChange(tag, text, index) {
	    if (text.charAt(index) != tag.charAt(0)) {
	      return false;
	    }

	    for (var i = 1, l = tag.length; i < l; i++) {
	      if (text.charAt(index + i) != tag.charAt(i)) {
	        return false;
	      }
	    }

	    return true;
	  }

	  // the tags allowed inside super templates
	  var allowedInSuper = {'_t': true, '\n': true, '$': true, '/': true};

	  function buildTree(tokens, kind, stack, customTags) {
	    var instructions = [],
	        opener = null,
	        tail = null,
	        token = null;

	    tail = stack[stack.length - 1];

	    while (tokens.length > 0) {
	      token = tokens.shift();

	      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {
	        throw new Error('Illegal content in < super tag.');
	      }

	      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {
	        stack.push(token);
	        token.nodes = buildTree(tokens, token.tag, stack, customTags);
	      } else if (token.tag == '/') {
	        if (stack.length === 0) {
	          throw new Error('Closing tag without opener: /' + token.n);
	        }
	        opener = stack.pop();
	        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
	          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
	        }
	        opener.end = token.i;
	        return instructions;
	      } else if (token.tag == '\n') {
	        token.last = (tokens.length == 0) || (tokens[0].tag == '\n');
	      }

	      instructions.push(token);
	    }

	    if (stack.length > 0) {
	      throw new Error('missing closing tag: ' + stack.pop().n);
	    }

	    return instructions;
	  }

	  function isOpener(token, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].o == token.n) {
	        token.tag = '#';
	        return true;
	      }
	    }
	  }

	  function isCloser(close, open, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].c == close && tags[i].o == open) {
	        return true;
	      }
	    }
	  }

	  function stringifySubstitutions(obj) {
	    var items = [];
	    for (var key in obj) {
	      items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + '}');
	    }
	    return "{ " + items.join(",") + " }";
	  }

	  function stringifyPartials(codeObj) {
	    var partials = [];
	    for (var key in codeObj.partials) {
	      partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
	    }
	    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
	  }

	  Hogan.stringify = function(codeObj, text, options) {
	    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) +  "}";
	  }

	  var serialNo = 0;
	  Hogan.generate = function(tree, text, options) {
	    serialNo = 0;
	    var context = { code: '', subs: {}, partials: {} };
	    Hogan.walk(tree, context);

	    if (options.asString) {
	      return this.stringify(context, text, options);
	    }

	    return this.makeTemplate(context, text, options);
	  }

	  Hogan.wrapMain = function(code) {
	    return 'var t=this;t.b(i=i||"");' + code + 'return t.fl();';
	  }

	  Hogan.template = Hogan.Template;

	  Hogan.makeTemplate = function(codeObj, text, options) {
	    var template = this.makePartials(codeObj);
	    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));
	    return new this.template(template, text, this, options);
	  }

	  Hogan.makePartials = function(codeObj) {
	    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};
	    for (key in template.partials) {
	      template.partials[key] = this.makePartials(template.partials[key]);
	    }
	    for (key in codeObj.subs) {
	      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);
	    }
	    return template;
	  }

	  function esc(s) {
	    return s.replace(rSlash, '\\\\')
	            .replace(rQuot, '\\\"')
	            .replace(rNewline, '\\n')
	            .replace(rCr, '\\r')
	            .replace(rLineSep, '\\u2028')
	            .replace(rParagraphSep, '\\u2029');
	  }

	  function chooseMethod(s) {
	    return (~s.indexOf('.')) ? 'd' : 'f';
	  }

	  function createPartial(node, context) {
	    var prefix = "<" + (context.prefix || "");
	    var sym = prefix + node.n + serialNo++;
	    context.partials[sym] = {name: node.n, partials: {}};
	    context.code += 't.b(t.rp("' +  esc(sym) + '",c,p,"' + (node.indent || '') + '"));';
	    return sym;
	  }

	  Hogan.codegen = {
	    '#': function(node, context) {
	      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),' +
	                      'c,p,0,' + node.i + ',' + node.end + ',"' + node.otag + " " + node.ctag + '")){' +
	                      't.rs(c,p,' + 'function(c,p,t){';
	      Hogan.walk(node.nodes, context);
	      context.code += '});c.pop();}';
	    },

	    '^': function(node, context) {
	      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
	      Hogan.walk(node.nodes, context);
	      context.code += '};';
	    },

	    '>': createPartial,
	    '<': function(node, context) {
	      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};
	      Hogan.walk(node.nodes, ctx);
	      var template = context.partials[createPartial(node, context)];
	      template.subs = ctx.subs;
	      template.partials = ctx.partials;
	    },

	    '$': function(node, context) {
	      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};
	      Hogan.walk(node.nodes, ctx);
	      context.subs[node.n] = ctx.code;
	      if (!context.inPartial) {
	        context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
	      }
	    },

	    '\n': function(node, context) {
	      context.code += write('"\\n"' + (node.last ? '' : ' + i'));
	    },

	    '_v': function(node, context) {
	      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	    },

	    '_t': function(node, context) {
	      context.code += write('"' + esc(node.text) + '"');
	    },

	    '{': tripleStache,

	    '&': tripleStache
	  }

	  function tripleStache(node, context) {
	    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	  }

	  function write(s) {
	    return 't.b(' + s + ');';
	  }

	  Hogan.walk = function(nodelist, context) {
	    var func;
	    for (var i = 0, l = nodelist.length; i < l; i++) {
	      func = Hogan.codegen[nodelist[i].tag];
	      func && func(nodelist[i], context);
	    }
	    return context;
	  }

	  Hogan.parse = function(tokens, text, options) {
	    options = options || {};
	    return buildTree(tokens, '', [], options.sectionTags || []);
	  }

	  Hogan.cache = {};

	  Hogan.cacheKey = function(text, options) {
	    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');
	  }

	  Hogan.compile = function(text, options) {
	    options = options || {};
	    var key = Hogan.cacheKey(text, options);
	    var template = this.cache[key];

	    if (template) {
	      var partials = template.partials;
	      for (var name in partials) {
	        delete partials[name].instance;
	      }
	      return template;
	    }

	    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
	    return this.cache[key] = template;
	  }
	})( true ? exports : Hogan);


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	var Hogan = {};

	(function (Hogan) {
	  Hogan.Template = function (codeObj, text, compiler, options) {
	    codeObj = codeObj || {};
	    this.r = codeObj.code || this.r;
	    this.c = compiler;
	    this.options = options || {};
	    this.text = text || '';
	    this.partials = codeObj.partials || {};
	    this.subs = codeObj.subs || {};
	    this.buf = '';
	  }

	  Hogan.Template.prototype = {
	    // render: replaced by generated code.
	    r: function (context, partials, indent) { return ''; },

	    // variable escaping
	    v: hoganEscape,

	    // triple stache
	    t: coerceToString,

	    render: function render(context, partials, indent) {
	      return this.ri([context], partials || {}, indent);
	    },

	    // render internal -- a hook for overrides that catches partials too
	    ri: function (context, partials, indent) {
	      return this.r(context, partials, indent);
	    },

	    // ensurePartial
	    ep: function(symbol, partials) {
	      var partial = this.partials[symbol];

	      // check to see that if we've instantiated this partial before
	      var template = partials[partial.name];
	      if (partial.instance && partial.base == template) {
	        return partial.instance;
	      }

	      if (typeof template == 'string') {
	        if (!this.c) {
	          throw new Error("No compiler available.");
	        }
	        template = this.c.compile(template, this.options);
	      }

	      if (!template) {
	        return null;
	      }

	      // We use this to check whether the partials dictionary has changed
	      this.partials[symbol].base = template;

	      if (partial.subs) {
	        // Make sure we consider parent template now
	        if (!partials.stackText) partials.stackText = {};
	        for (key in partial.subs) {
	          if (!partials.stackText[key]) {
	            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
	          }
	        }
	        template = createSpecializedPartial(template, partial.subs, partial.partials,
	          this.stackSubs, this.stackPartials, partials.stackText);
	      }
	      this.partials[symbol].instance = template;

	      return template;
	    },

	    // tries to find a partial in the current scope and render it
	    rp: function(symbol, context, partials, indent) {
	      var partial = this.ep(symbol, partials);
	      if (!partial) {
	        return '';
	      }

	      return partial.ri(context, partials, indent);
	    },

	    // render a section
	    rs: function(context, partials, section) {
	      var tail = context[context.length - 1];

	      if (!isArray(tail)) {
	        section(context, partials, this);
	        return;
	      }

	      for (var i = 0; i < tail.length; i++) {
	        context.push(tail[i]);
	        section(context, partials, this);
	        context.pop();
	      }
	    },

	    // maybe start a section
	    s: function(val, ctx, partials, inverted, start, end, tags) {
	      var pass;

	      if (isArray(val) && val.length === 0) {
	        return false;
	      }

	      if (typeof val == 'function') {
	        val = this.ms(val, ctx, partials, inverted, start, end, tags);
	      }

	      pass = !!val;

	      if (!inverted && pass && ctx) {
	        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
	      }

	      return pass;
	    },

	    // find values with dotted names
	    d: function(key, ctx, partials, returnFound) {
	      var found,
	          names = key.split('.'),
	          val = this.f(names[0], ctx, partials, returnFound),
	          doModelGet = this.options.modelGet,
	          cx = null;

	      if (key === '.' && isArray(ctx[ctx.length - 2])) {
	        val = ctx[ctx.length - 1];
	      } else {
	        for (var i = 1; i < names.length; i++) {
	          found = findInScope(names[i], val, doModelGet);
	          if (found !== undefined) {
	            cx = val;
	            val = found;
	          } else {
	            val = '';
	          }
	        }
	      }

	      if (returnFound && !val) {
	        return false;
	      }

	      if (!returnFound && typeof val == 'function') {
	        ctx.push(cx);
	        val = this.mv(val, ctx, partials);
	        ctx.pop();
	      }

	      return val;
	    },

	    // find values with normal names
	    f: function(key, ctx, partials, returnFound) {
	      var val = false,
	          v = null,
	          found = false,
	          doModelGet = this.options.modelGet;

	      for (var i = ctx.length - 1; i >= 0; i--) {
	        v = ctx[i];
	        val = findInScope(key, v, doModelGet);
	        if (val !== undefined) {
	          found = true;
	          break;
	        }
	      }

	      if (!found) {
	        return (returnFound) ? false : "";
	      }

	      if (!returnFound && typeof val == 'function') {
	        val = this.mv(val, ctx, partials);
	      }

	      return val;
	    },

	    // higher order templates
	    ls: function(func, cx, partials, text, tags) {
	      var oldTags = this.options.delimiters;

	      this.options.delimiters = tags;
	      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
	      this.options.delimiters = oldTags;

	      return false;
	    },

	    // compile text
	    ct: function(text, cx, partials) {
	      if (this.options.disableLambda) {
	        throw new Error('Lambda features disabled.');
	      }
	      return this.c.compile(text, this.options).render(cx, partials);
	    },

	    // template result buffering
	    b: function(s) { this.buf += s; },

	    fl: function() { var r = this.buf; this.buf = ''; return r; },

	    // method replace section
	    ms: function(func, ctx, partials, inverted, start, end, tags) {
	      var textSource,
	          cx = ctx[ctx.length - 1],
	          result = func.call(cx);

	      if (typeof result == 'function') {
	        if (inverted) {
	          return true;
	        } else {
	          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
	          return this.ls(result, cx, partials, textSource.substring(start, end), tags);
	        }
	      }

	      return result;
	    },

	    // method replace variable
	    mv: function(func, ctx, partials) {
	      var cx = ctx[ctx.length - 1];
	      var result = func.call(cx);

	      if (typeof result == 'function') {
	        return this.ct(coerceToString(result.call(cx)), cx, partials);
	      }

	      return result;
	    },

	    sub: function(name, context, partials, indent) {
	      var f = this.subs[name];
	      if (f) {
	        this.activeSub = name;
	        f(context, partials, this, indent);
	        this.activeSub = false;
	      }
	    }

	  };

	  //Find a key in an object
	  function findInScope(key, scope, doModelGet) {
	    var val;

	    if (scope && typeof scope == 'object') {

	      if (scope[key] !== undefined) {
	        val = scope[key];

	      // try lookup with get for backbone or similar model data
	      } else if (doModelGet && scope.get && typeof scope.get == 'function') {
	        val = scope.get(key);
	      }
	    }

	    return val;
	  }

	  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
	    function PartialTemplate() {};
	    PartialTemplate.prototype = instance;
	    function Substitutions() {};
	    Substitutions.prototype = instance.subs;
	    var key;
	    var partial = new PartialTemplate();
	    partial.subs = new Substitutions();
	    partial.subsText = {};  //hehe. substext.
	    partial.buf = '';

	    stackSubs = stackSubs || {};
	    partial.stackSubs = stackSubs;
	    partial.subsText = stackText;
	    for (key in subs) {
	      if (!stackSubs[key]) stackSubs[key] = subs[key];
	    }
	    for (key in stackSubs) {
	      partial.subs[key] = stackSubs[key];
	    }

	    stackPartials = stackPartials || {};
	    partial.stackPartials = stackPartials;
	    for (key in partials) {
	      if (!stackPartials[key]) stackPartials[key] = partials[key];
	    }
	    for (key in stackPartials) {
	      partial.partials[key] = stackPartials[key];
	    }

	    return partial;
	  }

	  var rAmp = /&/g,
	      rLt = /</g,
	      rGt = />/g,
	      rApos = /\'/g,
	      rQuot = /\"/g,
	      hChars = /[&<>\"\']/;

	  function coerceToString(val) {
	    return String((val === null || val === undefined) ? '' : val);
	  }

	  function hoganEscape(str) {
	    str = coerceToString(str);
	    return hChars.test(str) ?
	      str
	        .replace(rAmp, '&amp;')
	        .replace(rLt, '&lt;')
	        .replace(rGt, '&gt;')
	        .replace(rApos, '&#39;')
	        .replace(rQuot, '&quot;') :
	      str;
	  }

	  var isArray = Array.isArray || function(a) {
	    return Object.prototype.toString.call(a) === '[object Array]';
	  };

	})( true ? exports : Hogan);


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	(function(exports){

	"use strict";

	var trunc = Math.trunc || function(x){
		if( x >= 0 ){
			return Math.floor(x);
		} else {
			return Math.ceil(x);
		}
	};

	function ge(year1, month1, day1, year2, month2, day2){
		if( year1 > year2 ){
			return true;
		}
		if( year1 < year2 ){
			return false;
		}
		if( month1 > month2 ){
			return true;
		}
		if( month1 < month2 ){
			return false;
		}
		return day1 >= day2;
	}

	function gengouToAlpha(gengou){
		switch(gengou){
			case "平成": return "Heisei";
			case "昭和": return "Shouwa";
			case "大正": return "Taishou";
			case "明治": return "Meiji";
			default: throw new Error("unknown gengou: " + gengou);
		}
	}

	function padLeft(str, n, ch){
		var m = n - str.length;
		var pad = "";
		while( m-- > 0 ){
			pad += ch;
		}
		return pad + str;
	}

	var zenkakuDigits = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"];
	var alphaDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

	function isZenkakuDigit(ch){
		return zenkakuDigits.indexOf(ch) >= 0;
	}

	function isAlphaDigit(ch){
		return alphaDigits.indexOf(ch) >= 0;
	}

	function alphaDigitToZenkaku(ch){
		var i = alphaDigits.indexOf(ch);
		return i >= 0 ? zenkakuDigits[i] : ch;
	}

	function isDateObject(obj){
		return obj instanceof Date;
	}

	function removeOpt(opts, what){
		var result = [];
		for(var i=0;i<opts.length;i++){
			var opt = opts[i];
			if( opt === what ){
				continue;
			} else {
				result.push(opt);
			}
		}
		return result;
	}

	function toGengou(year, month, day){
		if( ge(year, month, day, 1989, 1, 8) ){
			return { gengou:"平成", nen:year - 1988 };
		}
		if( ge(year, month, day, 1926, 12, 25) ){
			return { gengou:"昭和", nen:year - 1925 };
		}
		if( ge(year, month, day, 1912, 7, 30) ){
			return { gengou:"大正", nen:year - 1911 };
		}
		if( ge(year, month, day, 1873, 1, 1) ){
			return { gengou: "明治", nen: year - 1867 };
		}
		return { gengou: "西暦", nen: year };
	}

	exports.toGengou = toGengou;

	function fromGengou(gengou, nen){
	    nen = Math.floor(+nen);
	    if( nen < 0 ){
	    	throw new Error("invalid nen: " + nen);
	    }
	    switch (gengou) {
	        case "平成":
	            return 1988 + nen;
	        case "昭和":
	            return 1925 + nen;
	        case "大正":
	            return 1911 + nen;
	        case "明治":
	            return 1867 + nen;
	        case "西暦":
	            return nen;
	        default:
	            throw new Error("invalid gengou: " + gengou);
	    }
	}

	exports.fromGengou = fromGengou;

	var youbi = ["日", "月", "火", "水", "木", "金", "土"];

	function toYoubi(dayOfWeek){
		return youbi[dayOfWeek];
	}

	exports.toYoubi = toYoubi;

	function KanjiDate(date){
		this.year = date.getFullYear();
		this.month = date.getMonth()+1;
		this.day = date.getDate();
		this.hour = date.getHours();
		this.minute = date.getMinutes();
		this.second = date.getSeconds();
		this.msec = date.getMilliseconds();
		this.dayOfWeek = date.getDay();
		var g = toGengou(this.year, this.month, this.day);
		this.gengou = g.gengou;
		this.nen = g.nen;
		this.youbi = youbi[this.dayOfWeek];
	}

	function KanjiDateExplicit(year, month, day, hour, minute, second, millisecond){
		if( hour === undefined ) hour = 0;
		if( minute === undefined ) minute = 0;
		if( second === undefined ) second = 0;
		if( millisecond === undefined ) millisecond = 0;
		var date = new Date(year, month-1, day, hour, minute, second, millisecond);
		return new KanjiDate(date);
	}

	function KanjiDateFromString(str){
		var m;
		m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if( m ){
			return KanjiDateExplicit(+m[1], +m[2], +m[3]);
		}
		m = str.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
		if( m ){
			return KanjiDateExplicit(+m[1], +m[2], +m[3], +m[4], +m[5], +m[6]);
		}
		throw new Error("cannot convert to KanjiDate");
	}

	function parseFormatString(fmtStr){
		var result = [];
		var parts = fmtStr.split(/(\{[^}]+)\}/);
		parts.forEach(function(part){
			if( part === "" ) return;
			if( part[0] === "{" ){
				part = part.substring(1);
				var token = {opts: []};
				var colon = part.indexOf(":");
				if( part.indexOf(":") >= 0 ){
					token.part = part.substring(0, colon);
					var optStr = part.substring(colon+1).trim();
					if( optStr !== "" ){
						if( optStr.indexOf(",") >= 0 ){
							token.opts = optStr.split(/\s*,\s*/);
						} else {
							token.opts = [optStr];
						}
					}
				} else {
					token.part = part;
				}
				result.push(token);
			} else {
				result.push(part);
			}
		});
		return result;
	}

	var format1 = "{G}{N}年{M}月{D}日（{W}）";
	var format2 = "{G}{N}年{M}月{D}日";
	var format3 = "{G:a}{N}.{M}.{D}";
	var format4 = "{G}{N:2}年{M:2}月{D:2}日（{W}）";
	var format5 = "{G}{N:2}年{M:2}月{D:2}日";
	var format6 = "{G:a}{N:2}.{M:2}.{D:2}";
	var format7 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分{s}秒";
	var format8 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分{s:2}秒";
	var format9 = "{G}{N}年{M}月{D}日（{W}） {a}{h:12}時{m}分";
	var format10 = "{G}{N:2}年{M:2}月{D:2}日（{W}） {a}{h:12,2}時{m:2}分";
	var format11 = "{G}{N:z}年{M:z}月{D:z}日";
	var format12 = "{G}{N:z,2}年{M:z,2}月{D:z,2}日";
	var format13 = "{Y}-{M:2}-{D:2}";
	var format14 = "{Y}-{M:2}-{D:2} {h:2}:{m:2}:{s:2}";

	exports.f1 = format1;
	exports.f2 = format2;
	exports.f3 = format3;
	exports.f4 = format4;
	exports.f5 = format5;
	exports.f6 = format6;
	exports.f7 = format7;
	exports.f8 = format8;
	exports.f9 = format9;
	exports.f10 = format10;
	exports.f11 = format11;
	exports.f12 = format12;
	exports.f13 = format13;
	exports.f14 = format14;
	exports.fSqlDate = format13;
	exports.fSqlDateTime = format14;

	function gengouPart(kdate, opts){
		var style = "2";
		opts.forEach(function(opt){
			if( ["2", "1", "a", "alpha"].indexOf(opt) >= 0 ){
				style = opt;
			}
		})
		switch(style){
			case "2": return kdate.gengou;
			case "1": return kdate.gengou[0]; 
			case "a": return gengouToAlpha(kdate.gengou)[0]; 
			case "alpha": return gengouToAlpha(kdate.gengou);
			default: return kdate.gengou;
		}
	}

	function numberPart(num, opts){
		var zenkaku = false;
		var width = 1;
		opts.forEach(function(opt){
			switch(opt){
				case "1": width = 1; break;
				case "2": width = 2; break;
				case "z": zenkaku = true; break;
			}
		});
		var result = num.toString();
		if( zenkaku ){
			result = result.split("").map(alphaDigitToZenkaku).join("");
		}
		if( width > 1 && num < 10 ){
			result = (zenkaku ? "０" : "0") + result;
		}
		return result;
	}

	function nenPart(kdate, opts){
		if( kdate.nen === 1 && opts.indexOf("g") >= 0 ){
			return "元";
		} else {
			return numberPart(kdate.nen, opts);
		}
	}

	function youbiPart(kdate, opts){
		var style;
		opts.forEach(function(opt){
			if( ["1", "2", "3", "alpha"].indexOf(opt) >= 0 ){
				style = opt;
			}
		})
		switch(style){
			case "1": return kdate.youbi;
			case "2": return kdate.youbi + "曜";
			case "3": return kdate.youbi + "曜日";
			case "alpha": return dayOfWeek[kdate.dayOfWeek];
			default: return kdate.youbi;
		}
	}

	function hourPart(hour, opts){
		var ampm = false;
		if( opts.indexOf("12") >= 0 ){
			ampm = true;
			opts = removeOpt(opts, "12");
		}
		if( ampm ){
			hour = hour % 12;
		}
		return numberPart(hour, opts);
	}

	function ampmPart(kdate, opts){
		var style = "kanji";
		opts.forEach(function(opt){
			switch(opt){
				case "am/pm": style = "am/pm"; break;
				case "AM/PM": style = "AM/PM"; break;
			}
		});
		var am = kdate.hour < 12;
		switch(style){
			case "kanji": return am ? "午前" : "午後";
			case "am/pm": return am ? "am" : "pm";
			case "AM/PM": return am ? "AM" : "PM";
			default : throw new Error("unknown style for AM/PM");
		}
	}

	function yearPart(year, opts){
		return year.toString();
	}

	function format(formatStr, kdate){
		var output = [];
		var tokens = parseFormatString(formatStr);
		tokens.forEach(function(token){
			if( typeof token === "string" ){
				output.push(token);
			} else {
				switch(token.part){
					case "G": output.push(gengouPart(kdate, token.opts)); break;
					case "N": output.push(nenPart(kdate, token.opts)); break;
					case "M": output.push(numberPart(kdate.month, token.opts)); break;
					case "D": output.push(numberPart(kdate.day, token.opts)); break;
					case "W": output.push(youbiPart(kdate, token.opts)); break;
					case "h": output.push(hourPart(kdate.hour, token.opts)); break;
					case "m": output.push(numberPart(kdate.minute, token.opts)); break;
					case "s": output.push(numberPart(kdate.second, token.opts)); break;
					case "a": output.push(ampmPart(kdate, token.opts)); break;
					case "Y": output.push(yearPart(kdate.year, token.opts)); break;
				}
			}
		})
		return output.join("");
	}

	exports.format = function(){
		var narg = arguments.length;
		var formatStr, args, i;
		if( narg === 0 ){
			return format(format1, new KanjiDate(new Date()));
		} else if( narg === 1 ){
			return format(format1, cvt(arguments[0]));
		} else {
			formatStr = arguments[0];
			if( formatStr == null ){
				formatStr = format1;
			}
			args = [];
			for(i=1;i<arguments.length;i++){
				args.push(arguments[i]);
			}
			if( args.length === 1 ){
				return format(formatStr, cvt(args[0]));
			} else {
				return format(formatStr, KanjiDateExplicit.apply(null, args));
			}
		}
		throw new Error("invalid format call");

		function cvt(x){
			if( isDateObject(x) ){
				return new KanjiDate(x);
			} else if( typeof x === "string" ){
				return KanjiDateFromString(x);
			}
			throw new Error("cannot convert to KanjiDate");
		}
	}

	})( false ? (window.kanjidate = {}) : exports);

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = "[{{patient_id}}]\r\n{{last_name}} {{first_name}}\r\n（{{last_name_yomi}} {{first_name_yomi}}）\r\n{{birthday_part}}\r\n{{age_part}}\r\n{{sex_as_kanji}}性\r\n<a href=\"javascript:void(0)\" mc-name=\"detailLink\" class=\"cmd-link\" style=\"font-size:13px\">詳細</a>\r\n\r\n<div style=\"display:none; margin:4px; padding:2px 0 0 0; border: 1px solid #ccc\" mc-name=\"patientInfoDetail\">\r\n\t<div style=\"margin:6px;\">電話番号： {{phone}}</div>\r\n\t<div style=\"margin:6px;\">住所： {{address}}</div>\r\n</div>\r\n"

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var Account = __webpack_require__(19);
	var SearchText = __webpack_require__(21);
	var modal = __webpack_require__(24);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var kanjidate = __webpack_require__(16);
	var mUtil = __webpack_require__(5);

	var tmplHtml = __webpack_require__(25);

	var accountLinkSelector = "[mc-name=accountButton]";
	var searchTextLinkSelector = "[mc-name=searchTextLink]";
	var referLinkSelector = "[mc-name=createReferLink]";

	exports.setup = function(dom, referUrl){
		var patientId = 0;
		dom.listen("rx-start-page", function(appData){
			patientId = appData.currentPatientId;
			if( appData.currentPatientId > 0 ){
				dom.html(tmplHtml);
			} else {
				dom.html("");
			}
		});
		dom.on("click", accountLinkSelector, function(event){
			event.preventDefault();
			doAccount(dom);
		});
		dom.on("click", searchTextLinkSelector, function(event){
			event.preventDefault();
			doSearchText(patientId);
		});
		dom.on("click", referLinkSelector, function(event){
			event.preventDefault();
			var patient;
			task.run([
				function(done){
					console.log(patientId);
					service.getPatient(patientId, function(err, result){
						if( err ){
							done(err);
							return;
						}
						patient = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				var bday = (patient.birth_day && patient.birth_day === "0000-00-00") ? 
					"" : kanjidate.format(kanjidate.f5, patient.birth_day);
				var age = null;
				if( patient.birth_day && patient.birth_day !== "0000-00-00" ){
					age = mUtil.calcAge(patient.birth_day);
				}
				var data = {
					"title": "紹介状",
					"patient-name": patient.last_name + " " + patient.first_name,
					"patient-birthday": bday,
					"patient-age": age,
					"patient-sex": mUtil.sexToKanji(patient.sex)
				};
				var form = event.target.closest("form");
				form.querySelector("input[name=json-data]").value = JSON.stringify(data);
				form.submit();
			})
		})
		dom.on("click", "[mc-name=endPatientButton]", function(event){
			event.preventDefault();
			dom.trigger("end-patient");
		});
	};

	function doAccount(dom){
		var visitId = dom.inquire("fn-get-current-visit-id");
		if( !(visitId > 0) ){
			return;
		}
		var charge, meisai;
		task.run([
			function(done){
				service.findCharge(visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					charge = result;
					done();
				})
			},
			function(done){
				if( charge ){
					done();
				} else {
					service.calcMeisai(visitId, function(err, result){
						if( err ){
							done(err);
							return;
						}
						meisai = result;
						done();
					})
				}
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			if( !meisai ){
				return;
			}
			var account = Account.create(meisai, visitId);
			modal.startModal({
				title: "会計",
				init: function(content, close){
					content.appendChild(account.get(0));
					account.on("0ms9b2wl-cancel", close);
					account.on("0ms9b2wl-entered", function(){
						close();
						$("body").trigger("exam-ended");
					})
				}
			})
			//modal.open("会計", account);
		})
	}

	function doSearchText(patientId){
		var form = SearchText.create(patientId);
		modal.startModal({
			title: "文章検索",
			init: function(content){
				content.appendChild(form.get(0));
			}
		})
		//modal.open("文章検索", form);
	}

	// account dialog
	// $("body").on("0ms9b2wl-cancel", function(){
	// 	modal.close();
	// })

	// account dialog
	// $("body").on("0ms9b2wl-entered", function(event){
	// 	modal.close();
	// 	$("body").trigger("exam-ended");
	// });


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(20);
	var tmpl = hogan.compile(tmplSrc);
	var mUtil = __webpack_require__(5);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);

	var chargeDispSelector = "[mc-name=charge-disp]";
	var modifyLinkSelector = "[mc-name=modifyLink]";
	var modifyWrapperSelector = "> [mc-name=modifyWrapper]";
	var modifyInputSelector = "> [mc-name=modifyWrapper] input[mc-name=newCharge]";
	var modifyFormSelector = "> [mc-name=modifyWrapper] form";
	var modifyEnterLinkSelector = "> [mc-name=modifyWrapper] a[mc-name=modifyEnter]";
	var modifyCancelLinkSelector = "> [mc-name=modifyWrapper] [mc-name=modifyCancel]";
	var enterLinkSelector = "> .workarea-commandbox [mc-name=enterLink]";
	var cancelLinkSelector = "> .workarea-commandbox [mc-name=cancelLink]";

	exports.create = function(meisai, visitId){
		var sections = mUtil.meisaiSections.map(function(sect){
			return {
				name: sect,
				items: meisai.meisai[sect].map(function(item){
					return {
						label: item.label,
						tanka: mUtil.formatNumber(item.tanka),
						count: item.count,
						total: mUtil.formatNumber(item.tanka * item.count)
					}
				})
			};
		}).filter(function(sect){ return sect.items.length > 0; });
		var data = {
			sections: sections,
			total_ten: mUtil.formatNumber(meisai.totalTen),
			charge: mUtil.formatNumber(meisai.charge),
			futan_wari: meisai.futanWari
		};
		var dom = $(tmpl.render(data));
		dom.on("click", modifyLinkSelector, function(event){
			event.preventDefault();
			dom.find(modifyWrapperSelector).toggle();
		});
		dom.on("submit", modifyFormSelector, function(event){
			event.preventDefault();
			doModify(dom);
		});
		dom.on("click", modifyEnterLinkSelector, function(event){
			event.preventDefault();
			doModify(dom);
		});
		dom.on("click", modifyCancelLinkSelector, function(event){
			event.preventDefault();
			dom.find(modifyInputSelector).val("");
			dom.find(modifyWrapperSelector).hide();
		});
		dom.on("click", enterLinkSelector, function(event){
			event.preventDefault();
			dom.find(enterLinkSelector).prop("disabled", true);
			var value = getChargeValue(dom);
			doEnter(dom, visitId, value);
		});
		dom.on("click", cancelLinkSelector, function(event){
			event.preventDefault();
			dom.trigger("0ms9b2wl-cancel");
		})
		return dom;
	};

	function doModify(dom){
		var input = dom.find(modifyInputSelector).val().trim();
		if( !/^\d+$/.test(input) ){
			alert("金額の入力が不適切です。");
			return;
		}
		input = +input;
		dom.find(chargeDispSelector).text(mUtil.formatNumber(input));
		dom.find(modifyInputSelector).val("");
		dom.find(modifyWrapperSelector).hide();
	}

	function getChargeValue(dom){
		var text = dom.find(chargeDispSelector).text().trim();
		text = text.replace(/,/g, "");
		return +text;
	}

	function doEnter(dom, visitId, charge){
		task.run([
			function(done){
				service.endExam(visitId, charge, done);
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("0ms9b2wl-entered");
		});
	}


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\" style=\"min-width:230px\">\r\n\t<!-- <div class=\"title\">会計</div> -->\r\n\t<table style=\"width:100%; max-width:400px; font-size:13px;\">\r\n\t    <tbody mc-name=\"meisai\">\r\n\t    \t{{#sections}}\r\n\t    \t\t<tr><td colspan=\"3\" style=\"font-weight:bold\">{{name}}</td></tr>\r\n\t    \t\t{{#items}}\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<td style=\"width:2em\">&nbsp;</td>\r\n\t\t\t\t\t\t<td width=\"*\">{{label}}</td>\r\n\t\t\t\t\t\t<td style=\"width:7em; text-align:right\">\r\n\t\t\t\t\t\t\t{{tanka}}x{{count}} = {{total}} 点\r\n\t\t\t\t\t\t</td>\r\n\t\t\t\t\t</tr>\r\n\t    \t\t{{/items}}\r\n\t    \t{{/sections}}\r\n\t\t\t<tr>\r\n\t\t\t\t<td colspan=\"3\" style=\"text-align:right;border-top:double #999\">\r\n\t\t\t\t\t総点 {{total_ten}} 点\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t    </tbody>\r\n\t</table>\r\n\t<hr/>\r\n\t<div style=\"font-size:13px\">\r\n\t    請求額： <span mc-name=\"charge-disp\">{{charge}}</span> 円 （負担 {{futan_wari}} 割）\r\n\t    <a mc-name=\"modifyLink\" href=\"javascript:void(0)\" class=\"cmd-link\">変更</a>\r\n\t</div>\r\n\t<div mc-name=\"modifyWrapper\" style=\"display:none; font-size:13px; margin:4px 0\">\r\n\t\t<form onsubmit=\"return false\">\r\n\t\t    変更額： <input mc-name=\"newCharge\" style=\"width: 4em\" class=\"alpha\"/> 円\r\n\t\t    <a mc-name=\"modifyEnter\" href=\"javascript:void(0)\" class=\"cmd-link\">適用</a> |\r\n\t\t    <a mc-name=\"modifyCancel\" href=\"javascript:void(0)\" class=\"cmd-link\">キャンセル</a>\r\n\t    </form>\r\n\t</div>\r\n\t<div class=\"workarea-commandbox\">\r\n\t    <button mc-name=\"enterLink\">入力</button>\r\n\t    <button mc-name=\"cancelLink\">キャンセル</button>\r\n\t</div>\r\n</div>\r\n\r\n"

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var mUtil = __webpack_require__(5);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);
	var mConsts = __webpack_require__(8);
	var kanjidate = __webpack_require__(16);

	var tmplSrc = __webpack_require__(22);
	var resultTmplSrc = __webpack_require__(23);
	var resultTmpl = hogan.compile(resultTmplSrc);

	var searchTextSelector = "> form[mc-name=searchForm] input[mc-name=searchText]";
	var searchLinkSelector = "> form[mc-name=searchForm] [mc-name=searchLink]";
	var searchResultSelector = "> [mc-name=resultWrapper]";

	exports.create = function(patientId){
		var dom = $(tmplSrc);
		bindSearch(dom, patientId);
		return dom;
	}

	function bindSearch(dom, patientId){
		dom.on("click", searchLinkSelector, function(event){
			event.preventDefault();
			var text = dom.find(searchTextSelector).val().trim();
			if( text === "" ){
				return;
			}
			var searchResult;
			task.run([
				function(done){
					service.searchTextForPatient(patientId, text, function(err, result){
						if( err ){
							done(err);
							return;
						}
						searchResult = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				var list = searchResult.map(function(item){
					return {
						title: kanjidate.format(kanjidate.f5, item.v_datetime),
						content: item.content.replace(/\n/g, "<br />\n")
					}
				});
				dom.find(searchResultSelector).html(resultTmpl.render({list: list}));
			})
		})
	}


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = "<div style=\"font-size:13px; width:300px\">\r\n    <form mc-name=\"searchForm\" onsubmit=\"return false\">\r\n        <input mc-name=\"searchText\"/>\r\n        <button mc-name=\"searchLink\">検索</button>\r\n    </form>\r\n    <div mc-name=\"resultWrapper\"\r\n         style=\"height:300px;overflow:auto\">\r\n    </div>\r\n</div>"

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "{{#list}}\r\n\t<div>\r\n\t    <div style=\"margin:2px 0; padding: 3px; border: 1px solid #ccc\">\r\n\t        <div name=\"title\"\r\n\t             style=\"font-weight: bold; margin-bottom:4px\">{{title}}</div>\r\n\t        <div name=\"content\">{{& content}}</div>\r\n\t    </div>\r\n\t</div>\r\n{{/list}}\r\n"

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	(function(exports){

	function setAttributes(e, map){
		for(var key in map){
			e.setAttribute(key, map[key]);
		}
	}

	function setStyles(e, map){
		for(var key in map){
			e.style[key] = map[key];
		}
	}

	function getOpt(opts, key, defaultValue){
		if( opts && key in opts ){
			return opts[key];
		} else {
			return defaultValue;
		}
	}

	function createScreen(zIndex, opacity){
		var screen = document.createElement("div");
		setStyles(screen, {
		    position:"fixed",
		    backgroundColor:"#999",
		    width:"100%",
		    height:"100%",
		    left:0,
		    top:0,
		    opacity: opacity,
		    filter:"alpha(opacity=" + Math.round(opacity*100) + ")",
		    zIndex: zIndex,
		    //display:"none"
		})
		return screen;
	}

	function createDialog(zIndex){
		var dialog = document.createElement("div");
		setStyles(dialog, {
		    position:"absolute",
		    left:"100px",
		    top:"50px",
		    padding:"10px",
		    border:"2px solid gray",
		    backgroundColor:"white",
		    opacity:1.0,
		    filter:"alpha(opacity=100)",
		    zIndex: zIndex,
		    overflow: "auto"
		})
		return dialog;
	}

	function Header(title){
		var header = document.createElement("table");
		setAttributes(header, {
			width: "100%",
			cellpadding: "0",
			cellspacing: "0"
		});
		setStyles(header, {
			margin: "0",
			padding: "0"
		});
		var tbody = document.createElement("tbody");
		header.appendChild(tbody);
		var tr = document.createElement("tr");
		tbody.appendChild(tr);
		var titleDom = document.createElement("td");
		titleDom.setAttribute("width", "*");
		titleDom.appendChild(createTitle(title));
		tr.appendChild(titleDom);
		var td = document.createElement("td");
		td.setAttribute("width", "auto");
		setStyles(td, {
		    width:"16px",
		    verticalAlign:"middle"
		});
		var closeBox = createCloseBox();
		td.appendChild(closeBox);
		tr.appendChild(td);
		return {
			dom: header,
			handle: titleDom,
			closeBox: closeBox
		}
	}

	function bindHandle(handler, dialog){
		handler.addEventListener("mousedown", function(event){
			event.preventDefault();
			event.stopPropagation();
			var startX = event.pageX;
			var startY = event.pageY;
			var offsetX = dialog.offsetLeft;
			var offsetY = dialog.offsetTop;
			document.addEventListener("mousemove", mousemoveHandler);
			document.addEventListener("mouseup", function(event){
				document.removeEventListener("mousemove", mousemoveHandler);
			});

			function mousemoveHandler(event){
				var windowWidth = window.innerWidth;
				var windowHeight = window.innerHeight;
				var dialogWidth = dialog.offsetWidth;
				var dialogHeight = dialog.offsetHeight;
				var currX = event.pageX;
				var currY = event.pageY;
				var newLeft = offsetX + (currX - startX);
				if( newLeft + dialogWidth > windowWidth ){
					newLeft = windowWidth - dialogWidth;
				}
				if( newLeft < 0 ){
					newLeft = 0;
				}
				var newTop = offsetY + (currY - startY);
				if( newTop + dialogHeight > windowHeight ){
					newTop = windowHeight - dialogHeight;
				}
				if( newTop < 0 ){
					newTop = 0;
				}
				dialog.style.left =  newLeft + "px";
				dialog.style.top = newTop + "px";
			}
		})
	}

	function createTitle(titleLabel){
		var handle = document.createElement("div");
		var title = document.createElement("div");
		setStyles(title, {
		    cursor:"move",
		    backgroundColor:"#ccc",
		    fontWeight:"bold",
		    padding:"6px 4px 4px 4px"
		});
		title.appendChild(document.createTextNode(titleLabel));
		handle.appendChild(title);
		return handle;
	}

	function createCloseBox(){
		var closeBox = document.createElement("a");
		closeBox.setAttribute("href", "javascript:void(0)");
		setStyles(closeBox, {
		    fontSize:"13px",
		    fontWeight:"bold",
		    margin:"4px 0 4px 4px",
		    padding:0,
		    textDecoration:"none",
		    color:"#333"
		});
		closeBox.appendChild(document.createTextNode("×"));
		return closeBox;
	}

	function createContent(){
		var content = document.createElement("div");
		content.style.marginTop = "10px";
		return content;
	}

	function ModalDialog(opts){
		this.screenZIndex = getOpt(opts, "scrrenZIndex", 10);
		this.screenOpacity = getOpt(opts, "screenOpacity", 0.5);
		this.dialogZIndex = getOpt(opts, "dialogZIndex", 11);
		this.title = getOpt(opts, "title", "Untitled");
		this.onCloseClick = getOpt(opts, "onCloseClick", null);
	}

	ModalDialog.prototype.open = function(){
		var screen = createScreen(this.screenZIndex, this.screenOpacity);
		//screen.style.display = "block";
		document.body.appendChild(screen);
		var dialog = createDialog(this.dialogZIndex);
		document.body.appendChild(dialog);
		var header = new Header(this.title);
		dialog.appendChild(header.dom);
		bindHandle(header.handle, dialog);
		header.closeBox.addEventListener("click", onClose.bind(this));
		var content = createContent(this.content);
		dialog.appendChild(content);
		this.screen = screen;
		this.dialog = dialog;
		this.content = content;
		this.reposition();

		function onClose(event){
			event.preventDefault();
			if( this.onCloseClick && this.onCloseClick() === false ){
				return;
			}
			this.close();
		}
	};

	ModalDialog.prototype.reposition = function(){
		if( !this.dialog ){
			return;
		}
		var dialog = this.dialog;
		var space = window.innerWidth - dialog.offsetWidth;
		if( space > 0 ){
			dialog.style.left = Math.floor(space / 2) + "px";
		}
	}

	ModalDialog.prototype.close = function(){
		document.body.removeChild(this.dialog);
		document.body.removeChild(this.screen);
	}

	// Example ----------------------------------------------
	//
	// startModal({
	// 	title: "Test",
	// 	init: function(content, close){
	// 		var a = document.createElement("button");
	// 		a.setAttribute("href", "javascript:void(0)");
	// 		a.addEventListener("click", function(event){
	// 			close();
	// 		});
	// 		a.appendChild(document.createTextNode("Close"));
	// 		content.innerHTML = "Hello, world!";
	// 		content.appendChild(a);
	// 		console.log(this.screenZIndex);
	// 	},
	// 	onCloseClick: function(){
	// 		console.log("close box clicked");
	// 		// return false // if not to close dialog
	// 	}
	// });
	//

	exports.startModal = function(opts){
		var modalDialog = new ModalDialog(opts);
		modalDialog.open();
		if( opts.init ){
			opts.init.call(modalDialog, modalDialog.content, function(){ modalDialog.close(); });
			modalDialog.reposition();
		}
	}

	})( true ? exports : window);


/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = "<div id=\"current-menu\">\r\n    <button mc-name=\"accountButton\">会計</button>\r\n    <button mc-name=\"endPatientButton\">患者終了</button>\r\n    <a mc-name=\"searchTextLink\" href=\"javascript:void(0)\"\r\n            class=\"cmd-link\">文章検索</a> |\r\n    <form style=\"display:inline\" action=\"/refer\" method=\"POST\" target=\"refer\">\r\n\t    <a mc-name=\"createReferLink\" href=\"javascript:void(0)\" class=\"cmd-link\">紹介状作成</a>\r\n\t    <input type=\"hidden\" name=\"json-data\" value=\"{}\" />\r\n\t</form>\r\n</div>\r\n<div mc-name=\"accountArea\"></div>\r\n"

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);

	var tmplSrc = __webpack_require__(27);
	var tmpl = hogan.compile(tmplSrc);

	exports.setup = function(dom){
		["rx-start-page", "rx-goto-page", "rx-delete-visit"].forEach(function(key){
			dom.listen(key, function(appData){
				var totalPages = appData.totalPages;
				var currentPage = appData.currentPage;
				dom.data("number-of-pages", totalPages);
				dom.data("page", currentPage);
				if( totalPages <= 1 ){
					dom.html("");
				} else {
					dom.html(tmpl.render({
						page: currentPage,
						total: totalPages
					}));
				}
			})
		});
		bindGotoFirst(dom);
		bindGotoPrev(dom);
		bindGotoNext(dom);
		bindGotoLast(dom);
	};

	function bindGotoFirst(dom){
		dom.on("click", "[mc-name=gotoFirst]", function(event){
			var numPages = dom.data("number-of-pages");
			var page = dom.data("page");
			event.preventDefault();
			if( page <= 1 ){
				return;
			}
			dom.trigger("goto-page", [1]);
		});
	};

	function bindGotoPrev(dom){
		dom.on("click", "[mc-name=gotoPrev]", function(event){
			var numPages = dom.data("number-of-pages");
			var page = dom.data("page");
			event.preventDefault();
			if( page <= 1 ){
				return;
			}
			dom.trigger("goto-page", [page - 1]);
		});
	};

	function bindGotoNext(dom){
		dom.on("click", "[mc-name=gotoNext]", function(event){
			var numPages = dom.data("number-of-pages");
			var page = dom.data("page");
			event.preventDefault();
			if( page >= numPages ){
				return;
			}
			dom.trigger("goto-page", [page + 1]);
		});
	};

	function bindGotoLast(dom){
		dom.on("click", "[mc-name=gotoLast]", function(event){
			var numPages = dom.data("number-of-pages");
			var page = dom.data("page");
			event.preventDefault();
			if( page >= numPages ){
				return;
			}
			dom.trigger("goto-page", [numPages]);
		});
	};



/***/ },
/* 27 */
/***/ function(module, exports) {

	module.exports = "<a mc-name=\"gotoFirst\" href=\"javascript:void(0)\" class=\"cmd-link\">&laquo</a>\r\n<a mc-name=\"gotoPrev\" href=\"javascript:void(0)\" class=\"cmd-link\">&lt;</a>\r\n<a mc-name=\"gotoNext\" href=\"javascript:void(0)\" class=\"cmd-link\">&gt;</a>\r\n<a mc-name=\"gotoLast\" href=\"javascript:void(0)\" class=\"cmd-link\">&raquo</a>\r\n<span mc-name=\"status\">[{{page}}/{{total}}]</span>\r\n"

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var service = __webpack_require__(10);
	var mUtil = __webpack_require__(5);
	var Record = __webpack_require__(29);

	exports.setup = function(dom){
		["rx-start-page", "rx-goto-page", "rx-delete-visit"].forEach(function(key){
			dom.listen(key, function(appData){
				var currentVisitId = dom.inquire("fn-get-current-visit-id");
				var tempVisitId = dom.inquire("fn-get-temp-visit-id");
				var records = appData.record_list;
				dom.html("");
				records.forEach(function(data){
					dom.append(Record.create(data, currentVisitId, tempVisitId));
				})
			})
		});
		bindDrugEntered(dom);
		bindDrugModified(dom);
		bindDrugDeleted(dom);
		bindShinryouBatchEntered(dom);
		bindConductsBatchEntered(dom);
		bindTextsBatchEntered(dom);
	};

	function bindDrugEntered(recordListDom){
		recordListDom.on("drug-entered", function(event, newDrug){
			recordListDom.broadcast("rx-drug-entered", [newDrug]);
		});
	}

	function bindDrugModified(dom){
		dom.on("drug-modified", function(event, newDrug){
			dom.broadcast("rx-drug-modified", [newDrug]);
		});
	}

	function bindDrugDeleted(dom){
		dom.on("drug-deleted", function(event, drugId, visitId){
			dom.broadcast("rx-drug-deleted", [drugId]);
			dom.broadcast("rx-number-of-drugs-changed", [visitId]);
		});
	}

	function bindShinryouBatchEntered(dom){
		dom.on("shinryou-batch-entered", function(event, visitId, shinryouList){
			event.stopPropagation();
			dom.broadcast("rx-shinryou-batch-entered", [visitId, shinryouList]);
		})
	}

	function bindConductsBatchEntered(dom){
		dom.on("conducts-batch-entered", function(event, visitId, conducts){
			event.stopPropagation();
			dom.broadcast("rx-conducts-batch-entered", [visitId, conducts]);
		});
	}

	function bindTextsBatchEntered(dom){
		dom.on("texts-batch-entered", function(event, visitId, texts){
			event.stopPropagation();
			dom.broadcast("rx-texts-batch-entered", [visitId, texts]);
		});
	}




/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(30);
	var Title = __webpack_require__(31);
	var TextList = __webpack_require__(33);
	var TextMenu = __webpack_require__(44);
	var Hoken = __webpack_require__(46);
	var DrugMenu = __webpack_require__(51);
	var DrugList = __webpack_require__(64);
	var ShinryouMenu = __webpack_require__(70);
	var ShinryouList = __webpack_require__(85);
	var ConductMenu = __webpack_require__(90);
	var ConductList = __webpack_require__(99);
	var Charge = __webpack_require__(117);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);

	exports.create = function(visit, currentVisitId, tempVisitId){
		var dom = $(tmplSrc);
		Title.setup(dom.find("[mc-name=title]"), visit, currentVisitId, tempVisitId);
		TextList.setup(dom.find("[mc-name=texts]"), visit.visit_id, visit.texts);
		TextMenu.setup(dom.find("[mc-name=text-menu]"), visit.visit_id);
		Hoken.setup(dom.find("[mc-name=hoken]"), visit);
		DrugMenu.setup(dom.find("[mc-name=drugMenu]"), visit);
		DrugList.setup(dom.find("[mc-name=drugs].record-drug-wrapper"), 
			visit.drugs, visit.visit_id, visit.v_datetime, visit.patient_id);
		ShinryouMenu.setup(dom.find("[mc-name=shinryouMenu]"), visit.visit_id, visit.v_datetime);
		ShinryouList.setup(dom.find("[mc-name=shinryouList]"), visit.shinryou_list,
			visit.visit_id, visit.v_datetime, visit.patient_id);
		ConductMenu.setup(dom.find("[mc-name=conductMenu]"), visit.visit_id, visit.v_datetime);
		ConductList.setup(dom.find("[mc-name=conducts]"), visit.conducts, visit.visit_id, visit.v_datetime);
		Charge.setup(dom.find("[mc-name=charge]"), visit.visit_id, visit.charge);
		bindTextsEntered(dom, visit.visit_id);
		bindShinryouEntered(dom, visit.visit_id);
		bindShinryouDeleted(dom, visit.visit_id);
		bindShinryouDeleteDuplicated(dom, visit.visit_id);
		bindConductEntered(dom, visit.visit_id);
		return dom;
	}

	function bindTextsEntered(dom, visitId){
		dom.on("text-batch-entered", function(event, targetVisitId, texts){
			if( visitId === targetVisitId ){
				event.stopPropagation();
				dom.broadcast("rx-texts-batch-entered", [targetVisitId, texts]);
			}
		})
	}

	// function bindDrugsEntered(dom, visitId){
	// 	dom.on("drugs-batch-entered", function(event, targetVisitId, drugs){
	// 		if( targetVisitId === visitId ){
	// 			event.stopPropagation();
	// 			dom.broadcast("rx-drugs-batch-entered", [targetVisitId, drugs]);
	// 		}
	// 	});
	// }

	// function bindDrugsModifiedDays(dom, visitId){
	// 	dom.on("drugs-batch-modified-days", function(event, targetVisitId, drugIds, days){
	// 		if( visitId === targetVisitId ){
	// 			event.stopPropagation();
	// 			drugIds.forEach(function(drugId){
	// 				dom.broadcast("rx-drug-modified-days", [drugId, days]);
	// 			});
	// 		}
	// 	});
	// }

	// function bindDrugsDeleted(dom, visitId){
	// 	dom.on("drugs-batch-deleted", function(event, targetVisitId, drugIds){
	// 		if( targetVisitId === visitId ){
	// 			event.stopPropagation();
	// 			drugIds.forEach(function(drugId){
	// 				dom.broadcast("rx-drug-deleted", [drugId]);
	// 			})
	// 		}
	// 	})
	// }

	// function bindDrugsNumbersChanged(dom, visitId){
	// 	dom.listen("rx-number-of-drugs-changed", function(targetVisitId){
	// 		if( visitId === targetVisitId ){
	// 			var drug
	// 		}
	// 	})
	// 	// dom.on("drugs-need-renumbering", function(event, targetVisitId){
	// 	// 	if( visitId === targetVisitId ){
	// 	// 		event.stopPropagation();
	// 	// 		dom.broadcast("rx-drugs-need-renumbering", [visitId]);
	// 	// 	}
	// 	// })
	// }

	function bindShinryouEntered(dom, visitId){
		dom.on("shinryou-batch-entered", function(event, targetVisitId, shinryouList){
			if( visitId === targetVisitId ){
				event.stopPropagation();
				dom.broadcast("rx-shinryou-batch-entered", [targetVisitId, shinryouList]);
			}
		})
	}

	function bindShinryouDeleted(dom, visitId){
		dom.on("shinryou-batch-deleted", function(event, targetVisitId, deletedShinryouIds){
			if( visitId === targetVisitId ){
				event.stopPropagation();
				deletedShinryouIds.forEach(function(shinryouId){
					dom.broadcast("rx-shinryou-deleted", [shinryouId])
				});
			}
		});
	}

	function bindShinryouDeleteDuplicated(dom, visitId){
		dom.on("shinryou-delete-duplicated", function(event, targetVisitId){
			if( visitId === targetVisitId ){
				event.stopPropagation();
				var shinryouItems = dom.broadcast("rx-shinryou-lookup-for-visit", [targetVisitId]);
				var curMap = {};
				var duplicateShinryouIds = [];
				shinryouItems.forEach(function(item){
					var shinryoucode = item.shinryoucode;
					if( curMap[shinryoucode] ){
						duplicateShinryouIds.push(item.shinryou_id);
					} else {
						curMap[shinryoucode] = true;
					}
				});
				task.run([
					function(done){
						service.batchDeleteShinryou(duplicateShinryouIds, done);
					}
				], function(err){
					if( err ){
						alert(err);
						return;
					}
					duplicateShinryouIds.forEach(function(shinryouId){
						dom.broadcast("rx-shinryou-deleted", [shinryouId]);
					})
				})
			}
		});
	}

	function bindConductEntered(dom, visitId){
		dom.on("conducts-batch-entered", function(event, targetVisitId, conducts){
			if( targetVisitId === visitId ){
				event.stopPropagation();
				dom.broadcast("rx-conducts-batch-entered", [targetVisitId, conducts]);
			}
		})
	}






/***/ },
/* 30 */
/***/ function(module, exports) {

	module.exports = "<table class=\"visit-entry\" width=\"100%\">\r\n    <tbody>\r\n    <tr>\r\n        <td colspan=\"2\" mc-name=\"title\"></td>\r\n    </tr>\r\n    <tr valign=top>\r\n        <td width=\"50%\">\r\n            <div class=\"record-text-wrapper\">\r\n        \t\t<div mc-name=\"texts\"></div>\r\n                <div mc-name=\"text-menu\" class=\"record-text-menu\"></div>\r\n            </div>\r\n        </td>\r\n        <td width=\"50%\">\r\n            <div class=\"record-right-wrapper\">\r\n                <div mc-name=\"hoken\" class=\"hoken\"></div>\r\n                <div mc-name=\"drugMenu\"></div>\r\n                <div mc-name=\"drugs\" class=\"record-drug-wrapper\">\r\n                    <div mc-name=\"rp\"></div>\r\n                </div>\r\n                <div mc-name=\"shinryouMenu\"></div>\r\n                <div mc-name=\"shinryouList\" class=\"record-shinryou-wrapper\"></div>\r\n                <div mc-name=\"conductMenu\"></div>\r\n                <div mc-name=\"conducts\" class=\"record-conduct-wrapper\"></div>\r\n                <div mc-name=\"charge\"></div>\r\n            </div>\r\n        </td>\r\n    </tr>\r\n    </tbody>\r\n</table>\r\n"

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var kanjidate = __webpack_require__(16);
	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);

	var tmplSrc = __webpack_require__(32);
	var tmpl = hogan.compile(tmplSrc);

	exports.setup = function(dom, visit, currentVisitId, tempVisitId){
		var label = kanjidate.format("{G}{N:2}年{M:2}月{D:2}日（{W}） {h:2}時{m:2}分", visit.v_datetime);
		dom.data("visit-id", visit.visit_id);
		render(dom, label, currentVisitId, tempVisitId);
		bindClick(dom);
		bindDelete(dom);
		bindSetTemp(dom);
		bindUnsetTemp(dom);
	};

	function getDateDom(dom){
		return dom.find(".visit-date")
	}

	function renderClass(dom, currentVisitId, tempVisitId){
		var dateDom = getDateDom(dom);
		dateDom.removeClass("current currentTmp");
		if( dom.data("visit-id") === currentVisitId ){
			dateDom.addClass("current");
		} else if( dom.data("visit-id") === tempVisitId ){
			dateDom.addClass("currentTmp");
		}
	}

	function render(dom, label, currentVisitId, tempVisitId){
		var html = tmpl.render({
			label: label
		});
		dom.html(html);
		renderClass(dom, currentVisitId, tempVisitId);
	}

	function getWorkspaceDom(dom){
		return dom.find("[mc-name=workarea]")
	};

	function bindClick(dom){
		dom.on("click", "[mc-name=titleBox] a", function(event){
			event.preventDefault();
			var ws = getWorkspaceDom(dom);
			if( ws.is(":visible") ){
				ws.hide();
			} else {
				ws.show();
			}
		});
	}

	function bindDelete(dom){
		dom.on("click", "a[mc-name=deleteVisitLink]", function(event){
			event.preventDefault();
			var visitId = dom.data("visit-id");
			if( !(visitId > 0) ){
				alert("invalid visit_id");
				return;
			}
			dom.trigger("delete-visit", [visitId]);
		});
	}

	function bindSetTemp(dom){
		dom.on("click", "a[mc-name=setCurrentTmpVisitId]", function(event){
			event.preventDefault();
			var visitId = dom.data("visit-id");
			dom.trigger("set-temp-visit-id", [visitId, function(err){
				if( err ){
					alert(err);
					return;
				}
				getWorkspaceDom(dom).hide();
			}]);
		});
		dom.listen("rx-set-temp-visit-id", function(appData){
			renderClass(dom, appData.currentVisitId, appData.tempVisitId);
		});
	}

	function bindUnsetTemp(dom){
		dom.on("click", "a[mc-name=unsetCurrentTmpVisitId]", function(event){
			event.preventDefault();
			if( !getDateDom(dom).hasClass("currentTmp") ){
				alert("暫定診察ではありません。")
				return;
			}
			dom.trigger("set-temp-visit-id", [0, function(err){
				if( err ){
					alert(err);
					return;
				}
				getWorkspaceDom(dom).hide();
			}]);
		})
	}



/***/ },
/* 32 */
/***/ function(module, exports) {

	module.exports = "<div mc-name=\"titleBox\" class=\"visit-date\">\r\n    <a href=\"javascript:void(0)\" class=\"record-title\">\r\n    \t<span mc-name=\"label\">{{label}}</span>\r\n    </a>\r\n</div>\r\n<div mc-name=\"workarea\" class=\"record-title-workarea\" style=\"display:none\">\r\n    <a mc-name=\"deleteVisitLink\" class=\"cmd-link\" href=\"javascript:void(0)\">この診察を削除</a> |\r\n    <a mc-name=\"setCurrentTmpVisitId\" class=\"cmd-link\" href=\"javascript:void(0)\">暫定診察設定</a> |\r\n    <a mc-name=\"unsetCurrentTmpVisitId\" class=\"cmd-link\" href=\"javascript:void(0)\">暫定診察解除</a>\r\n</div>\r\n"

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var Text = __webpack_require__(34);

	exports.setup = function(dom, visitId, texts){
		batchAdd(dom, texts);
		dom.listen("rx-texts-batch-entered", function(targetVisitId, texts){
			if( visitId !== targetVisitId ){
				return;
			}
			batchAdd(dom, texts);
		})
	}

	function batchAdd(dom, texts){
		texts.forEach(function(text){
			var te = Text.create(text);
			dom.append(te);
		});
	}

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var TextDisp = __webpack_require__(35);
	var TextForm = __webpack_require__(37);
	var tmplSrc = __webpack_require__(43);

	exports.create = function(text){
		var dom = $(tmplSrc);
		TextDisp.setup(getDispDom(dom), text);
		bindContentClick(dom, text);
		return dom;
	};

	function getDispDom(dom){
		return dom.find("> [mc-name=disp]");
	}

	function getFormDom(dom){
		return dom.find("> [mc-name=form]");
	}

	function bindContentClick(dom, text){
		dom.on("content-click", function(event){
			event.stopPropagation();
			var editor = TextForm.create(text);
			getDispDom(dom).hide();
			getFormDom(dom).html("").append(editor);
			bindEditor(dom, editor);
		})
	}

	function bindEditor(dom, editor){
		editor.on("text-updated", function(event, text){
			event.stopPropagation();
			var disp = getDispDom(dom);
			var form = getFormDom(dom);
			TextDisp.setup(disp, text);
			form.html("");
			disp.show();
		});
		editor.on("cancel-edit", function(event){
			event.stopPropagation();
			var disp = getDispDom(dom);
			var form = getFormDom(dom);
			form.html("");
			disp.show();
		});
		editor.on("text-deleted", function(event){
			event.stopPropagation();
			dom.remove();
		});
	}



/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(36);
	var tmpl = hogan.compile(tmplSrc);

	exports.setup = function(dom, text){
		var content = text.content.replace(/\n/g, "<br />\n");
		if( content === "" ){
			content = "（空白）"
		}
		var data = {
			content: content
		};
		dom.html(tmpl.render(data));
		bindClick(dom);
	};

	function bindClick(dom){
		dom.on("click", function(event){
			event.stopPropagation();
			dom.trigger("content-click");
		})
	}


/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = "{{& content}}"

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(40);
	var tmpl = hogan.compile(tmplSrc);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var mUtil = __webpack_require__(5);
	var conti = __webpack_require__(4);
	var rcptUtil = __webpack_require__(41);
	var moment = __webpack_require__(6);
	var modal = __webpack_require__(24);
	var shohousenTmplSrc = __webpack_require__(42);
	var shohousenTmpl = hogan.compile(shohousenTmplSrc);

	exports.create = function(text){
		var isEditing = text.text_id > 0;
		var html = tmpl.render(mUtil.assign({}, text, {
			isEditing: isEditing,
			isEntering: !isEditing
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
			var at = moment(visit.v_datetime);
			data["koufu-date"] = [at.year(), at.month()+1, at.date()];
		}
	}

	function shohousenDialog(dom, data){
		modal.startModal({
			title: "処方箋発行",
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
		// dom.find("button[mc-name=shohousen-button]").click(function(event){
		// 	event.preventDefault();
		// 	fetchData(visitId, function(err, result){
		// 		if( err ){
		// 			alert(err);
		// 			return;
		// 		}
		// 		var data = {
		// 			"drugs": content,
		// 			"futan-wari": result.futanWari
		// 		}
		// 		extendShohousenData(data, result);
		// 		var form = dom.find("form[mc-name=shohousen-form]");
		// 		form.find("input[name=json-data]").val(JSON.stringify(data))
		// 		form.submit();
		// 	})
		// })
		// dom.find("[mc-name=prescribeLink]").click(function(event){
		// 	event.preventDefault();
		// 	var form = dom.find("form[target=shohousen]");
		// 	fetchData(visitId, function(err, result){
		// 		if( err ){
		// 			alert(err);
		// 			return;
		// 		}
		// 		var data = {
		// 			"drugs": content,
		// 			"futan-wari": result.futanWari
		// 		}
		// 		extendShohousenData(data, result);
		// 		form.find("input[name=json-data]").val(JSON.stringify(data))
		// 		form.submit();
		// 	})
		// })
		dom.find("[mc-name=prescribeLink]").click(function(event){
			event.preventDefault();
			fetchData(visitId, function(err, result){
				if( err ){
					alert(err);
					return;
				}
				var data = {
					"drugs": content,
					"futan-wari": result.futanWari
				}
				extendShohousenData(data, result);
				shohousenDialog(dom, data);
			})
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

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(38).setImmediate))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(39).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(38).setImmediate, __webpack_require__(38).clearImmediate))

/***/ },
/* 39 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 40 */
/***/ function(module, exports) {

	module.exports = "<div class=\"enter-text\">\r\n\t<textarea mc-name=\"content\" name=\"content\">{{content}}</textarea>\r\n\r\n\t<div>\r\n\t    <a mc-name=\"enterLink\" href=\"javascript:void(0)\" class=\"cmd-link\">入力</a>\r\n\t    <a mc-name=\"cancelLink\" href=\"javascript:void(0)\" class=\"cmd-link\">キャンセル</a>\r\n\t    {{#isEditing}}\r\n\t    <a mc-name=\"deleteLink\" href=\"javascript:void(0)\" class=\"cmd-link\" >削除</a>\r\n\t\t<a mc-name=\"prescribeLink\" href=\"javascript:void(0)\" class=\"cmd-link\">処方箋発行</a>\r\n\t\t<a mc-name=\"copy\" href=\"javascript:void(0)\" class=\"cmd-link\">コピー</a>\r\n\t\t<!--\r\n\t    <form style=\"display:inline\" target=\"shohousen\", action=\"/shohousen\" method=\"POST\" mc-name=\"shohousen-form\">\r\n\t    \t<a mc-name=\"prescribeLink\" href=\"javascript:void(0)\" class=\"cmd-link\">処方箋発行</a>\r\n\t    \t<input name=\"json-data\" value=\"{}\" type=\"hidden\"/>\r\n    \t</form>\r\n\t\t-->\r\n\t    {{/isEditing}}\r\n\t</div>\r\n</div>\r\n"

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var mConsts = __webpack_require__(8);
	var moment = __webpack_require__(6);

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

	exports.calcFutanWari = function(visit, patient){
		var futanWari, bd, at, age;
		futanWari = 10;
		if( visit.shahokokuho ){
			bd = moment(patient.birth_day);
			at = moment(visit.v_datetime);
			age = exports.calcRcptAge(bd.year(), bd.month()+1, bd.date(),
				at.year(), at.month()+1);
			futanWari = exports.calcShahokokuhoFutanWariByAge(age);
			if( visit.shahokokuho.kourei > 0 ){
				futanWari = visit.shahokokuho.kourei;
			}
		}
		if( visit.koukikourei ){
			futanWari = visit.koukikourei.futan_wari;
		}
		if( visit.roujin ){
			futanWari = visit.roujin.futan_wari;
		}
		visit.kouhi_list.forEach(function(kouhi){
			var kouhiFutanWari;
			kouhiFutanWari = exports.kouhiFutanWari(kouhi.futansha);
			if( kouhiFutanWari < futanWari ){
				futanWari = kouhiFutanWari;
			}
		});
		return futanWari;
	};




/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = "<form action=\"/shohousen\" method=\"POST\" target=\"shohousen\">\r\n<input type=\"hidden\" name=\"json-data\"/>\r\n<button type=\"submit\" mc-name=\"enter\">入力</button>\r\n<button type=\"button\" mc-name=\"cancel\">キャンセル</button>\r\n</form>"

/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t<div mc-name=\"disp\" class=\"record-text cursor-pointer\"></div>\r\n\t<div mc-name=\"form\"></div>\r\n</div>\r\n"

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var tmplHtml = __webpack_require__(45);
	var TextForm = __webpack_require__(37);
	var Text = __webpack_require__(34);

	exports.setup = function(dom, visitId){
		dom.html(tmplHtml);
		bindEnter(dom, visitId);
	};

	var enterLinkSelector = "> [mc-name=disp] [mc-name=addTextLink]";

	function getDispDom(dom){
		return dom.find("> [mc-name=disp]");
	}

	function getWorkspaceDom(dom){
		return dom.find("> [mc-name=workspace]");
	}

	function bindEnter(dom, visitId){
		dom.on("click", enterLinkSelector, function(event){
			event.preventDefault();
			var editor = TextForm.create({content: "", visit_id: visitId});
			bindEditor(dom, editor, visitId);
			var disp = getDispDom(dom);
			var work = getWorkspaceDom(dom);
			disp.hide();
			work.html("").append(editor);
		});
	}

	function bindEditor(dom, editor, visitId){
		editor.on("text-entered", function(event, text){
			event.stopPropagation();
			var disp = getDispDom(dom);
			var work = getWorkspaceDom(dom);
			dom.trigger("text-batch-entered", [visitId, [text]]);
			work.html("");
			disp.show();
		});
		editor.on("cancel-edit", function(event){
			event.stopPropagation();
			var disp = getDispDom(dom);
			var work = getWorkspaceDom(dom);
			work.html("");
			disp.show();
		})
	}

/***/ },
/* 45 */
/***/ function(module, exports) {

	module.exports = "<div mc-name=\"disp\">\r\n\t<a mc-name=\"addTextLink\" href=\"javascript:void(0)\" class=\"cmd-link\">[文章追加]</a>\r\n</div>\r\n<div mc-name=\"workspace\"></div>\r\n"

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var kanjidate = __webpack_require__(16);
	var mUtil = __webpack_require__(5);
	var HokenSelectForm = __webpack_require__(47);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);

	var tmplSrc = __webpack_require__(50);
	var tmpl = hogan.compile(tmplSrc);

	exports.setup = function(dom, visit){
		update(dom, visit);
		bindClick(dom);
	};

	function update(dom, visit){
		var label = mUtil.hokenRep(visit);
		dom.html(tmpl.render({label: label}));
		dom.data("visit", visit);
	};

	function bindClick(dom){
		dom.on("click", "[mc-name=label]", function(event){
			event.preventDefault();
			var visit = dom.data("visit");
			var list;
			task.run(function(done){
				service.listAvailableHoken(visit.patient_id, visit.v_datetime, function(err, result){
					if( err ){
						done(err);
						return;
					}
					list = result;
					done();
				})
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				var form = HokenSelectForm.create(list, visit);
				bindForm(form, dom);
				dom.hide();
				dom.after(form);
			})
		});
	}

	function bindForm(form, dom){
		form.on("hoken-updated", function(event, visit){
			update(dom, visit);
			form.remove();
			dom.show();
		});
		form.on("cancel-edit", function(event){
			event.stopPropagation();
			form.remove();
			dom.show();
		})
	}



/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplHtml = __webpack_require__(48);
	var itemTmplSrc = __webpack_require__(49);
	var itemTmpl = hogan.compile(itemTmplSrc);
	var mUtil = __webpack_require__(5);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);

	exports.create = function(hoken, visit){
		var dom = $(tmplHtml);
		var wrapper = dom.find("[mc-name=checkboxes]").html("");
		hoken.shahokokuho_list.forEach(function(shahokokuho){
			var label = mUtil.shahokokuhoRep(shahokokuho.hokensha_bangou);
			if( shahokokuho.kourei > 0 ){
				label += "高齢・" + shahokokuho.kourei + "割";
			}
			var check = itemTmpl.render({
				label: label,
				kind: "shahokokuho",
				value: shahokokuho.shahokokuho_id,
				checked: shahokokuho.shahokokuho_id == visit.shahokokuho_id
			});
			wrapper.append(check);
		});
		hoken.koukikourei_list.forEach(function(koukikourei){
			var label = mUtil.koukikoureiRep(koukikourei.futan_wari);
			var check = itemTmpl.render({
				label: label,
				kind: "koukikourei",
				value: koukikourei.koukikourei_id,
				checked: koukikourei.koukikourei_id == visit.koukikourei_id
			});
			wrapper.append(check);
		});
		hoken.roujin_list.forEach(function(roujin){
			var label = mUtil.roujinRep(roujin.futan_wari);
			var check = itemTmpl.render({
				label: label,
				kind: "roujin",
				value: roujin.roujin_id,
				checked: roujin.roujin_id == visit.roujin_id
			});
			wrapper.append(check);
		});
		hoken.kouhi_list.forEach(function(kouhi){
			var label = mUtil.kouhiRep(kouhi.futansha);
			var check = itemTmpl.render({
				label: label,
				kind: "kouhi",
				value: kouhi.kouhi_id,
				checked: kouhi.kouhi_id == visit.kouhi_1_id || kouhi.kouhi_id == visit.kouhi_2_id || 
					kouhi.kouhi_id == visit.kouhi_3_id
			});
			wrapper.append(check);
		});
		bindEnter(dom, visit);
		bindCancel(dom);
		return dom;
	};

	function collectChecked(dom){
		var checked = {
			shahokokuho_list: [],
			koukikourei_list: [],
			roujin_list: [],
			kouhi_list: []
		};
		dom.find("input[type=checkbox][name=hoken]:checked").each(function(){
			var e = $(this);
			switch(e.data("kind")){
				case "shahokokuho": checked.shahokokuho_list.push(e.val()); break;
				case "koukikourei": checked.koukikourei_list.push(e.val()); break;
				case "roujin": checked.roujin_list.push(e.val()); break;
				case "kouhi": checked.kouhi_list.push(e.val()); break;
				default: alert("unknown kind " + e.data("kind")); break;
			}
		});
		return checked;
	}

	function bindEnter(dom, visit){
		dom.on("click", "[mc-name=enter]", function(event){
			event.preventDefault();
			var checked = collectChecked(dom);
			var data = {visit_id: visit.visit_id};
			if( checked.shahokokuho_list.length + checked.koukikourei_list.length >= 2 ){
				alert("社保国保と後期高齢はあわせてひとつしか選択できません。");
				return;
			}
			data.shahokokuho_id = checked.shahokokuho_list.length > 0 ? +checked.shahokokuho_list[0] : 0;
			data.koukikourei_id = checked.koukikourei_list.length > 0 ? +checked.koukikourei_list[0] : 0;
			data.roujin_id = checked.roujin_list.length > 0 ? +checked.roujin_list[0] : 0;
			data.kouhi_1_id = checked.kouhi_list.length > 0 ? +checked.kouhi_list[0] : 0;
			data.kouhi_2_id = checked.kouhi_list.length > 1 ? +checked.kouhi_list[1] : 0;
			data.kouhi_3_id = checked.kouhi_list.length > 2 ? +checked.kouhi_list[2] : 0;
			var updatedVisit;
			task.run([
				function(done){
					service.updateVisit(data, done);
				},
				function(done){
					service.getVisitWithFullHoken(visit.visit_id, function(err, result){
						if( err ){
							done(err);
							return;
						}
						updatedVisit = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("hoken-updated", [updatedVisit]);
			})
		});
	}

	function bindCancel(dom){
		dom.on("click", "[mc-name=cancel]", function(event){
			event.preventDefault();
			dom.trigger("cancel-edit");
		})
	}


/***/ },
/* 48 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n\t<div class=\"title\">適用保険の編集</div>\r\n\t<form onsubmit=\"return false\">\r\n\t\t<div mc-name=\"checkboxes\"></div>\r\n\t\t<div class=\"workarea-commandbox\">\r\n\t\t\t<button mc-name=\"enter\">入力</button>\r\n\t\t\t<button mc-name=\"cancel\">キャンセル</button>\r\n\t\t</div>\r\n\t</form>\r\n</div>\r\n\r\n"

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t<input type=\"checkbox\" name=\"hoken\" data-kind=\"{{kind}}\" value=\"{{value}}\"\r\n\t\t{{#checked}}checked{{/checked}}>\r\n\t\t{{label}}\r\n</div>"

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = "<span mc-name=\"label\" class=\"cursor-pointer\">{{label}}</span>\r\n"

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var kanjidate = __webpack_require__(16);
	var myclinicUtil = __webpack_require__(5);
	var Submenu = __webpack_require__(52);
	var DrugForm = __webpack_require__(54);

	var tmplHtml = __webpack_require__(57);

	var CopySelected = __webpack_require__(58);
	var ModifyDays = __webpack_require__(60);
	var DeleteSelected = __webpack_require__(62);

	var task = __webpack_require__(9);
	var service = __webpack_require__(10);

	exports.setup = function(dom, visit){
		dom.html(tmplHtml);
		bindAddDrug(dom, visit);
		bindSubmenuClick(dom);
		bindCopySelected(dom, visit.visit_id, visit.v_datetime);
		bindModifyDays(dom, visit.visit_id, visit.v_datetime);
		bindDeleteSelected(dom, visit.visit_id, visit.v_datetime);
		bindWorkareaCancel(dom);
		bindWorkareaClose(dom);
		Submenu.setup(getSubmenuDom(dom), visit.visit_id, visit.v_datetime);
	};

	function getSubmenuDom(dom){
		return dom.find(".drug-submenu");
	}

	function getWorkareaDom(dom){
		return dom.find("> [mc-name=workarea]");
	}

	function setWorkarea(dom, kind, content){
		var wa = getWorkareaDom(dom);
		wa.data("kind", kind);
		wa.append(content);
	}

	function clearWorkarea(dom){
		var wa = getWorkareaDom(dom);
		wa.removeData("kind");
		wa.html("");
	}

	function bindAddDrug(dom, visit){
		dom.find("[mc-name=addDrugLink]").click(function(event){
			event.preventDefault();
			var submenu = getSubmenuDom(dom);
			if( Submenu.isVisible(submenu) ){
				return;
			}
			var wa = getWorkareaDom(dom);
			var kind = wa.data("kind");
			if( kind === "add-drug" ){
				clearWorkarea(dom);
				return;
			} else if( kind ){
				return;
			}
			var msg = "（暫定）診察中ではありませんが、薬剤を追加しますか？";
			if( !dom.inquire("fn-confirm-edit", [visit.visit_id, msg]) ){
				return;
			}
			wa.html("");
			var form = DrugForm.createAddForm(visit.visit_id, visit.v_datetime, visit.patient_id);
			form.on("entered", function(event, newDrug){
				event.stopPropagation();
				dom.trigger("drug-entered", [newDrug]);
			});
			form.on("cancel", function(event){
				event.stopPropagation();
				clearWorkarea(dom);
			});
			setWorkarea(dom, "add-drug", form);
		});
	}

	function bindSubmenuClick(dom){
		dom.on("click", "[mc-name=drugSubmenuLink]", function(event){
			event.preventDefault();
			var wa = getWorkareaDom(dom);
			if( wa.data("kind") ){
				return;
			}
			var submenu = getSubmenuDom(dom);
			if( Submenu.isVisible(submenu) ){
				Submenu.hide(submenu);
			} else {
				Submenu.show(submenu);
			}
		});
	}

	function bindCopySelected(dom, visitId, at){
		var submenu = getSubmenuDom(dom);
		submenu.on("submenu-copy-selected", function(event, targetVisitId){
			event.stopPropagation();
			task.run(function(done){
				service.listFullDrugsForVisit(visitId, at, done);
			}, function(err, drugs){
				if( err ){
					alert(err);
					return;
				}
				var form = CopySelected.create(drugs, at);
				Submenu.hide(submenu);
				setWorkarea(dom, "copy-selected", form);
			})
		})
	}

	function bindModifyDays(dom, visitId, at){
		var submenu = getSubmenuDom(dom);
		submenu.on("submenu-modify-days", function(event){
			event.stopPropagation();
			task.run(function(done){
				service.listFullDrugsForVisit(visitId, at, done);
			}, function(err, drugs){
				if( err ){
					alert(err);
					return;
				}
				var form = ModifyDays.create(drugs, visitId, at);
				Submenu.hide(submenu);
				setWorkarea(dom, "modify-days", form);
			})
		})
	}

	function bindDeleteSelected(dom, visitId, at){
		var submenu = getSubmenuDom(dom);
		submenu.on("submenu-delete-selected", function(event){
			event.stopPropagation();
			task.run(function(done){
				service.listFullDrugsForVisit(visitId, at, done);
			}, function(err, drugs){
				if( err ){
					alert(err);
					return;
				}
				var form = DeleteSelected.create(drugs, visitId, at);
				Submenu.hide(submenu);
				setWorkarea(dom, "delete-selected", form);
			})
		})
	}

	function bindWorkareaCancel(dom){
		dom.on("cancel-workarea", function(event){
			event.stopPropagation();
			clearWorkarea(dom);
		});
	}

	function bindWorkareaClose(dom){
		dom.on("close-workarea", function(event){
			event.stopPropagation();
			clearWorkarea(dom);
		})
	}


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	__webpack_require__(3);
	var tmplHtml = __webpack_require__(53);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var mUtil = __webpack_require__(5);
	var conti = __webpack_require__(4);

	exports.setup = function(dom, visitId, at){
		dom.data("visible", false);
		bindCopyAll(dom, visitId, at);
		bindCopySelected(dom, visitId, at);
		bindModifyDays(dom, visitId);
		bindDeleteSelected(dom, visitId);
		bindCancel(dom);
	};

	exports.isVisible = function(dom){
		return dom.data("visible");
	};

	exports.show = function(dom){
		dom.data("visible", true);
		dom.html(tmplHtml);
	};

	exports.hide = function(dom){
		dom.data("visible", false);
		dom.html("");
	};

	function bindCopyAll(dom, visitId, at){
		dom.on("click", "[mc-name=copyAll]", function(event){
			event.preventDefault();
			event.stopPropagation();
			var targetVisitId = dom.inquire("fn-get-target-visit-id");
			if( targetVisitId === 0 ){
				alert("現在（暫定）診察中でないため、コピーできません。");
				return;
			}
			if( targetVisitId === visitId ){
				alert("自分自身にはコピーできません。");
				return;
			}
			var targetAt, drugs, enteredDrugIds, enteredDrugs = [];
			task.run([
				function(done){
					service.getVisit(targetVisitId, function(err, result){
						if( err ){
							done(err);
							return;
						}
						targetAt = result.v_datetime;
						done();
					})
				},
				function(done){
					service.listFullDrugsForVisit(visitId, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						drugs = result.map(function(item){
							return mUtil.assign({}, item);
						});
						done();
					})
				},
				function(done){
					conti.forEachPara(drugs, function(drug, done){
						service.resolveIyakuhinMasterAt(drug.d_iyakuhincode, targetAt, function(err, result){
							if( err ){
								done(err);
								return;
							}
							var modify = {
								visit_id: targetVisitId,
								d_iyakuhincode: result.iyakuhincode,
								d_prescribed: 0
							}
							mUtil.assign(drug, result, modify);
							done();
						})
					}, done);
				},
				function(done){
					service.batchEnterDrugs(drugs, function(err, result){
						if( err ){
							done(err);
							return;
						}
						enteredDrugIds = result;
						done();
					});
				},
				function(done){
					conti.forEach(enteredDrugIds, function(drugId, done){
						service.getFullDrug(drugId, targetAt, function(err, result){
							if( err ){
								done(err);
								return;
							}
							enteredDrugs.push(result);
							done();
						})
					}, done);
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				enteredDrugs.forEach(function(newDrug){
					dom.trigger("drug-entered", [newDrug]);
				});
				exports.hide(dom);
			})
		});
	}

	function bindCopySelected(dom, visitId, at){
		dom.on("click", "[mc-name=copySelected]", function(event){
			var targetVisitId = dom.inquire("fn-get-target-visit-id");
			if( !targetVisitId ){
				alert("現在（暫定）診察中でありません。");
				return;
			}
			if( visitId === targetVisitId ){
				alert("同じ診察にはコピーできません。");
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			dom.trigger("submenu-copy-selected", [targetVisitId]);
		})
	}

	function bindModifyDays(dom, visitId){
		dom.on("click", "[mc-name=modifyDays]", function(event){
			var msg = "（暫定）診察中の項目ではありませんが、薬剤を選択して日数を変更しますか？";
			if( !dom.inquire("fn-confirm-edit", [visitId, msg]) ){
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			dom.trigger("submenu-modify-days");
		})
	}

	function bindDeleteSelected(dom, visitId){
		dom.on("click", "[mc-name=deleteSelected]", function(event){
			var msg = "（暫定）診察中の項目ではありませんが、薬剤を選択して削除しますか？";
			if( !dom.inquire("fn-confirm-edit", [visitId, msg]) ){
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			dom.trigger("submenu-delete-selected");
		})
	}

	function bindCancel(dom){
		dom.on("click", "[mc-name=cancel]", function(event){
			event.preventDefault();
			exports.hide(dom);
		});
	}


/***/ },
/* 53 */
/***/ function(module, exports) {

	module.exports = "<a mc-name=\"copyAll\" href=\"javascript:void(0)\" class=\"cmd-link\">全部コピー</a> |\r\n<a mc-name=\"copySelected\" href=\"javascript:void(0)\" class=\"cmd-link\">部分コピー</a> |\r\n<a mc-name=\"modifyDays\" href=\"javascript:void(0)\" class=\"cmd-link\">日数変更</a> |\r\n<a mc-name=\"deleteSelected\" href=\"javascript:void(0)\" class=\"cmd-link\">複数削除</a> |\r\n<a mc-name=\"cancel\" href=\"javascript:void(0)\" class=\"cmd-link\">キャンセル</a>\r\n"

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var mUtil = __webpack_require__(5);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);
	var mConsts = __webpack_require__(8);

	var tmplSrc = __webpack_require__(55);
	var tmpl = hogan.compile(tmplSrc);
	var itemTmplSrc = __webpack_require__(56);
	var itemTmpl = hogan.compile(itemTmplSrc);

	var Naifuku = mConsts.DrugCategoryNaifuku;
	var Tonpuku = mConsts.DrugCategoryTonpuku;
	var Gaiyou = mConsts.DrugCategoryGaiyou;

	var ZaikeiGaiyou = mConsts.ZaikeiGaiyou;

	exports.createAddForm = function(visitId, at, patientId){
		var dom = $(tmpl.render({isCreating: true, title: "新規処方の入力"}));
		bindSearchForm(dom, visitId, at, patientId);
		bindSearchResult(dom, at);
		bindUsageExample(dom);
		bindCategoryChange(dom);
		bindClear(dom);
		bindEnter(dom, visitId, at);
		bindCancel(dom);
		return dom;
	};

	exports.createEditForm = function(drug, at, patientId){
		var data = {
			isEditing: true,
			title: "処方の編集",
			name: drug.name,
			iyakuhincode: drug.d_iyakuhincode,
			amount: drug.d_amount,
			unit: drug.unit,
			usage: drug.d_usage,
			days: drug.d_days,
			category: drug.d_category
		}
		var dom = $(tmpl.render(data));
		updateDisplayDom(dom, data);
		bindSearchForm(dom, drug.visit_id, at, patientId);
		bindSearchResult(dom, at);
		bindUsageExample(dom);
		bindCategoryChange(dom);
		bindClear(dom);
		bindModify(dom, drug.drug_id, at);
		bindCancel(dom);
		bindDelete(dom, drug.drug_id);
		return dom;
	}

	function getErrorBox(dom){
		return dom.find("> .error-box");
	}

	function getDisplayDom(dom){
		return dom.find("> .drug-area");
	}

	function getDisplayNameDom(dom){
		return dom.find("> .drug-area [mc-name=name]");
	}

	function getDisplayAmountLabelDom(dom){
		return dom.find("> .drug-area [mc-name=amountLabel]");
	}

	function getDisplayAmountInputDom(dom){
		return dom.find("> .drug-area input[mc-name=amount]");
	}

	function getDisplayUnitDom(dom){
		return dom.find("> .drug-area [mc-name=unit]");
	}

	function getDisplayUsageInputDom(dom){
		return dom.find("> .drug-area input[mc-name=usage]");
	}

	function getDisplayDaysRowDom(dom){
		return dom.find("> .drug-area [mc-name=daysRow]");
	}

	function getDisplayDaysLabelDom(dom){
		return dom.find("> .drug-area [mc-name=daysLabel]");
	}

	function getDisplayDaysInputDom(dom){
		return dom.find("> .drug-area input[mc-name=days]");
	}

	function getDisplayDaysUnitDom(dom){
		return dom.find("> .drug-area [mc-name=daysUnit]");
	}

	function getSearchButtonDom(dom){
		return dom.find("[mc-name=searchLink]");
	}

	function getSearchTextDom(dom){
		return dom.find("[mc-name=searchText]");
	}

	function getSearchMode(dom){
		return dom.find("input[type=radio][name=search-mode]:checked").val();
	}

	function getSearchSelectDom(dom){
		return dom.find("> .drug-search-area select[mc-name=searchResult]");
	}

	function getCheckedCategory(dom){
		return dom.find("> .drug-area input[type=radio][name=category]:checked").val();
	}

	function adaptToCategory(dom, category){
		var amountLabel, daysLabel, daysUnit;
		switch(category){
			case Naifuku: 
				amountLabel = "用量";
				daysLabel = "日数";
				daysUnit = "日分";
				break;
			case Tonpuku:
				amountLabel = "一回";
				daysLabel = "回数";
				daysUnit = "回分";
				break;
			case Gaiyou:
				amountLabel: "";
				amountLabel = "用量";
				daysLabel = "";
				daysUnit = "";
				break;
			default: alert("unknown category"); return;
		}
		getDisplayAmountLabelDom(dom).text(amountLabel);
		getDisplayDaysLabelDom(dom).text(daysLabel);
		if( category === Gaiyou ){
			getDisplayDaysRowDom(dom).hide();
		} else {
			getDisplayDaysRowDom(dom).show();
		}
		getDisplayDaysUnitDom(dom).text(daysUnit);
	}

	function updateDisplayCategory(dom, category){
		dom.find("> .drug-area input[type=radio][name=category][value=" + category + "]").prop("checked", true);
		adaptToCategory(dom, category);
	}

	function updateDisplayDom(dom, data){
		getDisplayDom(dom).data("iyakuhincode", data.iyakuhincode);
		getDisplayNameDom(dom).text(data.name);
		getDisplayAmountInputDom(dom).val(data.amount);
		getDisplayUnitDom(dom).text(data.unit);
		getDisplayUsageInputDom(dom).val(data.usage);
		getDisplayDaysInputDom(dom).val(data.days);
		updateDisplayCategory(dom, data.category);
	}

	function fixedDays(dom){
		var input = dom.find("> .drug-area input[mc-name=fixedDaysCheck]:visible");
		return input.length > 0 ? input.prop("checked") : false;
	}

	function preserveUsageEtc(dom){
		var input = dom.find("> .drug-area input[mc-name=preserveUsage]:visible");
		return input.length > 0 ? input.prop("checked") : false;
	}

	function updateDisplay(dom, data, at){
		var iyakuhincode = +data.iyakuhincode;
		var master;
		task.run(function(done){
			service.resolveIyakuhinMasterAt(iyakuhincode, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				master = result;
				done();
			})
		}, function( err ){
			if( err ){
				alert(err);
				return;
			}
			if( master === null ){
				alert("現在使用できない薬剤です。");
				return;
			}
			var dispData = {
				iyakuhincode: master.iyakuhincode,
				name: master.name,
				amount: data.amount,
				unit: data.unit,
				usage: data.usage,
				days: data.days,
				category: data.category
			};
			if( fixedDays(dom) && getDisplayDaysInputDom(dom).val() !== "" ){
				dispData.days = getDisplayDaysInputDom(dom).val();
			}
			if( preserveUsageEtc(dom) ){
				mUtil.assign(dispData, {
					amount: getDisplayAmountInputDom(dom).val(),
					usage: getDisplayUsageInputDom(dom).val(),
					days: getDisplayDaysInputDom(dom).val()
				});
			}
			updateDisplayDom(dom, dispData);
		});
	}

	function clearDisplay(dom){
		getErrorBox(dom).html("").hide();
		getDisplayDom(dom).removeData("iyakuhincode");
		getDisplayNameDom(dom).text("");
		getDisplayAmountInputDom(dom).val("");
		getDisplayUsageInputDom(dom).val("");
		getDisplayDaysInputDom(dom).val("");
	}

	function updateSearchResult(dom, dataList){
		var select = getSearchSelectDom(dom).html("");
		dataList.forEach(function(data){
			var opt = $(itemTmpl.render(data));
			opt.data("data", data);
			select.append(opt);
		})
	}

	function masterToData(master){
		return {
			label: master.name,
			iyakuhincode: master.iyakuhincode,
			amount: "",
			unit: master.unit,
			usage: "",
			days: "",
			category: (+master.zaikei) === ZaikeiGaiyou ? Gaiyou : Naifuku
		}
	}

	function searchMaster(dom, text, at){
		var list;
		if( text === "" ){
			return;
		}
		task.run(function(done){
			service.searchIyakuhinMaster(text, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				list = result;
				done();
			})
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			updateSearchResult(dom, list.map(masterToData));
		});
	}

	function convertPrescExampleToDrug(ex){
		var drug = {};
		Object.keys(ex).forEach(function(key){
			var val = ex[key];
			if( key.startsWith("m_") ){
				key = "d_" + key.slice(2);
			}
			drug[key] = val;
		});
		return drug;
	}

	function stockToData(stock){
		var drug = convertPrescExampleToDrug(stock);
		return {
			label: mUtil.drugRep(drug),
			iyakuhincode: drug.d_iyakuhincode,
			amount: drug.d_amount,
			unit: stock.unit,
			usage: drug.d_usage,
			days: drug.d_days,
			category: drug.d_category
		}
	}

	function searchStock(dom, text){
		var list;
		if( text === "" ){
			return;
		}
		task.run(function(done){
			service.searchPrescExample(text, function(err, result){
				if( err ){
					done(err);
					return;
				}
				list = result;
				done();
			})
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			var dataList = list.map(stockToData);
			updateSearchResult(dom, dataList);
		});
	}

	function prevToData(prev){
		return {
			label: mUtil.drugRep(prev),
			iyakuhincode: prev.d_iyakuhincode,
			amount: prev.d_amount,
			unit: prev.unit,
			usage: prev.d_usage,
			days: prev.d_days,
			category: prev.d_category
		}
	}

	function searchPrev(dom, patientId, text){
		var list;
		task.run(function(done){
			service.searchFullDrugForPatient(patientId, text, function(err, result){
				if( err ){
					done(err);
					return;
				}
				list = result;
				done();
			})
		}, function(err){
			if( err ){
				alert(err);
				return;
			}
			updateSearchResult(dom, list.map(prevToData));
		});
	}

	function bindSearchForm(dom, visitId, at, patientId){
		var form = dom.find("> .drug-search-area form[mc-name=searchForm]");
		form.submit(function(event){
			event.preventDefault();
			event.stopPropagation();
			var text = getSearchTextDom(dom).val().trim();
			var mode = getSearchMode(dom);
			switch(mode){
				case "master": searchMaster(dom, text, at); break;
				case "stock": searchStock(dom, text); break;
				case "prev": searchPrev(dom, patientId, text); break;
				default: throw new Error("unknown search mode: " + mode); 
			}
		});
	}

	function bindSearchResult(dom, at){
		var select = getSearchSelectDom(dom);
		select.on("click", "option", function(event){
			var data = $(this).data("data");
			updateDisplay(dom, data, at);
		})
	}

	function bindUsageExample(dom){
		var examples = dom.find("> .drug-area [mc-name=usageExampleWrapper]")
		dom.on("click", "> .drug-area [mc-name=usageExampleLink]", function(event){
			event.preventDefault();
			event.stopPropagation();
			examples.toggle();
		});
		dom.on("click", "> .drug-area select[name=usage-example] option", function(){
			var value = $(this).val();
			getDisplayUsageInputDom(dom).val(value);
			examples.hide();
		});
	}

	function bindCategoryChange(dom){
		dom.on("change", "> .drug-area input[type=radio][name=category]", function(event){
			var category = +$(this).val();
			adaptToCategory(dom, category);
		});
	}

	function bindClear(dom){
		dom.on("click", "> .workarea-commandbox [mc-name=clearFormLink]", function(event){
			event.preventDefault();
			clearDisplay(dom);
		});
	}

	function bindCancel(dom){
		dom.on("click", "> .workarea-commandbox [mc-name=closeLink]", function(event){
			event.stopPropagation();
			dom.trigger("cancel");
		});
	}

	function collectFormInputs(dom, drug){
		mUtil.assign(drug, {
			d_amount: getDisplayAmountInputDom(dom).val(),
			d_usage: getDisplayUsageInputDom(dom).val(),
			d_category: +getCheckedCategory(dom),
			d_days: +getDisplayDaysInputDom(dom).val()
		});
		if( drug.d_category === Gaiyou ){
			drug.d_days = 1;
		}
	}

	function validate(drug){
		var errs = [];
		if( !(drug.d_iyakuhincode > 0) ){
			errs.push("invalid iyakuhincode: " + drug.d_iyakuhincode);
		}
		if( !drug.d_amount ){
			errs.push("用量が指定されていません。");
		}
		var category = +drug.d_category;
		if( !(category === Naifuku || category === Tonpuku || category === Gaiyou) ){
			errs.push("invalid category: " + category);
		}
		if( !(drug.d_days && ("" + drug.d_days).match(/^\d+$/)) ){
			errs.push("日数・回数の指定が不適切です。");
		}
		return errs;
	}

	function clearDisplayConsideringFixedDays(dom){
		var days = getDisplayDaysInputDom(dom).val();
		clearDisplay(dom);
		if( fixedDays(dom) ){
			getDisplayDaysInputDom(dom).val(days);
		}
	}

	function clearSearchArea(dom){
		getSearchTextDom(dom).val("");
		getSearchSelectDom(dom).empty();
	}

	function bindEnter(dom, visitId, at){
		dom.on("click", "> .workarea-commandbox [mc-name=enterLink]", function(event){
			event.stopPropagation();
			var iyakuhincode = getDisplayDom(dom).data("iyakuhincode");
			if( !iyakuhincode ){
				alert("薬剤が設定されていません。");
				return;
			}
			var drug = {
				visit_id: visitId,
				d_iyakuhincode: iyakuhincode,
				d_prescribed: 0
			};
			collectFormInputs(dom, drug);
			var errors = validate(drug);
			if( errors.length > 0 ){
				getErrorBox(dom).text(errors.join("")).show();
				return;
			}
			var drugId, newDrug;
			task.run([
				function(done){
					service.enterDrug(drug, function(err, result){
						if( err ){
							done(err);
							return;
						}
						drugId = result;
						done();
					})
				},
				function(done){
					service.getFullDrug(drugId, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newDrug = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("entered", [newDrug]);
				clearDisplayConsideringFixedDays(dom);
				clearSearchArea(dom);
			})
		});
	}

	function bindModify(dom, drugId, at){
		dom.on("click", "> .workarea-commandbox [mc-name=enterLink]", function(event){
			event.stopPropagation();
			var iyakuhincode = getDisplayDom(dom).data("iyakuhincode");
			if( !iyakuhincode ){
				alert("薬剤が設定されていません。");
				return;
			}
			var drug = {
				drug_id: drugId,
				d_iyakuhincode: iyakuhincode
			};
			collectFormInputs(dom, drug);
			var errors = validate(drug);
			if( errors.length > 0 ){
				getErrorBox(dom).text(errors.join("")).show();
				return;
			}
			var newDrug;
			task.run([
				function(done){
					service.modifyDrug(drug, done);
				},
				function(done){
					service.getFullDrug(drug.drug_id, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newDrug = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("modified", [newDrug]);
			})
		});
	}

	function bindDelete(dom, drugId){
		dom.on("click", "> .workarea-commandbox [mc-name=deleteLink]", function(event){
			event.preventDefault();
			event.stopPropagation();
			if( !confirm("本当にこの薬剤を削除しますか？") ){
				return;
			}
			task.run(function(done){
				service.batchDeleteDrugs([drugId], done);
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("deleted", [drugId]);
			})
		});
	}


/***/ },
/* 55 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n<div mc-name=\"title\" class=\"title\">{{title}}</div>\r\n<div class=\"error-box\" style=\"display:none\"></div>\r\n<div class=\"drug-area\"> <!-- should be at the top level -->\r\n    <table width=\"100%\">\r\n        <tr>\r\n            <td style=\"width:3em;\">名称</td>\r\n            <td mc-name=\"name\"></td>\r\n        </tr>\r\n        <tr>\r\n            <td mc-name=\"amountLabel\">用量</td>\r\n            <td>\r\n                <input mc-name=\"amount\" class=\"alpha-only\" style=\"width:4em\" />\r\n                <span mc-name=\"unit\"></span>\r\n            </td>\r\n        </tr>\r\n        <tr>\r\n            <td>用法</td>\r\n            <td>\r\n                <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n                    <tr>\r\n                        <td>\r\n                            <input mc-name=\"usage\" class=\"kanji\" style=\"width:100%\" />\r\n                        </td>\r\n                        <td>\r\n                            &nbsp;\r\n                            <a mc-name=\"usageExampleLink\" href=\"javascript:void(0)\" class=\"cmd-link\"\r\n                               >例</a>\r\n                        </td>\r\n                    </tr>\r\n                </table>\r\n            </td>\r\n        </tr>\r\n        <tr mc-name=\"usageExampleWrapper\" style=\"display:none\">\r\n            <td colspan=\"2\">\r\n                <select name=\"usage-example\" size=\"4\">\r\n                    <option>分１　朝食後</option>\r\n                    <option>分２　朝夕食後</option>\r\n                    <option>分３　毎食後</option>\r\n                    <option>分１　寝る前</option>\r\n                </select>\r\n            </td>\r\n        </tr>\r\n        <tr mc-name=\"daysRow\">\r\n            <td mc-name=\"daysLabel\">日数</td>\r\n            <td>\r\n                <input mc-name=\"days\" class=\"alpha-only\" style=\"width:4em\" />\r\n                <span mc-name=\"daysUnit\">日分</span>\r\n                {{#isCreating}}\r\n        \t\t<span mc-name=\"fixedDaysWrapper\">\r\n        \t\t\t<input mc-name=\"fixedDaysCheck\" type=\"checkbox\"  checked=\"checked\"/> 固定\r\n        \t\t</span>\r\n                {{/isCreating}}\r\n            </td>\r\n        </tr>\r\n    </table>\r\n    <div>\r\n        <input type=radio mc-name=\"categoryNaifuku\" name=\"category\" value=\"0\" checked>内服\r\n        <input type=radio mc-name=\"categoryTonpuku\" name=\"category\" value=\"1\">屯服\r\n        <input type=radio mc-name=\"categoryGaiyou\"  name=\"category\" value=\"2\">外用\r\n    </div>\r\n    {{#isEditing}}\r\n    <div>\r\n        <input type=\"checkbox\" mc-name=\"preserveUsage\" />用量・用法・日数をそのままに\r\n    </div>\r\n    {{/isEditing}}\r\n    <div mc-name=\"comment\" style=\"padding:6px;display:none;border:1px solid #ccc\"></div>\r\n</div>\r\n<div class=\"workarea-commandbox\">\r\n    <button mc-name=\"enterLink\">入力</button>\r\n    <button mc-name=\"closeLink\">閉じる</button>\r\n    <a mc-name=\"clearFormLink\" href=\"javascript:void(0)\" class=\"cmd-link\">クリア</a>\r\n    {{#isEditing}}\r\n    <a mc-name=\"deleteLink\" href=\"javascript:void(0)\" class=\"cmd-link\">削除</a>\r\n    {{/isEditing}}\r\n</div>\r\n<div class=\"drug-search-area\">\r\n    <form style=\"margin:4px 0\" mc-name=\"searchForm\">\r\n        <input mc-name=\"searchText\" type=\"text\" class=\"kanji\"/>\r\n        <button mc-name=\"searchLink\">検索</button>\r\n    </form>\r\n    <div style=\"margin:4px 0\">\r\n        <input type=radio name=\"search-mode\" value=\"master\">マスター\r\n        <input type=radio name=\"search-mode\" value=\"stock\" checked>約束処方\r\n        <input type=radio name=\"search-mode\" value=\"prev\">過去の処方\r\n    </div>\r\n    <div>\r\n        <select mc-name=\"searchResult\" size=10 style=\"width:100%\"></select>\r\n    </div>\r\n</div>\r\n</div>\r\n\r\n"

/***/ },
/* 56 */
/***/ function(module, exports) {

	module.exports = "<option>{{label}}</option>"

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = "<a mc-name=\"addDrugLink\" href=\"javascript:void(0)\" class=\"cmd-link\">[処方]</a>\r\n<span class=\"cmd-link-span\">[</span>\r\n<a mc-name=\"drugSubmenuLink\" href=\"javascript:void(0)\" class=\"cmd-link\">+</a>\r\n<span class=\"cmd-link-span\">]</span>\r\n<div class=\"drug-submenu\" />\r\n<div mc-name=\"workarea\" />\r\n"

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(59);
	var tmpl = hogan.compile(tmplSrc);
	var mUtil = __webpack_require__(5);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);
	var conti = __webpack_require__(4);

	exports.create = function(drugs){
		var data = {
			drugs: drugs.map(drugToData)
		};
		var dom = $(tmpl.render(data));
		bindSelectAll(dom);
		bindUnselectAll(dom);
		bindEnter(dom, drugs);
		bindCancel(dom);
		return dom;
	};

	function drugToData(drug){
		return {
			drug_id: drug.drug_id,
			label: mUtil.drugRep(drug)
		}
	}

	function bindSelectAll(dom){
		var link = dom.find("[mc-name=selectAll]").click(function(event){
			event.preventDefault();
			dom.find("input[type=checkbox][name=drug]").prop("checked", true);
		});	
	}

	function bindUnselectAll(dom){
		var link = dom.find("[mc-name=unselectAll]").click(function(event){
			event.preventDefault();
			dom.find("input[type=checkbox][name=drug]").prop("checked", false);
		});	
	}

	function bindEnter(dom, drugs){
		dom.on("click", "> form > .workarea-commandbox [mc-name=enter]", function(event){
			event.preventDefault();
			event.stopPropagation();
			var checked = dom.find("input[type=checkbox][name=drug]:checked").map(function(){
				return +$(this).val();
			}).get();
			var selectedDrugs = drugs.filter(function(drug){
				return checked.indexOf(drug.drug_id) >= 0;
			});
			selectedDrugs = selectedDrugs.map(function(drug){
				return mUtil.assign({}, drug);
			});
			var targetVisitId = dom.inquire("fn-get-target-visit-id");
			if( !(targetVisitId > 0) ){
				alert("コピー先の（暫定）診察がみつかりません。");
				return;
			}
			var newDays = dom.find("> form input[name=days]").val();
			var targetVisitAt;
			var enteredDrugIds;
			var newlyEnteredDrugs = [];
			task.run([
				function(done){
					service.getVisit(targetVisitId, function(err, result){
						if( err ){
							done(err);
							return;
						}
						targetVisitAt = result.v_datetime;
						done();
					})
				},
				function(done){
					conti.forEachPara(selectedDrugs, function(drug, done){
						service.resolveIyakuhinMasterAt(drug.d_iyakuhincode, targetVisitAt, function(err, result){
							if( err ){
								done(err);
								return;
							}
							var modify = {
								visit_id: targetVisitId,
								d_iyakuhincode: result.iyakuhincode,
								d_prescribed: 0
							}; 
							if( newDays !== "" ){
								modify.d_days = newDays;
							}
							mUtil.assign(drug, result, modify);
							console.log(drug);
							done();
						})
					}, done);
				},
				function(done){
					service.batchEnterDrugs(selectedDrugs, function(err, result){
						if( err ){
							done(err);
							return;
						}
						enteredDrugIds = result;
						done();
					});
				},
				function(done){
					conti.forEach(enteredDrugIds, function(drugId, done){
						service.getFullDrug(drugId, targetVisitAt, function(err, result){
							if( err ){
								done(err);
								return;
							}
							newlyEnteredDrugs.push(result);
							done();
						})
					}, done);
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				//dom.trigger("drugs-batch-entered", [targetVisitId, newlyEnteredDrugs]);
				newlyEnteredDrugs.forEach(function(newDrug){
					dom.trigger("drug-entered", [newDrug]);
				});
				dom.trigger("close-workarea");
			})
		})
	}

	function bindCancel(dom){
		dom.on("click", "> form > .workarea-commandbox [mc-name=cancel]", function(event){
			event.preventDefault();
			event.stopPropagation();
			dom.trigger("cancel-workarea");
		})
	}


/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n<div class=\"title\">選択して処方をコピー</div>\r\n<form onsubmit=\"return false\">\r\n<table>\r\n\t<tbody mc-name=\"tbody\">\r\n\t{{#drugs}}\r\n\t\t<tr>\r\n\t\t\t<td><input type=\"checkbox\" name=\"drug\" value=\"{{drug_id}}\" /></td>\r\n\t\t\t<td>{{label}}</td>\r\n\t\t</tr>\r\n\t{{/drugs}}\r\n\t</tbody>\r\n</table>\r\n<hr/>\r\n<div>\r\n    <a mc-name=\"selectAll\" href=\"javascript:void(0)\" class=\"cmd-link\">全部選択</a> |\r\n    <a mc-name=\"unselectAll\" href=\"javascript:void(0)\" class=\"cmd-link\">全部解除</a>\r\n</div>\r\n<div>\r\n    日数：<input name=\"days\" style=\"width:2em\" class=\"alpha\">日分\r\n</div>\r\n<div class=\"workarea-commandbox\">\r\n    <button mc-name=\"enter\">入力</button>\r\n    <button mc-name=\"cancel\">キャンセル</button>\r\n</div>\r\n</form>\r\n</div>\r\n"

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(61);
	var tmpl = hogan.compile(tmplSrc);
	var mUtil = __webpack_require__(5);
	var mConst = __webpack_require__(8);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);
	var conti = __webpack_require__(4);

	exports.create = function(drugs, visitId, at){
		drugs = drugs.filter(function(drug){
			return drug.d_category === mConst.DrugCategoryNaifuku;
		});
		var data = {
			drugs: drugs.map(function(drug){
				return {
					drug_id: drug.drug_id,
					label: mUtil.drugRep(drug)
				}
			})
		};
		var dom = $(tmpl.render(data));
		bindEnter(dom, drugs, visitId, at);
		bindCancel(dom);
		return dom;
	};

	function bindEnter(dom, drugs, visitId, at){
		dom.on("click", "> form > .workarea-commandbox [mc-name=enter]", function(event){
			event.preventDefault();
			event.stopPropagation();
			var checked = dom.find("input[type=checkbox][name=drug]:checked").map(function(drug){
				return +$(this).val();
			}).get();
			var days = dom.find("input[name=days]").val().trim();
			if( days === "" ){
				alert("日数が入力されていません。");
				return;
			}
			if( !/^\d+$/.test(days) ){
				alert("日数の入力が適切でありません。");
				return;
			}
			var modifiedDrugs = [];
			task.run([
				function(done){
					service.batchUpdateDrugsDays(checked, +days, done);
				},
				function(done){
					conti.forEach(checked, function(drugId, done){
						service.getFullDrug(drugId, at, function(err, result){
							if( err ){
								done(err);
								return;
							}
							modifiedDrugs.push(result);
							done();
						})
					}, done);
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				//dom.trigger("drugs-batch-modified-days", [visitId, checked, days]);
				modifiedDrugs.forEach(function(newDrug){
					dom.trigger("drug-modified", [newDrug]);
				})
				dom.trigger("close-workarea");
			})
		});
	}

	function bindCancel(dom){
		dom.on("click", "> form > .workarea-commandbox [mc-name=cancel]", function(event){
			event.preventDefault();
			event.stopPropagation();
			dom.trigger("cancel-workarea");
		})
	}


/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n<div class=\"title\">日数を変更</div>\r\n<form onsubmit=\"return false\">\r\n<div mc-name=\"list\">\r\n\t<table>\r\n\t\t{{#drugs}}\r\n\t\t\t<tr>\r\n\t\t\t\t<td><input type=\"checkbox\" name=\"drug\" value=\"{{drug_id}}\" /></td>\r\n\t\t\t\t<td>{{label}}</td>\r\n\t\t\t</tr>\r\n\t\t{{/drugs}}\r\n\t</table>\r\n</div>\r\n<hr />\r\n<div>\r\n\t<input name=\"days\" size=\"6\" class=\"alpha\"/> 日分に変更\r\n</div>\r\n<div class=\"workarea-commandbox\">\r\n\t<button mc-name=\"enter\">入力</button>\r\n\t<button mc-name=\"cancel\">キャンセル</button>\r\n</div>\r\n</form>\r\n</div>\r\n"

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(63);
	var tmpl = hogan.compile(tmplSrc);
	var mUtil = __webpack_require__(5);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);

	exports.create = function(drugs, visitId, at){
		var data = {
			drugs: drugs.map(function(drug){
				return {
					drug_id: drug.drug_id,
					label: mUtil.drugRep(drug)
				}
			})
		};
		var dom = $(tmpl.render(data));
		bindEnter(dom, visitId);
		bindCancel(dom);
		return dom;
	};

	function bindEnter(dom, visitId){
		dom.on("click", "> form > .workarea-commandbox [mc-name=enter]", function(event){
			event.preventDefault();
			event.stopPropagation();
			var deletedDrugIds = dom.find("input[type=checkbox][name=drug]:checked").map(function(drug){
				return +$(this).val();
			}).get();
			task.run(function(done){
				service.batchDeleteDrugs(deletedDrugIds, done);
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				deletedDrugIds.forEach(function(drugId){
					dom.trigger("drug-deleted", [drugId, visitId]);
				});
				dom.trigger("close-workarea");
			})
		});
	}

	function bindCancel(dom){
		dom.on("click", "> form > .workarea-commandbox [mc-name=cancel]", function(event){
			event.preventDefault();
			event.stopPropagation();
			dom.trigger("cancel-workarea");
		})
	}


/***/ },
/* 63 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n<div class=\"title\">薬剤の複数削除</div>\r\n<form>\r\n<div mc-name=\"list\">\r\n\t<table>\r\n\t\t{{#drugs}}\r\n\t\t\t<tr>\r\n\t\t\t\t<td><input type=\"checkbox\" name=\"drug\" value=\"{{drug_id}}\" /></td>\r\n\t\t\t\t<td>{{label}}</td>\r\n\t\t\t</tr>\r\n\t\t{{/drugs}}\r\n\t</table>\r\n</div>\r\n<div class=\"workarea-commandbox\">\r\n\t<button mc-name=\"enter\">削除</button>\r\n\t<button mc-name=\"cancel\">キャンセル</button>\r\n</div>\r\n</form>\r\n</div>\r\n"

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var tmplHtml = __webpack_require__(65);
	var Drug = __webpack_require__(66);

	exports.setup = function(dom, drugs, visitId, at, patientId){
		dom.html(tmplHtml);
		var listDom = getListDom(dom);
		updateRp(dom, drugs.length > 0);
		var index = 1;
		drugs.forEach(function(drug){
			var e = Drug.create(index++, drug, at, patientId);
			listDom.append(e);
		});
		respondToDrugEntered(dom, visitId, at, patientId);
		respondToNumberOfDrugsChanged(dom, visitId);
	};

	function getRpDom(dom){
		return dom.find("[mc-name=rp]");
	}

	function getListDom(dom){
		return dom.find("[mc-name=list]");
	}

	function lookupDrugs(dom, visitId){
		return dom.broadcast("rx-drug-lookup-for-visit", [visitId]);
	}

	function countDrugs(dom, visitId){
		return lookupDrugs(dom, visitId).length;
	}

	function updateRp(dom, show){
		var text = show ? "Rp)" : "";
		getRpDom(dom).text(text);
	}

	function respondToDrugEntered(dom, visitId, at, patientId){
		dom.listen("rx-drug-entered", function(newDrug){
			if( visitId === newDrug.visit_id ){
				var index = countDrugs(dom, visitId) + 1;
				var listDom = getListDom(dom);
				listDom.append(Drug.create(index, newDrug, at, patientId));
				updateRp(dom, true);
			}
		});
	}

	function respondToNumberOfDrugsChanged(dom, visitId){
		dom.listen("rx-number-of-drugs-changed", function(targetVisitId){
			if( visitId === targetVisitId ){
				var index = 1;
				var drugs = lookupDrugs(dom, visitId);
				updateRp(dom, drugs.length > 0);
				drugs.forEach(function(drug){
					dom.broadcast("rx-drug-modify-index", [drug.drug_id, index++]);
				})
			}
		});
	}

	function respondToDrugsNeedRenumbering(dom, visitId){
		dom.listen("rx-drugs-need-renumbering", function(targetVisitId){
			if( visitId !== targetVisitId ){
				return;
			}
			var index = 1;
			var drugs = lookupDrugs(dom, visitId);
			drugs.forEach(function(drug){
				dom.broadcast("rx-drug-modify-index", [drug.drug_id, index++]);
			})
		});
	}

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = "<div mc-name=\"rp\"></div>\r\n<div mc-name=\"list\"></div>\r\n"

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var kanjidate = __webpack_require__(16);
	var mUtil = __webpack_require__(5);
	var DrugDisp = __webpack_require__(67);
	var DrugForm = __webpack_require__(54);

	var tmplSrc = __webpack_require__(69);

	var dispAreaSelector = "> [mc-name=disp-area]";
	var formAreaSelector = "> [mc-name=form-area]";

	function getDispAreaDom(dom){
		return dom.find(dispAreaSelector);
	}

	function getFormAreaDom(dom){
		return dom.find(formAreaSelector);
	}

	exports.create = function(index, drug, at, patientId){
		var dom = $(tmplSrc);
		DrugDisp.setup(getDispAreaDom(dom), index, drug);
		var ctx = {
			drug: drug
		};
		dom.listen("rx-drug-modified", function(newDrug){
			if( ctx.drug.drug_id === newDrug.drug_id ){
				ctx.drug = newDrug;
			}
		});
		dom.listen("rx-drug-lookup-for-visit", function(targetVisitId){
			if( targetVisitId === drug.visit_id ){
				return {
					drug_id: drug.drug_id
				};
			}
		});
		dom.listen("rx-drug-deleted", function(drugId){
			if( drugId === drug.drug_id ){
				dom.remove();
			}
		});
		bindClick(dom, ctx, at, patientId);
		return dom;
	}

	function bindClick(dom, ctx, at, patientId){
		dom.on("click", dispAreaSelector, function(event){
			event.stopPropagation();
			var drug = ctx.drug;
			var message = "（暫定）診察中でありませんが、この薬剤を編集しますか？";
			if( !dom.inquire("fn-confirm-edit", [drug.visit_id, message]) ){
				return;
			}
			var form = DrugForm.createEditForm(drug, at, patientId);
			form.on("cancel", function(event){
				event.stopPropagation();
				getDispAreaDom(dom).show();
				getFormAreaDom(dom).empty();
			});
			form.on("modified", function(event, newDrug){
				event.stopPropagation();
				dom.trigger("drug-modified", [newDrug]);
				getDispAreaDom(dom).show();
				getFormAreaDom(dom).empty();
			});
			form.on("deleted", function(event){
				event.stopPropagation();
				dom.trigger("drug-deleted", [drug.drug_id, drug.visit_id]);
			});
			var formArea = getFormAreaDom(dom);
			formArea.append(form);
			getDispAreaDom(dom).hide();
		});
	}



/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(68);
	var tmpl = hogan.compile(tmplSrc);
	var mUtil = __webpack_require__(5);

	exports.setup = function(dom, index, drug){
		var data = {
			index: index,
			label: mUtil.drugRep(drug)
		};
		dom.html(tmpl.render(data));
		dom.listen("rx-drug-modified", function(newDrug){
			if( drug.drug_id === newDrug.drug_id ){
				data.label = mUtil.drugRep(newDrug);
				dom.html(tmpl.render(data));
			}
		});
		dom.listen("rx-drug-modify-index", function(drugId, index){
			if( drug.drug_id === drugId ){
				data.index = index;
				dom.html(tmpl.render(data));
			}
		});
	}


/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = "<span mc-name=\"index\">{{index}}</span>) <span mc-name=\"label\">{{label}}</span>"

/***/ },
/* 69 */
/***/ function(module, exports) {

	module.exports = "<div mc-name=\"wrapper\">\r\n\t<div mc-name=\"disp-area\"></div>\r\n\t<div mc-name=\"form-area\"></div>\r\n</div>\r\n"

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var kanjidate = __webpack_require__(16);
	var mUtil = __webpack_require__(5);
	var AddRegularForm = __webpack_require__(71);
	var ShinryouKensaForm = __webpack_require__(73);
	var ShinryouAddForm = __webpack_require__(75);
	var ShinryouCopySelectedForm = __webpack_require__(78);
	var ShinryouDeleteSelectedForm = __webpack_require__(80);
	var ShinryouSubmenu = __webpack_require__(82);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);
	var conti = __webpack_require__(4);

	var tmplHtml = __webpack_require__(84);

	exports.setup = function(dom, visitId, at){
		dom.html(tmplHtml);
		bindAddRegular(dom, visitId, at);
		bindSubmenu(dom, visitId, at);
		bindSubmenuKensaForm(dom, visitId, at);
		bindSubmenuAddForm(dom, visitId, at);
		bindSubmenuCopyAll(dom, visitId, at);
		bindSubmenuCopySelected(dom, visitId, at);
		bindSubmenuDeleteSelectedForm(dom, visitId, at);
		bindSubmenuDeleteDuplicated(dom, visitId);
		bindSubmenuCancel(dom);
		setState(dom, "init");
	}

	var addShinryouSelector = "> [mc-name=addShinryouLink]";
	var submenuLinkSelector = "> [mc-name=submenuLink]";
	var submenuAreaSelector = "> [mc-name=submenu-area]";
	var workAreaSelector = "> [mc-name=work-area]";

	function bindAddRegular(dom, visitId, at){
		dom.on("click", addShinryouSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			var state = getState(dom);
			if( state === "submenu" ){
				return;
			} else if( state === "add-regular" ){
				endWork(dom);
			} else {
				var ok = dom.inquire("fn-confirm-edit", [visitId, 
					"現在（暫定）診療中でありませんが、診療行為を追加しますか？"]);
				if( !ok ){
					return;
				}
				var form = AddRegularForm.create(visitId, at);
				form.on("entered", function(event, newShinryouList, newConducts){
					event.stopPropagation();
					endWork(dom);
					dom.trigger("shinryou-batch-entered", [visitId, newShinryouList]);
					dom.trigger("conducts-batch-entered", [visitId, newConducts]);
				});
				form.on("cancel", function(event){
					event.stopPropagation();
					endWork(dom);
				});
				startWork(dom, "add-regular", form);
			}
		})
	}

	function bindSubmenu(dom, visitId, at){
		dom.on("click", submenuLinkSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			var state = getState(dom);
			if( state === "submenu" ){
				closeSubmenu(dom);
				setState(dom, "init");
			} else if( state === "init" ) {
				dom.find(submenuAreaSelector).append(ShinryouSubmenu.create());
				setState(dom, "submenu");
			}
		})
	}

	function bindSubmenuKensaForm(dom, visitId, at){
		dom.on("submenu-kensa-form", function(event){
			event.stopPropagation();
			if( !dom.inquire("fn-confirm-edit", [visitId, "現在（暫定）診療中でありませんが、検査を追加しますか？"]) ){
				return;
			}
			var form = ShinryouKensaForm.create(visitId, at);
			form.on("9y9h9nm8-entered", function(event, list){
				dom.trigger("shinryou-batch-entered", [visitId, list]);
				endWork(dom);
			});
			form.on("9y9h9nm8-cancel", function(){
				endWork(dom);
			});
			closeSubmenu(dom);
			startWork(dom, "add-kensa", form);
		})
	}

	function bindSubmenuAddForm(dom, visitId, at){
		dom.on("submenu-add-form", function(event){
			event.stopPropagation();
			if( !dom.inquire("fn-confirm-edit", [visitId, "現在（暫定）診療中でありませんが、診療行為を追加しますか？"]) ){
				return;
			}
			var form = ShinryouAddForm.create(visitId, at);
			form.on("shinryou-entered", function(event, newShinryou){
				event.stopPropagation();
				dom.trigger("shinryou-batch-entered", [visitId, [newShinryou]]);
			});
			form.on("cancel", function(event){
				event.stopPropagation();
				endWork(dom);
			})
			closeSubmenu(dom);
			startWork(dom, "add-search", form);
		})
	}

	function batchFetchShinryou(shinryouIds, at, cb){
		var newShinryouList = [];
		conti.forEach(shinryouIds, function(shinryouId, done){
			service.getFullShinryou(shinryouId, at, function(err, result){
				if( err ){
					done(err);
					return;
				}
				newShinryouList.push(result);
				done();
			})
		}, function(err){
			if( err ){
				cb(err);
				return;
			}
			cb(undefined, newShinryouList);
		});
	}

	function copy(targetVisitId, srcShinryouList, cb){
		var targetVisit, dstShinryouCodes = [], dstShinryouList, newShinryouIds, newShinryouList = [];
		conti.exec([
			function(done){
				service.getVisit(targetVisitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					targetVisit = result;
					done();
				})
			},
			function(done){
				var targetAt = targetVisit.v_datetime;
				conti.forEach(srcShinryouList, function(shinryou, done){
					service.resolveShinryouMasterAt(shinryou.shinryoucode, targetAt, function(err, result){
						if( err ){
							console.log(err);
							done("コピー先で有効でありません：" + shinryou.name);
							return;
						}
						dstShinryouCodes.push(result.shinryoucode);
						done();
					})
				}, done);
			},
			function(done){
				var dstShinryouList = dstShinryouCodes.map(function(shinryoucode){
					return {
						visit_id: targetVisitId,
						shinryoucode: shinryoucode
					};
				});
				service.batchEnterShinryou(dstShinryouList, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newShinryouIds = result;
					done();
				})
			},
			function(done){
				batchFetchShinryou(newShinryouIds, targetVisit.v_datetime, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newShinryouList = result;
					done();
				})
			}
		], function(err){
			if( err ){
				cb(err);
				return;
			}
			cb(undefined, newShinryouList);
		});
	}

	function bindSubmenuCopyAll(dom, visitId, at){
		dom.on("submenu-copy-all", function(event){
			event.stopPropagation();
			var targetVisitId = dom.inquire("fn-get-target-visit-id");
			if( !(targetVisitId > 0) ){
				alert("現在（暫定）診療中でないので、コピーできません。");
				return;
			}
			if( targetVisitId === visitId ){
				alert("自分自身にはコピーできません。");
				return;
			}
			var srcShinryouList, newShinryouList = [];
			task.run([
				function(done){
					service.listFullShinryouForVisit(visitId, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						srcShinryouList = result;
						done();
					})
				},
				function(done){
					copy(targetVisitId, srcShinryouList, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newShinryouList = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				closeSubmenu(dom);
				setState(dom, "init");
				dom.trigger("shinryou-batch-entered", [targetVisitId, newShinryouList]);
			})
		})
	}

	function bindSubmenuCopySelected(dom, visitId, at){
		dom.on("submenu-copy-selected", function(event){
			event.stopPropagation();
			var targetVisitId = dom.inquire("fn-get-target-visit-id");
			if( !(targetVisitId > 0) ){
				alert("現在（暫定）診療中でないので、コピーできません。");
				return;
			}
			if( targetVisitId === visitId ){
				alert("自分自身にはコピーできません。");
				return;
			}
			var shinryouList;
			task.run([
				function(done){
					service.listFullShinryouForVisit(visitId, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						shinryouList = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				var form = ShinryouCopySelectedForm.create(shinryouList);
				form.on("enter", function(event, shinryouIds){
					var srcShinryouList, newShinryouList;
					task.run([
						function(done){
							batchFetchShinryou(shinryouIds, at, function(err, result){
								if( err ){
									done(err);
									return;
								}
								srcShinryouList = result;
								done();
							})
						},
						function(done){
							copy(targetVisitId, srcShinryouList, function(err, result){
								if( err ){
									done(err);
									return;
								}
								newShinryouList = result;
								done();
							})
						}
					], function(err){
						if( err ){
							alert(err);
							return;
						}
						endWork(dom);
						dom.trigger("shinryou-batch-entered", [targetVisitId, newShinryouList]);
					})
				});
				form.on("cancel", function(event){
					event.stopPropagation();
					endWork(dom);
				})
				closeSubmenu(dom);
				startWork(dom, "copy-selected", form);
			})		
		});
	}

	function bindSubmenuDeleteSelectedForm(dom, visitId, at){
		dom.on("submenu-delete-selected", function(event){
			event.stopPropagation();
			if( !dom.inquire("fn-confirm-edit", [visitId, "現在（暫定）診療中でありませんが、診療行為を削除しますか？"]) ){
				return;
			}
			var shinryouList;
			task.run(function(done){
				service.listFullShinryouForVisit(visitId, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					shinryouList = result;
					done();
				})
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				var form = ShinryouDeleteSelectedForm.create(shinryouList);
				form.on("shinryou-deleted", function(event, deletedShinryouIds){
					event.stopPropagation();
					dom.trigger("shinryou-batch-deleted", [visitId, deletedShinryouIds]);
					endWork(dom);
				});
				form.on("cancel", function(event){
					event.stopPropagation();
					endWork(dom);
				})
				closeSubmenu(dom);
				startWork(dom, "delete-selected", form);
			})
		})
	}

	function bindSubmenuDeleteDuplicated(dom, visitId){
		dom.on("submenu-delete-duplicated", function(event){
			event.stopPropagation();
			closeSubmenu(dom);
			setState(dom, "init");
			dom.trigger("shinryou-delete-duplicated", [visitId]);
		});
	}

	function bindSubmenuCancel(dom){
		dom.on("submenu-cancel", function(event){
			event.stopPropagation();
			closeSubmenu(dom);
			setState(dom, "init");
		})
	}

	function setState(dom, state){
		return dom.data("state", state);
	}

	function getState(dom){
		return dom.data("state");
	}

	function startWork(dom, state, e){
		setState(dom, state);
		dom.find(workAreaSelector).append(e);
	}

	function endWork(dom){
		dom.find(workAreaSelector).html("");
		setState(dom, "init");
	}

	function closeSubmenu(dom){
		dom.find(submenuAreaSelector).html("");
	}

	// function bindCloseWorkarea(dom){
	// 	dom.on("close-workarea", function(event){
	// 		event.stopPropagation();
	// 		endWork(dom);
	// 	})
	// }

	// function bindShinryouBatchEntered(dom){
	// 	dom.on("shiryou-batch-entered", function(event){
	// 		endWork(dom);
	// 	});
	// }




/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(72);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);
	var conti = __webpack_require__(4);

	// Helpers /////////////////////////////////////////////////////////////////////////////

	function getInput(dom, value){
		return dom.find("input[type=checkbox][name=item][value=" + value + "]");
	}

	// Bindings ////////////////////////////////////////////////////////////////////////////

	function bindEnter(dom, visitId, at){
		var selector = "> form .workarea-commandbox [mc-name=enter]";
		dom.on("click", selector, function(event){
			event.preventDefault();
			event.stopPropagation();
			dom.find(selector).prop("disabled", true);
			var names = dom.find("> form input[name=item]:checked").map(function(){
				return $(this).val();
			}).get();
			var newShinryouIds, newConductIds;
			var newShinryouList = [], newConductList = [];
			task.run([
				function(done){
					service.enterShinryouByNames(visitId, names, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newShinryouIds = result.shinryou_ids;
						newConductIds = result.conduct_ids;
						done();
					})
				},
				function(done){
					conti.forEach(newShinryouIds, function(newShinryouId, done){
						service.getFullShinryou(newShinryouId, at, function(err, result){
							if( err ){
								done(err);
								return;
							}
							newShinryouList.push(result);
							done();
						})
					}, done);
				},
				function(done){
					conti.forEach(newConductIds, function(newConductId, done){
						service.getFullConduct(newConductId, at, function(err, result){
							if( err ){
								done(err);
								return;
							}
							newConductList.push(result);
							done();
						})
					}, done);
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("entered", [newShinryouList, newConductList]);
			})
		})
	}

	function bindCancel(dom){
		dom.on("click", "> form .workarea-commandbox [mc-name=cancel]", function(event){
			event.preventDefault();
			event.stopPropagation();
			dom.trigger("cancel");
		});
	}

	function bindShohou(dom){
		dom.on("change", "input[type=checkbox][name=item][value=処方料]", function(event){
			var shohou = $(event.target);
			var kasan = getInput(dom, "外来後発加算１");
			kasan.prop("checked", shohou.is(":checked")); 
		});
	}

	// Exports /////////////////////////////////////////////////////////////////////////////

	exports.create = function(visitId, at){
		var dom = $(tmplSrc);
		bindEnter(dom, visitId, at);
		bindCancel(dom);
		bindShohou(dom);
		return dom;
	}



/***/ },
/* 72 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n<div class=\"title\">診療行為入力</div>\r\n<form onsubmit=\"return false\">\r\n<div>\r\n    <table width=\"100%\">\r\n        <tr valign=\"top\">\r\n            <td>\r\n                <input type=\"checkbox\" name=\"item\" value=\"初診\"> 初診<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"再診\"> 再診<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"外来管理加算\"> 外来管理加算<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"特定疾患管理\"> 特定疾患管理<br/>\r\n            </td>\r\n            <td>\r\n                <input type=\"checkbox\" name=\"item\" value=\"尿一般\"> 尿一般<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"便潜血\"> 便潜血<br/>\r\n            </td>\r\n        </tr>\r\n    </table>\r\n\r\n    <table width=\"100%\">\r\n        <tr valign=\"top\">\r\n            <td>\r\n                <input type=\"checkbox\" name=\"item\" value=\"尿便検査判断料\"> 尿便検査判断料<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"血液検査判断料\"> 血液検査判断料<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"生化Ⅰ判断料\"> 生化Ⅰ判断料<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"生化Ⅱ判断料\"> 生化Ⅱ判断料<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"免疫検査判断料\"> 免疫検査判断料<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"微生物検査判断料\"> 微生物検査判断料<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"静脈採血\"> 静脈採血<br/>\r\n            </td>\r\n            <td>\r\n                <input type=\"checkbox\" name=\"item\" value=\"処方料\"> 処方料<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"処方料７\"> 処方料７<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"手帳記載加算\"> 手帳記載加算<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"外来後発加算１\"> 外来後発加算１<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"特定疾患処方\"> 特定疾患処方<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"長期処方\"> 長期処方<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"内服調剤\"> 内服調剤<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"外用調剤\"> 外用調剤<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"調剤基本\"> 調剤基本<br/>\r\n                <input type=\"checkbox\" name=\"item\" value=\"薬剤情報提供\"> 薬剤情報提供<br/>\r\n            </td>\r\n        </tr>\r\n    </table>\r\n    <input type=\"checkbox\" name=\"item\" value=\"向精神薬\"> 向精神薬\r\n    <input type=\"checkbox\" name=\"item\" value=\"心電図\"> 心電図\r\n    &nbsp;\r\n    <input type=\"checkbox\" name=\"item\" value=\"骨塩定量\"> 骨塩定量\r\n</div>\r\n<div class=\"workarea-commandbox\">\r\n    <button mc-name=\"enter\">入力</button>\r\n    <button mc-name=\"cancel\">キャンセル</button>\r\n</div>\r\n</form>\r\n</div>\r\n"

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var tmplSrc = __webpack_require__(74);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var conti = __webpack_require__(4);

	var inputSelector = "> form[mc-name=main-form] input[type=checkbox][name=kensa]";
	var setKensaLinkSelector = "> form[mc-name=main-form] [mc-name=form-commands] [mc-name=setKensa]";
	var clearKensaLinkSelector = "> form[mc-name=main-form] [mc-name=form-commands] [mc-name=clearKensa]";
	var enterLinkSelector = "> form[mc-name=main-form] .workarea-commandbox [mc-name=enter]";
	var cancelLinkSelector = "> form[mc-name=main-form] .workarea-commandbox [mc-name=cancel]";

	exports.create = function(visitId, at){
		var dom = $(tmplSrc);
		bindSetKensa(dom);
		bindClearKensa(dom);
		bindEnter(dom, visitId, at);
		bindCancel(dom);
		return dom;
	}

	var kensaSetNames = ["血算", "ＨｂＡ１ｃ", "ＧＯＴ", "ＧＰＴ", "γＧＴＰ", "クレアチニン",
	        "尿酸", "ＬＤＬ－コレステロール", "ＨＤＬ－コレステロール", "ＴＧ"];

	function bindSetKensa(dom){
		dom.on("click", setKensaLinkSelector, function(event){
			event.preventDefault();
			dom.find(inputSelector).each(function(){
				var chk = $(this);
				if( kensaSetNames.indexOf(chk.val()) >= 0 ){
					chk.prop("checked", true);
				}
			})
		});
	}

	function bindClearKensa(dom){
		dom.on("click", clearKensaLinkSelector, function(event){
			event.preventDefault();
			dom.find(inputSelector).each(function(){
				var chk = $(this);
				chk.prop("checked", false);
			});
		});
	}

	function bindEnter(dom, visitId, at){
		dom.on("click", enterLinkSelector, function(event){
			event.preventDefault();
			var names = dom.find(inputSelector + ":checked").map(function(){
				return $(this).val();
			}).get();
			var shinryouIds, newShinryouList;
			task.run([
				function(done){
					service.enterShinryouByNames(visitId, names, function(err, result){
						if( err ){
							done(err);
							return;
						}
						shinryouIds = result.shinryou_ids;
						if( result.conduct_ids.length > 0 ){
							alert("WARNING: entered conducts were ignored");
						}
						done();
					});
				},
				function(done){
					conti.mapPara(shinryouIds, function(shinryouId, cb){
						service.getFullShinryou(shinryouId, at, cb);
					}, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newShinryouList = result;
						done();
					});
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("9y9h9nm8-entered", [newShinryouList]);
			})
		});
	}

	function bindCancel(dom){
		dom.on("click", cancelLinkSelector, function(event){
			event.preventDefault();
			dom.trigger("9y9h9nm8-cancel")
		})
	}

/***/ },
/* 74 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n    <div class=\"title\">検査の入力</div>\r\n    <form onsubmit=\"return false\" mc-name=\"main-form\">\r\n        <div>\r\n            <table width=\"100%\">\r\n                <tr valign=\"top\">\r\n                    <td width=\"50%\">\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"血算\">血算\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"末梢血液像\">末梢血液像\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＨｂＡ１ｃ\">ＨｂＡ１ｃ\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＰＴ\">ＰＴ\r\n                        </div>\r\n                        <hr style=\"border:1px solid #ccc; height:1px\"/>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＧＯＴ\">ＧＯＴ\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＧＰＴ\">ＧＰＴ\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"γＧＴＰ\">γＧＴＰ\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＣＰＫ\">ＣＰＫ\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"クレアチニン\">クレアチニン\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"尿酸\">尿酸\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"カリウム\">カリウム\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＬＤＬ－コレステロール\">ＬＤＬ－Ｃｈ\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＨＤＬ－コレステロール\">ＨＤＬ－Ｃｈ\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＴＧ\">ＴＧ\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"グルコース\">グルコース\r\n                        </div>\r\n                    </td>\r\n                    <td>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＣＲＰ\">ＣＲＰ\r\n                        </div>\r\n                        <hr style=\"border:1px solid #ccc; height:1px\"/>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＴＳＨ\">ＴＳＨ\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＦＴ４\">ＦＴ４\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＦＴ３\">ＦＴ３\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"ＰＳＡ\">ＰＳＡ\r\n                        </div>\r\n                        <hr style=\"border:1px solid #ccc; height:1px\"/>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"蛋白定量（尿）\">蛋白定量（尿）\r\n                        </div>\r\n                        <div>\r\n                            <input type=\"checkbox\" name=\"kensa\" value=\"クレアチニン（尿）\">クレアチニン（尿）\r\n                        </div>\r\n                    </td>\r\n                </tr>\r\n            </table>\r\n        </div>\r\n        <hr style=\"border:1px solid #ccc; height:1px\"/>\r\n        <div mc-name=\"form-commands\">\r\n            <a mc-name=\"setKensa\" class=\"cmd-link\" href=\"javascript:void(0)\">セット検査</a> :\r\n            <a mc-name=\"clearKensa\" class=\"cmd-link\" href=\"javascript:void(0)\">クリア</a>\r\n        </div>\r\n\r\n        <div class=\"workarea-commandbox\">\r\n            <button mc-name=\"enter\">入力</button>\r\n            <button mc-name=\"cancel\">キャンセル</button>\r\n        </div>\r\n    </form>\r\n</div>\r\n"

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);

	var tmplSrc = __webpack_require__(76);
	var resultTmplSrc = __webpack_require__(77);
	var resultTmpl = hogan.compile(resultTmplSrc);

	exports.create = function(visitId, at){
		var dom = $(tmplSrc);
		var ctx = {shinryoucode: undefined};
		bindEnter(dom, visitId, at, ctx);
		bindCancel(dom);
		bindSearch(dom, at);
		bindResult(dom, at, ctx);
		return dom;
	}

	var dispNameSelector = "> div[mc-name=disp-area] [mc-name=name]";
	var enterSelector = "> .workarea-commandbox [mc-name=enter]";
	var cancelSelector = "> .workarea-commandbox [mc-name=close]";
	var searchTextInputSelector = "> form[mc-name=search-form] input[mc-name=text]";
	var searchResultSelector = "> form[mc-name=search-form] select";

	function updateDisp(dom, label){
		dom.find(dispNameSelector).text(label);
	}

	function bindEnter(dom, visitId, at, ctx){
		dom.on("click", enterSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			var shinryoucode = ctx.shinryoucode;
			if( !shinryoucode ){
				alert("診療行為が指定されていません。");
				return;
			}
			shinryoucode = +shinryoucode;
			var newShinryouId, newShinryou;
			task.run([
				function(done){
					service.batchEnterShinryou([{
						visit_id: visitId,
						shinryoucode: shinryoucode
					}], function(err, result){
						if( err ){
							done(err);
							return;
						}
						newShinryouId = result;
						done();
					})
				},
				function(done){
					service.getFullShinryou(newShinryouId, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newShinryou = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("shinryou-entered", [newShinryou]);
			});
		})
	}

	function bindCancel(dom){
		dom.on("click", cancelSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			dom.trigger("cancel");
		});
	}

	function bindSearch(dom, at){
		dom.on("submit", "> form[mc-name=search-form]", function(event){
			event.preventDefault();
			event.stopPropagation();
			var text = dom.find(searchTextInputSelector).val().trim();
			if( text === "" ){
				return;
			}
			var list;
			task.run(function(done){
				service.searchShinryouMaster(text, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					list = result;
					done();
				});
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				var select = dom.find(searchResultSelector);
				select.html(resultTmpl.render({list: list}));
			});
		});
	}

	function bindResult(dom, at, ctx){
		dom.on("change", searchResultSelector, function(event){
			var shinryoucode = +dom.find(searchResultSelector + " option:selected").val();
			var master;
			task.run([
				function(done){
					service.resolveShinryouMasterAt(shinryoucode, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						master = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				ctx.shinryoucode = master.shinryoucode;
				updateDisp(dom, master.name);
			})
		});
	}


/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n<div class=\"title\">診療行為検索</div>\r\n<div mc-name=\"disp-area\">\r\n    名称：<span mc-name=\"name\"></span>\r\n</div>\r\n<div class=\"workarea-commandbox\">\r\n    <button mc-name=\"enter\">入力</button>\r\n    <button mc-name=\"close\">閉じる</button>\r\n</div>\r\n<form mc-name=\"search-form\">\r\n<div>\r\n    <input mc-name=\"text\">\r\n    <button mc-name=\"search\">検索</button>\r\n</div>\r\n<div>\r\n    <select mc-name=\"select\" size=\"10\"></select>\r\n</div>\r\n</form>\r\n</div>\r\n"

/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = "{{#list}}\r\n\t<option value=\"{{shinryoucode}}\">{{name}}</option>\r\n{{/list}}"

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(79);
	var tmpl = hogan.compile(tmplSrc);

	exports.create = function(shinryouList){
		var dom = $(tmpl.render({list: shinryouList}));
		bindSelectAll(dom);
		bindDeselectAll(dom);
		bindEnter(dom);
		bindCancel(dom);
		return dom;
	};

	var inputSelector = "> form[mc-name=search-result] input[name=shinryou_id]";
	var selectAllSelector = "> div[mc-name=selector-box] [mc-name=selectAll]";
	var deselectAllSelector = "> div[mc-name=selector-box] [mc-name=deselectAll]";
	var enterSelector = "> form[mc-name=command-form] [mc-name=enter]";
	var cancelSelector = "> form[mc-name=command-form] [mc-name=cancel]";

	function bindSelectAll(dom){
		dom.on("click", selectAllSelector, function(event){
			event.preventDefault();
			dom.find(inputSelector).prop("checked", true);
		})
	}

	function bindDeselectAll(dom){
		dom.on("click", deselectAllSelector, function(event){
			event.preventDefault();
			dom.find(inputSelector).prop("checked", false);
		})
	}

	function bindEnter(dom){
		dom.on("click", enterSelector, function(event){
			var shinryouIds = dom.find(inputSelector).filter(function(){
				return $(this).is(":checked");
			}).map(function(){
				return +$(this).val();
			}).get();
			dom.trigger("enter", [shinryouIds]);
		});
	}

	function bindCancel(dom){
		dom.on("click", cancelSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			dom.trigger("cancel");
		});
	}


/***/ },
/* 79 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n<div class=\"title\">診療行為コピー</div>\r\n<form onsubmit=\"return false\" mc-name=\"search-result\">\r\n<div>\r\n\t<table>\r\n\t\t<tbody mc-name=\"tbody\">\r\n\t\t\t{{#list}}\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<input type=\"checkbox\" name=\"shinryou_id\" value=\"{{shinryou_id}}\" />\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t{{name}}\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t{{/list}}\r\n\t\t</tbody>\r\n\t</table>\r\n</div>\r\n</form>\r\n<hr/>\r\n<div mc-name=\"selector-box\">\r\n    <a mc-name=\"selectAll\" href=\"javascript:void(0)\" class=\"cmd-link\">全部選択</a> :\r\n    <a mc-name=\"deselectAll\" href=\"javascript:void(0)\" class=\"cmd-link\">全部解除</a>\r\n</div>\r\n<form onsubmit=\"return false\" mc-name=\"command-form\">\r\n<div class=\"workarea-commandbox\">\r\n    <button mc-name=\"enter\">実行</button>\r\n    <button mc-name=\"cancel\">キャンセル</button>\r\n</div>\r\n</form>\r\n</div>\r\n"

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(81);
	var tmpl = hogan.compile(tmplSrc);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);

	exports.create = function(shinryouList){
		var dom = $(tmpl.render({list: shinryouList}));
		bindSelectAll(dom);
		bindDeselectAll(dom);
		bindEnter(dom);
		bindCancel(dom);
		return dom;
	};

	function bindSelectAll(dom){
		dom.on("click", "> form [mc-name=selectAll]", function(event){
			event.preventDefault();
			dom.find("> form input[name=shinryou_id]").prop("checked", true);
		})
	}

	function bindDeselectAll(dom){
		dom.on("click", "> form [mc-name=deselectAll]", function(event){
			event.preventDefault();
			dom.find("> form input[name=shinryou_id]").prop("checked", false);
		})
	}

	function collectChecked(dom){
		return dom.find("> form input[name=shinryou_id]:checked").map(function(){
			return +$(this).val();
		}).get();
	}

	function bindEnter(dom){
		dom.on("click", "> form .workarea-commandbox [mc-name=enter]", function(event){
			event.preventDefault();
			var shinryouIds = collectChecked(dom);
			task.run(function(done){
				service.batchDeleteShinryou(shinryouIds, done);
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("shinryou-deleted", [shinryouIds]);
			})
		});
	}

	function bindCancel(dom){
		dom.on("click", "> form .workarea-commandbox [mc-name=cancel]", function(event){
			event.preventDefault();
			dom.trigger("cancel");
		});
	}


/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n<div class=\"title\">複数診療削除</div>\r\n<form onsubmit=\"return false\">\r\n<div>\r\n\t<table>\r\n\t\t<tbody mc-name=\"tbody\">\r\n\t\t{{#list}}\r\n\t\t\t<tr>\r\n\t\t\t\t<td>\r\n\t\t\t\t\t<input type=\"checkbox\" name=\"shinryou_id\" value={{shinryou_id}} />\r\n\t\t\t\t</td>\r\n\t\t\t\t<td>\r\n\t\t\t\t\t{{name}}\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t{{/list}}\r\n\t\t</tbody>\r\n\t</table>\r\n</div>\r\n<hr/>\r\n<div>\r\n    <a mc-name=\"selectAll\" href=\"javascript:void(0)\" class=\"cmd-link\">全部選択</a> :\r\n    <a mc-name=\"deselectAll\" href=\"javascript:void(0)\" class=\"cmd-link\">全部解除</a>\r\n</div>\r\n<div class=\"workarea-commandbox\">\r\n    <button mc-name=\"enter\">削除実行</button>\r\n    <button mc-name=\"cancel\">キャンセル</button>\r\n</div>\r\n</form>\r\n</div>\r\n"

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var tmplSrc = __webpack_require__(83);

	exports.create = function(){
		var dom = $(tmplSrc);
		bindKensaForm(dom);
		bindAddForm(dom);
		bindCopyAll(dom);
		bindCopySelected(dom);
		bindDeleteSelected(dom);
		bindDeleteDuplicated(dom);
		bindCancel(dom);
		return dom;
	};

	function bindKensaForm(dom){
		dom.on("click", "> [mc-name=kensa]", function(event){
			dom.trigger("submenu-kensa-form");
		});
	}

	function bindAddForm(dom){
		dom.on("click", "> [mc-name=search]", function(event){
			dom.trigger("submenu-add-form");
		});
	}

	function bindCopyAll(dom){
		dom.on("click", "> [mc-name=copyAll]", function(event){
			dom.trigger("submenu-copy-all");
		});
	}

	function bindCopySelected(dom){
		dom.on("click", "> [mc-name=copySelected]", function(event){
			dom.trigger("submenu-copy-selected");
		});
	}

	function bindDeleteSelected(dom){
		dom.on("click", "> [mc-name=deleteSelected]", function(event){
			dom.trigger("submenu-delete-selected");
		});
	}

	function bindDeleteDuplicated(dom){
		dom.on("click", "> [mc-name=deleteDuplicated]", function(event){
			dom.trigger("submenu-delete-duplicated");
		});
	}

	function bindCancel(dom){
		dom.on("click", "> [mc-name=cancel]", function(event){
			dom.trigger("submenu-cancel");
		});
	}

/***/ },
/* 83 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t<a mc-name=\"kensa\" href=\"javascript:void(0)\" class=\"cmd-link\">検査</a> |\r\n\t<a mc-name=\"search\" href=\"javascript:void(0)\" class=\"cmd-link\">診療行為検索</a> |\r\n\t<a mc-name=\"copyAll\" href=\"javascript:void(0)\" class=\"cmd-link\">全部コピー</a> |\r\n\t<a mc-name=\"copySelected\" href=\"javascript:void(0)\" class=\"cmd-link\">選択コピー</a> |\r\n\t<a mc-name=\"deleteSelected\" href=\"javascript:void(0)\" class=\"cmd-link\">複数削除</a> |\r\n\t<a mc-name=\"deleteDuplicated\" href=\"javascript:void(0)\" class=\"cmd-link\">重複削除</a> |\r\n\t<a mc-name=\"cancel\" href=\"javascript:void(0)\" class=\"cmd-link\">キャンセル</a>\r\n</div>\r\n"

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = "<a mc-name=\"addShinryouLink\" href=\"javascript:void(0)\" class=\"cmd-link\">[診療行為]</a>\r\n<span class=\"cmd-link-span\">[</span>\r\n<a mc-name=\"submenuLink\" href=\"javascript:void(0)\" class=\"cmd-link\">+</a>\r\n<span class=\"cmd-link-span\">]</span>\r\n<div mc-name=\"submenu-area\"></div>\r\n<div mc-name=\"work-area\"></div>\r\n"

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var Shinryou = __webpack_require__(86);

	exports.setup = function(dom, shinryouList, visitId, at, patientId){
		batchAdd(dom, shinryouList);
		respondToShinryouEntered(dom, visitId);
	};

	function batchAdd(dom, shinryouList){
		shinryouList.forEach(function(shinryou){
			var se = Shinryou.create(shinryou);
			dom.append(se);
		});
	}

	function lookupShinryou(dom, visitId){
		return dom.broadcast("rx-shinryou-lookup-for-visit", [visitId]);
	}

	function respondToShinryouEntered(dom, visitId){
		dom.listen("rx-shinryou-batch-entered", function(targetVisitId, shinryouList){
			if( visitId === targetVisitId ){
				var currentList = lookupShinryou(dom, visitId).slice();
				shinryouList = shinryouList.slice();
				while( currentList.length > 0 && shinryouList.length > 0 ){
					var curr = currentList[0];
					var shin = shinryouList[0];
					if( shin.shinryoucode < curr.shinryoucode ){
						curr.dom.before(Shinryou.create(shin));
						shinryouList.shift();
					} else {
						currentList.shift();
					}
				}
				if( currentList.length === 0 ){
					batchAdd(dom, shinryouList);
				}
			}
		})
	}


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var kanjidate = __webpack_require__(16);
	var mUtil = __webpack_require__(5);
	var ShinryouForm = __webpack_require__(87);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);

	var tmplSrc = __webpack_require__(89);
	var tmpl = hogan.compile(tmplSrc);

	exports.create = function(shinryou){
		var dom = $(tmpl.render({
			label: shinryou.name
		}));
		dom.listen("rx-shinryou-lookup-for-visit", function(targetVisitId){
			if( targetVisitId === shinryou.visit_id ){
				return {
					shinryou_id: shinryou.shinryou_id,
					shinryoucode: shinryou.shinryoucode,
					dom: dom
				};
			}
		});
		dom.listen("rx-shinryou-deleted", function(targetShinryouId){
			if( shinryou.shinryou_id === targetShinryouId ){
				dom.remove();
			}
		});
		bindClick(dom, shinryou);
		return dom;
	};

	var dispSelector = "> [mc-name=disp]";
	var formSelector = "> [mc-name=form]";

	function getDispDom(dom){
		return dom.find(dispSelector);
	}

	function getFormDom(dom){
		return dom.find(formSelector);
	}

	function taskDeleteShinryou(ctx, opt){
		opt = opt || {};
		var keyShinryouId = opt.shinryouId || "shinryouId";
		return function(done){
			var shinryouId = ctx[keyShinryouId];
			service.batchDeleteShinryou([shinryouId], done);
		}
	}

	function bindClick(dom, shinryou){
		dom.on("click", dispSelector, function(event){
			event.stopPropagation();
			event.preventDefault();
			if( !dom.inquire("fn-confirm-edit", [shinryou.visit_id, "現在（限定）診察中でありませんが、この診療行為を編集しますか？"]) ){
				return;
			}
			var form = ShinryouForm.create(shinryou);
			form.on("delete", function(event){
				event.stopPropagation();
				var ctx = {shinryouId: shinryou.shinryou_id};
				task.run(taskDeleteShinryou(ctx), function(err){
					dom.trigger("shinryou-batch-deleted", [shinryou.visit_id, [shinryou.shinryou_id]]);
				});
			});
			form.on("cancel", function(event){
				event.stopPropagation();
				getFormDom(dom).html("");
				getDispDom(dom).show();
			});
			getDispDom(dom).hide();
			getFormDom(dom).append(form);
		})
	}




/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(88);
	var tmpl = hogan.compile(tmplSrc);

	exports.create = function(shinryou){
		var dom = $(tmpl.render({
			name: shinryou.name
		}));
		bindDelete(dom, shinryou.visit_id);
		bindCancel(dom);
		return dom;
	}

	var deleteSelector = "> form[mc-name=command-box] [mc-name=deleteLink]";
	var cancelSelector = "> form[mc-name=command-box] [mc-name=cancelLink]";

	function bindDelete(dom, visitId){
		dom.on("click", deleteSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			if( !dom.inquire("fn-confirm-edit", [visitId, "現在（暫定）診察中でありませんが、この診療行為を削除しますか？"]) ){
				return;
			}
			dom.trigger("delete");
		});
	}

	function bindCancel(dom){
		dom.on("click", cancelSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			dom.trigger("cancel");
		});
	}


/***/ },
/* 88 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n<div class=\"title\">診療行為編集</div>\r\n<div>\r\n\t名称：<span mc-name=\"name\">{{name}}</span>\r\n</div>\r\n<form onsubmit=\"return false\" mc-name=\"command-box\">\r\n\t<div class=\"workarea-commandbox\">\r\n\t\t<a mc-name=\"deleteLink\" href=\"javascript:void(0)\" class=\"cmd-link\">削除</a> |\r\n\t\t<a mc-name=\"cancelLink\" href=\"javascript:void(0)\" class=\"cmd-link\">キャンセル</a>\r\n\t</div>\r\n</form>\r\n</div>\r\n"

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t<div mc-name=\"disp\">{{label}}</div>\r\n\t<div mc-name=\"form\"></div>\r\n</div>"

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var kanjidate = __webpack_require__(16);
	var myclinicUtil = __webpack_require__(5);
	var ConductSubmenu = __webpack_require__(91);
	var ConductAddXpForm = __webpack_require__(93);
	var ConductAddInjectForm = __webpack_require__(95);
	var conti = __webpack_require__(4);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);
	var mConsts = __webpack_require__(8);

	var tmplHtml = __webpack_require__(98);

	exports.setup = function(dom, visitId, at){
		dom.html(tmplHtml);
		bindTopMenuClick(dom, visitId, at);
		setState(dom, "init");
	}

	function setState(dom, state){
		dom.data("state", state);
	}

	function getState(dom){
		return dom.data("state");
	}

	var topMenuSelector = "> [mc-name=top-menu-area] [mc-name=submenuLink]";
	var submenuSelector = "> [mc-name=submenu-area]";
	var workspaceSelector = "> [mc-name=workspace-area]";

	function getSubmenuDom(dom){
		return dom.find(submenuSelector);
	}

	function getWorkspaceDom(dom){
		return dom.find(workspaceSelector);
	}

	function closeSubmenu(dom){
		getSubmenuDom(dom).html("");
	}

	function startWork(dom, state, form){
		closeSubmenu(dom);
		getWorkspaceDom(dom).append(form);
		setState(dom, state);
	}

	function endWork(dom){
		getWorkspaceDom(dom).html("");
		setState(dom, "init");
	}

	function bindTopMenuClick(dom, visitId, at){
		dom.on("click", topMenuSelector, function(event){
			event.preventDefault();
			var state = getState(dom);
			if( state === "init" ){
				var submenu = ConductSubmenu.create();
				bindSubmenu(dom, submenu, visitId, at);
				getSubmenuDom(dom).append(submenu);
				setState(dom, "submenu");
			} else if( state === "submenu" ){
				closeSubmenu(dom);
				setState(dom, "init");
			}
		});
	}

	function enterXp(visitId, at, label, film, cb){
		var conductId, kizaicode, shinryoucodes = [], newConduct;
		conti.exec([
			function(done){
				var conduct = {
					visit_id: visitId,
					kind: mConsts.ConductKindGazou
				}
				service.enterConduct(conduct, function(err, result){
					if( err ){
						done(err);
						return;
					}
					conductId = result;
					done();
				})
			},
			function(done){
				var gazouLabel = {
					visit_conduct_id: conductId,
					label: label
				};
				service.enterGazouLabel(gazouLabel, done);
			},
			function(done){
				service.resolveKizaiNameAt(film, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					kizaicode = result;
					done();
				})
			},
			function(done){
				var kizai = {
					visit_conduct_id: conductId,
					kizaicode: kizaicode,
					amount: 1
				};
				service.enterConductKizai(kizai, done);
			},
			function(done){
				var names = ['単純撮影', '単純撮影診断'];
				service.batchResolveShinryouNamesAt(names, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					names.forEach(function(name){
						var code = result[name];
						if( code > 0 ){
							shinryoucodes.push(code);
						}
					});
					done();
				})
			},
			function(done){
				var list = shinryoucodes.map(function(shinryoucode){
					return {
						visit_conduct_id: conductId,
						shinryoucode: shinryoucode
					};
				});
				service.batchEnterConductShinryou(list, done);
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
				cb(err);
				return;
			}
			cb(undefined, newConduct);
		});
	}

	function doAddXp(dom, visitId, at){
		var msg = "現在（暫定）診察中でありませんが、Ｘ線処置を追加しますか？";
		if( !dom.inquire("fn-confirm-edit", [visitId, msg]) ){
			return;
		}
		var form = ConductAddXpForm.create();
		form.on("enter", function(event, label, film){
			event.stopPropagation();
			var newConduct;
			task.run(function(done){
				enterXp(visitId, at, label, film, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newConduct = result;
					done();
				})
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("conducts-batch-entered", [visitId, [newConduct]]);
				endWork(dom);
			})
		});
		form.on("cancel", function(event){
			event.stopPropagation();
			endWork(dom);
		});
		startWork(dom, "add-xp", form);
	}

	function addInject(visitId, at, iyakuhincode, amount, kind, cb){
		var conductId, newConduct;
		var shinryouNames = [];
		if( kind === mConsts.ConductKindHikaChuusha ){
			shinryouNames.push("皮下筋注");
		} else if( kind === mConsts.ConductKindJoumyakuChuusha ){
			shinryouNames.push("静注");
		}
		var shinryoucodes = [];
		conti.exec([
			function(done){
				var conduct = {
					visit_id: visitId,
					kind: kind
				};
				service.enterConduct(conduct, function(err, result){
					if( err ){
						done(err);
						return;
					}
					conductId = result;
					done();
				})
			},
			function(done){
				var names = shinryouNames;
				service.batchResolveShinryouNamesAt(names, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					names.forEach(function(name){
						var code = result[name];
						if( code > 0 ){
							shinryoucodes.push(code);
						}
					});
					done();
				})
			},
			function(done){
				var list = shinryoucodes.map(function(shinryoucode){
					return {
						visit_conduct_id: conductId,
						shinryoucode: shinryoucode
					};
				});
				service.batchEnterConductShinryou(list, done);
			},
			function(done){
				var drug = {
					visit_conduct_id: conductId,
					iyakuhincode: iyakuhincode,
					amount: amount
				};
				service.enterConductDrug(drug, done);
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
				cb(err);
				return;
			}
			cb(undefined, newConduct);
		})
	}

	function doAddInject(dom, visitId, at){
		var msg = "現在（暫定）診察中でありませんが、Ｘ線処置を追加しますか？";
		if( !dom.inquire("fn-confirm-edit", [visitId, msg]) ){
			return;
		}
		var form = ConductAddInjectForm.create(at);
		form.on("enter", function(event, iyakuhincode, amount, kind){
			event.stopPropagation();
			var newConduct;
			task.run(function(done){
				addInject(visitId, at, iyakuhincode, amount, kind, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newConduct = result;
					done();
				})
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("conducts-batch-entered", [visitId, [newConduct]]);
				endWork(dom);
			});
		});
		form.on("cancel", function(event){
			event.stopPropagation();
			endWork(dom);
		});
		startWork(dom, "add-inject", form);
	}

	function bindSubmenu(dom, submenu, visitId, at){
		submenu.on("add-xp", function(event){
			doAddXp(dom, visitId, at);
		});
		submenu.on("add-inject", function(event){
			doAddInject(dom, visitId, at);
		});
		submenu.on("copy-all", function(event){
			var targetVisitId = dom.inquire("fn-get-target-visit-id");
			if( !(targetVisitId > 0) ){
				alert("現在（暫定）診察中でないので、コピーできません。");
				return;
			}
			if( targetVisitId === visitId ){
				alert("自分自身にコピーすることはできません。");
				return;
			}
			var conductIds, newConducts = [];
			task.run([
				function(done){
					service.copyConducts(visitId, targetVisitId, function(err, result){
						if( err ){
							alert(err);
							return;
						}
						conductIds = result;
						done();
					})
				},
				function(done){
					conti.forEach(conductIds, function(conductId, done){
						service.getFullConduct(conductId, at, function(err, result){
							if( err ){
								done(err);
								return;
							}
							newConducts.push(result);
							done();
						})
					}, done);
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				closeSubmenu(dom);
				setState(dom, "init");
				dom.trigger("conducts-batch-entered", [targetVisitId, newConducts]);
			});
		});
		submenu.on("cancel", function(event){
			event.stopPropagation();
			closeSubmenu(dom);
			setState(dom, "init");
		});
	}



/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var tmplSrc = __webpack_require__(92);

	exports.create = function(){
		var dom = $(tmplSrc);
		bindAddXp(dom);
		bindAddInject(dom);
		bindCopyAll(dom);
		bindCancel(dom);
		return dom;
	};

	function bindAddXp(dom){
		dom.on("click", "> [mc-name=addXp]", function(event){
			event.preventDefault();
			dom.trigger("add-xp");
		});
	}

	function bindAddInject(dom){
		dom.on("click", "> [mc-name=addInject]", function(event){
			event.preventDefault();
			dom.trigger("add-inject");
		});
	}

	function bindCopyAll(dom){
		dom.on("click", "> [mc-name=copyAll]", function(event){
			event.preventDefault();
			dom.trigger("copy-all");
		});
	}

	function bindCancel(dom){
		dom.on("click", "> [mc-name=cancel]", function(event){
			event.preventDefault();
			dom.trigger("cancel");
		});
	}

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t<a mc-name=\"addXp\" href=\"javascript:void(0)\" class=\"cmd-link\">Ｘ線検査追加</a> |\r\n\t<a mc-name=\"addInject\" href=\"javascript:void(0)\" class=\"cmd-link\">注射追加</a> |\r\n\t<a mc-name=\"copyAll\" href=\"javascript:void(0)\" class=\"cmd-link\">全部コピー</a> |\r\n\t<a mc-name=\"cancel\" href=\"javascript:void(0)\" class=\"cmd-link\">キャンセル</a>\r\n</div>"

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var tmplSrc = __webpack_require__(94);

	exports.create = function(){
		var dom = $(tmplSrc);
		bindEnter(dom);
		bindCancel(dom);
		return dom;
	}

	var labelSelectSelector = "> form [mc-name=label-selector-area] select[mc-name=label]";
	var filmSelectSelector = "> form [mc-name=film-selector-area] select[mc-name=film]";
	var enterSelector = "> form .workarea-commandbox [mc-name=enter]";
	var cancelSelector = "> form .workarea-commandbox [mc-name=cancel]";

	function getSelectedLabel(dom){
		return dom.find(labelSelectSelector + " option:selected").val();
	}

	function getSelectedFilm(dom){
		return dom.find(filmSelectSelector + " option:selected").val();
	}

	function bindEnter(dom){
		dom.on("click", enterSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			var label = getSelectedLabel(dom);
			var film = getSelectedFilm(dom);
			dom.trigger("enter", [label, film]);
		});
	}

	function bindCancel(dom){
		dom.on("click", cancelSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			dom.trigger("cancel");
		});
	}

/***/ },
/* 94 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n    <div class=\"title\">X線入力</div>\r\n    <form onsubmit=\"return false\">\r\n        <div style=\"margin: 3px 0\" mc-name=\"label-selector-area\">\r\n            <select mc-name=\"label\">\r\n                <option>胸部単純Ｘ線</option>\r\n                <option>腹部単純Ｘ線</option>\r\n            </select>\r\n        </div>\r\n        <div style=\"margin: 3px 0\" mc-name=\"film-selector-area\">\r\n            <select mc-name=\"film\">\r\n                <option>半切</option>\r\n                <option selected>大角</option>\r\n                <option>四ツ切</option>\r\n            </select>\r\n        </div>\r\n        <div class=\"workarea-commandbox\">\r\n            <button mc-name=\"enter\">入力</button>\r\n            <button mc-name=\"cancel\">キャンセル</button>\r\n        </div>\r\n    </form>\r\n</div>\r\n"

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(96);
	var resultTmplSrc = __webpack_require__(97);
	var resultTmpl = hogan.compile(resultTmplSrc);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var mConsts = __webpack_require__(8);

	exports.create = function(at){
		var dom = $(tmplSrc);
		var ctx = {
			iyakuhincode: undefined
		};
		bindSearch(dom, at);
		bindSearchResultSelect(dom, at, ctx);
		bindEnter(dom, ctx);
		bindCancel(dom);
		return dom;
	};

	var drugNameSelector = "> form[mc-name=main-form] [mc-name=name]";
	var drugUnitSelector = "> form[mc-name=main-form] [mc-name=unit]";
	var amountInputSelector = "> form[mc-name=main-form] input[mc-name=amount]";
	var kindInputSelector = "> form[mc-name=main-form] input[type=radio][name=kind]";
	var searchFormSelector = "> form[mc-name=search-form]";
	var searchTextSelector = "> form[mc-name=search-form] input[mc-name=searchText]";
	var searchResultSelector = "> form[mc-name=search-form] select";
	var enterSelector = "> form[mc-name=main-form] .workarea-commandbox [mc-name=enter]";
	var cancelSelector = "> form[mc-name=main-form] .workarea-commandbox [mc-name=cancel]";

	var listOfConductKinds = [mConsts.ConductKindHikaChuusha, mConsts.ConductKindJoumyakuChuusha,
		mConsts.ConductKindOtherChuusha, mConsts.ConductKindGazou];

	function getSearchResultDom(dom){
		return dom.find(searchResultSelector);
	}

	function getSearchText(dom){
		return dom.find(searchTextSelector).val();
	}

	function getAmount(dom){
		return dom.find(amountInputSelector).val();
	}

	function getKind(dom){
		return dom.find(kindInputSelector).filter(function(){
			return $(this).is(":checked");
		}).val();
	}

	function updateDrugName(dom, name){
		dom.find(drugNameSelector).text(name);
	}

	function updateDrugUnit(dom, unit){
		dom.find(drugUnitSelector).text(unit);
	}

	function updateSearchResult(dom, resultList){
		getSearchResultDom(dom).html(resultTmpl.render({
			list: resultList
		}));
	}

	function setDrug(dom, master, ctx){
		ctx.iyakuhincode = master.iyakuhincode;
		updateDrugName(dom, master.name);
		updateDrugUnit(dom, master.unit);
	}

	function bindSearch(dom, at){
		dom.on("submit", searchFormSelector, function(event){
			event.preventDefault();
			var text = getSearchText(dom).trim();
			if( text === "" ){
				return;
			}
			var searchResult;
			task.run([
				function(done){
					service.searchIyakuhinMaster(text, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						searchResult = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				updateSearchResult(dom, searchResult);
			})
		});
	}

	function bindSearchResultSelect(dom, at, ctx){
		dom.on("change", searchResultSelector, function(event){
			var iyakuhincode = dom.find(searchResultSelector + " option:selected").val();
			var master;
			task.run([
				function(done){
					service.resolveIyakuhinMasterAt(iyakuhincode, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						master = result;
						done();
					});
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				setDrug(dom, master, ctx);
			})
		});
	}

	function bindEnter(dom, ctx){
		dom.on("click", enterSelector, function(event){
			event.preventDefault();
			var iyakuhincode = ctx.iyakuhincode;
			if( !iyakuhincode ){
				alert("薬剤が指定されていません。");
				return;
			}
			iyakuhincode = +iyakuhincode;
			var amount = +getAmount(dom);
			var kind = +getKind(dom);
			if( !(amount > 0) ){
				alert("用量が不適切です。");
				return;
			}
			if( listOfConductKinds.indexOf(kind) < 0 ){
				alert("invalid conduct kind: " + kind);
				return;
			}
			dom.trigger("enter", [iyakuhincode, amount, kind]);
		});
	}

	function bindCancel(dom){
		dom.on("click", cancelSelector, function(event){
			event.preventDefault();
			dom.trigger("cancel");
		});
	}


/***/ },
/* 96 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n    <div class=\"title\">処置注射入力</div>\r\n    <form onsubmit=\"return false\" mc-name=\"main-form\">\r\n        <div>\r\n            <table style=\"width:100%\">\r\n                <tr>\r\n                    <td style=\"width:3em\">名称：</td>\r\n                    <td width=\"*\"><span mc-name=\"name\"></span></td>\r\n                </tr>\r\n                <tr>\r\n                    <td style=\"width:2.5em\">用量：</td>\r\n                    <td><input mc-name=\"amount\" size=\"8\" value=\"1\"/>\r\n                        <span mc-name=\"unit\"></span></td>\r\n                </tr>\r\n            </table>\r\n        </div>\r\n        <div mc-name=\"kindWrapper\">\r\n            <input type=\"radio\" name=\"kind\" value=\"0\" checked>皮下・筋肉\r\n            <input type=\"radio\" name=\"kind\" value=\"1\">静脈\r\n            <input type=\"radio\" name=\"kind\" value=\"2\">その他\r\n        </div>\r\n        <div class=\"workarea-commandbox\">\r\n            <button mc-name=\"enter\">入力</button>\r\n            <button mc-name=\"cancel\">キャンセル</button>\r\n        </div>\r\n    </form>\r\n    <hr />\r\n    <form onsubmit=\"return false\" mc-name=\"search-form\">\r\n        <div style=\"margin:3px 0\">\r\n            <input mc-name=\"searchText\"/>\r\n            <button mc-name=\"searchLink\">検索</button>\r\n        </div>\r\n        <div>\r\n            <select mc-name=\"searchResult\" size=\"10\" style=\"width:100%\"></select>\r\n        </div>\r\n    </form>\r\n</div>\r\n\r\n"

/***/ },
/* 97 */
/***/ function(module, exports) {

	module.exports = "{{#list}}\r\n\t<option value=\"{{iyakuhincode}}\">{{name}}</option>\r\n{{/list}}"

/***/ },
/* 98 */
/***/ function(module, exports) {

	module.exports = "<div mc-name=\"top-menu-area\">\r\n\t<a mc-name=\"submenuLink\" href=\"javascript:void(0)\" class=\"cmd-link\">[処置]</a>\r\n</div>\r\n<div mc-name=\"submenu-area\"></div>\r\n<div mc-name=\"workspace-area\"></div>\r\n"

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var Conduct = __webpack_require__(100);

	exports.setup = function(dom, conducts, visitId, at){
		batchAdd(dom, conducts, visitId, at);
		dom.listen("rx-conducts-batch-entered", function(targetVisitId, conducts){
			if( visitId !== targetVisitId ){
				return;
			}
			batchAdd(dom, conducts, visitId, at);
		});
	};

	function batchAdd(dom, conducts, visitId, at){
		conducts.forEach(function(conduct){
			var ce = Conduct.create(conduct, visitId, at);
			dom.append(ce);
		})
	}




/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var kanjidate = __webpack_require__(16);
	var mUtil = __webpack_require__(5);
	var ConductDisp = __webpack_require__(101);
	var ConductForm = __webpack_require__(103);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var tmplSrc = __webpack_require__(116);

	var dispAreaSelector = "> [mc-name=disp-area]";
	var workAreaSelector = "> [mc-name=work-area]";

	function extendConductsWithLabel(conduct){
		conduct = mUtil.assign({}, conduct);
		conduct.kind_label = mUtil.conductKindToKanji(conduct.kind);
		conduct.drugs = conduct.drugs.map(function(drug){
			return mUtil.assign({}, drug, {
				label: mUtil.conductDrugRep(drug)
			});
		});
		conduct.kizai_list = conduct.kizai_list.map(function(kizai){
			return mUtil.assign({}, kizai, {
				label: mUtil.conductKizaiRep(kizai)
			});
		});
		return conduct;
	}

	exports.create = function(conduct, visitId, at){
		var visitId = conduct.visit_id;
		var conductId = conduct.id;
		conduct = extendConductsWithLabel(conduct);
		var ctx = {
			conduct: conduct
		};
		var dom = $(tmplSrc);
		getDispAreaDom(dom).append(ConductDisp.create(conduct));
		bindClick(dom, visitId, at, ctx);
		dom.on("conduct-modified", function(event, targetConductId, newConduct){
			if( conductId === targetConductId ){
				event.stopPropagation();
				var newConductEx = extendConductsWithLabel(newConduct);
				ctx.conduct = newConductEx;
				dom.broadcast("rx-conduct-modified", [targetConductId, newConductEx]);
				return;
			}
		});
		return dom;
	};

	function getDispAreaDom(dom){
		return dom.find(dispAreaSelector);
	}

	function getWorkAreaDom(dom){
		return dom.find(workAreaSelector);
	}

	function bindClick(dom, visitId, at, ctx){
		dom.on("click", dispAreaSelector, function(event){
			event.preventDefault();
			var conduct = ctx.conduct;
			var conductId = conduct.id;
			var msg = "現在（暫定）診察中でありませんが、この処置を変更しますか？";
			if( !dom.inquire("fn-confirm-edit", [visitId, msg]) ){
				return;
			}
			var form = ConductForm.create(conduct, at);
			form.on("close", function(event){
				event.stopPropagation();
				getWorkAreaDom(dom).html("");
				getDispAreaDom(dom).show();
			});
			form.on("delete", function(event){
				event.stopPropagation();
				task.run(function(done){
					service.deleteConduct(conductId, done);
				}, function(err){
					if( err ){
						alert(err);
						return;
					}
					dom.remove();
				})
			})
			getDispAreaDom(dom).hide();
			getWorkAreaDom(dom).append(form);
		});
	}



/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(102);
	var tmpl = hogan.compile(tmplSrc);

	exports.create = function(conductEx){
		var conductId = conductEx.id;
		var dom = $("<div></div>");
		dom.html(tmpl.render(conductEx));
		dom.listen("rx-conduct-modified", function(targetConductId, newConductEx){
			if( conductId !== targetConductId ){
				return;
			}
			dom.html(tmpl.render(newConductEx));
		});
		return dom;
	};


/***/ },
/* 102 */
/***/ function(module, exports) {

	module.exports = "<div mc-name=\"kind\">&lt;{{kind_label}}&gt;</div>\r\n<div mc-name=\"gazouLabel\">{{gazou_label}}</div>\r\n<div mc-name=\"shinryouList\">\r\n\t{{#shinryou_list}}\r\n\t\t<div>{{name}}</div>\r\n\t{{/shinryou_list}}\r\n</div>\r\n<div mc-name=\"drugs\">\r\n\t{{#drugs}}\r\n\t\t<div>{{label}}</div>\r\n\t{{/drugs}}\r\n</div>\r\n<div mc-name=\"kizaiList\">\r\n\t{{#kizai_list}}\r\n\t\t<div>{{label}}</div>\r\n\t{{/kizai_list}}\r\n</div>\r\n"

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(104);
	var tmpl = hogan.compile(tmplSrc);
	var mUtil = __webpack_require__(5);
	var AddShinryouForm = __webpack_require__(105);
	var AddDrugForm = __webpack_require__(108);
	var AddKizaiForm = __webpack_require__(111);
	var GazouLabelForm = __webpack_require__(114);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);

	exports.create = function(conductEx, at){
		var conductId = conductEx.id;
		var dom = $("<div></div>");
		dom.html(tmpl.render(conductEx));
		adaptToKind(dom, conductEx.kind);
		var ctx = {
			conduct: conductEx
		};
		bindAddShinryou(dom, at, conductId);
		bindAddDrug(dom, at, conductId);
		bindAddKizai(dom, at, conductId);
		bindKindChange(dom, at, conductId);
		bindGazouLabel(dom, at, ctx);
		bindDeleteShinryou(dom, conductId, at);
		bindDeleteDrug(dom, conductId, at);
		bindDeleteKizai(dom, conductId, at);
		bindClose(dom);
		bindDelete(dom);
		dom.listen("rx-conduct-modified", function(targetConductId, newConductEx){
			if( conductId === targetConductId ){
				ctx.conduct = newConductEx;
				dom.html(tmpl.render(newConductEx));
				adaptToKind(dom, newConductEx.kind);
			}
		});
		return dom;
	};

	var addShinryouLinkSelector = "> div > [mc-name=main-area] > .menu-box [mc-name=addShinryou]";
	var addDrugLinkSelector = "> div > [mc-name=main-area] > .menu-box [mc-name=addDrug]";
	var addKizaiLinkSelector = "> div > [mc-name=main-area] > .menu-box [mc-name=addKizai]";
	var kindSelector = "> div > [mc-name=main-area] [mc-name=disp-area] select[mc-name=kind]";
	var gazouLabelDispSelector = "> div > [mc-name=main-area] [mc-name=disp-area] [mc-name=gazou-label-disp]";
	var gazouLabelFormSelector = "> div > [mc-name=main-area] [mc-name=disp-area] [mc-name=gazou-label-form]";
	var editGazouLabelLinkSelector = "> div > [mc-name=main-area] [mc-name=disp-area] [mc-name=editGazouLabelLink]";
	var subformAreaSelector = "> div > [mc-name=main-area] > [mc-name=subwidget]";
	var closeLinkSelector = "> div > [mc-name=main-area] > [mc-name=disp-area] > .workarea-commandbox [mc-name=closeLink]";
	var deleteLinkSelector = "> div > [mc-name=main-area] > [mc-name=disp-area] > .workarea-commandbox [mc-name=deleteLink]";
	var deleteShinryouLinkSelector = "> div > [mc-name=main-area] [mc-name=shinryouList] [mc-name=deleteShinryouLink]";
	var deleteDrugLinkSelector = "> div > [mc-name=main-area] [mc-name=drugList] [mc-name=deleteDrugLink]";
	var deleteKizaiLinkSelector = "> div > [mc-name=main-area] [mc-name=kizaiList] [mc-name=deleteKizaiLink]";

	function getSubformAreaDom(dom){
		return dom.find(subformAreaSelector);
	}

	function adaptToKind(dom, kind){
		dom.find(kindSelector + " option[value=" + kind + "]").prop("selected", true);
	}

	function getKind(dom){
		return dom.find(kindSelector + " option:selected").val();
	}

	function bindAddShinryou(dom, at, conductId){
		dom.on("click", addShinryouLinkSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			var area = getSubformAreaDom(dom);
			if( !area.is(":empty") ){
				return;
			}
			var form = AddShinryouForm.create(at, conductId);
			form.on("cancel", function(event){
				event.stopPropagation();
				getSubformAreaDom(dom).empty();
			});
			dom.find(subformAreaSelector).append(form);
		});
	}

	function bindAddDrug(dom, at, conductId){
		dom.on("click", addDrugLinkSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			var area = getSubformAreaDom(dom);
			if( !area.is(":empty") ){
				return;
			}
			var form = AddDrugForm.create(at, conductId);
			form.on("cancel", function(event){
				event.stopPropagation();
				getSubformAreaDom(dom).empty();
			});
			dom.find(subformAreaSelector).append(form);
		})
	}

	function bindAddKizai(dom, at, conductId){
		dom.on("click", addKizaiLinkSelector, function(event){
			event.preventDefault();
			event.stopPropagation();
			var area = getSubformAreaDom(dom);
			if( !area.is(":empty") ){
				return;
			}
			var form = AddKizaiForm.create(at, conductId);
			form.on("cancel", function(event){
				event.stopPropagation();
				getSubformAreaDom(dom).empty();
			});
			dom.find(subformAreaSelector).append(form);
		})
	}

	function bindKindChange(dom, at, conductId){
		dom.on("change", kindSelector, function(event){
			var kind = getKind(dom);
			var newConduct;
			task.run([
				function(done){
					service.changeConductKind(conductId, kind, done);
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

	function bindGazouLabel(dom, at, ctx){
		dom.on("click", editGazouLabelLinkSelector, function(event){
			event.preventDefault();
			var dispArea = dom.find(gazouLabelDispSelector);
			var formArea = dom.find(gazouLabelFormSelector);
			var form = GazouLabelForm.create(ctx.conduct, at);
			form.on("modified", function(event, newConduct){
				event.stopPropagation();
				dom.trigger("conduct-modified", [ctx.conduct.id, newConduct]);
			})
			form.on("cancel", function(event){
				event.stopPropagation();
				formArea.empty();
				dispArea.show();
			})
			dispArea.hide();
			formArea.append(form);
		})
	}

	function bindDeleteShinryou(dom, conductId, at){
		dom.on("click", deleteShinryouLinkSelector, function(event){
			event.preventDefault();
			if( !confirm("この処置診療行為を削除しますか？") ){
				return;
			}
			var e = $(this);
			e.prop("disabled", true);
			var id = e.attr("id-value");
			var newConduct;
			task.run([
				function(done){
					service.deleteConductShinryou(id, done);
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
				dom.trigger("conduct-modified", [conductId, newConduct]);
			})
		})
	}

	function bindDeleteDrug(dom, conductId, at){
		dom.on("click", deleteDrugLinkSelector, function(event){
			event.preventDefault();
			if( !confirm("この処置薬剤を削除しますか？") ){
				return;
			}
			var e = $(this);
			e.prop("disabled", true);
			var id = e.attr("id-value");
			var newConduct;
			task.run([
				function(done){
					service.deleteConductDrug(id, done);
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
				dom.trigger("conduct-modified", [conductId, newConduct]);
			})
		})
	}

	function bindDeleteKizai(dom, conductId, at){
		dom.on("click", deleteKizaiLinkSelector, function(event){
			event.preventDefault();
			if( !confirm("この処置器材を削除しますか？") ){
				return;
			}
			var e = $(this);
			e.prop("disabled", true);
			var id = e.attr("id-value");
			var newConduct;
			task.run([
				function(done){
					service.deleteConductKizai(id, done);
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
				dom.trigger("conduct-modified", [conductId, newConduct]);
			})
		})
	}

	function bindClose(dom){
		dom.on("click", closeLinkSelector, function(event){
			event.preventDefault();
			dom.trigger("close");
		});
	}

	function bindDelete(dom){
		dom.on("click", deleteLinkSelector, function(event){
			event.preventDefault();
			if( !confirm("この処置を削除してもいいですか？") ){
				return;
			}
			dom.trigger("delete");
		});
	}


/***/ },
/* 104 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n    <div class=\"title\">処置の編集</div>\r\n    <div mc-name=\"main-area\">\r\n        <div class=\"menu-box\">\r\n            <a mc-name=\"addShinryou\" class=\"cmd-link menu-item\" \r\n               href=\"javascript:void(0)\">診療行為追加</a> |\r\n            <a mc-name=\"addDrug\" class=\"cmd-link menu-item\"\r\n               href=\"javascript:void(0)\">薬剤追加</a> |\r\n            <a mc-name=\"addKizai\" class=\"cmd-link menu-item\"\r\n               href=\"javascript:void(0)\">器材追加</a>\r\n        </div>\r\n        <div mc-name=\"subwidget\" class=\"subwidget-area\"></div>\r\n        <div mc-name=\"disp-area\">\r\n            <div mc-name=\"kind-area\">\r\n                <table style=\"margin-left:0\" padding=\"0\" cellspacing=\"0\">\r\n                    <tr>\r\n                        <td>種類：</td>\r\n                        <td width=\"*\">\r\n                            <select mc-name=\"kind\" style=\"margin: 3px 0\">\r\n                                <option value=\"0\">皮下・筋肉注射</option>\r\n                                <option value=\"1\">静脈注射</option>\r\n                                <option value=\"2\">その他の注射</option>\r\n                                <option value=\"3\">画像</option>\r\n                            </select>\r\n                        </td>\r\n                    </tr>\r\n                    </select>\r\n                </table>\r\n            </div>\r\n            <div mc-name=\"gazouLabelWrapper\" style=\"margin: 3px 0\">\r\n                <div mc-name=\"gazou-label-disp\">\r\n                    画像ラベル： <span mc-name=\"gazouLabel\">{{gazou_label}}</span>\r\n                    <a mc-name=\"editGazouLabelLink\" class=\"cmd-link\" href=\"javascript:void(0)\">編集</a>\r\n                </div>\r\n                <div mc-name=\"gazou-label-form\"></div>\r\n            </div>\r\n            <div mc-name=\"shinryouList\">\r\n                {{#shinryou_list}}\r\n                    <div>\r\n                        <span mc-name=\"label\">{{name}}</span> \r\n                        <a mc-name=\"deleteShinryouLink\" href=\"javascript:void(0)\" class=\"cmd-link\" \r\n                            id-value=\"{{id}}\">削除</a>\r\n                    </div>\r\n                {{/shinryou_list}}                \r\n            </div>\r\n            <div mc-name=\"drugList\">\r\n                {{#drugs}}\r\n                    <div>\r\n                        <span mc-name=\"label\">{{label}}</span>  \r\n                        <a mc-name=\"deleteDrugLink\" href=\"javascript:void(0)\" class=\"cmd-link\"\r\n                            id-value=\"{{id}}\">削除</a>  \r\n                    </div>\r\n                {{/drugs}}                \r\n            </div>\r\n            <div mc-name=\"kizaiList\">\r\n                {{#kizai_list}}\r\n                    <div>\r\n                        <span mc-name=\"label\">{{label}}</span> \r\n                        <a mc-name=\"deleteKizaiLink\" href=\"javascript:void(0)\" class=\"cmd-link\"\r\n                            id-value=\"{{id}}\">削除</a> \r\n                    </div>\r\n                {{/kizai_list}}                \r\n            </div>\r\n            <hr/>\r\n            <div class=\"workarea-commandbox\">\r\n                <button mc-name=\"closeLink\">閉じる</button>\r\n                <a mc-name=\"deleteLink\" class=\"cmd-link\" href=\"javascript:void(0)\">削除</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(106);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var resultTmplSrc = __webpack_require__(107);
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



/***/ },
/* 106 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n\t<div class=\"title\">診療行為追加</div>\r\n\t<div mc-name=\"disp-area\">\r\n\t    名前：<span mc-name=\"name\"></span>\r\n\t</div>\r\n\t<div class=\"commandbox\">\r\n\t    <button mc-name=\"enterLink\">入力</button>\r\n\t    <button mc-name=\"cancelLink\">キャンセル</button>\r\n\t</div>\r\n\t<hr />\r\n\t<form onsubmit=\"return false\" mc-name=\"search-form\">\r\n\t\t<div>\r\n\t\t    <input mc-name=\"searchText\"/>\r\n\t\t    <button mc-name=\"searchLink\">検索</button>\r\n\t\t</div>\r\n\t\t<div>\r\n\t\t    <select mc-name=\"searchResult\" style=\"width:100%\" size=\"6\"></select>\r\n\t\t</div>\r\n\t</form>\r\n</div>\r\n"

/***/ },
/* 107 */
/***/ function(module, exports) {

	module.exports = "{{#list}}\r\n\t<option value=\"{{shinryoucode}}\">{{name}}</option>\r\n{{/list}}"

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(109);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var resultTmplSrc = __webpack_require__(110);
	var resultTmpl = hogan.compile(resultTmplSrc);

	exports.create = function(at, conductId){
		var dom = $(tmplSrc);
		var ctx = {
			iyakuhincode: undefined
		};
		bindEnter(dom, conductId, at, ctx);
		bindCancel(dom);
		bindSearch(dom, at);
		bindSearchResultSelect(dom, at, ctx);
		return dom;
	};

	var nameSelector = "> form[mc-name=main-form] [mc-name=name]";
	var amountSelector = "> form[mc-name=main-form] input[mc-name=amount]";
	var unitSelector = "> form[mc-name=main-form] [mc-name=unit]";
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

	function getAmount(dom){
		return dom.find(amountSelector).val().trim();
	}

	function updateName(dom, name){
		dom.find(nameSelector).text(name);
	}

	function updateUnit(dom, unit){
		dom.find(unitSelector).text(unit);
	}

	function bindEnter(dom, conductId, at, ctx){
		dom.on("click", enterSelector, function(event){
			event.preventDefault();
			var iyakuhincode = ctx.iyakuhincode;
			if( !iyakuhincode ){
				alert("薬剤が指定されていません。");
				return;
			}
			iyakuhincode = +iyakuhincode;
			var amount = getAmount(dom);
			if( amount === "" ){
				alert("用量が設定されていません。");
				return;
			}
			amount = +amount;
			var newConduct;
			task.run([
				function(done){
					service.enterConductDrug({
						visit_conduct_id: conductId,
						iyakuhincode: iyakuhincode,
						amount: amount
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
				service.searchIyakuhinMaster(text, at, function(err, result){
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

	function setDrug(dom, master, ctx){
		ctx.iyakuhincode = master.iyakuhincode;
		updateName(dom, master.name);
		updateUnit(dom, master.unit);
	}

	function bindSearchResultSelect(dom, at, ctx){
		dom.on("change", searchResultSelector, function(event){
			var iyakuhincode = dom.find(searchResultSelector + " option:selected").val();
			var master;
			task.run(function(done){
				service.getIyakuhinMaster(iyakuhincode, at, function(err, result){
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
				setDrug(dom, master, ctx);
			})
		});
	}



/***/ },
/* 109 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n    <div class=\"title\">薬剤追加</div>\r\n    <form mc-name=\"main-form\" onsubmit=\"return false\">\r\n        <table style=\"width:100%\">\r\n            <tr>\r\n                <td style=\"width:3em\">名称：</td>\r\n                <td width=\"*\"><span mc-name=\"name\"></span></td>\r\n            </tr>\r\n            <tr>\r\n                <td style=\"width:2.5em\">用量：</td>\r\n                <td><input mc-name=\"amount\" size=\"8\" value=\"1\"/>\r\n                    <span mc-name=\"unit\"></span></td>\r\n            </tr>\r\n        </table>\r\n    </form>\r\n    <div class=\"commandbox\">\r\n        <button mc-name=\"enterLink\">入力</button>\r\n        <button mc-name=\"cancelLink\">キャンセル</button>\r\n    </div>\r\n    <hr/>\r\n    <form mc-name=\"search-form\" onsubmit=\"return false\">\r\n        <div>\r\n            <input mc-name=\"searchText\"/>\r\n            <button mc-name=\"searchLink\">検索</button>\r\n        </div>\r\n        <div>\r\n            <select mc-name=\"searchResult\" size=\"10\" style=\"width:100%\"></select>\r\n        </div>\r\n    </form>\r\n</div>\r\n"

/***/ },
/* 110 */
/***/ function(module, exports) {

	module.exports = "{{#list}}\r\n\t<option value=\"{{iyakuhincode}}\">{{name}}</option>\r\n{{/list}}"

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(112);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var resultTmplSrc = __webpack_require__(113);
	var resultTmpl = hogan.compile(resultTmplSrc);

	exports.create = function(at, conductId){
		var dom = $(tmplSrc);
		var ctx = {
			kizaicode: undefined
		};
		bindEnter(dom, conductId, at, ctx);
		bindCancel(dom);
		bindSearch(dom, at);
		bindSearchResultSelect(dom, at, ctx);
		return dom;
	};

	var nameSelector = "> form[mc-name=main-form] [mc-name=name]";
	var amountSelector = "> form[mc-name=main-form] input[mc-name=amount]";
	var unitSelector = "> form[mc-name=main-form] [mc-name=unit]";
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

	function getAmount(dom){
		return dom.find(amountSelector).val().trim();
	}

	function updateName(dom, name){
		dom.find(nameSelector).text(name);
	}

	function updateUnit(dom, unit){
		dom.find(unitSelector).text(unit);
	}

	function bindEnter(dom, conductId, at, ctx){
		dom.on("click", enterSelector, function(event){
			event.preventDefault();
			var kizaicode = ctx.kizaicode;
			if( !kizaicode ){
				alert("器材が指定されていません。");
				return;
			}
			kizaicode = +kizaicode;
			var amount = getAmount(dom);
			if( amount === "" ){
				alert("用量が設定されていません。");
				return;
			}
			amount = +amount;
			var newConduct;
			task.run([
				function(done){
					service.enterConductKizai({
						visit_conduct_id: conductId,
						kizaicode: kizaicode,
						amount: amount
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
				service.searchKizaiMaster(text, at, function(err, result){
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

	function setKizai(dom, master, ctx){
		ctx.kizaicode = master.kizaicode;
		updateName(dom, master.name);
		updateUnit(dom, master.unit);
	}

	function bindSearchResultSelect(dom, at, ctx){
		dom.on("change", searchResultSelector, function(event){
			var kizaicode = dom.find(searchResultSelector + " option:selected").val();
			var master;
			task.run(function(done){
				service.getKizaiMaster(kizaicode, at, function(err, result){
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
				setKizai(dom, master, ctx);
			})
		});
	}



/***/ },
/* 112 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n\t<div class=\"title\">器材追加</div>\r\n    <form mc-name=\"main-form\" onsubmit=\"return false\">\r\n        <table style=\"width:100%\">\r\n            <tr>\r\n                <td style=\"width:3em\">名称：</td>\r\n                <td width=\"*\"><span mc-name=\"name\"></span></td>\r\n            </tr>\r\n            <tr>\r\n                <td style=\"width:2.5em\">用量：</td>\r\n                <td><input mc-name=\"amount\" size=\"8\" value=\"1\"/>\r\n                    <span mc-name=\"unit\"></span></td>\r\n            </tr>\r\n        </table>\r\n        <!--\r\n\t\t<div>\r\n\t\t\t<div>名称：<span mc-name=\"name\"></span></div>\r\n\t\t\t<div>量：<input mc-name=\"amount\" size=\"6\"> <span mc-name=\"unit\"></span></div>\r\n\t\t</div>\r\n\t\t-->\r\n\t</form>\r\n\t<div class=\"commandbox\">\r\n\t    <button mc-name=\"enterLink\">入力</button>\r\n\t    <button mc-name=\"cancelLink\">キャンセル</button>\r\n\t</div>\r\n\t<hr/>\r\n    <form mc-name=\"search-form\" onsubmit=\"return false\">\r\n\t\t<div>\r\n\t\t\t<input mc-name=\"searchText\"/>\r\n\t\t\t<button mc-name=\"searchLink\">検索</button>\r\n\t\t</div>\r\n\t\t<div>\r\n\t\t\t<select mc-name=\"searchResult\" style=\"width:100%\" size=\"6\"></select>\r\n\t\t</div>\r\n\t</form>\r\n</div>"

/***/ },
/* 113 */
/***/ function(module, exports) {

	module.exports = "{{#list}}\r\n\t<option value=\"{{kizaicode}}\">{{name}}</option>\r\n{{/list}}"

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(115);
	var tmpl = hogan.compile(tmplSrc);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);
	var conti = __webpack_require__(4);

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


/***/ },
/* 115 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\"> \r\n      <span mc-name=\"label\"></span>  \r\n      <input mc-name=\"text\" value=\"{{gazou_label}}\"/>  \r\n      <a mc-name=\"suggestLink\" href=\"javascript:void(0)\" class=\"cmd-link\">例</a> \r\n      <div mc-name=\"selectWrapper\" style=\"display:none\"> \r\n        <select mc-name=\"select\" size=\"2\"> \r\n          <option>胸部単純Ｘ線</option> \r\n          <option>腹部単純Ｘ線</option> \r\n        </select> \r\n      </div> \r\n      <br /> \r\n      <a mc-name=\"enter\" href=\"javascript:void(0)\" class=\"cmd-link\">入力</a> |  \r\n      <a mc-name=\"cancel\" href=\"javascript:void(0)\" class=\"cmd-link\">キャンセル</a>  \r\n</div>\r\n"

/***/ },
/* 116 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t<div mc-name=\"disp-area\"></div>\r\n\t<div mc-name=\"work-area\"></div>\r\n</div>\r\n"

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var mUtil = __webpack_require__(5);
	var ChargeDisp = __webpack_require__(118);
	var ChargeForm = __webpack_require__(120);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);

	exports.setup = function(dom, visitId, charge){
		if( dom.data("setup") ){
			throw new Error("duplicate setup in charge.js");
		}
		dom.data("setup", 1);
		// disp events
		dom.on("v7lug8he-start-edit", function(event){
			if( !charge ){
				return;
			}
			startEdit(dom, visitId, charge);
		});
		// form events
		dom.on("30g8sm2i-cancel", function(event){
			showDisp();
		});
		dom.on("30g8sm2i-modified", function(event, newCharge){
			charge = newCharge;
			showDisp();
		});
		// initial display
		showDisp();

		function showDisp(){
			dom.empty();
			dom.append(mkDisp(charge));
		}
	};

	function mkDisp(charge){
		return ChargeDisp.create(charge);
	}

	function startEdit(dom, visitId, charge){
		var meisai;
		task.run([
			function(done){
				service.calcMeisai(visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					meisai = result;
					done();
				});
			},
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.empty();
			dom.append(ChargeForm.create(meisai, charge));
		});
	}


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(119);
	var tmpl = hogan.compile(tmplSrc);
	var mUtil = __webpack_require__(5);

	exports.create = function(charge){
		if( charge ){
			charge = mUtil.assign({}, charge, {
				has_charge: true,
				charge_rep: mUtil.formatNumber(charge.charge)
			})
		} else {
			charge = { has_charge: false };
		}
		var dom = $(tmpl.render(charge));
		bindClick(dom);
		return dom;
	};

	function bindClick(dom){
		dom.click(function(event){
			dom.trigger("v7lug8he-start-edit");
		});
	}


/***/ },
/* 119 */
/***/ function(module, exports) {

	module.exports = "{{#has_charge}}\r\n\t<div mc-name=\"chargeWrapper\">\r\n\t\t請求額： <span mc-name=\"charge\">{{charge_rep}}</span> 円\r\n\t</div>\r\n{{/has_charge}}\r\n{{^has_charge}}\r\n\t<div mc-name=\"noChargeWrapper\">\r\n\t（未請求）\r\n\t</div>\r\n{{/has_charge}}\r\n"

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(121);
	var tmpl = hogan.compile(tmplSrc);
	var mUtil = __webpack_require__(5);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);

	var chargeInputSelector = "input[mc-name=newCharge]";
	var enterLinkSelector = "[mc-name=enterLink]"
	var cancelLinkSelector = "[mc-name=cancelLink]"

	exports.create = function(meisai, currentCharge){
		var data = {
			total_ten: mUtil.formatNumber(meisai.totalTen),
			futan_wari: meisai.futanWari,
			current_charge: currentCharge ? mUtil.formatNumber(currentCharge.charge) : "",
			calc_charge: meisai.charge
		};
		var dom = $(tmpl.render(data));
		dom.on("click", enterLinkSelector, function(event){
			event.preventDefault();
			doEnter(dom, currentCharge.visit_id);
		})
		dom.on("click", cancelLinkSelector, function(event){
			event.preventDefault();
			dom.trigger("30g8sm2i-cancel");
		})
		return dom;
	}

	function doEnter(dom, visitId){
		var input = dom.find(chargeInputSelector).val().trim();
		if( input === "" ){
			alert("金額が入力されていません。");
			return;
		}
		if( !/^\d+$/.test(input) ){
			alert("金額の入力が不適切です。");
			return;
		}
		input = +input;
		var newCharge;
		task.run([
			function(done){
				service.endExam(visitId, input, done);
			},
			function(done){
				service.getCharge(visitId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					newCharge = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			dom.trigger("30g8sm2i-modified", [newCharge]);
		});
	}


/***/ },
/* 121 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\t\r\n\t<div class=\"title\">請求額の変更</div>\r\n\t<div>診療報酬総点： {{total_ten}} 点</div>\r\n\t<div>負担割： {{futan_wari}} 割</div>\r\n\t<div>現在の請求額： {{current_charge}} 円</div>\r\n\t<form onsubmit=\"return false\">\r\n\t<div>変更後の請求額： <input mc-name=\"newCharge\" value=\"{{calc_charge}}\" size=\"4\"> 円</div>\r\n\t<div class=\"commandbox\">\r\n\t\t<button mc-name=\"enterLink\">入力</button>\r\n\t\t<button mc-name=\"cancelLink\">キャンセル</button>\r\n\t</div>\r\n\t</form>\r\n</div>\r\n"

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var moment = __webpack_require__(6);
	var ListPane = __webpack_require__(123);
	var AddPane = __webpack_require__(127);
	var EndPane = __webpack_require__(131);
	var EditPane = __webpack_require__(133);
	var ItemPane = __webpack_require__(135);
	var mConsts = __webpack_require__(8);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var conti = __webpack_require__(4);

	var tmplHtml = __webpack_require__(138);

	var workareaSelector = "> div > [mc-name=workarea]";
	var listLinkSelector = "> div > [mc-name=command-box] [mc-name=listLink]";
	var addLinkSelector = "> div > [mc-name=command-box] [mc-name=addLink]";
	var endLinkSelector = "> div > [mc-name=command-box] [mc-name=endLink]";
	var editLinkSelector = "> div > [mc-name=command-box] [mc-name=editLink]";

	exports.setup = function(dom){
		if( dom.data("setup") ){
			throw new Error("duplicate setup for disease");
		}
		dom.data("setup", 1);

		var patientId = 0;
		dom.listen("rx-start-page", function(appData){
			patientId = appData.currentPatientId;
			if( patientId > 0 ){
				dom.html(tmplHtml);
				listPane(dom, patientId, appData.diseases);
			} else {
				dom.html("");
			}
		});
		dom.on("click", listLinkSelector, function(event){
			event.preventDefault();
			listPane(dom, patientId);
		})
		dom.on("click", addLinkSelector, function(event){
			event.preventDefault();
			addPane(dom, patientId);
		})
		dom.on("click", endLinkSelector, function(event){
			event.preventDefault();
			endPane(dom, patientId);
		})
		dom.on("click", editLinkSelector, function(event){
			event.preventDefault();
			editPane(dom, patientId);
		});
		// from list disease pane
		dom.on("3dynuzj3-selected", function(event, disease){
			itemPane(dom, disease);
		});
		// from add disease pane
		dom.on("r6ihx2oq-entered", function(event, newDisease, message){
			addPane(dom, patientId, message);
		});
		// from end disease pane
		dom.on("gvr59xqp-modified", function(event, modifiedDiseases){
			endPane(dom, patientId);
		});
		// from edi disease pane
		dom.on("kodrsu7v-selected", function(event, disease){
			itemPane(dom, disease);
		});
		// from item disease pane
		dom.on("cirqgerl-modified", function(event, modifiedDisease){
			listPane(dom, patientId);
		});
		dom.on("cirqgerl-deleted", function(event, deletedDiseaseId){
			listPane(dom, patientId);
		});
	};

	function listPane(dom, patientId, optDiseases){
		if( optDiseases ){
			invoke(optDiseases);
		} else {
			var diseases;
			task.run([
				function(done){
					service.listCurrentFullDiseases(patientId, function(err, result){
						if( err ){
							alert(err);
							return;
						}
						diseases = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				invoke(diseases);
			})
		}

		function invoke(diseases){
			var wa = dom.find(workareaSelector).empty();
			wa.append(ListPane.create(diseases));
		}
	}

	function addPane(dom, patientId, optMessage){
		var wa = dom.find(workareaSelector);
		wa.empty();
		wa.append(AddPane.create(patientId, optMessage));
	}

	function endPane(dom, patientId){
		var diseases;
		task.run([
			function(done){
				service.listCurrentFullDiseases(patientId, function(err, result){
					if( err ){
						alert(err);
						return;
					}
					diseases = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			var wa = dom.find(workareaSelector);
			wa.empty();
			wa.append(EndPane.create(diseases));
		})
	}

	function editPane(dom, patientId){
		var wa = dom.find(workareaSelector);
		var allDiseases;
		task.run([
			function(done){
				service.listAllFullDiseases(patientId, function(err, result){
					if( err ){
						done(err);
						return;
					}
					allDiseases = result;
					done();
				})
			}
		], function(err){
			wa.empty();
			wa.append(EditPane.create(allDiseases));
		})
	}

	function itemPane(dom, disease){
		var wa = dom.find(workareaSelector);
		wa.empty();
		wa.append(ItemPane.create(disease));
	}


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);

	var tmplSrc = __webpack_require__(124);
	var tmpl = hogan.compile(tmplSrc);

	var DiseaseListItem = __webpack_require__(125);

	exports.create = function(list){
		var dom = $(tmpl.render({}));
		var wrapper = dom.find("[mc-name=list]");
		list.forEach(function(disease){
			var tr = DiseaseListItem.create(disease);
			wrapper.append(tr);
		});
		return dom;
	};



/***/ },
/* 124 */
/***/ function(module, exports) {

	module.exports = "<table class=\"list\" style=\"font-size:13px;\">\r\n\t<tbody mc-name=\"list\">\r\n\t</tbody>\r\n</table>\r\n"

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var kanjidate = __webpack_require__(16);
	var mUtil = __webpack_require__(5);

	var tmplSrc = __webpack_require__(126);
	var tmpl = hogan.compile(tmplSrc);

	exports.create = function(disease){
		var data = mUtil.assign({}, disease, {
			label: mUtil.diseaseFullName(disease),
			start_date_label: kanjidate.format("{G:a}{N}.{M}.{D}.", disease.start_date)
		});
		var dom = $(tmpl.render(data));
		bindClick(dom, disease);
		return dom;
	}

	function bindClick(dom, disease){
		dom.on("click", function(event){
			event.preventDefault();
			dom.trigger("3dynuzj3-selected", [disease]);
		});
	}



/***/ },
/* 126 */
/***/ function(module, exports) {

	module.exports = "<tr>\r\n\t<td>\r\n\t\t<a href=\"javascript:void(0)\" class=\"disease-full-name\">\r\n\t\t\t{{label}}\r\n\t\t</a>\r\n\t\t<span style=\"color:#999\">\r\n\t\t\t({{start_date_label}})\r\n\t\t</span>\r\n\t</td>\r\n</tr>\r\n"

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(128);
	var tmpl = hogan.compile(tmplSrc);
	var resultTmplSrc = __webpack_require__(129);
	var resultTmpl = hogan.compile(resultTmplSrc);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var conti = __webpack_require__(4);
	var moment = __webpack_require__(6);
	var DateBinder = __webpack_require__(130);
	var mUtil = __webpack_require__(5);

	var gengouSelector = "> .start-date select[mc-name=gengou]";
	var nenInputSelector = "> .start-date input[mc-name=nen]";
	var monthInputSelector = "> .start-date input[mc-name=month]";
	var dayInputSelector = "> .start-date input[mc-name=day]";

	var messageSelector = "> [mc-name=message]";
	var dispSelector = "> [mc-name=disp-area] [mc-name=name]";
	var enterLinkSelector = "> .commandbox [mc-name=enterLink]";
	var addSuspectLinkSelector = "> .commandbox [mc-name=suspectLink]";
	var deleteAdjLinkSelector = "> .commandbox [mc-name=deleteAdjLink]";
	var searchFormSelector = "> form[mc-name=search-form]";
	var exampleLinkSelector = "> form[mc-name=search-form] [mc-name=exampleLink]";
	var searchModeInput = "> form[mc-name=search-form] input[type=radio][name=search-kind]"
	var searchTextSelector = "> form[mc-name=search-form] input[mc-name=searchText]";
	var searchLinkSelector = "> form[mc-name=search-form] [mc-name=searchLink]";
	var searchResultSelector = "> form[mc-name=search-form] select[mc-name=searchResult]";

	var diseaseExamplesSrc = [
	    '急性上気道炎',
	    '急性気管支炎',
	    'アレルギー性鼻炎',
	    'アレルギー性結膜炎',
	    '気管支喘息',
	    '急性胃腸炎',
	    '頭痛',
	    '糖尿病',
	    ['糖尿病の疑い', { disease:'糖尿病', adj:['の疑い'] }],
	    'インフルエンザＡ型',
	    ['(の疑い)', { adj:['の疑い'] }]
	];

	var diseaseExamplesData = parseDiseaseExamplesSrc(diseaseExamplesSrc);

	exports.create = function(patientId, optMessage){
		var dom = $(tmpl.render({message: optMessage}));
		var ctx = {
			shoubyoumeiMaster: undefined,
			shuushokugoMasters: [],
			dateBinder: DateBinder.bind(mkStartDateMap(dom)),
			patientId: patientId
		};
		ctx.dateBinder.setDate(moment());
		bindEnter(dom, ctx);
		bindAddSusp(dom, ctx);
		bindDeleteAdj(dom, ctx);
		bindSearch(dom, ctx.dateBinder);
		bindExampleLink(dom);
		bindSearchResult(dom, ctx);
		fillExampleOptions(dom);
		return dom;
	};

	function mkStartDateMap(dom){
		return {
			gengouSelect: dom.find(gengouSelector),
			nenInput: dom.find(nenInputSelector),
			monthInput: dom.find(monthInputSelector),
			dayInput: dom.find(dayInputSelector)
		};
	}

	function parseDiseaseExamplesSrc(src){
		return src.map(function(item){
			if( item instanceof Array ){
				return {
					label: item[0],
					config: item[1]
				}
			} else {
				return {
					label: item,
					config: { disease: item, adj: [] }
				}
			}
		});
	}

	function fillExampleOptions(dom){
		var select = dom.find(searchResultSelector);
		var data = diseaseExamplesData;
		select.empty();
		data.forEach(function(item){
			var opt = $("<option>X</option>");
			opt.text(item.label);
			opt.data("config", item.config);
			opt.data("mode", "example");
			select.append(opt);
		})
	}

	function bindEnter(dom, ctx){
		dom.on("click", enterLinkSelector, function(event){
			event.preventDefault();
			if( !ctx.shoubyoumeiMaster ){
				alert("傷病名が指定されていません。");
				return;
			}
			var shoubyoumeicode = ctx.shoubyoumeiMaster.shoubyoumeicode;
			var patientId = ctx.patientId;
			var startDate = getStartDate(ctx.dateBinder);
			if( !startDate ){
				alert("開始日の設定が不適切です。");
				return;
			}
			var shuushokugocodes = ctx.shuushokugoMasters.map(function(master){
				return master.shuushokugocode;
			});
			var diseaseId, newDisease;
			task.run([
				function(done){
					service.enterDisease(shoubyoumeicode, patientId, startDate, shuushokugocodes, function(err, result){
						if( err ){
							done(err);
							return;
						}
						diseaseId = result;
						done();
					})
				},
				function(done){
					service.getFullDisease(diseaseId, function(err, result){
						if( err ){
							done(err);
							return;
						}
						newDisease = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				var name = dom.find(dispSelector).text();
				var msg = name + "が入力されました。";
				dom.trigger("r6ihx2oq-entered", [newDisease, msg]);
			})
		})
	}

	function bindAddSusp(dom, ctx){
		dom.on("click", addSuspectLinkSelector, function(event){
			event.preventDefault();
			var master;
			task.run([
				function(done){
					service.getShuushokugoMasterByName("の疑い", function(err, result){
						if( err ){
							done(err);
							return;
						}
						master = result;
						done();
					});
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				ctx.shuushokugoMasters.push(master);
				updateDisp(dom, ctx);
			})
		})
	}

	function bindDeleteAdj(dom, ctx){
		dom.on("click", deleteAdjLinkSelector, function(event){
			event.preventDefault();
			ctx.shuushokugoMasters = [];
			updateDisp(dom, ctx);
		})
	}

	function searchShoubyoumei(dom, text, at){
		var searchResult;
		task.run([
			function(done){
				service.searchShoubyoumeiMaster(text, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					searchResult = result;
					done();
				});
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			var list = searchResult.map(function(item){
				return {
					name: item.name,
					mode: "disease",
					code: item.shoubyoumeicode
				};
			});
			var resultSelect = dom.find(searchResultSelector);
			resultSelect.html(resultTmpl.render({list: list}));
		});
	}

	function searchShuushokugo(dom, text){
		var searchResult;
		task.run([
			function(done){
				service.searchShuushokugoMaster(text, function(err, result){
					if( err ){
						done(err);
						return;
					}
					searchResult = result;
					done();
				});
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			var list = searchResult.map(function(item){
				return {
					name: item.name,
					mode: "adj",
					code: item.shuushokugocode
				};
			});
			var resultSelect = dom.find(searchResultSelector);
			resultSelect.html(resultTmpl.render({list: list}));
		});
	}

	function getStartDate(dateBinder){
		var optDate = dateBinder.getDate();
		if( !optDate.ok ){
			alert("開始日が適切に設定されていません。\n" + optDate.error);
			return null;
		} else {
			return optDate.sqlDate;
		}
	}

	function bindSearch(dom, dateBinder){
		dom.on("submit", searchFormSelector, function(event){
			event.preventDefault();
			var at = getStartDate(dateBinder);
			if( !at ){
				return;
			}
			var text = dom.find(searchTextSelector).val().trim();
			if( text === "" ){
				return;
			}
			var mode = dom.find(searchModeInput+":checked").val();
			if( mode === "disease" ){
				searchShoubyoumei(dom, text, at);
			} else if( mode === "adj" ){
				searchShuushokugo(dom, text);
			} else {
				alert("unknown search mode: " + mode);
				return;
			}
		})
	}

	function bindExampleLink(dom){
		dom.on("click", exampleLinkSelector, function(event){
			event.preventDefault();
			fillExampleOptions(dom);
			// var select = dom.find(searchResultSelector);
			// fillExampleOptions(select);
		});
	}

	function updateDisp(dom, ctx){
		var disease = {
			name: ctx.shoubyoumeiMaster ? ctx.shoubyoumeiMaster.name : "",
			adj_list: ctx.shuushokugoMasters
		};
		var fullName = mUtil.diseaseFullName(disease);
		dom.find(dispSelector).text(fullName);
	}

	function selectShoubyoumei(dom, code, ctx){
		var at = getStartDate(ctx.dateBinder);
		if( !at ){
			return;
		}
		var master;
		task.run([
			function(done){
				service.getShoubyoumeiMaster(code, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					master = result;
					done();
				})
			}
		], function(err){
			if( err ){
				console.log(err);
				alert("この傷病名は、開始日に有効でありません。");
				return;
			}
			ctx.shoubyoumeiMaster = master;
			updateDisp(dom, ctx);
		})
	}

	function selectShuushokugo(dom, code, ctx){
		var master;
		task.run([
			function(done){
				service.getShuushokugoMaster(code, function(err, result){
					if( err ){
						done(err);
						return;
					}
					master = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			ctx.shuushokugoMasters.push(master);
			updateDisp(dom, ctx);
		})
	}

	function selectExample(dom, config, ctx){
		var shoubyoumeiMaster = null;
		var shuushokugoMasters = [];
		var at = getStartDate(ctx.dateBinder);
		if( !at ){
			return;
		}
		task.run([
			function(done){
				if( config.disease ){
					service.getShoubyoumeiMasterByName(config.disease, at, function(err, result){
						if( err ){
							done(err);
							return;
						}
						shoubyoumeiMaster = result;
						done();
					})
				} else {
					done();
				}
			},
			function(done){
				if( config.adj && config.adj.length > 0 ){
					conti.forEach(config.adj, function(name, done){
						service.getShuushokugoMasterByName(name, function(err, result){
							if( err ){
								done(err);
								return;
							}
							shuushokugoMasters.push(result);
							done();
						})
					}, done);
				} else {
					done();
				}
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			ctx.shoubyoumeiMaster = shoubyoumeiMaster;
			ctx.shuushokugoMasters = shuushokugoMasters;
			updateDisp(dom, ctx);
		});
	}

	function bindSearchResult(dom, ctx){
		dom.on("change", searchResultSelector, function(){
			var opt = dom.find(searchResultSelector + " option:selected");
			var code = opt.val();
			var mode = opt.data("mode");
			if( mode === "disease" ){
				selectShoubyoumei(dom, code, ctx);
			} else if( mode === "adj" ){
				selectShuushokugo(dom, code, ctx);
			} else if( mode === "example" ){
				selectExample(dom, opt.data("config"), ctx);
			} else {
				alert("invalid option mode: " + mode);
				return;
			}
		})
	}



/***/ },
/* 128 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n    {{#message}}\r\n    <div mc-name=\"message\" class=\"message\"\r\n         style=\"border:1px solid #990;color:#990;margin:4px;padding:4px;\">\r\n         {{message}}\r\n    </div>\r\n    {{/message}}\r\n    <div style=\"font-size:13px\" mc-name=\"disp-area\">\r\n        名前：<span mc-name=\"name\"></span>\r\n    </div>\r\n    <div class=\"start-date\" style=\"font-size:13px\">\r\n        <select mc-name=\"gengou\" style=\"width:auto\">\r\n            <option value=\"平成\">平成</option>\r\n        </select><input \r\n\t\t\ttype=\"text\" mc-name=\"nen\" class=\"disease-nen alpha\">年<input \r\n\t\t\ttype=\"text\" mc-name=\"month\" class=\"disease-month alpha\">月<input \r\n\t\t\ttype=\"text\" mc-name=\"day\" class=\"disease-day alpha\">日\r\n    </div>\r\n    <div class=\"commandbox\">\r\n        <button mc-name=\"enterLink\">入力</button>\r\n        <a mc-name=\"suspectLink\" href=\"javascript:void(0)\" class=\"cmd-link\" style=\"font-size:90%\">の疑い</a> |\r\n\t\t<a mc-name=\"deleteAdjLink\" href=\"javascript:void(0)\" class=\"cmd-link\" style=\"font-size:90%\">修飾語削除</a>\r\n    </div>\r\n    <hr/>\r\n    <form mc-name=\"search-form\" onsubmit=\"return false\">\r\n        <div>\r\n            <input mc-name=\"searchText\" class=\"kanji\" style=\"width:100px;\">\r\n            <button mc-name=\"searchLink\">検索</button>\r\n            <a mc-name=\"exampleLink\" href=\"javascript:void(0)\" class=\"cmd-link\">例</a>\r\n        </div>\r\n        <div mc-name=\"modeWrapper\">\r\n            <input type=\"radio\" name=\"search-kind\" value=\"disease\" checked>病名\r\n            <input type=\"radio\" name=\"search-kind\" value=\"adj\">修飾語\r\n        </div>\r\n        <div>\r\n            <select mc-name=\"searchResult\" size=\"11\"></select>\r\n        </div>\r\n    </form>\r\n</div>\r\n"

/***/ },
/* 129 */
/***/ function(module, exports) {

	module.exports = "{{#list}}\r\n\t<option value=\"{{code}}\" data-mode=\"{{mode}}\">{{name}}</option>\r\n{{/list}}"

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var kanjidate = __webpack_require__(16);
	var moment = __webpack_require__(6);

	exports.bind = function(domMap){
		return new DateBinder(domMap);
	};

	function DateBinder(domMap){
		this.domMap = domMap;
		if( "dayLabel" in domMap ){
			this.bindDayClick(domMap.dayLabel);
		}
		if( "monthLabel" in domMap ){
			this.bindMonthClick(domMap.monthLabel);
		}
		if( "nenLabel" in domMap ){
			this.bindNenClick(domMap.nenLabel);
		}
		if( "weekLink" in domMap ){
			this.bindWeekClick(domMap.weekLink);
		}
		if( "todayLink" in domMap ){
			this.bindTodayClick(domMap.todayLink);
		}
		if( "monthLastDayLink" in domMap ){
			this.bindMonthLastDayClick(domMap.monthLastDayLink);
		}
		if( "lastMonthLastDayLink" in domMap ){
			this.bindLastMonthLastDayClick(domMap.lastMonthLastDayLink);
		}
	}

	function analyzeDate(m){
		var result = {
			year: m.year(),
			month: m.month() + 1,
			day: m.date()
		};
		var g = kanjidate.toGengou(result.year, result.month, result.day);
		result.gengou = g.gengou;
		result.nen = g.nen;
		return result;
	}

	DateBinder.prototype.bindDayClick = function(dayLabel){
		var self = this;
		dayLabel.on("click", function(event){
			event.preventDefault();
			var dateOpt = self.getDate();
			if( !dateOpt.ok ){
				return;
			}
			var m = dateOpt.date;
			var amount = 1;
			if( event.shiftKey ){
				amount = -amount;
			}
			m.add(amount, "days");
			self.setDate(m);
		});
		return this;
	}

	DateBinder.prototype.bindMonthClick = function(monthLabel){
		var self = this;
		monthLabel.on("click", function(event){
			event.preventDefault();
			var dateOpt = self.getDate();
			if( !dateOpt.ok ){
				return;
			}
			var m = dateOpt.date;
			var amount = 1;
			if( event.shiftKey ){
				amount = -amount;
			}
			m.add(amount, "months");
			self.setDate(m);
		});
		return this;
	}

	DateBinder.prototype.bindNenClick = function(nenLabel){
		var self = this;
		nenLabel.on("click", function(event){
			event.preventDefault();
			var dateOpt = self.getDate();
			if( !dateOpt.ok ){
				return;
			}
			var m = dateOpt.date;
			var amount = 1;
			if( event.shiftKey ){
				amount = -amount;
			}
			m.add(amount, "years");
			self.setDate(m);
		});
		return this;
	}

	DateBinder.prototype.bindWeekClick = function(weekLink){
		var self = this;
		weekLink.on("click", function(event){
			event.preventDefault();
			var dateOpt = self.getDate();
			if( !dateOpt.ok ){
				return;
			}
			var m = dateOpt.date;
			var amount = 1;
			if( event.shiftKey ){
				amount = -amount;
			}
			m.add(amount, "weeks");
			self.setDate(m);
		});
		return this;
	}

	DateBinder.prototype.bindTodayClick = function(todayLink){
		var self = this;
		todayLink.on("click", function(event){
			event.preventDefault();
			self.setDate(moment());
		});
		return this;
	}

	DateBinder.prototype.bindMonthLastDayClick = function(link){
		var self = this;
		link.on("click", function(event){
			event.preventDefault();
			var dateOpt = self.getDate();
			if( !dateOpt.ok ){
				return;
			}
			var m = dateOpt.date;
			m.date(1).add(1, "months").add(-1, "days");
			self.setDate(m);
		});
		return this;
	}

	DateBinder.prototype.bindLastMonthLastDayClick = function(link){
		var self = this;
		link.on("click", function(event){
			event.preventDefault();
			var m = moment();
			m.date(1).add(-1, "days");
			self.setDate(m);
		});
		return this;
	}

	DateBinder.prototype.getGengou = function(){
		return this.domMap.gengouSelect.val();
	}

	DateBinder.prototype.setGengou = function(gengou){
		this.domMap.gengouSelect.val(gengou);
		return this;
	}

	DateBinder.prototype.getNen = function(){
		return this.domMap.nenInput.val();
	}

	DateBinder.prototype.setNen = function(nen){
		this.domMap.nenInput.val(nen);
		return this;
	}

	DateBinder.prototype.getMonth = function(){
		return this.domMap.monthInput.val();
	}

	DateBinder.prototype.setMonth = function(month){
		this.domMap.monthInput.val(month);
		return this;
	}

	DateBinder.prototype.getDay = function(){
		return this.domMap.dayInput.val();
	}

	DateBinder.prototype.setDay = function(day){
		this.domMap.dayInput.val(day);
		return this;
	}

	DateBinder.prototype.setDate = function(m){
		var d = analyzeDate(m);
		this.setGengou(d.gengou);
		this.setNen(d.nen);
		this.setMonth(d.month);
		this.setDay(d.day);
		return this;
	}

	DateBinder.prototype.getDate = function(){
		var map = this.domMap;
		var gengou = this.getGengou();
		var nen = this.getNen();
		var month = this.getMonth();
		var day = this.getDay();
		var err = [];
		var allDigits = /^\d+$/;
		if( !allDigits.test(nen) ){
			err.push("年の入力が適切でありません。");
		}
		if( !allDigits.test(month) ){
			err.push("月の入力が適切でありません。");
		}
		if( !allDigits.test(day) ){
			err.push("日の入力が適切でありません。");
		}
		var year = kanjidate.fromGengou(gengou, +nen);
		var m = moment({year: year, month: month-1, day: day});
		if( err.length > 0 ){
			return {
				ok: false,
				error: err.join("\n"),
				isEmpty: (nen === "" && month === "" && day === "")
			};
		} else {
			return {
				ok: true,
				date: m,
				sqlDate: m.format("YYYY-MM-DD")
			}
		}
	}

	DateBinder.prototype.empty = function(gengouOpt){
		var map = this.domMap;
		if( gengouOpt ){
			map.gengouSelect.val(gengouOpt);
		}
		map.nenInput.val("");
		map.monthInput.val("");
		map.dayInput.val("");
		return this;
	}

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(132);
	var tmpl = hogan.compile(tmplSrc);
	var mUtil = __webpack_require__(5);
	var kanjidate = __webpack_require__(16);
	var DateBinder = __webpack_require__(130);
	var moment = __webpack_require__(6);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var conti = __webpack_require__(4);
	var mConsts = __webpack_require__(8);

	var diseaseCheckboxSelector = "> .list input[type=checkbox][name=disease]";
	var endDateGengouSelector = "> .end-date select[mc-name=gengou]";
	var endDateNenInputSelector = "> .end-date input[mc-name=nen]";
	var endDateNenLabelSelector = "> .end-date [mc-name=nenLabel]";
	var endDateMonthInputSelector = "> .end-date input[mc-name=month]";
	var endDateMonthLabelSelector = "> .end-date [mc-name=monthLabel]"
	var endDateDayInputSelector = "> .end-date input[mc-name=day]";
	var endDateDayLabelSelector = "> .end-date [mc-name=dayLabel]";
	var endDateWeekLinkSelector = "> .end-date [mc-name=weekLabel]";
	var endDateTodayLinkSelector = "> .end-date [mc-name=todayLabel]";
	var endDateMonthLastDayLinkSelector = "> .end-date [mc-name=monthLastDayLabel]";
	var endDateLastMonthLastDayLinkSelector = "> .end-date [mc-name=lastMonthLastDayLabel]";
	var reasonRadioSelector = "> [mc-name=end-reason-area] input[type=radio][name=end-reason]";
	var enterLinkSelector = "> .commandbox [mc-name=enterLink]";

	exports.create = function(diseases){
		var data = {
			diseases: diseasesData(diseases)
		};
		var dom = $(tmpl.render(data));
		var ctx = {
			dateBinder: setupDateBinder(dom),
		}
		ctx.dateBinder.setDate(moment());
		bindSelectionChange(dom, ctx);
		bindEnter(dom, ctx);
		return dom;
	}

	function diseasesData(diseases){
		return diseases.map(function(d){
			return {
				disease_id: d.disease_id,
				name_label: mUtil.diseaseFullName(d),
				start_date_label: kanjidate.format(kanjidate.f3, d.start_date),
				start_date: d.start_date
			}
		})
	}

	function setupDateBinder(dom){
		var map = {
			gengouSelect: dom.find(endDateGengouSelector),
			nenInput: dom.find(endDateNenInputSelector),
			nenLabel: dom.find(endDateNenLabelSelector),
			monthInput: dom.find(endDateMonthInputSelector),
			monthLabel: dom.find(endDateMonthLabelSelector),
			dayInput: dom.find(endDateDayInputSelector),
			dayLabel: dom.find(endDateDayLabelSelector),
			weekLink: dom.find(endDateWeekLinkSelector),
			todayLink: dom.find(endDateTodayLinkSelector),
			monthLastDayLink: dom.find(endDateMonthLastDayLinkSelector),
			lastMonthLastDayLink: dom.find(endDateLastMonthLastDayLinkSelector)
		}
		return DateBinder.bind(map);
	}

	function bindSelectionChange(dom, ctx){
		dom.on("change", diseaseCheckboxSelector, function(){
			var last = null;
			dom.find(diseaseCheckboxSelector + ":checked").each(function(){
				var startDate = $(this).data("start-date");
				if( !last || startDate > last ){
					last = startDate;
				}
			});
			if( last ){
				ctx.dateBinder.setDate(moment(last));
			} else {
				ctx.dateBinder.setDate(moment());
			}
		})
	}

	function hasSusp(fullDisease){
		return fullDisease.adj_list.some(function(adj){
			console.log(adj.name);
			return adj.name == "の疑い";
		})
	}

	function fixEndReason(fullDisease, proposedReason){
		if( proposedReason === mConsts.DiseaseEndReasonCured && hasSusp(fullDisease) ){
			return mConsts.DiseaseEndReasonStopped;
		}
		return proposedReason;
	}

	function bindEnter(dom, ctx){
		dom.on("click", enterLinkSelector, function(event){
			event.preventDefault();
			var diseaseIds = dom.find(diseaseCheckboxSelector + ":checked").map(function(){
				return +$(this).val();
			}).get();
			var dateOpt = ctx.dateBinder.getDate();
			if( !dateOpt.ok ){
				alert(dateOpt.error);
				return;
			}
			var endDate = dateOpt.sqlDate;
			var reason = dom.find(reasonRadioSelector + ":checked").val();
			var diseases = [], newDiseases = [];
			task.run([
				function(done){
					conti.forEach(diseaseIds, function(diseaseId, done){
						service.getFullDisease(diseaseId, function(err, result){
							if( err ){
								done(err);
								return;
							}
							diseases.push(result);
							done();
						})
					}, done);
				},
				function(done){
					diseases.forEach(function(disease){
						disease.end_reason = fixEndReason(disease, reason);
						disease.end_date = endDate;
					});
					service.batchUpdateDiseases(diseases, done);
				},
				function(done){
					conti.forEach(diseaseIds, function(diseaseId, done){
						service.getFullDisease(diseaseId, function(err, result){
							if( err ){
								done(err);
								return;
							}
							newDiseases.push(result);
							done();
						})
					}, done);
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("gvr59xqp-modified", [newDiseases]);
			})
		})
	}


/***/ },
/* 132 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t<table class=\"list\">\r\n\t    <tbody mc-name=\"tbody\">\r\n\t\t\t{{#diseases}}\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<input type=\"checkbox\" name=\"disease\" value=\"{{disease_id}}\" data-start-date=\"{{start_date}}\" />\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t{{name_label}} <span style='color:#999'>({{start_date_label}})</span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t{{/diseases}}\r\n\t    </tbody>\r\n\t</table>\r\n\r\n\t<div class=\"end-date\" style=\"font-size:13px\">\r\n\t\t<select mc-name=\"gengou\" style=\"width:auto\">\r\n\t\t\t<option value=\"平成\">平成</option>\r\n\t\t</select><!--\r\n\t\t--><input type=\"text\" mc-name=\"nen\" class=\"disease-nen alpha\" /><!--\r\n\t\t--><a mc-name=\"nenLabel\" href=\"javascript:void(0)\" class=\"cmd-link\">年</a><!--\r\n\t\t--><input type=\"text\" mc-name=\"month\" class=\"disease-month alpha\"/><!--\r\n\t\t--><a mc-name=\"monthLabel\" href=\"javascript:void(0)\" class=\"cmd-link\">月</a><!--\r\n\t\t--><input type=\"text\" mc-name=\"day\" class=\"disease-day alpha\"/><!--\r\n\t\t--><a mc-name=\"dayLabel\" href=\"javascript:void(0)\" class=\"cmd-link\">日</a>\r\n\t\t<div>\r\n\t\t\t<a mc-name=\"weekLabel\" href=\"javascript:void(0)\" class=\"cmd-link\">週</a> |\r\n\t\t\t<a mc-name=\"todayLabel\" href=\"javascript:void(0)\" class=\"cmd-link\">今日</a> |\r\n\t\t\t<a mc-name=\"monthLastDayLabel\" href=\"javascript:void(0)\" class=\"cmd-link\">月末</a> |\r\n\t\t\t<a mc-name=\"lastMonthLastDayLabel\" href=\"javascript:void(0)\" class=\"cmd-link\">先月末</a>\r\n\t\t</div>\t\r\n\t</div>\r\n\t<div mc-name=\"end-reason-area\">\r\n\t    <form style=\"margin:0;padding:0\">\r\n\t    転帰：<input type=\"radio\" value=\"C\" name=\"end-reason\" checked/>治癒<!--\r\n\t\t--><input type=\"radio\" value=\"S\" name=\"end-reason\"/>中止<!--\r\n\t\t--><input type=\"radio\" value=\"D\" name=\"end-reason\"/>死亡\r\n\t    </form>\r\n\t</div>\r\n\t<div class=\"commandbox\">\r\n\t\t<button mc-name=\"enterLink\">入力</button>\r\n\t</div>\r\n</div>\r\n"

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(134);
	var tmpl = hogan.compile(tmplSrc);
	var mUtil = __webpack_require__(5);
	var kanjidate = __webpack_require__(16);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);

	var dispNameSelector = "> .disease-editor [mc-name=name]";
	var dispStartDateSelector = "> .disease-editor [mc-name=startDate]";
	var dispEndReasonSelector = "> .disease-editor [mc-name=endReason]";
	var dispEndDateSelector = "> .disease-editor [mc-name=endDate]";
	var diseaseListSelector = "> .disease-list select[mc-name=select]";
	var editLinkSelector = "> .commandbox [mc-name=editLink]";

	exports.create = function(allDiseases){
		var data = {
			diseases: cvtAllDiseasesToData(allDiseases)
		}
		var dom = $(tmpl.render(data));
		var ctx = {
			disease: undefined
		}
		bindEdit(dom, ctx);
		bindSelectChange(dom, ctx);
		return dom;
	};

	function cvtAllDiseasesToData(allDiseases){
		return allDiseases.map(function(item){
			return {
				disease_id: item.disease_id,
				end_reason_label: mUtil.diseaseEndReasonToKanji(item.end_reason),
				name_label: mUtil.diseaseFullName(item),
				start_date_label: kanjidate.format(kanjidate.f3, item.start_date)
			}
		})
	}

	function endDateRep(endDate){
		if( endDate === "0000-00-00" ){
			return "";
		} else {
			return kanjidate.format(kanjidate.f5, endDate);
		}
	}

	function updateDisp(dom, disease){
		dom.find(dispNameSelector).text(mUtil.diseaseFullName(disease));
		dom.find(dispStartDateSelector).text(kanjidate.format(kanjidate.f5, disease.start_date));
		dom.find(dispEndReasonSelector).text(mUtil.diseaseEndReasonToKanji(disease.end_reason));
		dom.find(dispEndDateSelector).text(endDateRep(disease.end_date));
	}

	function bindEdit(dom, ctx){
		dom.on("click", editLinkSelector, function(event){
			event.preventDefault();
			if( !ctx.disease ){
				alert("傷病名が選択されていません。");
				return;
			}
			dom.trigger("kodrsu7v-selected", [ctx.disease]);
		});
	}

	function bindSelectChange(dom, ctx){
		dom.on("change", diseaseListSelector, function(){
			var diseaseId = $(this).val();
			var disease;
			task.run([
				function(done){
					service.getFullDisease(diseaseId, function(err, result){
						if( err ){
							done(err);
							return;
						}
						disease = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				ctx.disease = disease;
				updateDisp(dom, disease);
			})
		});
	}


/***/ },
/* 134 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n\t<div class=\"disease-editor\">\r\n\t\t<table>\r\n\t\t\t<tbody>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td style=\"text-align:right\">名前：</td><td><span mc-name=\"name\"></span></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td style=\"text-align:right\">開始日：</td><td><span mc-name=\"startDate\"></span></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td style=\"text-align:right\">転帰：</td><td><span mc-name=\"endReason\"></span></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td style=\"text-align:right\">終了日：</td><td><span mc-name=\"endDate\"></span></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</tbody>\r\n\t\t</table>\r\n\t</div>\r\n\t<div class=\"commandbox\">\r\n\t\t<button mc-name=\"editLink\">編集</button>\r\n\t</div>\r\n\r\n\t<div class=\"disease-list\">\r\n\t\t<select mc-name=\"select\" size=\"10\">\r\n\t\t\t{{#diseases}}\r\n\t\t\t\t<option value=\"{{disease_id}}\">\r\n\t\t\t\t\t[{{end_reason_label}}] {{name_label}} ({{start_date_label}})\r\n\t\t\t\t</option>\r\n\t\t\t{{/diseases}}\r\n\t\t</select>\r\n\t</div>\r\n</div>"

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(136);
	var resultTmplSrc = __webpack_require__(137);
	var resultTmpl = hogan.compile(resultTmplSrc);
	var mUtil = __webpack_require__(5);
	var kanjidate = __webpack_require__(16);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var DateBinder = __webpack_require__(130);
	var moment = __webpack_require__(6);

	var nameSelector = "> [mc-name=name-area] [mc-name=name]";
	var startDateGengouSelector = "> .start-date select[mc-name=startDateGengou]";
	var startDateNenInputSelector = "> .start-date input[mc-name=startDateNen]";
	var startDateMonthInputSelector = "> .start-date input[mc-name=startDateMonth]";
	var startDateDayInputSelector = "> .start-date input[mc-name=startDateDay]";
	var endDateGengouSelector = "> .end-date select[mc-name=endDateGengou]";
	var endDateNenInputSelector = "> .end-date input[mc-name=endDateNen]";
	var endDateMonthInputSelector = "> .end-date input[mc-name=endDateMonth]";
	var endDateDayInputSelector = "> .end-date input[mc-name=endDateDay]";
	var endReasonSelector = "> [mc-name=end-reason-area] select[mc-name=endReason]";
	var enterLinkSelector = "> .command-box [mc-name=enterLink]";
	var deleteAdjLinkSelector = "> .command-box [mc-name=deleteAdjLink]";
	var deleteLinkSelector = "> .command-box [mc-name=deleteLink]";
	var searchFormSelector = "> form[mc-name=search-form]";
	var searchTextInputSelector = "> form[mc-name=search-form] input[mc-name=searchText]";
	var searchModeInputSelector = "> form[mc-name=search-form] input[type=radio][name=search-kind]";
	var searchResultSelector = "> form[mc-name=search-form] select[mc-name=searchResult]";

	exports.create = function(disease){
		var dom = $(tmplSrc);
		var ctx = {
			diseaseId: disease.disease_id,
			patientId: disease.patient_id,
			startDate: disease.start_date,
			endDate: disease.end_date,
			endReason: disease.end_reason,
			shoubyoumeiMaster: disease,
			shuushokugoMasters: disease.adj_list,
			startDateBinder: makeStartDateBinder(dom),
			endDateBinder: makeEndDateBinder(dom)
		}
		updateDisp(dom, ctx);
		bindEnter(dom, ctx);
		bindDeleteAdj(dom, ctx);
		bindDelete(dom, ctx);
		bindSearch(dom, ctx);
		bindSearchSelect(dom, ctx);
		return dom;
	};

	function makeStartDateBinder(dom){
		var map = {
			gengouSelect: dom.find(startDateGengouSelector),
			nenInput: dom.find(startDateNenInputSelector),
			monthInput: dom.find(startDateMonthInputSelector),
			dayInput: dom.find(startDateDayInputSelector)
		};
		return DateBinder.bind(map);
	}

	function makeEndDateBinder(dom){
		var map = {
			gengouSelect: dom.find(endDateGengouSelector),
			nenInput: dom.find(endDateNenInputSelector),
			monthInput: dom.find(endDateMonthInputSelector),
			dayInput: dom.find(endDateDayInputSelector)
		};
		return DateBinder.bind(map);
	}

	function composeFullName(ctx){
		var disease = mUtil.assign({}, ctx.shoubyoumeiMaster, {
			adj_list: ctx.shuushokugoMasters
		});
		return mUtil.diseaseFullName(disease);
	}

	function updateDisp(dom, ctx){
		dom.find(nameSelector).text(composeFullName(ctx));
		ctx.startDateBinder.setDate(moment(ctx.startDate));
		if( ctx.endDate === "0000-00-00"){
			ctx.endDateBinder.setDate(moment()).empty();
		} else {
			ctx.endDateBinder.setDate(moment(ctx.endDate));
		}
		dom.find(endReasonSelector).val(ctx.endReason);
	}

	function searchShoubyoumei(dom, text, ctx){
		var at = ctx.startDate;
		var searchResult;
		task.run([
			function(done){
				service.searchShoubyoumeiMaster(text, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					searchResult = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			var list = searchResult.map(function(item){
				return {
					name: item.name,
					code: item.shoubyoumeicode,
					mode: "disease"
				};
			});
			dom.find(searchResultSelector).html(resultTmpl.render({list: list}));
		})
	}

	function searchShuushokugo(dom, text){
		var searchResult;
		task.run([
			function(done){
				service.searchShuushokugoMaster(text, function(err, result){
					if( err ){
						done(err);
						return;
					}
					searchResult = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			var list = searchResult.map(function(item){
				return {
					name: item.name,
					code: item.shuushokugocode,
					mode: "adj"
				};
			});
			dom.find(searchResultSelector).html(resultTmpl.render({list: list}));
		})
	}

	function bindEnter(dom, ctx){
		dom.on("click", enterLinkSelector, function(event){
			event.preventDefault();
			var startDateOpt = ctx.startDateBinder.getDate();
			if( !startDateOpt.ok ){
				alert("開始日の設定が不適切です。");
				return;
			}
			var startDate = startDateOpt.sqlDate;
			var endDateOpt = ctx.endDateBinder.getDate();
			var endDate;
			if( !endDateOpt.ok ){
				if( endDateOpt.isEmpty ){
					endDate = "0000-00-00";
				} else {
					alert("終了日の設定が不適切です。");
					return;
				}
			} else {
				endDate = endDateOpt.sqlDate;
			}
			var endReason = dom.find(endReasonSelector + " option:selected").val();
			var newDisease = mUtil.assign({}, ctx.shoubyoumeiMaster, {
				disease_id: ctx.diseaseId,
				patient_id: ctx.patientId,
				start_date: startDate,
				end_reason: endReason,
				end_date: endDate
			});
			newDisease.adj_list = ctx.shuushokugoMasters.map(function(adj){
				return mUtil.assign({}, adj, {
					disease_id: ctx.diseaseId,
					shuushokugocode: adj.shuushokugocode
				});
			});
			var updatedDisease;
			task.run([
				function(done){
					service.updateDiseaseWithAdj(newDisease, done);
				},
				function(done){
					service.getFullDisease(ctx.diseaseId, function(err, result){
						if( err ){
							done(err);
							return;
						}
						updatedDisease = result;
						done();
					})
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("cirqgerl-modified", [updatedDisease]);
			});
		})
	}

	function bindDeleteAdj(dom, ctx){
		dom.on("click", deleteAdjLinkSelector, function(event){
			event.preventDefault();
			ctx.shuushokugoMasters = [];
			updateDisp(dom, ctx);
		});
	}

	function bindDelete(dom, ctx){
		dom.on("click", deleteLinkSelector, function(event){
			event.preventDefault();
			if( !confirm("この傷病名を削除しますか？") ){
				return;
			}
			var diseaseId = ctx.diseaseId;
			task.run([
				function(done){
					service.deleteDiseaseWithAdj(diseaseId, done);
				}
			], function(err){
				if( err ){
					alert(err);
					return;
				}
				dom.trigger("cirqgerl-deleted", [diseaseId]);
			})
		});
	}

	function bindSearch(dom, ctx){
		dom.on("submit", searchFormSelector, function(event){
			event.preventDefault();
			var text = dom.find(searchTextInputSelector).val().trim();
			if( text === "" ){
				return;
			}
			var mode = dom.find(searchModeInputSelector + ":checked").val();
			if( mode === "disease" ){
				searchShoubyoumei(dom, text, ctx);
			} else if( mode === "adj" ){
				searchShuushokugo(dom, text);
			} else {
				alert("unknown mode: " + mode);
				return;
			}
		});
	}

	function selectShoubyoumei(dom, shoubyoumeicode, ctx){
		var at = ctx.startDate;
		var master;
		task.run([
			function(done){
				service.getShoubyoumeiMaster(shoubyoumeicode, at, function(err, result){
					if( err ){
						done(err);
						return;
					}
					master = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			ctx.shoubyoumeiMaster = master;
			updateDisp(dom, ctx);
		})
	}

	function selectShuushokugo(dom, shuushokugocode, ctx){
		var master;
		task.run([
			function(done){
				service.getShuushokugoMaster(shuushokugocode, function(err, result){
					if( err ){
						done(err);
						return;
					}
					master = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			ctx.shuushokugoMasters.push(master);
			updateDisp(dom, ctx);
		})
	}

	function bindSearchSelect(dom, ctx){
		dom.on("change", searchResultSelector, function(){
			var opt = dom.find(searchResultSelector + " option:selected");
			var code = opt.val();
			var mode = opt.data("mode");
			if( mode === "disease" ){
				selectShoubyoumei(dom, code, ctx);
			} else if( mode === "adj" ){
				selectShuushokugo(dom, code, ctx);
			} else {
				alert("unknown mode: " + mode);
				return;
			}
		});
	}


/***/ },
/* 136 */
/***/ function(module, exports) {

	module.exports = "<div>\r\n    <div mc-name=\"name-area\" style=\"font-size:13px\">\r\n        名前：<span mc-name=\"name\"></span>\r\n    </div>\r\n    <div class=\"start-date\" style=\"font-size:13px\">\r\n        <select mc-name=\"startDateGengou\" style=\"width:auto\">\r\n            <option value=\"平成\">平成</option>\r\n        </select><!--\r\n\t\t--><input mc-name=\"startDateNen\" class=\"disease-nen alpha\"/>年<!--\r\n\t\t--><input mc-name=\"startDateMonth\" class=\"disease-month alpha\"/>月<!--\r\n\t\t--><input mc-name=\"startDateDay\" class=\"disease-day alpha\"/>日\r\n    </div>\r\n    <div>から</div>\r\n    <div class=\"end-date\" style=\"font-size:13px\">\r\n        <select mc-name=\"endDateGengou\" style=\"width:auto\">\r\n            <option value=\"昭和\">昭和</option>\r\n            <option value=\"平成\">平成</option>\r\n        </select><!--\r\n\t\t--><input mc-name=\"endDateNen\" class=\"disease-nen alpha\">年<!--\r\n\t\t--><input mc-name=\"endDateMonth\" class=\"disease-month alpha\">月<!--\r\n\t\t--><input mc-name=\"endDateDay\" class=\"disease-day alpha\">日\r\n    </div>\r\n    <div mc-name=\"end-reason-area\">\r\n        <select mc-name=\"endReason\" style=\"width:auto\">\r\n            <option value=\"N\">継続</option>\r\n            <option value=\"C\">治癒</option>\r\n            <option value=\"S\">中止</option>\r\n            <option value=\"D\">死亡</option>\r\n        </select>\r\n    </div>\r\n    <hr/>\r\n    <div class=\"command-box\">\r\n        <button mc-name=\"enterLink\">入力</button>\r\n        <a mc-name=\"deleteAdjLink\" href=\"javascript:void(0)\" class=\"cmd-link\">修飾語削除</a> |\r\n        <a mc-name=\"deleteLink\" href=\"javascript:void(0)\" class=\"cmd-link\">削除</a>\r\n    </div>\r\n    <hr/>\r\n    <form onsubmit=\"return false\" mc-name=\"search-form\">\r\n        <div>\r\n            <input mc-name=\"searchText\" class=\"kanji\" style=\"width:110px;\">\r\n            <button mc-name=\"searchLink\">検索</button>\r\n        </div>\r\n        <div>\r\n            <input type=\"radio\" name=\"search-kind\" value=\"disease\" checked>病名\r\n            <input type=\"radio\" name=\"search-kind\" value=\"adj\">修飾語\r\n        </div>\r\n        <div>\r\n            <select mc-name=\"searchResult\" size=\"10\"></select>\r\n        </div>\r\n    </form>\r\n</div>\r\n"

/***/ },
/* 137 */
/***/ function(module, exports) {

	module.exports = "{{#list}}\r\n\t<option value=\"{{code}}\" data-mode=\"{{mode}}\">{{name}}</option>\r\n{{/list}}"

/***/ },
/* 138 */
/***/ function(module, exports) {

	module.exports = "<div class=\"workarea\">\r\n\t<div class=\"title\">病名</div>\r\n\t<div mc-name=\"workarea\"></div>\r\n\t<hr />\r\n\t<div mc-name=\"command-box\">\r\n\t\t<a mc-name=\"listLink\" href=\"javascript:void(0)\" class=\"cmd-link\">現行</a> |\r\n\t\t<a mc-name=\"addLink\" href=\"javascript:void(0)\" class=\"cmd-link\">追加</a> |\r\n\t\t<a mc-name=\"endLink\" href=\"javascript:void(0)\" class=\"cmd-link\">転帰</a> |\r\n\t\t<a mc-name=\"editLink\"href=\"javascript:void(0)\" class=\"cmd-link\">編集</a>\r\n\t</div>\r\n</div>\r\n"

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);
	var SelectPatientItem = __webpack_require__(140);

	var tmplHtml = __webpack_require__(142);

	exports.setup = function(dom){
		dom.html(tmplHtml);
		bindButton(dom);
		bindOption(dom);
	};

	function getWorkspaceDom(dom){
		return dom.find("[mc-name=selectWrapper]");
	};

	function getSelectDom(dom){
		return dom.find("[mc-name=selectWrapper] select");
	}

	function bindButton(dom){
		dom.on("click", "[mc-name=button]", function(event){
			event.preventDefault();
			var ws = getWorkspaceDom(dom);
			if( ws.is(":visible") ){
				getSelectDom(dom).html("");
				ws.hide();
			} else {
				var list;
				task.run(function(done){
					service.listFullWqueueForExam(function(err, result){
						if( err ){
							done(err);
							return;
						}
						list = result;
						done();
					});
				}, function(err){
					if( err ){
						alert(err);
						return;
					}
					var select = getSelectDom(dom).html("");
					list.forEach(function(wq){
						var e = $("<option></option>").val(wq.visit_id);
						var e = SelectPatientItem.create(wq);
						select.append(e);
					});
					ws.show();
				})
			}
		});
	}

	function bindOption(dom){
		dom.on("dblclick", "option", function(event){
			var opt = $(this);
			var values = opt.val().split(",");
			var patientId = +values[0];
			var visitId = +values[1];
			opt.trigger("start-exam", [patientId, visitId]);
		});
		dom.listen("rx-start-page", function(){
			getSelectDom(dom).html("");
			getWorkspaceDom(dom).hide();
		});
	};



/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var mUtil = __webpack_require__(5);

	var tmplSrc = __webpack_require__(141);
	var tmpl = hogan.compile(tmplSrc);

	exports.create = function(data){
		data = mUtil.assign({}, data, {
			state_label: mUtil.wqueueStateToKanji(data.wait_state)
		});
		var e = $(tmpl.render(data));
		return e;
	};



/***/ },
/* 141 */
/***/ function(module, exports) {

	module.exports = "<option value=\"{{patient_id}},{{visit_id}}\">[{{state_label}}] {{last_name}} {{first_name}}</option>"

/***/ },
/* 142 */
/***/ function(module, exports) {

	module.exports = "<button mc-name=\"button\">患者選択</button>\r\n<div mc-name=\"selectWrapper\" style=\"display:none\">\r\n    <select mc-name=\"select\" style=\"width:100%\" size=10></select>\r\n</div>\r\n"

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);
	var mUtil = __webpack_require__(5);

	var tmplHtml = __webpack_require__(144);

	var itemTmplSrc = __webpack_require__(145);
	var itemTmpl = hogan.compile(itemTmplSrc);

	exports.setup = function(dom){
		dom.html(tmplHtml);
		bindButton(dom);
		bindForm(dom);
		bindOption(dom);
	};

	function hideWorkspace(dom){
		getWorkspaceDom(dom).hide();
		getInputDom(dom).val("");
		getSelectDom(dom).html("");
	};

	function getWorkspaceDom(dom){
		return dom.find("[mc-name=workspace]");
	};

	function getInputDom(dom){
		return dom.find("[mc-name=searchForm] input.search-patient-input");
	};

	function getSelectDom(dom){
		return dom.find("select");
	};

	function bindButton(dom){
		dom.on("click", "[mc-name=button]", function(){
			var ws = getWorkspaceDom(dom);
			if( ws.is(":visible") ){
				hideWorkspace(dom);
			} else {
				ws.show();
				getInputDom(dom).focus();
			}
		});
	};

	function bindForm(dom){
		dom.on("submit", "form", function(){
			var text = getInputDom(dom).val();
			if( text === "" ){
				return;
			}
			var list;
			task.run(function(done){
				service.searchPatient(text, function(err, result){
					if( err ){
						done(err);
						return;
					}
					list = result;
					done();
				});
			}, function(err){
				if( err ){
					alert(err);
					return;
				}
				if( list.length === 1 ){
					var patient = list[0];
					dom.trigger("start-patient", [patient.patient_id]);
				} else {
					var select = getSelectDom(dom).html("");
					list.forEach(function(patient){
						var data = mUtil.assign({}, patient, {
							patient_id_label: mUtil.padNumber(patient.patient_id, 4)
						});
						var opt = itemTmpl.render(data);
						select.append(opt);
					});
				}
			});
		});
	}

	function bindOption(dom){
		dom.on("dblclick", "option", function(){
			var opt = $(this);
			var patientId = +opt.val();
			opt.trigger("start-patient", [patientId]);
		});
		dom.listen("rx-start-page", function(){
			hideWorkspace(dom);
		});
	}



/***/ },
/* 144 */
/***/ function(module, exports) {

	module.exports = "<button mc-name=\"button\">患者検索</button>\r\n<div mc-name=\"workspace\" style=\"display:none\">\r\n    <form mc-name=\"searchForm\" onsubmit=\"return false;\">\r\n        <input mc-name=\"text\" class=\"alpha search-patient-input\">\r\n        <button mc-name=\"searchButton\">検索</button>\r\n    </form>\r\n    <div>\r\n        <select mc-name=\"select\" size=\"16\" style=\"width:100%\"></select>\r\n    </div>\r\n</div>\r\n"

/***/ },
/* 145 */
/***/ function(module, exports) {

	module.exports = "<option value=\"{{patient_id}}\">[{{patient_id_label}}] {{last_name}} {{first_name}}</option>"

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var hogan = __webpack_require__(13);
	var mUtil = __webpack_require__(5);
	var service = __webpack_require__(10);
	var $ = __webpack_require__(1);
	__webpack_require__(2);
	var task = __webpack_require__(9)

	var tmplHtml = __webpack_require__(147);
	var optionTmpl = hogan.compile(__webpack_require__(148));

	exports.setup = function(dom){
		dom.html(tmplHtml);
		bindButton(dom);
		bindOption(dom);
		dom.listen("rx-start-page", function(pageData){
			getSelectDom(dom).hide().html("");
		})
	};

	function getSelectDom(dom){
		return dom.find("select");
	}

	function bindButton(dom){
		dom.on("click", "button", function(){
			var select = getSelectDom(dom);
			if( select.is(":visible") ){
				select.hide().html("");
			} else {
				task.run(function(cb){
					service.recentVisits(cb);
				}, function(err, list){
					if( err ){
						alert(err);
						return;
					}
					updateSelect(select, list);
					select.show();
				});
			}
		});
	}

	function bindOption(dom){
		dom.on("dblclick", "option", function(){
			var patientId = $(this).val();
			dom.trigger("start-patient", [+patientId]);
		});
	}

	function updateSelect(select, list){
		list.forEach(function(data){
			data = mUtil.assign({}, data, {
				patient_id_part: mUtil.padNumber(data.patient_id, 4)
			});
			select.append(optionTmpl.render(data))
		});
	}


/***/ },
/* 147 */
/***/ function(module, exports) {

	module.exports = "<button>最近の受診</button>\r\n<div>\r\n  <select size=\"20\" style=\"display:none\"></select>\r\n</div>\r\n"

/***/ },
/* 148 */
/***/ function(module, exports) {

	module.exports = "<option value=\"{{patient_id}}\">[{{patient_id_part}}] {{last_name}} {{first_name}}</option>\r\n"

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var service = __webpack_require__(10);
	var task = __webpack_require__(9);
	var mUtil = __webpack_require__(5);

	var tmplHtml = __webpack_require__(150);
	var resultTmplSrc = __webpack_require__(151);
	var resultTmpl = hogan.compile(resultTmplSrc);

	exports.setup = function(dom){
		dom.html(tmplHtml);
		bindButton(dom);
		bindOption(dom);
	};

	function getWorkspaceDom(dom){
		return dom.find("[mc-name=selectWrapper]");
	};

	function getSelectDom(dom){
		return dom.find("select");
	};

	function bindButton(dom){
		dom.on("click", "[mc-name=button]", function(){
			var ws = getWorkspaceDom(dom);
			if( ws.is(":visible") ){
				ws.hide();
				getSelectDom(dom).html("");
			} else {
				var list;
				task.run(function(done){
					service.listTodaysVisits(function(err, result){
						if( err ){
							done(err);
							return;
						}
						list = result;
						done();
					})
				}, function(err){
					if( err ){
						alert(err);
						return;
					}
					var select = getSelectDom(dom);
					select.html(searchResult(list));
					ws = getWorkspaceDom(dom);
					ws.show();
				});
			}
		})
	}

	function searchResult(list){
		var data = list.map(function(item){
			return {
				patient_id: item.patient_id,
				patient_id_label: mUtil.padNumber(item.patient_id, 4),
				last_name: item.last_name,
				first_name: item.first_name
			};
		})
		return resultTmpl.render({list: data});
	}

	function bindOption(dom){
		dom.on("dblclick", "option", function(){
			var opt = $(this);
			var patientId = opt.val();
			opt.trigger("start-patient", [patientId]);
		});
		dom.listen("rx-start-page", function(appData){
			if( appData.currentPatientId === 0 ){
				getWorkspaceDom(dom).hide();
			}
		})
	}



/***/ },
/* 150 */
/***/ function(module, exports) {

	module.exports = "<button mc-name=\"button\">本日の受診</button>\r\n<div mc-name=\"selectWrapper\" style=\"display:none\">\r\n\t<select mc-name=\"select\" size=\"20\"></select>\r\n</div>\r\n"

/***/ },
/* 151 */
/***/ function(module, exports) {

	module.exports = "{{#list}}\r\n\t<option value=\"{{patient_id}}\">[{{patient_id_label}}] {{last_name}} {{first_name}}</option>\r\n{{/list}}\r\n"

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var modal = __webpack_require__(24);
	var service = __webpack_require__(10);
	var mUtil = __webpack_require__(5);
	var hogan = __webpack_require__(13);
	var kanjidate = __webpack_require__(16);

	var mainTmpl = hogan.compile(__webpack_require__(153));
	var optionTmpl = hogan.compile(__webpack_require__(154));
	var dispTmpl = hogan.compile(__webpack_require__(155));

	function getSearchTextDom(dom){
		return dom.find("input[mc-name=searchText]");
	}

	function getDispDom(dom){
		return dom.find("[mc-name=disp]");
	}

	function bindSelect(dom){
		dom.on("click", "select[mc-name=searchResult] option", function(){
			var opt = $(this);
			var patientId = opt.val();
			opt.trigger("patient-selected", [patientId]);
		});
	}

	function bindPatientSelected(dom){
		dom.on("patient-selected", function(event, patientId){
			event.stopPropagation();
			service.getPatient(patientId, function(err, result){
				if( err ){
					alert(err);
					return;
				}
				var data = makePatientData(result);
				updateDisp(dom, data);
			})
		});
	}

	function bindSearchForm(dom){
		dom.find("form[mc-name=searchForm]").submit(function(event){
			event.preventDefault();
			var text = getSearchTextDom(dom).val();
			if( text === "" ){
				return;
			}
			service.searchPatient(text, function(err, result){
				if( err ){
					alert(err);
					return;
				}
				var select = dom.find("select[mc-name=searchResult]").html("");
				result.forEach(function(item){
					var data = mUtil.assign({}, item, {
						patient_id_part: mUtil.padNumber(item.patient_id, 4)
					});
					var opt = optionTmpl.render(data);
					select.append(opt);
				});
			})
		});
	}

	function bindEnter(dom, close){
		dom.find("[mc-name=enterLink]").click(function(event){
			var patientId = dom.data("patient_id");
			if( !(patientId > 0) ){
				alert("患者番号が不適切です。");
				return;
			}
			service.startVisit(patientId, mUtil.nowAsSqlDatetime(), function(err){
				if( err ){
					alert(err);
					return;
				}
				close();
			})
		})
	}

	function makeBirthdayLabel(birthday){
		if( birthday && birthday !== "0000-00-00" ){
			return kanjidate.format("{G}{N}年{M}月{D}日", birthday) + 
				"（" + mUtil.calcAge(birthday) + "才）";
		} else {
			return "";
		}
	}

	function makePatientData(patient){
		return mUtil.assign({}, patient, {
			birthday_label: makeBirthdayLabel(patient.birth_day),
			sex_label: mUtil.sexToKanji(patient.sex)
		});
	}

	function updateDisp(dom, data){
		getDispDom(dom).html(dispTmpl.render(data));
		dom.data("patient_id", data.patient_id);
	}

	exports.open = function(){
		var dom = $("<div style='width:260px'></div>");
		dom.html(mainTmpl.render({patient: {}}, {disp: dispTmpl}));
		bindSearchForm(dom);
		bindSelect(dom);
		bindPatientSelected(dom);
		modal.startModal({
			title: "受付",
			init: function(content, close){
				content.appendChild(dom.get(0));
				bindEnter(dom, close);
				getSearchTextDom(dom).focus();
			}
		})
		//bindEnter(dom);
		//modal.open("受付", dom);
		//getSearchTextDom(dom).focus();
	}


/***/ },
/* 153 */
/***/ function(module, exports) {

	module.exports = "<div mc-name=\"disp\" style=\"font-size: 13px\">\r\n    {{#patient}}\r\n        {{> disp}}\r\n    {{/patient}}\r\n</div>\r\n\r\n<div class=\"dialog-commandbox\">\r\n    <button mc-name=\"enterLink\">診察受付</button>\r\n</div>\r\n\r\n<div mc-name=\"searchWrapper\">\r\n    <form mc-name=\"searchForm\" style=\"margin: 4px 0\">\r\n        <input mc-name=\"searchText\"/>\r\n        <button mc-name=\"searchLink\">検索</button>\r\n    </form>\r\n    <div>\r\n        <select mc-name=\"searchResult\" size=\"8\"></select>\r\n    </div>    \r\n</div>"

/***/ },
/* 154 */
/***/ function(module, exports) {

	module.exports = "<option value='{{patient_id}}'>[{{patient_id_part}}] {{last_name}} {{first_name}}</option>"

/***/ },
/* 155 */
/***/ function(module, exports) {

	module.exports = "<table width=\"100%\">\r\n    <tr>\r\n        <td style=\"width:65px\">患者番号：</td>\r\n        <td mc-name=\"patientId\">{{patient_id}}</td>\r\n    </tr>\r\n    <tr>\r\n        <td style=\"width:65px\">名前：</td>\r\n        <td mc-name=\"name\">{{last_name}} {{first_name}}</td>\r\n    </tr>\r\n    <tr>\r\n        <td style=\"width:65px\">よみ：</td>\r\n        <td mc-name=\"yomi\">{{last_name_yomi}} {{first_name_yomi}}</td>\r\n    </tr>\r\n    <tr>\r\n        <td style=\"width:65px\">生年月日：</td>\r\n        <td mc-name=\"birthday\">{{birthday_label}}</td>\r\n    </tr>\r\n    <tr>\r\n        <td style=\"width:65px\">性別：</td>\r\n        <td mc-name=\"sex\">{{sex_label}}</td>\r\n    </tr>\r\n    <tr>\r\n        <td style=\"width:65px\">住所：</td>\r\n        <td mc-name=\"address\">{{address}}</td>\r\n    </tr>\r\n    <tr>\r\n        <td style=\"width:65px\">電話：</td>\r\n        <td mc-name=\"phone\">{{phone}}</td>\r\n    </tr>\r\n</table>"

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var $ = __webpack_require__(1);
	var hogan = __webpack_require__(13);
	var tmplSrc = __webpack_require__(157);
	var resultTmplSrc = __webpack_require__(158);
	var resultTmpl = hogan.compile(resultTmplSrc);
	var modal = __webpack_require__(24);
	var task = __webpack_require__(9);
	var service = __webpack_require__(10);
	var kanjidate = __webpack_require__(16);

	var searchTextSelector = "> form[mc-name=search-form] input[mc-name=searchText]";
	var searchLinkSelector = "> form[mc-name=search-form] [mc-name=searchButton]";
	var searchResultSelector = "> [mc-name=resultBox]";

	exports.setup = function(dom){
		dom.on("click", function(event){
			event.preventDefault();
			var form = $(tmplSrc);
			form.on("click", searchLinkSelector, function(event){
				event.preventDefault();
				var text = form.find(searchTextSelector).val().trim();
				if( text === "" ){
					return;
				}
				doSearch(form, text);
			});
			modal.startModal({
				title: "全文検索",
				init: function(content){
					content.appendChild(form.get(0));
				}
			})
			//modal.open("全文検索", form);
		})
	}

	function prepContent(content, searchText){
		if( searchText !== "" && searchText.indexOf("<") < 0 ){
			content = content.split(searchText).join('<span style="color:#f00">' + searchText + '</span>');
		}
		content = content.replace(/\n/g, "<br />\n");
		return content;
	}

	function doSearch(form, text){
		var searchResult;
		task.run([
			function(done){
				service.searchWholeText(text, function(err, result){
					if( err ){
						done(err);
						return;
					}
					searchResult = result;
					done();
				})
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			var list = searchResult.map(function(item){
				return {
					patient_id: item.patient_id,
					last_name: item.last_name,
					first_name: item.first_name,
					date_label: kanjidate.format(kanjidate.f5, item.v_datetime),
					content: prepContent(item.content, text)
				}
			})
			form.find(searchResultSelector).html(resultTmpl.render({list: list}));
		})
	}


/***/ },
/* 157 */
/***/ function(module, exports) {

	module.exports = "<div style=\"width:300px\">\r\n\t<form mc-name=\"search-form\" onsubmit=\"return false\">\r\n\t\t<input mc-name=\"searchText\" />\r\n\t\t<button mc-name=\"searchButton\">検索</button>\r\n\t</form>\r\n\t<div mc-name=\"resultBox\" style=\"height: 360px;font-size:12px;margin-top:6px;border:1px solid #ccc\"></div>\r\n</div>"

/***/ },
/* 158 */
/***/ function(module, exports) {

	module.exports = "{{#list}}\r\n\t<div style=\"margin:2px 0;padding: 3px;border: 1px solid #ccc\">\r\n\t\t<div name=\"title\"\r\n\t\t\tstyle=\"font-weight: bold; margin-bottom: 4px; color: green\">\r\n\t\t\t({{patient_id}}) [{{last_name}} {{first_name}}]\r\n\t\t\t{{ date_label }}\r\n\t\t</div>\r\n\t\t<div name=\"content\">\r\n\t\t\t{{& content}}\r\n\t\t</div>\r\n\t</div>;\r\n{{/list}}\r\n"

/***/ }
/******/ ]);