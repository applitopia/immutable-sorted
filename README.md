Immutable Sorted Collections for JavaScript
===========================================

This package is an extension of [Immutable.js](https://facebook.github.io/immutable-js/) which provides
additional Persistent Immutable data structures `SortedMap` and `SortedSet`.

These data structures are highly efficient minimizing the need to copy or cache data
by structural sharing via [B-trees](https://en.wikipedia.org/wiki/B-tree).

Additional features include partial sort (first N items) using Floyd-Rivest select algorithm.

Version
-------

Current version [immutable-sorted@0.2.3](https://github.com/applitopia/immutable-sorted/releases/tag/v0.2.3) is an extension of [immutable-js@4.0.0-rc.9](https://github.com/facebook/immutable-js/releases/tag/v4.0.0-rc.9).

Installation
------------

```shell
npm install immutable-sorted
```

SortedSet
---------

See more details on [SortedSet](https://applitopia.github.io/pages/immutable-sorted/docs/#/SortedSet) page.

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

When iterating a SortedSet, the entries will be (value, value) pairs. Iteration order of a SortedSet is determined by a comparator.

Set values, like Map keys, may be of any type. Equality is determined by comparator returning 0 value. In case of a custom comparator the equality may be redefined to have a different meaning than Immutable.is.

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

See more details on [SortedMap](https://applitopia.github.io/pages/immutable-sorted/docs/#/SortedMap) page.

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
function for efficiently sorting the first N items in the collections using
Floyd-Rivest select algorithm.

Example:
```js
> const { Seq } = require('immutable-sorted');

> const seq1=Seq(['orange', 'apple', 'banana']);
> seq1.partialSort(2)
Seq [ "apple", "banana" ]
```

License
-------

MIT License

Original work Copyright (c) 2014-present, Facebook, Inc.

Modified work Copyright (c) 2017, Applitopia, Inc.
