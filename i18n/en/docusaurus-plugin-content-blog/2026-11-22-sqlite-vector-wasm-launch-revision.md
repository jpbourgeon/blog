---
"date": 2026-11-22
"description": "A focused browser distribution of SQLite and SQLite-Vector: usage, integration, verification and measured footprint."
"rationale": ".42p/design/article_sqlite-vector-wasm-launch/rationale.md"
"slug": "sqlite-vector-wasm-launch-revision"
"tags":
  - "sqlite"
  - "wasm"
  - "local-first"
  - "vector-search"
"draft": true
"title": "SQLite and vector search in the browser, without changing APIs"
---

A browser application can keep its data locally yet lose much of its usefulness when the server becomes unreachable. Local storage alone is not enough: users must still be able to query records, filter them, search text and find nearby items.

[sqlite-vector-wasm](https://github.com/at-rama/sqlite-vector-wasm) brings together SQLite, FTS5 and [SQLite-Vector](https://github.com/sqliteai/sqlite-vector) in a WebAssembly distribution for browsers. The design choice is straightforward: **add vector search to SQLite without replacing its APIs**, while shipping an integration that each application does not have to rebuild.

<!-- truncate -->

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

## 2. One database, several ways to query

SQLite already answers structured questions through SQL and text-search questions through FTS5. Vector search adds another primitive: ranking numerical representations by proximity. For semantic search, those representations can be embeddings computed by the application.

Together, these capabilities support practical embedded uses: consulting maintenance records without connectivity, finding a passage in locally stored documentation, or exploring a local catalog. An application can combine SQL filters, full-text search and vector neighbors in a database developers already know.

## 3. Why this distribution?

SQLite offers several approaches to vector search: [sqlite-vec](https://github.com/asg017/sqlite-vec) is a dedicated extension, while [SQLite.ai](https://github.com/sqliteai/sqlite-wasm) distributes a WASM runtime with several additional components.

This package uses [SQLite-Vector](https://github.com/sqliteai/sqlite-vector), with capabilities including Float32 vectors and native binary vectors with Hamming distance. They cover both continuous numerical representations and compact binary signatures.

**sqlite-vector-wasm's value lies in its composition**: SQLite, SQLite-Vector and browser WASM companions, pre-integrated and qualified. It leaves out SQLite-Sync and SQLite-Memory to focus maintenance on the capabilities needed for this runtime.

## 4. Staying close to SQLite

The usage contract remains SQLite WASM's C API exposed to JavaScript and its OO1 interface. No ORM, alternative query façade or SQL dialect is introduced. The opening example uses `sqlite3.oo1.DB`, `db.exec` and `db.selectObjects` in the manner of the existing API.

SQLite-Vector is linked statically at build time and its SQL functions are registered automatically for each connection. No manual extension loading is needed in the browser. However, `vector_init()` must describe the vector columns used by **each connection**. Reopening a persistent database requires this association again, not recreating its table or rows.

Staying near native APIs limits the project's custom integration surface. The package includes loaders, WASM and Worker/storage companions. For a new application, a **dedicated Worker** keeps synchronous database queries away from the UI thread.

For Vite projects, the [documented production recipe](https://at-rama.github.io/sqlite-vector-wasm/usage/#vite-production-build) shows how to integrate the loader and emit the companion assets. Persistent storage uses SQLite's OPFS VFS implementations.

## 5. Build, qualify, then maintain

A WASM file that starts is not enough to qualify a distribution. We need to establish **what was built**, **what was packaged** and **what works in the archive actually shipped**.

The build starts from recorded upstream versions and digests. It preserves the selected SQLite interfaces and integrates SQLite-Vector without patching its sources for this package. Packaging checks the runtime file inventory and hashes, then creates an archive with a runtime manifest and license texts. Project-authored code and documentation are **Apache-2.0**; SQLite is **public domain**, SQLite-Vector is **Apache-2.0**, and the FP16 headers are **MIT**. The Emscripten runtime and incorporated libraries retain their respective licenses and notices, including MIT, Illinois/NCSA and the applicable LLVM and musl terms. These texts are shipped under `licenses/` with recorded origins; the project's license does not supersede upstream terms. These records support provenance and functionally verifiable reconstruction.

Qualification runs against **the final extracted archive in a real browser**. It exercises C/OO1 interfaces, loading surfaces, FTS5, Float32/L2 search and binary/Hamming search. Expected distances are computed independently of the extension, rather than being accepted from another query that might reproduce the same error.

Persistence is tested more thoroughly than by observing a successful `COMMIT`: write ordinary and vector data, close the connection cleanly, terminate the Worker, start a new Worker at the same origin and reopen the stored data. The selected OPFS VFSs are exercised under observed prerequisites. The test establishes **recovery after an orderly runtime shutdown**, including vector data.

Upstream monitoring identifies candidate compositions. **Humans select the composition and merge it into `main`**. That merge triggers the build and qualification of the definitive archive; if every check passes, publication to npm and GitHub follows automatically. Earlier PR qualification does not replace acceptance of the post-merge archive.

**Release 0.4.0** provides a concrete evidence set: the distributed archive, `publication.json` (publication manifest and provenance), `attestation.json` (GitHub attestation binding the archive to its source revision) and `delivery.json` (delivery operations receipt). During review, the **npm archive's SHA-256** was checked against the manifest and GitHub metadata. The receipt records successful delivery; it is neither independent attestation nor human approval. The [publication contract](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/publication.md) defines the scope of these records.

## 6. What is the footprint?

An integrated distribution costs bytes. To compare this cost without mixing compression methods, a [reproducible measurement](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/runtime-footprint.md) was recorded on **2 November 2026** for three “ESM loader + WASM” pairs.

The JavaScript loader was compacted with the same settings, without semantic optimization or identifier mangling; WASM remained unchanged. Each file was gzipped separately and the two sizes were then added.

| Measured distribution | npm version | Loader + WASM, normalized gzip |
| --- | --- | ---: |
| Official SQLite WASM | `3.54.1-build1` | **483,824 bytes** |
| sqlite-vector-wasm | `0.3.2` | **517,404 bytes** |
| SQLite.ai WASM | `3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6` | **583,616 bytes** |

In this measurement, the focused pair is **6.9% larger** than official SQLite's and **11.3% smaller** than SQLite.ai's. The three compositions differ in versions and bundled capabilities. The focused choice offers a balance between integrated features, a contained footprint and a manageable maintenance surface.

## 7. Try it

The package is on [npm](https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm), alongside its [source repository](https://github.com/at-rama/sqlite-vector-wasm), [usage guide](https://at-rama.github.io/sqlite-vector-wasm/usage/) and [browser demo](https://at-rama.github.io/sqlite-vector-wasm/demo/).

A small in-memory table is enough to begin. The guide then covers Worker integration, persistent storage and Vite builds.

**Scope and limitations.** The RGB/L2 example shows numerical distance, not human color perception; its in-memory database does not demonstrate persistence. The distribution targets browsers and provides query primitives: embeddings, synchronization, conflict resolution and hybrid ranking belong to the application. OPFS depends on VFS and hosting prerequisites (secure context, Worker and, depending on the mode, isolation or specific initialization). Restart tests cover orderly shutdown, not crashes. Finally, the measurements in §6 compare loader/WASM pairs with different versions and scopes: they do not isolate extension overhead, HTTP transfer sizes or performance.
