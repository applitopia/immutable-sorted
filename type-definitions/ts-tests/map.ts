/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Map, List } from '../../';

{ // #constructor

  // $ExpectType Map<{}, {}>
  Map();

  // $ExpectType Map<number, string>
  Map([[1, 'a']]);

  // $ExpectType Map<number, string>
  Map(List<[number, string]>([[1, 'a']]));

  // $ExpectType Map<string, number>
  Map({ a: 1 });

  // $ExpectError - TypeScript does not support Lists as tuples
  Map(List([List(['a', 'b'])]));

  // $ExpectError
  const invalidNumberMap: Map<number, number> = Map();
}

{ // #size

  // $ExpectType number
  Map().size;

  // $ExpectError
  Map().size = 10;
}

{ // #get

  // $ExpectType number | undefined
  Map<number, number>().get(4);

  // $ExpectType number | "a"
  Map<number, number>().get(4, 'a');

  // $ExpectError
  Map<number, number>().get<number, number>(4, 'a');
}

{ // #set

  // $ExpectType Map<number, number>
  Map<number, number>().set(0, 0);

  // $ExpectError
  Map<number, number>().set(1, 'a');

  // $ExpectError
  Map<number, number>().set('a', 1);

  // $ExpectType Map<number, string | number>
  Map<number, number | string>().set(0, 1);

  // $ExpectType Map<number, string | number>
  Map<number, number | string>().set(0, 'a');
}

{ // #setIn

  // $ExpectType Map<number, number>
  Map<number, number>().setIn([], 0);
}

{ // #delete

  // $ExpectType Map<number, number>
  Map<number, number>().delete(0);

  // $ExpectError
  Map<number, number>().delete('a');
}

{ // #deleteAll

  // $ExpectType Map<number, number>
  Map<number, number>().deleteAll([0]);

  // $ExpectError
  Map<number, number>().deleteAll([0, 'a']);
}

{ // #deleteIn

  // $ExpectType Map<number, number>
  Map<number, number>().deleteIn([]);
}

{ // #remove

  // $ExpectType Map<number, number>
  Map<number, number>().remove(0);

  // $ExpectError
  Map<number, number>().remove('a');
}

{ // #removeAll

  // $ExpectType Map<number, number>
  Map<number, number>().removeAll([0]);

  // $ExpectError
  Map<number, number>().removeAll([0, 'a']);
}

{ // #removeIn

  // $ExpectType Map<number, number>
  Map<number, number>().removeIn([]);
}

{ // #clear

  // $ExpectType Map<number, number>
  Map<number, number>().clear();

  // $ExpectError
  Map().clear(10);
}

{ // #update

  // $ExpectType number
  Map().update(v => 1);

  // $ExpectError
  Map<number, number>().update((v: Map<string>) => v);

  // $ExpectType Map<number, number>
  Map<number, number>().update(0, (v: number) => 0);

  // $ExpectError
  Map<number, number>().update(0, (v: number) => v + 'a');

  // $ExpectType Map<number, number>
  Map<number, number>().update(1, 10, (v: number) => 0);

  // $ExpectError
  Map<number, number>().update(1, 'a', (v: number) => 0);

  // $ExpectError
  Map<number, number>().update(1, 10, (v: number) => v + 'a');
}

{ // #updateIn

  // $ExpectType Map<number, number>
  Map<number, number>().updateIn([], v => v);

  // $ExpectError
  Map<number, number>().updateIn([], 10);
}

{ // #map

  // $ExpectType Map<number, number>
  Map<number, number>().map((value: number, key: number, iter: Map<number, number>) => 1);

  // $ExpectType Map<number, string>
  Map<number, number>().map((value: number, key: number, iter: Map<number, number>) => 'a');

  // $ExpectType Map<number, number>
  Map<number, number>().map<number>((value: number, key: number, iter: Map<number, number>) => 1);

  // $ExpectError
  Map<number, number>().map<string>((value: number, key: number, iter: Map<number, number>) => 1);

  // $ExpectError
  Map<number, number>().map<number>((value: string, key: number, iter: Map<number, number>) => 1);

  // $ExpectError
  Map<number, number>().map<number>((value: number, key: string, iter: Map<number, number>) => 1);

  // $ExpectError
  Map<number, number>().map<number>((value: number, key: number, iter: Map<number, string>) => 1);

  // $ExpectError
  Map<number, number>().map<number>((value: number, key: number, iter: Map<number, number>) => 'a');
}

{ // #mapKeys

  // $ExpectType Map<number, number>
  Map<number, number>().mapKeys((value: number, key: number, iter: Map<number, number>) => 1);

  // $ExpectType Map<string, number>
  Map<number, number>().mapKeys((value: number, key: number, iter: Map<number, number>) => 'a');

  // $ExpectType Map<number, number>
  Map<number, number>().mapKeys<number>((value: number, key: number, iter: Map<number, number>) => 1);

  // $ExpectError
  Map<number, number>().mapKeys<string>((value: number, key: number, iter: Map<number, number>) => 1);

  // $ExpectError
  Map<number, number>().mapKeys<number>((value: string, key: number, iter: Map<number, number>) => 1);

  // $ExpectError
  Map<number, number>().mapKeys<number>((value: number, key: string, iter: Map<number, number>) => 1);

  // $ExpectError
  Map<number, number>().mapKeys<number>((value: number, key: number, iter: Map<number, string>) => 1);

  // $ExpectError
  Map<number, number>().mapKeys<number>((value: number, key: number, iter: Map<number, number>) => 'a');
}

{ // #flatMap

  // $ExpectType Map<number, number>
  Map<number, number>().flatMap((value: number, key: number, iter: Map<number, number>) => [[0, 1]]);

  // $ExpectType Map<string, string>
  Map<number, number>().flatMap((value: number, key: number, iter: Map<number, number>) => [['a', 'b']]);

  // $ExpectType Map<number, number>
  Map<number, number>().flatMap<number, number>((value: number, key: number, iter: Map<number, number>) => [[0, 1]]);

  // $ExpectError
  Map<number, number>().flatMap<number, string>((value: number, key: number, iter: Map<number, number>) => [[0, 1]]);

  // $ExpectError
  Map<number, number>().flatMap<number, number>((value: string, key: number, iter: Map<number, number>) => [[0, 1]]);

  // $ExpectError
  Map<number, number>().flatMap<number, number>((value: number, key: string, iter: Map<number, number>) => [[0, 1]]);

  // $ExpectError
  Map<number, number>().flatMap<number, number>((value: number, key: number, iter: Map<number, string>) => [[0, 1]]);

  // $ExpectError
  Map<number, number>().flatMap<number, number>((value: number, key: number, iter: Map<number, number>) => [[0, 'a']]);
}

{ // #merge

  // $ExpectType Map<string, number>
  Map<string, number>().merge({ a: 1 });

  // $ExpectType Map<string, number | { b: number; }>
  Map<string, number>().merge({ a: { b: 1 } });

  // $ExpectType Map<number, number>
  Map<number, number>().merge(Map<number, number>());

  // $ExpectType Map<number, string | number>
  Map<number, number>().merge(Map<number, string>());

  // $ExpectType Map<number, string | number>
  Map<number, number | string>().merge(Map<number, string>());

  // $ExpectType Map<number, string | number>
  Map<number, number | string>().merge(Map<number, number>());
}

{ // #mergeIn

  // $ExpectType Map<number, number>
  Map<number, number>().mergeIn([], []);
}

{ // #mergeWith

  // $ExpectType Map<number, number>
  Map<number, number>().mergeWith((prev: number, next: number, key: number) => 1, Map<number, number>());

  // $ExpectError
  Map<number, number>().mergeWith((prev: string, next: number, key: number) => 1, Map<number, number>());

  // $ExpectError
  Map<number, number>().mergeWith((prev: number, next: string, key: number) => 1, Map<number, number>());

  // $ExpectError
  Map<number, number>().mergeWith((prev: number, next: number, key: string) => 1, Map<number, number>());

  // $ExpectError
  Map<number, number>().mergeWith((prev: number, next: number, key: number) => 'a', Map<number, number>());

  // $ExpectError
  Map<number, number>().mergeWith((prev: number, next: number, key: number) => 1, Map<number, string>());

  // $ExpectType Map<string, number>
  Map<string, number>().mergeWith((prev: number, next: number, key: string) => 1, { a: 1 });

  // $ExpectError
  Map<string, number>().mergeWith((prev: number, next: number, key: string) => 1, { a: 'a' });

  // $ExpectType Map<number, string | number>
  Map<number, number | string>().mergeWith((prev: number, next: string, key: number) => 1, Map<number, string>());
}

{ // #mergeDeep

  // $ExpectType Map<string, number>
  Map<string, number>().mergeDeep({ a: 1 });

  // $ExpectError
  Map<string, number>().mergeDeep({ a: { b: 1 } });

  // $ExpectType Map<number, number>
  Map<number, number>().mergeDeep(Map<number, number>());

  // $ExpectError
  Map<number, number>().mergeDeep(Map<number, string>());

  // $ExpectType Map<number, string | number>
  Map<number, number | string>().mergeDeep(Map<number, string>());

  // $ExpectType Map<number, string | number>
  Map<number, number | string>().mergeDeep(Map<number, number>());
}

{ // #mergeDeepIn

  // $ExpectType Map<number, number>
  Map<number, number>().mergeDeepIn([], []);
}

{ // #mergeDeepWith

  // $ExpectType Map<number, number>
  Map<number, number>().mergeDeepWith((prev: number, next: number, key: number) => 1, Map<number, number>());

  // $ExpectError
  Map<number, number>().mergeDeepWith((prev: number, next: number, key: number) => 1, Map<number, string>());

  // $ExpectType Map<string, number>
  Map<string, number>().mergeDeepWith((prev: number, next: number, key: string) => 1, { a: 1 });

  // $ExpectError
  Map<string, number>().mergeDeepWith((prev: number, next: number, key: string) => 1, { a: 'a' });

  // $ExpectType Map<number, string | number>
  Map<number, number | string>().mergeDeepWith((prev: number, next: string, key: number) => 1, Map<number, string>());
}

{ // #flip

  // $ExpectType Map<string, number>
  Map<number, string>().flip();
}

{ // #withMutations

  // $ExpectType Map<number, number>
  Map<number, number>().withMutations(mutable => mutable);

  // $ExpectError
  Map<number, number>().withMutations((mutable: Map<string>) => mutable);
}

{ // #asMutable

  // $ExpectType Map<number, number>
  Map<number, number>().asMutable();
}

{ // #asImmutable

  // $ExpectType Map<number, number>
  Map<number, number>().asImmutable();
}
