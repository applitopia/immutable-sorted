Immutable Sorted Collections for JavaScript
===========================================

This package is an extension of [Immutable.js](https://facebook.github.io/immutable-js/) which provides
additional Persistent Immutable data structures `SortedMap` and `SortedSet`.

These data structures are highly efficient minimizing the need to copy or cache data
by structural sharing via [B-trees](https://en.wikipedia.org/wiki/B-tree).


Installation
------------

```shell
npm install immutable-sorted
```

Examples
--------

SortedSet (see more examples on [SortedSet page](https://applitopia.github.io/pages/immutable-sorted/docs/#/SortedSet)):
```js
> const { SortedSet } = require('immutable-sorted');

> const set1=SortedSet(['orange', 'apple', 'banana']);
SortedSet { "apple", "banana", "orange" }

> const set2=set1.add('mango');
SortedSet { "apple", "banana", "mango", "orange" }

> const set3=set2.delete('banana');
SortedSet { "apple", "mango", "orange" }
```

SortedMap (see more examples on [SortedMap page](https://applitopia.github.io/pages/immutable-sorted/docs/#/SortedMap)):
```js
const { SortedMap, isSorted } = require('immutable-sorted');

> const map1=SortedMap([['orange','orange'], ['apple','red'], ['banana','yellow']]);
SortedMap { "apple": "red", "banana": "yellow", "orange": "orange" }

> const map2=map1.set('mango', 'yellow/orange');
SortedMap { "apple": "red", "banana": "yellow", "mango": "yellow/orange", "orange": "orange" }

> const map3=map2.delete('banana');
SortedMap { "apple": "red", "mango": "yellow/orange", "orange": "orange" }
```

License
-------

Modified work (Immutable Sorted collections) is MIT Licensed.

Original work (Immutable.js) is [BSD-licensed](https://github.com/facebook/immutable-js/blob/master/LICENSE) and additional [patent grant](https://github.com/facebook/immutable-js/blob/master/PATENTS) is provided.
