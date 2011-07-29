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
