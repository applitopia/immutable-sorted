/**
 *  Copyright (c) 2017, Applitopia, Inc.
 *  All rights reserved.
 *
 *  Modified source code is licensed under the MIT-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  Original source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

export class SortedMapNode {
  constructor(comparator, options, ownerID) {
    this.comparator = comparator;
    this.options = options;
    this.ownerID = ownerID;
  }

  getComparator() {}
  get(key, notSetValue) {}
  upsert(ownerID, key, value, didChangeSize, didAlter) {}
  remove(ownerID, key, didChangeSize, didAlter) {}
  fastRemove(ownerID, key, didChangeSize, didAlter) {}
  iterate(fn, reverse) {}
  print(level, maxDepth) {}
  checkConsistency(printFlag) {}
}

export class SortedMapPacker {
  constructor() {}
  pack(comparator, options, ownerID, collection) {}
}

export class SortedMapNodeFactory {
  constructor() {}
  createNode(comparator, options, ownerID, entries, nodes) {}
  createPacker() {}
  createIterator(map, type, reverse) {}
}
