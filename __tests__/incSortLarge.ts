/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Range, Seq } from '../';

describe('incSortLarge', () => {

  const verify = function(seq) {
    let i = 0;
    seq.forEach((v, k) => {
      expect(v).toEqual(k);
      expect(k).toEqual(i);
      i++;
    });
  };

  const verifyOther = function(seq, limit) {
    let i = 0;
    for (const v of seq) {
      expect(v).toEqual(i);
      i++;
    }

    i = 0;
    seq.reverse().forEach((v, k) => {
      expect(v).toEqual(limit - 1 - k);
      expect(k).toEqual(i);
      i++;
    });

    i = 0;
    for (const v of seq.reverse()) {
      expect(v).toEqual(limit - 1 - i);
      i++;
    }

    expect(i).toEqual(limit);
  };

  const step = function(s, n, limit, f) {
    const ret = f().take(limit);
    verify(ret);
    verifyOther(ret, Math.min(n, limit));
    return ret;
  };

  it('sorts small ranges', () => {
    for (let n = 1; n < 100; n += 10) {
      const r = Range(n - 1, -1, -2).concat(Range(n % 2, n, 2));
      for (let limit = 1; limit <= n; limit += 7) {
        // step("Regular sort", n, limit, () => r.sort());
        step("Partial sort", n, limit, () => r.partialSort(limit));
        step("Incremental sort", n, limit, () => r.incSort());
      }
    }
  });

  it('sorts large ranges', () => {
    for (let n = 1; n < 1000; n += 93) {
      const r = Range(n - 1, -1, -2).concat(Range(n % 2, n, 2)).toIndexedSeq();
      for (let limit = 10; limit <= n; limit *= 4) {
        // step("Regular sort", n, limit, () => r.sort());
        step("Partial sort", n, limit, () => r.partialSort(limit));
        step("Incremental sort", n, limit, () => r.incSort());
      }
      if (n > 100) {
        // step("Regular sort", n, n - 100, () => r.sort());
        step("Partial sort", n, n - 100, () => r.partialSort(n - 100));
        step("Incrmtl sort", n, n - 100, () => r.incSort());
      }
    }
    });

});
