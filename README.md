# functionalJS

A Javascript library to imitate aspects of functional programming languages. It's influenced by the syntax and functions of [Haskell](http://www.haskell.org/haskellwiki/Haskell).

Using functionalJS in a browser is straight-forward:
    
    <script type="text/javascript" src="functional.js"></script>
    <script type="text/javascript">

		// load default functions globally (for a list see below)
      loadDefaults();
      
      testFunctional = new Functional(
      	...
      );

    </script>

Using functionalJS in node.js is equally easy:

    var fctl = require('./functional');
    Functional = fctl.Functional;
    
    // load default functions globally
    fctl.loadDefaults();
    // or load default functions into a hash
    var f = fctl.defaults();
    
    testFunctional = new Functional(
    	...
    );

## The Functional Object

The Functional Object provides a functional equivalent to Javascript's `Function()` constructor.

### Constructor: new Functional()
The constructor takes the knowledge database for this functional, which will be examined in the order listed here. As it's not possible to specify a name like in the `function xyz()` constructor, you can simply name it by provide a string in the arguments list, like `var test = new Functional('test', ...)`.

The other arguments should be the knowledge database for this function. Make sure to note the order as it's important for a correct solution. Each pattern entry can be provided by an array. The last array element specifies the returning value or the function to call. Strings in the arguments list will be automatically detected as variable names, `[]` matches an empty list, `[x:xs]` (or other variable names) matches every non-empty list.

Valid entries for the knowledge database would be:

- `[0, 1]` (matches exactly `0` and returns `1`)
- `["n", function(n) { return n+1; }]` (matches any number and returns it's successor)
- `["[]", 0]` (matches an empty list and returns `0`)
- `["[x:xs]", function(x, xs) { return ...; }]` (matches any non-empty list)
- `["[a:b:rest]", function (a, b, rest) { return ...; }]` (matches any list with at least two elements)
- `function(a, b) { return a+b; }` (matches all)

As you can see in the last example it's also possible to provide a function instead of an array for the knowledge database, then it will automatically create an equivalent entry with `["a", "b", function(a, b) {...}]`.

Correct constructor calls would be:

    foldr = new Functional("foldr",
                ["f", "i", "[]", function(f, i) { return i; }],
		["f", "i", "[x:xs]", function(f, i, x, xs) { return f(x, foldr(f, i, xs)); }]
    );

    fibonacci = new Functional("fibonacci",

                [0, 0],

                [1, 1],

                function(n) { return fibonacci(n-1)+fibonacci(n-2); }

    );

### Evaluation

You can use your own and the predefined functions simply like a function

    mult(-3, 4) // results in -12

One of the best thing about functional programming language is that you can evaluate all functionals particularly. So the default functional `sum` is defined very easy:

    sum = foldr(add, 0) // results in a particular function which expects just a list

With particular evalutation it's easy to reuse your functions or to use the default ones:

    until(greaterthanRe(80), mult(2), 1) // results in 128, greaterthanRe(80) and mult(2) are particular functionals

### Special operations

It's also possible to manipulate the knowledge database of an already existing Functional. With special keywords is also possible to get it's name and it's whole knownledge database. You can execute the special operations just by call the keywords instead of the evaluation, e.g. 

    mult('__list')

- __list - returns the current knowledge database
- __name - returns the name of this Functional if specified with the Constructor
- __add - adds new entries to the knowledge database at the end
- __addOnTop - adds new entries to the end of the knowledge database

A valid extending operation would be:

    mult('__addOnTop', 
        [1, 1, 42],            // mult(1,1) now returns 42
        [3, 1, 3.1415926535]   // mult(3,1) now returns Pi
    );

## Default functions

You can load the default functions globally by using `loadDefaults()` or additionally in node.js by assigning it to a variable with `var f = fctl.defaults()`.

The default functions are influenced by syntax and naming by the [Haskell Prelude functions](http://zvon.org/other/haskell/Outputprelude/). Currently there are no functions for tuples implemented.

All functions with two parameters which aren't commutative have an equivalent which's name is ending with "Re". These functions do the same but with transposed parameters as in particular use cases, like `lessthan(0)` you want to check something like `x<0`. But the particular usage of `lessthan` results in `0<x`, so you can use the "Re"-function.

### Bool operations
- and :: Bool -> Bool -> Bool
- or :: Bool -> Bool -> Bool

### Number operations
- lessthan :: (Number a) => a -> a -> Bool
- lessthanRe :: (Number a) => a -> a -> Bool
- lessequal :: (Number a) => a -> a -> Bool
- lessequalRe :: (Number a) => a -> a -> Bool
- equal :: a -> a -> Bool
- equalRe :: a -> a -> Bool
- greaterequal :: (Number a) => a -> a -> Bool
- greaterequalRe :: (Number a) => a -> a -> Bool
- greaterthan :: (Number a) => a -> a -> Bool
- greaterthanRe :: (Number a) => a -> a -> Bool
- abs :: (Number a) => a -> a
- signum :: (Number a) => a -> a
- add :: (Number a) => a -> a -> a
- sub :: (Number a) => a -> a -> a
- subRe :: (Number a) => a -> a -> a
- mult :: (Number a) => a -> a -> a
- ratio :: (Number a) => a -> a -> a
- ratioRe :: (Number a) => a -> a -> a
- div :: (Int a) => a -> a -> a
- divRe :: (Int a) => a -> a -> a
- modRe :: (Int a) => a -> a -> a

### List operations
- unwords :: (String a) => [a] -> a
- tail :: [a] -> [a]
- head :: [a] -> a
- last :: [a] -> a
- unshift :: a -> [a] -> [a]
- push :: a -> [a] -> [a]
- length :: (Int b) => [a] -> b
- concat :: [a] -> [a] -> [a]
- reverse :: [a] -> [a]
- replicate :: (Int a) => a -> b -> [b]
- drop :: (Int a) => a -> [b] -> [b]
- take :: (Int a) => a -> [b] -> [b]
- takeWhile :: (a -> Bool) -> [a] -> [a]
- foldr :: (a -> b -> b) -> b -> [a] -> b
- foldl :: (a -> b -> a) -> a -> [b] -> a
- sum :: (Number a) => [a] -> a
- avg :: (Number a) => [a] -> a
- map :: (a -> b) -> [a] -> [b]
- all :: (a -> Bool) -> [a] -> Bool
- any :: (a -> Bool) -> [a] -> Bool
- until :: (a -> Bool) -> (a -> a) -> a -> a

## ToDo:

- implement tuples and related functions

## License

	Copyright 2011 Falco Nogatz. 

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	 http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
