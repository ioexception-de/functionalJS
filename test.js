var sys = require('sys');

var fctl = require('./functional');
var Functional = fctl.Functional;
fctl.loadDefaults();



/* Alternativ functional implementation of the multiplication function */
mult2 = new Functional(
	[1, "n", function(n) { return n; }],
	["n", 1, function(n) { return n; }],
	function(a, b) { if (a < 0) { return -1*mult2(-1*a, b); } else if (b < 0) { return -1*mult2(a,-1*b); } else { return a+mult2(a,b-1); } }
);
sys.puts("mult2(-3,4): " + mult2(-3,4));

/* Functional implementation for the faculty function - factorial, factorial2 and factorial3 are equivalent */
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
sys.puts("factorial2(6): " + factorial2(6));

/* Functional implementation of the recursive fibonacci function */
fibonacci = new Functional(
	[0, 0],
	[1, 1],
	function(n) { return fibonacci(n-1)+fibonacci(n-2); }
);
sys.puts("fibonacci(10): " + fibonacci(10));

/* Functional implementation of the average function of three numbers to test the particular usage */
avg = new Functional(
	["a", "b", "c", function(a, b, c) { return (a+b+c)/3; }]
);
sys.puts("avg(1,3,3.5): " + avg(1,3,3.5));
sys.puts("avg(4,6)(8): " + avg(4,6)(mult(2,4)));
sys.puts("avg(5)(6,7): " + avg(5)(6,7));

/* example of extending the knowledge base */
sys.puts("mult(1,1) BEFORE extending the database: " + mult(1,1));
mult('__addOnTop', 
	[1, 1, 42],
	[3, 1, 3.1415926535]
);
sys.puts("mult(1,1) AFTER extended the database with __addOnTop([1,1,42]): " + mult(1,1));

/* Test of the default functions */
sys.puts("mult(-3,4): " + mult(-3,4));
sys.puts("length([1,2,3]): " + length([1,2,3]));
sys.puts("tail([1,2,3]): " + sys.inspect(tail([1,2,3])));
sys.puts("head([1,2,3]): " + head([1,2,3]));
sys.puts("unshift(0, [1,2,3]): " + sys.inspect(unshift(0, [1,2,3])));
sys.puts("last([1,2,3]): " + last([1,2,3]));
sys.puts("foldr(mult, 1, [1,2,3,4]): " + foldr(mult, 1, [1,2,3,4]));

