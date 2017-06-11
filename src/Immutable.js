/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { Seq } from './Seq';
import { OrderedMap } from './OrderedMap';
import { SortedMap } from './SortedMap';
import { List } from './List';
import { Map } from './Map';
import { Stack } from './Stack';
import { OrderedSet } from './OrderedSet';
import { Set } from './Set';
import { SortedSet } from './SortedSet';
import { Record } from './Record';
import { Range } from './Range';
import { Repeat } from './Repeat';
import { is } from './is';
import { fromJS } from './fromJS';
import {
  isImmutable,
  isCollection,
  isKeyed,
  isIndexed,
  isAssociative,
  isOrdered,
  isSorted,
  isValueObject
} from './Predicates';
import { Collection } from './CollectionImpl';
import { hash } from './Hash';

export default {
  Collection: Collection,
  // Note: Iterable is deprecated
  Iterable: Collection,

  Seq: Seq,
  Map: Map,
  OrderedMap: OrderedMap,
  SortedMap: SortedMap,
  List: List,
  Stack: Stack,
  Set: Set,
  OrderedSet: OrderedSet,
  SortedSet: SortedSet,

  Record: Record,
  Range: Range,
  Repeat: Repeat,

  is: is,
  fromJS: fromJS,
  hash: hash,

  isImmutable: isImmutable,
  isCollection: isCollection,
  isKeyed: isKeyed,
  isIndexed: isIndexed,
  isAssociative: isAssociative,
  isOrdered: isOrdered,
  isSorted: isSorted,
  isValueObject: isValueObject
};

// Note: Iterable is deprecated
const Iterable = Collection;

export {
  Collection,
  Iterable,
  Seq,
  Map,
  OrderedMap,
  SortedMap,
  List,
  Stack,
  Set,
  OrderedSet,
  SortedSet,
  Record,
  Range,
  Repeat,
  is,
  fromJS,
  hash,
  isImmutable,
  isCollection,
  isKeyed,
  isIndexed,
  isAssociative,
  isOrdered,
  isSorted,
  isValueObject
};
