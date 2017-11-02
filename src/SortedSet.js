/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { SetCollection, KeyedCollection } from './Collection';
import { IS_SORTED_SENTINEL, isSorted } from './Predicates';
import { Set, isSet } from './Set';
import { SortedMap, emptySortedMap } from './SortedMap';
import { mapFactory } from './Operations';

export class SortedSet extends Set {
  // @pragma Construction

  constructor(value, comparator, options) {
    if (!comparator) {
      if (this instanceof SortedSet) {
        comparator = this.getComparator();
      }
      if (!comparator) {
        comparator = SortedSet.defaultComparator;
      }
    }
    if (!options) {
      if (this instanceof SortedSet) {
        options = this.getOptions();
      }
      if (!options) {
        options = SortedSet.defaultOptions;
      }
    }
    return value === null || value === undefined
      ? emptySortedSet(comparator, options)
      : isSortedSet(value) &&
        value.getComparator() === comparator &&
        value.getOptions() === options
        ? value
        : emptySortedSet(comparator, options).withMutations(set => {
            set.pack(value);
          });
  }

  static of(/*...values*/) {
    return this(arguments);
  }

  static fromKeys(value) {
    return this(KeyedCollection(value).keySeq());
  }

  toString() {
    return this.__toString('SortedSet {', '}');
  }

  // @pragma Access

  getComparator() {
    return this._map.getComparator();
  }

  getOptions() {
    return this._map.getOptions();
  }

  // @pragma Modification

  pack(value) {
    const seq =
      value === undefined
        ? undefined
        : SetCollection(value)
            .toKeyedSeq()
            .mapKeys((k, v) => v);
    return updateSortedSet(this, this._map.pack(seq));
  }

  sort(comparator) {
    // Late binding
    return SortedSet(this, comparator, this.getOptions());
  }

  sortBy(mapper, comparator) {
    // Late binding
    return SortedSet(mapFactory(this, mapper), comparator, this.getOptions());
  }

  __ensureOwner(ownerID) {
    if (ownerID === this.__ownerID) {
      return this;
    }
    const newMap = this._map.__ensureOwner(ownerID);
    if (!ownerID) {
      if (this.size === 0) {
        return this.__empty();
      }
      this.__ownerID = ownerID;
      this._map = newMap;
      return this;
    }
    return this.__make(newMap, ownerID);
  }
}

export function isSortedSet(maybeSortedSet) {
  return isSet(maybeSortedSet) && isSorted(maybeSortedSet);
}

SortedSet.isSortedSet = isSortedSet;

SortedSet.defaultComparator = SortedMap.defaultComparator;
SortedSet.defaultOptions = SortedMap.defaultOptions;

const SortedSetPrototype = SortedSet.prototype;
SortedSetPrototype[IS_SORTED_SENTINEL] = true;

SortedSetPrototype.__empty = function() {
  return emptySortedSet(this.getComparator(), this.getOptions());
};
SortedSetPrototype.__make = makeSortedSet;

function updateSortedSet(set, newMap) {
  if (set.__ownerID) {
    set.size = newMap.size;
    set._map = newMap;
    return set;
  }
  return newMap === set._map
    ? set
    : newMap.size === 0 ? set.__empty() : set.__make(newMap);
}

function makeSortedSet(map, ownerID) {
  const set = Object.create(SortedSetPrototype);
  set.size = map ? map.size : 0;
  set._map = map;
  set.__ownerID = ownerID;
  return set;
}

function emptySortedSet(comparator, options) {
  return makeSortedSet(emptySortedMap(comparator, options));
}
