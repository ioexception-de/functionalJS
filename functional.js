var Functional = function() {
	var list = [];
	var name = null;

	/* HELPER functions */
	function isArray(obj) {
		return (obj.constructor.toString().indexOf("Array") > -1);
	}

	function isVariableName(str) {
		if (typeof str !== 'string')
			return false;
		return (str.match(/^\w(\w|\d)*$/) !== null);
	}
	function isListName(str) {
		if (typeof str !== 'string')
			return false;
		return (str.match(/^\[\w+(\:\w+)+\]$/) !== null);
	}
	function isEmptyList(str) {
		if (typeof str !== 'string')
			return false;
		return (str.match(/^\[\]$/) !== null);
	}

	/* endof: helper functions */


	function getParametersOfFunction(f) {
		return f.toString().replace(/^function (anonymous)?\(([^)]*)\) {(.|\n)*}$/, '$2').replace(/\s+(,)/g, '$1').replace(/(,)\s+/g, '$1').split(",");
	}

	function getNameOfFunction(f) {
		return f.getName();
		return f.toString().replace(/^function (.+)\([^)]*\)\s*{(.|\n)*}$/, '$1');
	}


	function addToList() {
		for(var i = 0; i < arguments.length; i++) {
			switch(typeof arguments[i]) {
				case "object":
					list.push(arguments[i]);
				break;
				case "string": 
					name = arguments[i];
				break;
				case "function":
					var params = getParametersOfFunction(arguments[i]);
					params.push(arguments[i]);
					list.push(params);
				break;
			}
		}
	}

	function addToListOnTop() {
		for(var i = 0; i < arguments.length; i++) {
			switch(typeof arguments[i]) {
				case "object":
					list.unshift(arguments[i]);
				break;
				case "string": 
					name = arguments[i];
				break;
				case "function":
					var params = getParametersOfFunction(arguments[i]);
					params.push(arguments[i]);
					list.unshift(params);
				break;
			}
		}
	}

	function getList() {
		return list;
	}

	function getMeta(args) {
		switch(args[0]) {
			case "__add":
				return function __add() {
					var args = arguments[0];
					for (var key in args) {
						if (key == 0)
							continue;

						addToList(args[key]);
					}
				};
			break;
			case "__addOnTop":
				return function __addOnTop() {
					var args = arguments[0];
					for (var key in args) {
						if (key == 0)
							continue;

						addToListOnTop(args[key]);
					}
				};
			break;
			case "__list":
				return function __list() {
					return list;
				};
			break;
			case "__name":
				return function __name() {
					return name;
				};
			break;
			default:
				return false;
			break;
		}
	};


	function get() {
		var meta = getMeta(arguments);
		if (meta !== false) {
			return meta(arguments);
		}

		function sameArguments(a, b) {
			// a might be a hash, b must be an array
			for (var i = 0; i < b.length; i++) {
				//
				if (isArray(a[i]) && a[i].length == 0 && b[i] == "[]")	// match "[]" as empty array
					continue;
				if (isArray(b[i]) && b[i].length == 0 && a[i] == "[]")	// match "[]" as empty array
					continue;

				if (b[i] !== a[i])
					return false;
			}
			return true;
		}
		
		function getMin(a, b) {
			return Math.min((b.length ? b.length : 0), (a.length ? a .length : 0));
		}
		
		function partSameArguments(a, b) {
			var loops = getMin(a, b);
			for (var i = 0; i < loops; i++) {
				if (b[i] !== a[i])
					return false;
			}
			return true;
		}

		function matchVariableArguments(realArgs, varArgs, until) {
			var until = (typeof until === 'undefined' ? varArgs.length : until);
			
			var args = {};
			for (var i = 0; i < until; i++) {
				if (varArgs[i] === realArgs[i]) {
					args[realArgs[i]] = realArgs[i];
				}
				else if (isVariableName(varArgs[i])) {
					args[varArgs[i]] = realArgs[i];
				}
				else if (isEmptyList(varArgs[i]) && isArray(realArgs[i]) && realArgs[i].length == 0) {
					continue;
				}
				else if (isListName(varArgs[i]) && isArray(realArgs[i]) && realArgs[i].length >= varArgs[i].split(":").length-1) {
					var parts = varArgs[i].replace(/^\[(.*)\]$/, '$1').split(":");
					for (var k = 0; k < parts.length-1; k++) {
						args[parts[k]] = realArgs[i][k];
					}
					args[parts[parts.length-1]] = realArgs[i].slice(parts.length-1);
				}
				else {
					return false;
				}
			}

			return args;
		}

		function replaceParameters(params, hsh) {
			var newParams = [];
			for(var i = 0; i < params.length; i++) {
				if (typeof hsh[params[i]] != "undefined")
					newParams.push(hsh[params[i]]);
				else
					newParams.push(params[i]);
			}
			return newParams;
		}
		
		function insertValuesIntoFunction(f, hsh) {
			// insert values in function body		
			var fBody = f.toString().replace(/^function (anonymous)?\([^)]*\) {\s*((.|\n)*)\s*}$/, '$2');

			var pattern, replacement;
			for (var key in hsh) {
				pattern = new RegExp("(\\W)"+key+"(?!\\w)", "g");
				if (typeof hsh[key] === 'function') {
					var fctlName = hsh[key]('__name')
					if (fctlName !== null) {
						replacement = fctlName;
					}
					else {
						replacement = hsh[key].toString().replace(/^function (.+)\([^)]*\)\s*{(\s|.)*}$/, '$1');
					}
				} else {
					replacement = hsh[key];
				}
				fBody = fBody.replace(pattern, '$1'+replacement);
			}
			
			// delete parameters in the value's list of the function
			var params = getParametersOfFunction(f);
			var newParams = [];
			for (var i = 0; i < params.length; i++) {
				if (typeof hsh[params[i]] === 'undefined') {
					newParams.push(params[i]);
				}
			}
		
			var newFunction = new Function(newParams, fBody);
			return {
				params: newParams,
				function: newFunction
			};
		}

		/* Real evaluation */
		if (list[0].length === arguments.length+1) {
			for (var i = 0; i < list.length; i++) {
				if (sameArguments(arguments, list[i].slice(0, -1))) {
					return list[i].slice(-1)[0];
				}

				var matched = matchVariableArguments(arguments, list[i].slice(0, -1));

				if (matched !== false) {
					var f = list[i].slice(-1)[0];
					var args = replaceParameters(getParametersOfFunction(f), matched);
					return f.apply(this, args);
				}

				continue;
			}
		}
		else if (list[0].length > arguments.length+1) {
			/* Partial evaluation */
			fctl = new Functional();

			for (var i = 0; i < list.length; i++) {
				var matched = {};
				if (partSameArguments(arguments, list[i].slice(0, -1))) {
					var nargs = list[i].slice(0, -1).slice(0, getMin(arguments, list[i].slice(0, -1)));
					nargs.push(list[i].slice(-1)[0]);
					fctl('__add',
						nargs
					);
				} else {
					var bothN = getMin(arguments, list[i].slice(0, -1));
					var matched = matchVariableArguments(arguments, list[i].slice(0, -1), bothN);
					if (matched !== false) {
						var ret = insertValuesIntoFunction(list[i].slice(-1)[0], matched, list[i].slice(0,-1));
						var nargs = list[i].slice(bothN, -1);
						nargs.push(ret.function);
						fctl('__add',
							nargs
						);
					}
				}
			}


			return fctl;
		}
		else {
			return false;
		}

		return false;
	}


	for (var i = 0; i < arguments.length; i++) {
		addToList(arguments[i]);
	}

	return get;
};




var loadDefaults = function() {

	/* ===== BOOLEANS ===== */
	and = new Functional("and",
		function(a, b) { return a && b; }
	);
	or = new Functional("or",
		function(a, b) { return a || b; }
	);

	/* ===== NUMBERS ===== */
	lessthan = new Functional("lessthan", 
		function(a, b) { return a < b; }
	);
	greaterthan = new Functional("greaterthan",
		function(a, b) { return a > b; }
	);
	lessequal = new Functional("lessequal",
		function(a, b) { return a <= b; }
	);
	greaterequal = new Functional("greaterequal",
		function(a, b) { return a >= b; }
	);
	equal = new Functional("equal",
		function(a, b) { return a === b; }
	);
	/* Defining "Re" functions the most times you need the particual lessthanRe(2) for
	 * "x<2" instead of lessthan(2) which means "2<x" */
	lessthanRe = new Functional("lessthanRe", function(a, b) { return b < a; });
	greaterthanRe = new Functional("greaterthanRe", function(a, b) { return b > a; });
	lessequalRe = new Functional("lessequalRe", function(a, b) { return b <= a; });
	greaterequalRe = new Functional("greaterequalRe", function(a, b) { return b >= a; });
	equalRe = equal;


	abs = new Functional("abs",
		function(a) { return (a < 0 ? -1*a : a); }
	);
	signum = new Functional("signum",
		function(a) { return (a < 0 ? -1 : (a > 1 ? 1 : 0)); }
	);
	add = new Functional("add",
		function(a, b) { return a+b; }
	);
	mult = new Functional("mult",
		function(a, b) { return a*b; }
	);
	sub = new Functional("sub",
		function(a, b) { return a-b; }
	);
	ratio = new Functional("ratio",
		function(a, b) { return a/b; }
	);
	mod = new Functional("mod",
		function(a, b) { return a % b; }
	);
	div = new Functional("div",
		function(a, b) { return Math.floor(a / b); }
	);
	subRe = new Functional("subRe", function(a, b) { return b-a; });
	ratioRe = new Functional("ratioRe", function(a, b) { return b/a; });
	modRe = new Functional("modRe", function(a, b) { return b % a; });
	divRe = new Functional("divRe", function(a, b) { return Math.floor(b / a); });


	/* ===== STRINGS ===== */
	unwords = new Functional("unwords",
		["[a:b:rest]", function(a, b, rest) { return a+" "+unwords(unshift(b, rest)); }],
		["[x:xs]", 		function(x, xs) { return x; }]
	);


	/* ===== LISTS ===== */
	tail = new Functional("tail",
		["[x:xs]", 		function(x, xs) { return xs; }]
	);
	head = new Functional("head",
		["[x:_]", 		function(x) { return x; }]
	);

	/* It's not allowed to use non-functional methods within your function body.
	 * The function body should only contain a return statement without any
	 * additional variable or function usage.
	 * But at the moment there's no way to avoid the javascript's unshift function
	 * as there isn't any haskell-like "(x:xs)" operator to create a new list.
	 */
	unshift = new Functional("unshift",
		["e", 			"list", 	function(e, list) { list.unshift(e); return list; }]
	);
	push = new Functional("push",
		["e", 			"list", 	function(e, list) { list.push(e); return list; }]
	);
	last = new Functional("last",
		["[a:b:rest]", function(a, b, rest) { return last(unshift(b, rest)); }],
		["[a:_]", 		function(a) { return a; }]
	);
	length = new Functional("length",
		["[]", 			0],
		["[x:xs]", 		function(x, xs) { return 1+length(xs); }]
	);

	foldr = new Functional("foldr",
		["f", 			"i", 			"[]", 		function(f, i) { return i; }],
		["f", 			"i", 			"[x:xs]", function(f, i, x, xs) { return f(x, foldr(f, i, xs)); }]
	);
	foldl = new Functional("foldl",
		["f", 			"i", 			"[]", 		function(f, i) { return i; }],
		["f",				"i", 			"[x:xs]",	function(f, i, x, xs) { return foldl(f, f(z, x), xs); }]
	);

	sum = foldr(add, 0);
	avg = new Functional("avg",
		["[]",			0],
		["l",				function(l) { return ratio(sum(l), length(l)); }]
	);

	map = new Functional("map",
		["f", 			"[]", 		function(f) { return []; }],
		["f", 			"[x:xs]", 	function(f, x, xs) { return unshift(f(x), map(f, xs)); }]
	);
	all = new Functional("all",
		["f", 			"l", 			function(f, l) { return foldr(and, true, map(f, l)); }]
	);
	any = new Functional("any",
		["f", 			"l", 			function(f, l) { return foldr(or, false, map(f, l)); }]
	);
	until = new Functional("until",
		["cond", 		"f",			"i", 			function(cond, f, i) { return (cond(i) ? i : until(cond, f, f(i))); }]
	); 

	concat = new Functional("concat",
		["l", 			"[]", 		function(l) { return l; }],
		["[]", 			"l", 			function(l) { return l; }],
		["l", 			"[x:xs]", function(l, x, xs) { return concat(push(x, l), xs); }]
	);
	take = new Functional("take",
		[0, 				"l", 			function(l) { return []; }],
		["n", 			"[]", 		function(n) { return []; }],
		["n", 			"[x:xs]", function(n, x, xs) { return unshift(x, take(n-1, xs)); }]
	);
	takeWhile = new Functional("takeWhile",
		["cond", 		"[]",			function(cond) { return []; }],
		["cond", 		"[x:xs]",	function(cond, x, xs) { return (cond(x) ? unshift(x, takeWhile(cond, xs)) : []); }]
	);
	reverse = new Functional("reverse",
		["[]",			[]],
		["[x:xs]", 		function(x, xs) { return push(x, reverse(xs)); }]
	);
	drop = new Functional("drop", 
		[0, 				"l", 			function(l) { return l; }],
		["n",				"[]", 		function(n) { return []; }],
		["n", 			"[x:xs]",	function(n, x, xs) { return drop(n-1, xs); }]
	);
	replicate = new Functional("replicate",
		[0,				"e",			function(e) { return []; }],
		["n",				"e",			function(n, e) { return unshift(e, replicate(n-1, e)); }]
	);
}


getDefaults = function() {
	loadDefaults();

	return {
		and: and,
		or: or,
		lessthan: lessthan,
		lessthanRe: lessthanRe,
		lessequal: lessequal,
		lessequalRe: lessequalRe,
		equal: equal,
		equalRe: equalRe,
		greaterequal: greaterequal,
		greaterequalRe: greaterequalRe,
		greaterthan: greaterthan,
		greaterthanRe: greaterthanRe,
		abs: abs,
		signum: signum,
		add: add,
		sub: sub,
		subRe: subRe,
		mult: mult,
		ratio: ratio,
		ratioRe: ratioRe,
		div: div,
		divRe: divRe,
		mod: mod,
		modRe: modRe,
		unwords: unwords,
		tail: tail,
		head: head,
		unshift: unshift,
		push: push,
		last: last,
		length: length,
		foldr: foldr,
		foldl: foldl,
		sum: sum,
		avg: avg,
		map: map,
		all: all,
		any: any,
		concat: concat,
		until: until,
		take: take,
		takeWhile: takeWhile,
		reverse: reverse,
		drop: drop,
		replicate: replicate
	};
};


if (typeof exports !== 'undefined') {
	exports.Functional = Functional;
	exports.loadDefaults = loadDefaults;
	exports.defaults = getDefaults;
}
