Immutable Sorted Collections for JavaScript
===========================================
[![npm version](https://badge.fury.io/js/immutable-sorted.svg)](https://badge.fury.io/js/immutable-sorted)
[![jest](https://img.shields.io/badge/tested_with-jest-brightgreen.svg)](https://facebook.github.io/jest/)
[![dependencies](https://img.shields.io/david/applitopia/immutable-sorted.svg)](https://david-dm.org/applitopia/immutable-sorted)
[![devDependencies](https://img.shields.io/david/dev/applitopia/immutable-sorted.svg)](https://david-dm.org/applitopia/immutable-sorted?type=dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This package is an extension of popular collections library [Immutable.js](https://github.com/facebook/immutable-js). It provides additional immutable collections [SortedMap](https://applitopia.github.io/immutable-sorted/docs/#/SortedMap) and [SortedSet](https://applitopia.github.io/immutable-sorted/docs/#/SortedSet) that maintain their entries sorted by a comparator. The current implementation is using a classic [B-tree](https://en.wikipedia.org/wiki/B-tree) memory structure.

Additionally, this package provides [partial sort](https://en.wikipedia.org/wiki/Partial_sorting) (returning the `n smallest elements`)
and [incremental sort](https://en.wikipedia.org/wiki/Selection_algorithm#Incremental_sorting_by_selection)
operations implemented using [Floyd-Rivest](https://en.wikipedia.org/wiki/Floyd%E2%80%93Rivest_algorithm) variant of [selection algorithm](https://en.wikipedia.org/wiki/Selection_algorithm).

Version
-------

The current version [immutable-sorted@0.2.9](https://github.com/applitopia/immutable-sorted/releases/tag/v0.2.9) is an extension of [immutable-js@4.0.0-rc.12](https://github.com/facebook/immutable-js/releases/tag/v4.0.0-rc.12).


Installation
------------

```shell
npm install immutable-sorted
```

SortedSet
---------

See more details on [SortedSet](https://applitopia.github.io/immutable-sorted/docs/#/SortedSet) page.

SortedSet is a type of Set that keeps its values sorted by a comparator. The current implementation is using a classic B-Tree memory structure with O(N) space requirements and O(log N) get, add, and delete operations.

Example:
```js
> const { SortedSet } = require('immutable-sorted');

> const set1=SortedSet(['orange', 'apple', 'banana']);
SortedSet { "apple", "banana", "orange" }

> const set2=set1.add('mango');
SortedSet { "apple", "banana", "mango", "orange" }

> const set3=set2.delete('banana');
SortedSet { "apple", "mango", "orange" }
```

Using a custom comparator:

```js
> const reverseCmp=(a,b)=>(a>b?-1:a<b?1:0);

> const set4=SortedSet(set1, reverseCmp);
SortedSet { "orange", "banana", "apple" }

> const set5=set4.add('mango');
SortedSet { "orange", "mango", "banana", "apple" }

> const set6=set5.delete('banana');
SortedSet { "orange", "mango", "apple" }
```

Set values, like Map keys, may be of any type. Equality is determined by comparator returning 0 value. In case of a custom comparator the equality may be redefined to have a different meaning than Immutable.is.

**Searching SortedSet**

Many real applications require ability to efficiently search in a sorted dataset. The method:

```js
from(value, backwards) 
```

returns a sequence that represents a subset of a sorted set starting with value 
up to the last element in the set.

If the optional parameter backwards is set to true, the returned sequence will
list the entries backwards, starting with value down to the first element in the set.

Example:
```js
const { SortedSet } = require('immutable-sorted');

const abc = SortedSet(["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]);

> abc.from("R");
Seq { "R", "S", "T", "U", "V", "W", "X", "Y", "Z" }

> abc.from("R", true);
Seq { "R", "Q", "P", "O", "N", "M", "L", "K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A" }
```

The method from() can be efficiently combined with take() to retrieve the desired number of values or with takeWhile() to retrieve a specific range:
```js
> abc.from("R").take(5);
Seq { "R", "S", "T", "U", "V" }

> abc.from("R").takeWhile(s => s < "W");
Seq { "R", "S", "T", "U", "V" }

> abc.from("R", true).take(5);
Seq { "R", "Q", "P", "O", "N" }

> abc.from("R", true).takeWhile(s => s > "K");
Seq { "R", "Q", "P", "O", "N", "M", "L" }
```

**Working with objects**

Many real use cases will be about storing the whole objects in SortedSet. That will usually be meaningful only when custom comparator is defined.

Let's consider the following example with city objects:

```js
> const { SortedSet, Seq, fromJS } = require('immutable-sorted');

// Have an array of city objects
> const cities=[
   {state: 'MA', city: 'Boston'},
   {city: 'Miami', state: 'FL'},
   {city: 'Seattle', state: 'WA'},
   {city: 'Phoenix', state: 'AZ'}];

// Make a seq that converts cities from JS into immutable objects
> const citiesSeq=Seq(cities).map((v)=>fromJS(v));

// Create a default SortedSet
> const set1=SortedSet(citiesSeq);
SortedSet {
   Map { "city": "Miami", "state": "FL" },
   Map { "city": "Phoenix", "state": "AZ" },
   Map { "city": "Seattle", "state": "WA" },
   Map { "state": "MA", "city": "Boston" } }
```

When relying on defaultComparator, like in example above, the objects get sorted by their string representations from toString() method. This is usually not what the application designers want. In our case it makes more sense to sort by the city name, than the whole string representation.

Let's create a custom comparator:

```js
// Define a general comparator
> const cmp=(a,b)=>(a>b?1:(a<b?-1:0));

// Define a comparator of city names
> let citiesCmp=(a,b)=>cmp(a.get('city'), b.get('city'));

// Create a SortedSet with custom comparator
> const set2=SortedSet(citiesSeq, citiesCmp);
SortedSet {
   Map { "state": "MA", "city": "Boston" },
   Map { "city": "Miami", "state": "FL" },
   Map { "city": "Phoenix", "state": "AZ" },
   Map { "city": "Seattle", "state": "WA" } }
```

The custom comparator that we have created seems to work as expected. Now let's add into the collection another city of Phoenix, this time from state Illinois.

```js
> const set3=set2.add(fromJS({city: 'Phoenix', state: 'IL'}));
SortedSet {
   Map { "state": "MA", "city": "Boston" },
   Map { "city": "Miami", "state": "FL" },
   Map { "city": "Phoenix", "state": "IL" },
   Map { "city": "Seattle", "state": "WA" } }
```

The Phoenix, AZ had been replaced with Phoenix, IL. This is because of the way the custom comparator is defined. It determines equality by comparing city names only, therefore Phoenix, AZ and Phoenix, IL are equal according to this comparator. Let's try to extend the comparator to compare the city name first and if they match then determine the result by comparing the state.

```js
// Define more complex custom comparator
> citiesCmp=(a,b)=>cmp(a.get('city'), b.get('city'))||cmp(a.get('state'), b.get('state'));

// Create a new SortedSet with new custom comparator
> const set4=SortedSet(set2, citiesCmp);
SortedSet {
   Map { "state": "MA", "city": "Boston" },
   Map { "city": "Miami", "state": "FL" },
   Map { "city": "Phoenix", "state": "AZ" },
   Map { "city": "Seattle", "state": "WA" } }

// set4 looks the same as set2, now let's add the conflicting Phoenix, IL to set4
> const set5=set4.add(fromJS({city: 'Phoenix', state: 'IL'}));
SortedSet {
   Map { "state": "MA", "city": "Boston" },
   Map { "city": "Miami", "state": "FL" },
   Map { "city": "Phoenix", "state": "AZ" },
   Map { "city": "Phoenix", "state": "IL" },
   Map { "city": "Seattle", "state": "WA" } }
```

The custom comparator behaves as expected. Now let's swap the order of commands in the comparator and sort by state first and by city name second.

```js
> const stateCitiesCmp=(a,b)=>cmp(a.get('state'), b.get('state'))||cmp(a.get('city'), b.get('city'));

> const set6=SortedSet(set5, stateCitiesCmp);
SortedSet {
   Map { "city": "Phoenix", "state": "AZ" },
   Map { "city": "Miami", "state": "FL" },
   Map { "city": "Phoenix", "state": "IL" },
   Map { "state": "MA", "city": "Boston" },
   Map { "city": "Seattle", "state": "WA" } }
```

SortedMap
---------

See more details on [SortedMap](https://applitopia.github.io/immutable-sorted/docs/#/SortedMap) page.

SortedMap is a type of Map that keeps its entries (their keys) sorted by a comparator. The current implementation is using a classic B-Tree memory structure with O(N) space requirements and O(log N) get, set, and delete operations.

Example:
```js
const { SortedMap } = require('immutable-sorted');

> const map1=SortedMap([['orange','orange'], ['apple','red'], ['banana','yellow']]);
SortedMap { "apple": "red", "banana": "yellow", "orange": "orange" }

> const map2=map1.set('mango', 'yellow/orange');
SortedMap { "apple": "red", "banana": "yellow", "mango": "yellow/orange", "orange": "orange" }

> const map3=map2.delete('banana');
SortedMap { "apple": "red", "mango": "yellow/orange", "orange": "orange" }
```

Using a custom comparator:

```js
> const reverseCmp=(a,b)=>(a>b?-1:(a<b?1:0));

> const map4=SortedMap(map1, reverseCmp);
SortedMap { "orange": "orange", "banana": "yellow", "apple": "red" }

> const map5=map4.set('mango', 'yellow/orange');
SortedMap { "orange": "orange", "mango": "yellow/orange", "banana": "yellow", "apple": "red" }

> const map6=map5.delete('banana');
SortedMap { "orange": "orange", "mango": "yellow/orange", "apple": "red" }
```

When iterating a SortedMap, the order of entries is guaranteed to be the same as the sorted order of keys determined by a comparator.

Map keys and values may be of any type. Equality of keys is determined by comparator returning 0 value. In case of a custom comparator the equality may be redefined to have a different meaning than Immutable.is.

**Searching SortedMap**

Many real applications require ability to efficiently search in a sorted data structure. The method:

```js
from(key, backwards)
```

returns a sequence that represents a portion of this sorted map starting with a specific key up to the last entry in the sorted  map.

If the optional parameter backwards is set to true, the returned sequence will list the entries backwards, starting with key down to the first entry in the sorted map.

Example:
```js
> const abc = SortedMap([["A", "a"], ["B", "b"], ["C", "c"], ["D", "d"], ["E", "e"], ["F", "f"], ["G", "g"], ["H", "h"], ["I", "i"], ["J", "j"], ["K", "k"], ["L", "l"], ["M", "m"], ["N", "n"], ["O", "o"], ["P", "p"], ["Q", "q"], ["R", "r"], ["S", "s"], ["T", "t"], ["U", "u"], ["V", "v"], ["W", "w"], ["X", "x"], ["Y", "y"], ["Z", "z"]]);
 
> abc.from("R");
Seq { "R": "r", "S": "s", "T": "t", "U": "u", "V": "v", "W": "w", "X": "x", "Y": "y", "Z": "z" }
 
> abc.from("R", true);
Seq { "R": "r", "Q": "q", "P": "p", "O": "o", "N": "n", "M": "m", "L": "l", "K": "k", "J": "j", "I": "i", "H": "h", "G": "g", "F": "f", "E": "e", "D": "d", "C": "c", "B": "b", "A": "a" }
```

The method from() can be efficiently combined with take() to retrieve the desired number of values or with takeWhile() to retrieve a specific range:
```js
> abc.from("R").take(5);
Seq { "R": "r", "S": "s", "T": "t", "U": "u", "V": "v" }

> abc.from("R").takeWhile((v, k) => k < "W");
Seq { "R": "r", "S": "s", "T": "t", "U": "u", "V": "v" }
 
> abc.from("R", true).take(5);
Seq { "R": "r", "Q": "q", "P": "p", "O": "o", "N": "n" }
 
> abc.from("R", true).takeWhile((v, k) => k > "K");
Seq { "R": "r", "Q": "q", "P": "p", "O": "o", "N": "n", "M": "m", "L": "l" }
```

**Working with objects**

Many real use cases will be about storing the whole objects in SortedMap. That will usually be meaningful only when custom comparator is defined.

Let's consider the following example with city objects as keys and their co-ordinates as values:

```js
> const { SortedMap, Seq, fromJS } = require('immutable-sorted');

// Have an array of city objects
> const cities=[
   [{state: 'MA', city: 'Boston'}, ['42°21′N','71°04′W']],
   [{city: 'Miami', state: 'FL'},['25°47′N','80°13′W']],
   [{city: 'Seattle', state: 'WA'},['47°37′N','122°20′W']],
   [{city: 'Phoenix', state: 'AZ'},['33°27′N','112°04′W']]];

// Make a seq that converts cities and their co-ordinates from JS into immutable objects
> const citiesSeq=Seq.Keyed(cities).mapKeys((v)=>fromJS(v)).map((v)=>fromJS(v));
Seq {
   Map { "state": "MA", "city": "Boston" }: List [ "42°21′N", "71°04′W" ],
   Map { "city": "Miami", "state": "FL" }: List [ "25°47′N", "80°13′W" ],
   Map { "city": "Seattle", "state": "WA" }: List [ "47°37′N", "122°20′W" ],
   Map { "city": "Phoenix", "state": "AZ" }: List [ "33°27′N", "112°04′W" ] }

// Create a default SortedMap
> const map1=SortedMap(citiesSeq);
SortedMap {
   Map { "city": "Miami", "state": "FL" }: List [ "25°47′N", "80°13′W" ],
   Map { "city": "Phoenix", "state": "AZ" }: List [ "33°27′N", "112°04′W" ],
   Map { "city": "Seattle", "state": "WA" }: List [ "47°37′N", "122°20′W" ],
   Map { "state": "MA", "city": "Boston" }: List [ "42°21′N", "71°04′W" ] }
```

When relying on defaultComparator, like in example above, the objects get sorted by their string representations from toString() method. This is usually not what the application designers want. In our case it makes more sense to sort by the city name, than the whole string representation.

Let's create a custom comparator:

```js
// Define a general simple comparator
> const cmp=(a,b)=>(a>b?1:(a<b?-1:0));

// Define a comparator of city names
> let citiesCmp=(a,b)=>cmp(a.get('city'), b.get('city'));

// Create a SortedSet with custom comparator
> const map2=SortedMap(citiesSeq, citiesCmp);
SortedMap {
   Map { "state": "MA", "city": "Boston" }: List [ "42°21′N", "71°04′W" ],
   Map { "city": "Miami", "state": "FL" }: List [ "25°47′N", "80°13′W" ],
   Map { "city": "Phoenix", "state": "AZ" }: List [ "33°27′N", "112°04′W" ],
   Map { "city": "Seattle", "state": "WA" }: List [ "47°37′N", "122°20′W" ] }
```

The custom comparator that we have created seems to work as expected. Now let's add into the collection another city of Phoenix, this time from state Illinois.

```js
> const map3=map2.set(fromJS({city: 'Phoenix', state: 'IL'}), fromJS(['41°36′N','87°37′W']));
SortedMap {
   Map { "state": "MA", "city": "Boston" }: List [ "42°21′N", "71°04′W" ],
   Map { "city": "Miami", "state": "FL" }: List [ "25°47′N", "80°13′W" ],
   Map { "city": "Phoenix", "state": "IL" }: List [ "41°36′N", "87°37′W" ],
   Map { "city": "Seattle", "state": "WA" }: List [ "47°37′N", "122°20′W" ] }
```

The Phoenix, AZ had been replaced with Phoenix, IL. This is because of the way the custom comparator is defined. It determines equality by comparing city names only, therefore Phoenix, AZ and Phoenix, IL are equal according to this comparator. Let's try to extend the comparator to compare the city name first and if they match then determine the result by comparing the state.

```js
// Define more complex custom comparator
> citiesCmp=(a,b)=>cmp(a.get('city'), b.get('city'))||cmp(a.get('state'), b.get('state'));

// Create a new SortedMap with new custom comparator
> const map4=SortedMap(map2, citiesCmp);
SortedMap {
   Map { "state": "MA", "city": "Boston" }: List [ "42°21′N", "71°04′W" ],
   Map { "city": "Miami", "state": "FL" }: List [ "25°47′N", "80°13′W" ],
   Map { "city": "Phoenix", "state": "AZ" }: List [ "33°27′N", "112°04′W" ],
   Map { "city": "Seattle", "state": "WA" }: List [ "47°37′N", "122°20′W" ] }

// map4 looks the same as map2, now let's add the conflicting Phoenix, IL to map4
> const map5=map4.set(fromJS({city: 'Phoenix', state: 'IL'}), fromJS(['41°36′N','87°37′W']));
SortedMap {
   Map { "state": "MA", "city": "Boston" }: List [ "42°21′N", "71°04′W" ],
   Map { "city": "Miami", "state": "FL" }: List [ "25°47′N", "80°13′W" ],
   Map { "city": "Phoenix", "state": "AZ" }: List [ "33°27′N", "112°04′W" ],
   Map { "city": "Phoenix", "state": "IL" }: List [ "41°36′N", "87°37′W" ],
   Map { "city": "Seattle", "state": "WA" }: List [ "47°37′N", "122°20′W" ] }
```

The custom comparator behaves as expected. Now let's swap the order of commands in the comparator and sort by state first and by city name second.

```js
> const stateCitiesCmp=(a,b)=>cmp(a.get('state'), b.get('state'))||cmp(a.get('city'), b.get('city'));

> const map6=SortedMap(map5, stateCitiesCmp);
SortedMap {
   Map { "city": "Phoenix", "state": "AZ" }: List [ "33°27′N", "112°04′W" ],
   Map { "city": "Miami", "state": "FL" }: List [ "25°47′N", "80°13′W" ],
   Map { "city": "Phoenix", "state": "IL" }: List [ "41°36′N", "87°37′W" ],
   Map { "state": "MA", "city": "Boston" }: List [ "42°21′N", "71°04′W" ],
   Map { "city": "Seattle", "state": "WA" }: List [ "47°37′N", "122°20′W" ] }
  ```

Partial sort
------------

Any collection (including sequences) provides partialSort() and partialSortBy()
functions for efficiently finding and sorting the `n smallest elements` in a collection using
Floyd-Rivest select algorithm.

Example:
```js
> const { Seq } = require('immutable-sorted');

> const seq1=Seq(['orange', 'apple', 'banana']);
> seq1.partialSort(2)
Seq [ "apple", "banana" ]
```

Incremental sort
----------------

Any collection (including sequences) also provides incSort() and incSortBy()
functions optimized to provide first entries of the result set faster than regular sort().
This function is expected to be used with iterators or sequence operations
retrieving limited number of result entries.

Example:
```js
> const { Seq } = require('immutable-sorted');

> const seq1=Seq(['orange', 'apple', 'banana']);
> seq1.incSort().take(2)
Seq [ "apple", "banana" ]
```

License
-------

MIT License

Modified work Copyright (c) 2017-present, Applitopia, Inc.

Original work Copyright (c) 2014-present, Facebook, Inc.
