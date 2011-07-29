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

    
## Default functions

You can load the default functions globally by using `loadDefaults()` or additionally in node.js by assigning it to a variable with `var f = fctl.defaults()`.

The default functions are influenced by syntax and naming by the [Haskell Prelude functions](http://zvon.org/other/haskell/Outputprelude/). Currently there are no functions for tuples implemented.

All functions with two parameters which aren't commutative have an equivalent which's name is ending with "Re". These functions do the same but with transposed parameters as in particular use cases, like `lessthan(0)` you want to check something like `x<0`. But the particular usage of `lessthan` results in `0<x`, so you can use the "Re"-function.

### and :: Bool -> Bool -> Bool

### or :: Bool -> Bool -> Bool

### lessthan :: (Number a) => a -> a -> Bool

### lessthanRe :: (Number a) => a -> a -> Bool

Non-commutative function of `lessthan`, so `lessthanRe(0)` results in a particular function which checks if a number is less than 0.

### lessequal :: (Number a) => a -> a -> Bool

### lessequalRe :: (Number a) => a -> a -> Bool

Non-commutative function of `lessequal`, so `lessequalRe(0)` results in a particular function which checks if a number is less or equal 0.

### equal :: a -> a -> Bool

### equalRe :: a -> a -> Bool

Alias for `equal`. As the equal function is commutative, it's not necessary, but because all comparisons have an "Re" equivalent, this alias is defined.

### greaterequal :: (Number a) => a -> a -> Bool

### greaterequalRe :: (Number a) => a -> a -> Bool

Non-commutative function of `greaterequal`, so `greaterequalRe(0)` results in a particular function which checks if a number is greater or equal 0.

### greaterthan :: (Number a) => a -> a -> Bool

### greaterthanRe :: (Number a) => a -> a -> Bool

Non-commutative function of `greaterthan`, so `greaterthanRe(0)` results in a particular function which checks if a number is greater than 0.

### abs :: (Number a) => a -> a

## ToDo:

slides.js

- implement tuples

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
