/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//
// Floyd-Rivest algorithm according to wikipedia
// https://en.wikipedia.org/wiki/Floyd%E2%80%93Rivest_algorithm
//

const swap = (array, i, j) => {
  const tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
};

const sampleThreshold = 1000;
const sampleReach = 0.5;

// partition the elements between inclusive left and right around t
export const quickSelectRange = (array, left, right, k, comparator) => {
  // k is outside of range, no need to sort out anything
  if (k < left || k > right) {
    return;
  }
  while (right > left) {
    // use select recursively to sample a smaller set of size s
    // the arbitrary constants 600 and 0.5 are used in the original
    // version to minimize execution time
    if (right - left > sampleThreshold) {
      const n = right - left + 1;
      const i = k - left + 1;
      const z = Math.log(n);
      const s = sampleReach * Math.exp(2 * z / 3);
      const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * Math.sign(i - n / 2);
      const newLeft = Math.max(left, Math.floor(k - i * s / n + sd));
      const newRight = Math.min(right, Math.floor(k + (n - i) * s / n + sd));
      quickSelectRange(array, newLeft, newRight, k, comparator);
    }

    const t = array[k];
    let i = left;
    let j = right;
    swap(array, left, k);
    if (comparator(array[right], t) > 0) {
      swap(array, right, left);
    }
    while (i < j) {
      swap(array, i++, j--);
      while (comparator(array[i], t) < 0) {
        i++;
      }
      while (comparator(array[j], t) > 0) {
        j--;
      }
    }
    if (array[left] === t) {
      swap(array, left, j);
    } else {
      swap(array, ++j, right);
    }
    // adjust left and right towards the boundaries of the subset
    // containing the (k - left + 1)th smallest element
    if (j <= k) {
      left = j + 1;
    }
    if (k <= j) {
      right = j - 1;
    }
  }
};

export const quickSelect = (array, k, comparator) => {
  if (!comparator) {
    comparator = (a, b) => (a > b ? 1 : a < b ? -1 : 0);
  }
  quickSelectRange(array, 0, array.length - 1, k, comparator);
};

export default quickSelect;
