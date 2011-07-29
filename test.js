var fctl = require('./functional');
var Functional = fctl.Functional;
fctl.loadDefaults();


console.log("===== Test default functions =====");
console.log("and(true,false): "								+ and(true,false));										// false
console.log("or(true,false): "								+ or(true,false));										// true
console.log("mult(-3,4): " 									+ mult(-3,4));												// -12
console.log("length([1,2,3]): " 								+ length([1,2,3]));										// 3
console.log("tail([1,2,3]): " 								+ tail([1,2,3]));											// [2,3]
console.log("head([1,2,3]): " 								+ head([1,2,3]));											// 1
console.log("reverse([1,2,3]): "								+ reverse([1,2,3]));										// [3,2,1]
console.log("unshift(0, [1,2,3]): " 						+ unshift(0, [1,2,3]));									// [0,1,2,3]
console.log("last([1,2,3]): " 								+ last([1,2,3]));											// 3
console.log("concat([1,2],[3,4]): "							+ concat([1,2],[3,4]));									// [1,2,3,4]
console.log("take(3, [1,2,3,4,5]): "						+ take(3, [1,2,3,4,5]));								// [1,2,3]
console.log("replicate(3, 5): "								+ replicate(3, 5));										// [5,5,5]
console.log("foldr(mult, 1, [1,2,3,4]): " 				+ foldr(mult, 1, [1,2,3,4]));							// 24
console.log("sum([1,2,3,4]): " 								+ sum([1,2,3,4]));										// 10					| sum = foldr(add, 0)
console.log("map([1,-2,3,-4]): "								+ map(abs, [1,-2,3,-4]));								// [1,2,3,4]
console.log("all(lessthanRe(5), [1,2,3,4]): " 			+ all(lessthanRe(5), [1,2,3,4]));					// true				| use particular "Re" function as lessthan(3) means 3<x instead of x<3, 
																																		//						  which you can create using lessthanRe(3)
console.log("until(greaterthanRe(80), mult(2), 1): "	+ until(greaterthanRe(80), mult(2), 1)); 			// 128				| multiplicating with 2, beginning with 1, until it's greater than 80


console.log("\n===== Test particular functions =====");
console.log("1) Particular usage of a self-defined avarage function which expects 3 parameters");
avg2 = new Functional(
	["a", "b", "c", function(a, b, c) { return (a+b+c)/3; }]
);
console.log("avg(1,3,3.5): " 									+ avg2(1,3,3.5));											// 2.5
console.log("avg(4,6)(mult(2,4)): " 						+ avg2(4,6)(mult(2,4)));								// 6
console.log("avg(5)(6,7): " 									+ avg2(5)(6,7));											// 6

console.log("2) Particular usage of the default's mult within a the map function");
console.log("map(mult(3), [1,2,3]): "						+ map(mult(3), [1,2,3]));								// [1,3,9]


console.log("\n===== Test own functionals =====");
console.log("1) Alternative functional implementation of the multiplication function");
mult2 = new Functional("mult2",
	["n", 1, function(n) { return n; }],
	function(a, b) { if (a < 0) { return -1*mult2(-1*a, b); } else if (b < 0) { return -1*mult2(a,-1*b); } else { return a+mult2(a,b-1); } }
);
console.log("mult2(-3,4): " 									+ mult2(-3,4));											// -12

console.log("2) Functional implementation of the recursive fibonacci function");
fibonacci = new Functional("fibonacci",
	[0, 0],
	[1, 1],
	function(n) { return fibonacci(n-1)+fibonacci(n-2); }
);
console.log("fibonacci(10): " 								+ fibonacci(10));											// 55

console.log("3) Functional implementation for the faculty function - factorial, factorial2 and factorial3 are equivalent");
factorial = new Functional (
	[0, 1],
	function(n) { return n * factorial(n-1); }
);
factorial2 = new Functional(
	[0, 1],
	["n", function(n) { return n * factorial2(n-1); }]
);
factorial3 = new Functional(
	function(n) { if (n > 1) { return n*factorial3(n-1); } else return 1; }
);
console.log("factorial2(6): " 								+ factorial2(6));											// 720


console.log("\n===== Test extending the knowledge database =====");
console.log("mult(1,1) before extending the database: " + mult(1,1));
mult('__addOnTop', 
	[1, 1, 42],
	[3, 1, 3.1415926535]
);
console.log("mult(1,1) after extended the database with __addOnTop([1,1,42]): " + mult(1,1));
