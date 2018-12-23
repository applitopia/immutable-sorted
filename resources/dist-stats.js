/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const { exec } = require('child_process');

require('colors');

const execp = cmd =>
  new Promise((resolve, reject) =>
    exec(cmd, (error, out) => (error ? reject(error) : resolve(out)))
  );

const space = (n, s) =>
  new Array(Math.max(0, 10 + n - (s || '').length)).join(' ') + (s || '');

const bytes = b =>
  `${b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} bytes`;

const diff = (n, o) => {
  const d = n - o;
  return d === 0 ? '' : d < 0 ? ` ${bytes(d)}`.green : ` +${bytes(d)}`.red;
};

const pct = (s, b) => ` ${Math.floor(10000 * (1 - s / b)) / 100}%`.grey;

Promise.all([
  execp('cat dist/immutable.js | wc -c'),
  execp('git show master:dist/immutable.js | wc -c'),
  execp('cat dist/immutable.min.js | wc -c'),
  execp('git show master:dist/immutable.min.js | wc -c'),
  execp('cat dist/immutable.min.js | gzip -c | wc -c'),
  execp('git show master:dist/immutable.min.js | gzip -c | wc -c'),
])
  .then(results => results.map(result => parseInt(result, 10)))
  .then(([rawNew, rawOld, minNew, minOld, zipNew, zipOld]) => {
    console.log(
      `  Raw: ${space(14, bytes(rawNew).cyan)}       ${space(
        15,
        diff(rawNew, rawOld)
      )}`
    );
    console.log(
      `  Min: ${space(14, bytes(minNew).cyan)}${pct(minNew, rawNew)}${space(
        15,
        diff(minNew, minOld)
      )}`
    );
    console.log(
      `  Zip: ${space(14, bytes(zipNew).cyan)}${pct(zipNew, rawNew)}${space(
        15,
        diff(zipNew, zipOld)
      )}`
    );
  });
