// Regression test for the security dependency bumps.
//
// The repo previously resolved these packages to vulnerable versions. This
// test pins the minimum fixed version for each bumped dependency and also
// smoke-tests the two existing code paths that consume the bumped packages
// (joi validation via schema.js and mongoose model definition via
// models/listing.js), so a bump that changes their public behaviour fails
// loudly instead of silently.
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');

// Minimum versions required to close the advisories we bumped.
const REQUIRED = {
  mongoose: '8.9.5', // GHSA-wpg9-53fq-2r8h, GHSA-vg7j-7cwx-8wgw, GHSA-m7xq-9374-9rvx
  joi: '17.13.7', // GHSA-6h2x-m376-mqjq
  'proxy-addr': '2.0.8', // GHSA-jqcg-44mw-7w3h
  'path-to-regexp': '0.1.13', // GHSA-37ch-88jc-xwx2, GHSA-rhx6-c78j-4q9w
  minimatch: '10.2.3', // GHSA-23c5-xmqv-rm74, GHSA-7r86-cg39-jmmj, GHSA-3ppc-4f35-3m26
  'brace-expansion': '1.1.18', // GHSA-rgw5-rvv9-x895, GHSA-6j4f-fj2g-mc7p, GHSA-qhr7-859c-m2p7, GHSA-mh99-v99m-4gvg
};

function parseVersion(v) {
  const m = /^v?(\d+)\.(\d+)\.(\d+)/.exec(String(v));
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [0, 0, 0];
}

function gte(installed, required) {
  const a = parseVersion(installed);
  const b = parseVersion(required);
  for (let i = 0; i < 3; i += 1) {
    if (a[i] !== b[i]) return a[i] > b[i];
  }
  return true;
}

test('security-bumped dependencies resolve to at least the fixed versions', () => {
  for (const [pkg, required] of Object.entries(REQUIRED)) {
    const installed = require(`${pkg}/package.json`).version;
    assert.ok(
      gte(installed, required),
      `${pkg} resolved to ${installed}, which is older than the fixed ${required}`,
    );
  }
});

test('existing validation and model paths still work after the bumps', () => {
  // Existing code path that consumes joi (schema.js).
  const { listingSchema } = require('../schema.js');
  const result = listingSchema.validate({
    listing: {
      title: 'beach house',
      description: 'quiet and sunny',
      image: '',
      location: 'goa',
      country: 'in',
      price: 120,
    },
  });
  assert.equal(result.error, undefined);

  // Existing code path that consumes mongoose (models/listing.js).
  const Listing = require('../models/listing.js');
  assert.equal(typeof Listing, 'function');
  assert.equal(Listing.modelName, 'listing');
});
