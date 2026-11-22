---
title: "SQLite and vector search in the browser, without changing APIs"
description: "A focused browser distribution of SQLite and SQLite-Vector: usage, integration, verification and measured footprint."
slug: sqlite-vector-wasm-launch
date: 2026-11-22
draft: true
tags: [sqlite, wasm, local-first, vector-search]
rationale: article_sqlite-vector-wasm-launch
---

A browser application can keep its data locally yet lose much of its usefulness when the server becomes unreachable. Local storage alone is not enough: users must still be able to query records, filter them, search text and find nearby items.

[sqlite-vector-wasm](https://github.com/at-rama/sqlite-vector-wasm) brings together SQLite, FTS5 and [SQLite-Vector](https://github.com/sqliteai/sqlite-vector) in a WebAssembly distribution for browsers. The design choice is straightforward: **add vector search to SQLite without replacing its APIs**, while shipping an integration that each application does not have to rebuild.

## 1. Find the closest colors

Consider a drawing application's local palette. Each color is an RGB triplet; we want to find the numerically closest colors to `[220, 50, 60]`.

Once `@at-rama/sqlite-vector-wasm` is installed and the runtime files are served from `/sqlite/`, the SQLite OO1 API can be used directly:

```js
import sqlite3InitModule from '/sqlite/sqlite3.mjs';

const sqlite3 = await sqlite3InitModule();
const db = new sqlite3.oo1.DB(':memory:');

try {
  db.exec('CREATE TABLE palette(name TEXT, rgb BLOB)');
  db.exec(`
    INSERT INTO palette(name, rgb) VALUES
      ('Coral', vector_as_f32('[230,57,70]')),
      ('Deep red', vector_as_f32('[214,40,40]')),
      ('Steel blue', vector_as_f32('[69,123,157]'))
  `);

  // Describe the existing column as three-dimensional Float32 vectors.
  db.exec("SELECT vector_init('palette', 'rgb', 'type=FLOAT32,dimension=3,distance=L2')");

  const neighbors = db.selectObjects(`
    SELECT p.name, n.distance
    FROM vector_full_scan('palette', 'rgb', '[220,50,60]', 3) AS n
    JOIN palette AS p ON p.rowid = n.rowid
    ORDER BY n.distance
  `);
  console.log(neighbors);
} finally {
  db.close();
}
```

| Rank | Color | RGB | Approximate L2 distance |
| ---: | --- | --- | ---: |
| 1 | Coral | `[230,57,70]` | 15.78 |
| 2 | Deep red | `[214,40,40]` | 23.15 |
| 3 | Steel blue | `[69,123,157]` | 193.75 |

Three operations do most of the work: `vector_as_f32()` encodes the values, `vector_init()` describes the vector column for the current connection, and `vector_full_scan()` finds nearest neighbors. There is no replacement query language or project-specific JavaScript abstraction to learn.

This is deliberately a teaching example. Euclidean distance in RGB does not faithfully model human color perception. The database is in memory: this demonstrates vector proximity search, **not** persistence, synchronization or a complete local-first application.

## 2. One database, several ways to query

SQLite already answers structured questions through SQL and text-search questions through FTS5. Vector search adds another primitive: ranking numerical representations by proximity. For semantic search, those representations might be embeddings provided by the application; the runtime does not generate embeddings.

Together, these capabilities support practical embedded uses: consulting maintenance records without connectivity, finding a passage in locally stored documentation, or exploring a catalog synchronized by another layer. An application can combine SQL filters, full-text search and vector neighbors. Replication, conflict resolution and hybrid ranking remain separate responsibilities.

The value is therefore not a promise of an “intelligent database.” It is access to complementary querying primitives over local data, using SQLite's established tools.

## 3. Why this distribution?

Vector search around SQLite is not new. [sqlite-vec](https://github.com/asg017/sqlite-vec) takes another approach to this problem; [SQLite.ai](https://github.com/sqliteai/sqlite-wasm) already offers a broader WASM distribution.

This package uses [SQLite-Vector](https://github.com/sqliteai/sqlite-vector), with capabilities including Float32 vectors and native binary vectors with Hamming distance. They cover both continuous numerical representations and compact binary signatures.

The intended distinction is not exclusivity or an unproven performance advantage. It is **a focused, pre-integrated and qualified composition**: SQLite, SQLite-Vector and the browser WASM companions, without requiring each developer to assemble and maintain that combination. SQLite-Sync and SQLite-Memory are not bundled; that narrower scope also reduces what the distribution must track and verify.

## 4. Staying close to SQLite

The usage contract remains SQLite WASM's C API exposed to JavaScript and its OO1 interface. No ORM, alternative query façade or SQL dialect is introduced. The opening example uses `sqlite3.oo1.DB`, `db.exec` and `db.selectObjects` in the manner of the existing API.

SQLite-Vector is linked statically at build time and its SQL functions are registered automatically for each connection. No manual extension loading is needed in the browser. However, `vector_init()` must describe the vector columns used by **each connection**. Reopening a persistent database requires this association again, not recreating its table or rows.

Staying near native APIs limits the project's custom integration surface. It does not remove browser constraints. The package includes loaders, WASM and Worker/storage companions. For a new application, a **dedicated Worker** keeps synchronous database queries away from the UI thread.

OPFS persistence uses SQLite's VFS implementations and their prerequisites: a secure context, a Worker and, depending on the VFS, cross-origin isolation, Web Locks or explicit initialization. Bundlers must also emit the companion assets and preserve their URLs. The documented [Vite recipe](https://at-rama.github.io/sqlite-vector-wasm/usage/#vite-production-build) describes a tested configuration, not universal compatibility. This distribution targets **browsers**, not Node.js, WASI or native executables.

## 5. Build, qualify, then maintain

A WASM file that starts is not enough to qualify a distribution. We need to establish **what was built**, **what was packaged** and **what works in the archive actually shipped**.

The build starts from recorded upstream versions and digests. It preserves the selected SQLite interfaces and integrates SQLite-Vector without patching its sources for this package. Packaging checks the runtime file inventory and hashes, then creates an archive with a runtime manifest and license notices. These records support provenance and functionally verifiable reconstruction; they do not promise byte-identical rebuilds.

Qualification runs against **the final extracted archive in a real browser**. It exercises C/OO1 interfaces, loading surfaces, FTS5, Float32/L2 search and binary/Hamming search. Expected distances are computed independently of the extension, rather than being accepted from another query that might reproduce the same error.

Persistence is tested more thoroughly than by observing a successful `COMMIT`: write ordinary and vector data, close the connection cleanly, terminate the Worker, start a new Worker at the same origin and reopen the stored data. The selected OPFS VFSs are exercised under observed prerequisites. This establishes recovery **after an orderly runtime shutdown**, not general crash durability or cross-browser guarantees.

Upstream changes are monitored to identify candidate compositions. Human selection and publication decisions follow qualification. **This is a maintenance discipline, not a promise of unlimited support or autonomous upgrades.** The [publication contract](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/publication.md) ties together the integrated revision, accepted archive and provenance records.

## 6. What is the footprint?

An integrated distribution costs bytes. To compare this cost without mixing compression methods, a [reproducible measurement](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/runtime-footprint.md) was recorded on **2 November 2026** for three “ESM loader + WASM” pairs.

The JavaScript loader was compacted with the same settings, without semantic optimization or identifier mangling; WASM remained unchanged. Each file was gzipped separately and the two sizes were then added.

| Measured distribution | npm version | Loader + WASM, normalized gzip |
| --- | --- | ---: |
| Official SQLite WASM | `3.54.1-build1` | **483,824 bytes** |
| sqlite-vector-wasm | `0.3.2` | **517,404 bytes** |
| SQLite.ai WASM | `3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6` | **583,616 bytes** |

In this measurement, the focused pair is **6.9% larger** than official SQLite's and **11.3% smaller** than SQLite.ai's. But the SQLite versions, bundled features, loaders and packaging boundaries are different. These numbers cannot isolate the incremental footprint of SQLite-Vector, SQLite-Sync or SQLite-Memory, nor attribute the differences solely to their inclusion.

They are not measured HTTP transfer sizes, runtime memory, query performance or complete application weights. They describe three **distributions observed on a specific date**. The actual trade-off is between the capabilities integrated, the surface that must be maintained and the needs deliberately left to the application.

## 7. Try it

The package is on [npm](https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm), alongside its [source repository](https://github.com/at-rama/sqlite-vector-wasm), [usage guide](https://at-rama.github.io/sqlite-vector-wasm/usage/) and [browser demo](https://at-rama.github.io/sqlite-vector-wasm/demo/).

A small in-memory table is enough to begin. If the application later needs persistence, Workers or a bundler, the relevant examples and conditions are documented separately: those are integration choices to validate in the target environment, not capabilities to assume.
