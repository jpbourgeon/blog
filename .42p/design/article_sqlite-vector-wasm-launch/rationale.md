# Article de lancement de sqlite-vector-wasm — Capture

## Identité et intention

`article_sqlite-vector-wasm-launch` prépare un article technique bilingue pour les développeurs et architectes qui travaillent sur le navigateur, les applications local-first ou la recherche embarquée. Le blog porte la publication canonique. Dev.to et LinkedIn restent des relais possibles, à décider séparément.

**R-fondation** — Présenter une distribution ciblée de SQLite et SQLite-Vector pour le navigateur. Elle ajoute la recherche vectorielle à l'usage familier de SQLite et garde la composition du runtime sous contrôle. La construction, la qualification de l'archive et le suivi des projets amont donnent un contenu concret à l'intention de maintenance durable. L'angle retenu est celui des choix et des garanties observables.

## Composition V4 adoptée

Le fil va de l'usage au positionnement, puis à l'architecture, aux garanties, au compromis mesuré et à la possibilité d'essayer. Les proportions sont des repères de densité. La composition appartient aux décisions de l'auteur (S-decisions, S-plan). Un échafaudage de rédaction distinct reste facultatif.

| Section | Part indicative | Décision de composition |
| --- | ---: | --- |
| I. Besoin | I–II : 15 % | Pouvoir interroger les données locales quand le serveur est inaccessible. Après cette motivation courte, montrer une vraie recherche de voisins, « aussi simple que SQLite ». CAP/CouchDB sert de référence brève pour situer les choix de cohérence et de disponibilité en contexte distribué. |
| II. SQLite et usages embarqués | Incluse dans I–II | SQL pour les filtres et relations, FTS5 pour le texte, vecteurs pour la proximité numérique, éventuellement sémantique selon les embeddings fournis. Illustrer par une intervention hors réseau, une base documentaire locale ou un catalogue synchronisé par une autre couche. Ces usages sont illustratifs. La réplication, les conflits, la production d'embeddings et la stratégie de recherche hybride relèvent de l'application ou d'autres composants. |
| III. Écosystème | 15 % | Citer sqlite-vec en une phrase neutre. Situer le choix de SQLite-Vector dans la série 0.3 par les capacités utiles, dont Float32, vecteurs binaires natifs et Hamming, à étayer selon Q-sources. Reconnaître le WASM enrichi de SQLite.ai déjà disponible. Présenter la composition ciblée sans revendication d'exclusivité sur SQLite/WASM, la recherche vectorielle, Workers ou OPFS. |
| IV. Architecture | 25 % | Faire des API navigateur SQLite C/OO1 le contrat, sans façade JavaScript, ORM ni dialecte de remplacement. Relier l'intégration statique et l'enregistrement automatique des fonctions SQL à la simplicité d'usage et à la réduction de la surface spécifique à maintenir. Revenir sur les trois opérations de l'exemple sans recopier le code. Le runtime livré cible le navigateur et exclut Node.js, le natif et WASI. Workers, VFS et bundlers ont leurs propres conditions d'usage. |
| V. Garanties et maintenance | 23 % | Relier les choix de conception aux contrôles de construction et aux preuves de qualification et de release. Expliquer comment le suivi des versions officielles, la sélection humaine des compositions et la qualification après intégration rendent la maintenance praticable. |
| VI. Empreinte et compromis | 17 % | Comparer SQLite WASM officiel, la composition ciblée et le WASM SQLite.ai enrichi à partir de la mesure ci-dessous. Laisser SQLite-Sync et SQLite-Memory hors de la distribution réduit la composition à maintenir et reporte les besoins correspondants sur l'application. |
| VII. Résultat | 5 % | Donner au lecteur de quoi essayer la distribution via [npm](https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm), le [dépôt](https://github.com/at-rama/sqlite-vector-wasm), le [guide](https://at-rama.github.io/sqlite-vector-wasm/usage/) et la [démo](https://at-rama.github.io/sqlite-vector-wasm/demo/). |

**C-upstreams** — Garder la reconnaissance des projets amont sans raconter la migration depuis sqlite-vec, étape de développement hors sujet. Les explications de 42P/OpenSpec et les variantes d'usage détaillées restent hors du propos.

**C-licences** — Présenter les licences et notices vérifiées de notre distribution. L'ambiguïté des informations de licence sur SQLite.ai a conduit l'auteur à écarter cet argument comparatif. Seul un nouvel arbitrage de l'auteur peut rouvrir ce choix.

## Exemple d'ouverture

Assembler l'initialisation et la requête Float32 du [guide d'usage][usage], avec les fichiers du runtime servis ensemble sous `/sqlite/`. Les lignes de requête reprennent le guide.

```js
import sqlite3InitModule from '/sqlite/sqlite3.mjs';
const sqlite3 = await sqlite3InitModule();
const db = new sqlite3.oo1.DB(':memory:');

db.exec('CREATE TABLE items(embedding BLOB)');
db.exec("INSERT INTO items(rowid, embedding) VALUES(1, vector_as_f32('[1,0]')), (2, vector_as_f32('[0,1]'))");
db.exec("SELECT vector_init('items', 'embedding', 'type=FLOAT32,dimension=2,distance=L2')");
const neighbors = db.selectArrays(
  "SELECT rowid, distance FROM vector_full_scan('items', 'embedding', '[1,0]', 2) ORDER BY distance"
);
console.log(neighbors);
// [[1, 0], [2, approximately 1.414214]]
db.close();
```

`vector_as_f32()` encode les deux vecteurs en BLOB. `vector_init()` associe la colonne au type, à la dimension et à la métrique sur cette connexion, après l'enregistrement automatique de l'extension. `vector_full_scan()` calcule les distances L2 à `[1,0]` par balayage exact. Les voisins sont la ligne 1 à distance 0 et la ligne 2 à distance √2. La démonstration porte sur deux vecteurs numériques en mémoire, sans production d'embeddings, persistance ni mesure des performances.

## Garanties à documenter

**C-durabilite** — La [construction][build] part de versions et d'empreintes enregistrées, puis le [manifeste de distribution][packaging] décrit la composition et l'outillage. Le contrat vise une reconstruction fonctionnellement vérifiable. La [qualification][acceptance] exerce l'archive finale en navigateur avec des oracles indépendants pour Float32/L2 et BIT/Hamming. L'exemple probant pour OPFS est la relecture des données ordinaires et vectorielles après commit, fermeture, terminaison du Worker puis réouverture à la même origine. La portée est celle du navigateur et des VFS testés, dans les conditions d'hébergement enregistrées, après un arrêt ordonné.

Le [contrat de release][publication] lie la révision intégrée, l'archive qualifiée et les éléments de provenance. Pour une release donnée, citer les pièces réellement disponibles parmi le manifeste, l'archive et l'attestation, en distinguant leur présence de leur vérification. [Watch][watch] identifie des combinaisons candidates. La sélection humaine et la qualification avant publication matérialisent une intention de suivi, sans durée de support promise ni mise à jour autonome.

## Empreinte mesurée

[Relevé reproductible du 2 novembre 2026][footprint]. Terser compacte le chargeur ESM sans renommage ni optimisation sémantique. Le WASM reste inchangé. Le gzip local est calculé séparément sur les deux fichiers, puis leurs tailles sont additionnées.

| Distribution | Version npm mesurée | Total compacté (octets) | Gzip normalisé (octets) |
| --- | --- | ---: | ---: |
| SQLite WASM officiel | `3.54.1-build1` | 1 177 470 | 483 824 |
| sqlite-vector-wasm | `0.3.2` | 1 268 943 | 517 404 |
| SQLite.ai WASM | `3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6` | 1 418 294 | 583 616 |

En gzip normalisé, sqlite-vector-wasm dépasse SQLite officiel de 6,9 % et occupe 11,3 % de moins que SQLite.ai. Versions, fonctions et frontières d'empaquetage diffèrent. Les tailles portent sur la paire chargeur/WASM de cette observation datée, hors fichiers compagnons, transferts HTTP observés, mémoire et performances. Les fichiers compactés sont des sorties de mesure. Elles ne ventilent pas le coût des extensions et ne préjugent pas des prochaines releases. Une représentation sobre suffit sur la base du relevé publié.

## Points ouverts

- **Q-sources** — Pour la version retenue dans l'article, exécuter à nouveau l'exemple documenté et vérifier les liens, les capacités attribuées aux projets amont, les conditions précises des Workers/VFS et les notices de l'archive dans le cadre de C-licences. Rattacher les affirmations de construction, qualification et publication à leurs preuves applicables, notamment l'identité de l'archive et l'attestation si elle est citée. La comparaison d'empreinte demeure celle des versions mesurées.
- **Q-diffusion** — L'auteur décidera de la publication de l'article et de l'usage éventuel de chaque relais. La Capture consigne un état de travail et ne vaut pas autorisation d'exposition.

## Sources et provenance

- **S-decisions — primaire, éditoriale.** Arbitrages de l'auteur en octobre–novembre 2026 et confirmation dans la mission de reprise. Fond, progression V4, proximité des API SQLite, usages embarqués, CAP sourcé, retrait de l'historique sqlite-vec et de la différenciation juridique, garanties et mesure comparative. Les échanges historiques n'ont pas de permalien public.
- **S-plan — dérivée, éditoriale.** Composition V4 proposée par l'assistant et adoptée par l'auteur. La [Capture historique de #20][prior] en conserve la trace, y compris les corrections sur l'exemple et la mesure. L'adoption couvre le fond et la structure, avec des formulations et illustrations à composer.
- **S-package — primaire, technique.** Documentation à la révision `8dfeda79fcd14e2f43afa34f31ee53420a74ce24` : [usage][usage], [acquisition][inputs], [construction][build], [assemblage][packaging], [qualification][acceptance], [publication][publication], [Watch][watch], [notices][notice], [empreinte et reproduction][footprint]. Les [releases du package](https://github.com/at-rama/sqlite-vector-wasm/releases) portent les pièces par version. Les documents décrivent le périmètre des mécanismes et des observations.
- **S-amont — références techniques.** [SQLite WASM](https://sqlite.org/wasm), [FTS5](https://www.sqlite.org/fts5.html), [sqlite-vec](https://github.com/asg017/sqlite-vec), [SQLite-Vector](https://github.com/sqliteai/sqlite-vector), [SQLite.ai WASM](https://github.com/sqliteai/sqlite-wasm) et [CouchDB — cohérence](https://guide.couchdb.org/editions/1/en/consistency.html).
- **Cadre du blog** — [instructions](../../../AGENTS.md), [standard éditorial](../../../standards/editorial.md) et [voix](../../../standards/voice.md).

[prior]: https://github.com/jpbourgeon/blog/blob/935bdb4134d4a31bbe90942015675ad670be6b08/.42p/design/article_sqlite-vector-wasm-launch/rationale.md
[usage]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/usage.md#host-and-initialize
[inputs]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/source-acquisition.md
[build]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/build.md
[packaging]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/packaging.md
[acceptance]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/acceptance.md
[publication]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/publication.md
[watch]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/watch.md
[notice]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/tools/package/NOTICE-vector.txt
[footprint]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/runtime-footprint.md
