# Article de lancement de sqlite-vector-wasm — Plan V4

## Intention

Article technique bilingue pour les développeurs et architectes du navigateur, du local-first et de la recherche embarquée. Montrer l'intérêt d'une distribution ciblée de SQLite et SQLite-Vector à partir de son usage, de ses choix de conception et de ses garanties observables. La [Capture](rationale.md#identité-et-intention) porte la thèse et les décisions de fond.

Composition adoptée par l'auteur. Sa provenance est consignée dans la Capture ([S-decisions et S-plan](rationale.md#sources-et-provenance)). Le fil va de l'usage au positionnement, puis à l'architecture, aux garanties, au compromis mesuré et à la possibilité d'essayer. Les proportions sont des repères de densité.

## Composition

| Section | Part indicative | Contribution |
| --- | ---: | --- |
| I. Besoin | I–II : 15 % | Pouvoir interroger les données locales quand le serveur est inaccessible. Après cette motivation courte, montrer l'[exemple de recherche de voisins](rationale.md#exemple-douverture), « aussi simple que SQLite ». CAP/CouchDB sert de référence brève pour situer les choix de cohérence et de disponibilité en contexte distribué. |
| II. SQLite et usages embarqués | Incluse dans I–II | Montrer la complémentarité de SQL, FTS5 et vecteurs. Illustrer par une intervention hors réseau, une base documentaire locale ou un catalogue synchronisé par une autre couche. Ces usages sont illustratifs. Préciser le [périmètre de la distribution](rationale.md#choix-éditoriaux). |
| III. Écosystème | 15 % | Citer sqlite-vec en une phrase neutre. Situer le choix de SQLite-Vector dans la série 0.3 par les capacités utiles, dont Float32, vecteurs binaires natifs et Hamming, à étayer selon [Q-sources](rationale.md#points-ouverts). Reconnaître le WASM enrichi de SQLite.ai déjà disponible. Expliquer le [positionnement](rationale.md#choix-éditoriaux) de la composition ciblée. |
| IV. Architecture | 25 % | Expliquer le choix des API SQLite C/OO1, l'intégration statique et l'enregistrement automatique. Revenir sur les trois opérations de l'exemple sans recopier le code, puis situer le [périmètre navigateur et ses conditions](rationale.md#choix-éditoriaux). |
| V. Garanties et maintenance | 23 % | Relier les choix de conception aux contrôles de construction et aux preuves de qualification et de release. Expliquer comment le suivi des versions officielles, la sélection humaine des compositions et la qualification après intégration rendent la maintenance praticable. Pour illustrer la qualification, reprendre le [cas OPFS](rationale.md#garanties-à-documenter). |
| VI. Empreinte et compromis | 17 % | Comparer SQLite WASM officiel, la composition ciblée et le WASM SQLite.ai enrichi à partir du [relevé daté](rationale.md#empreinte-mesurée). Une présentation sobre de cette mesure suffit. Expliquer le [compromis de composition](rationale.md#choix-éditoriaux). |
| VII. Résultat | 5 % | Donner au lecteur de quoi essayer la distribution via [npm](https://www.npmjs.com/package/@at-rama/sqlite-vector-wasm), le [dépôt](https://github.com/at-rama/sqlite-vector-wasm), le [guide](https://at-rama.github.io/sqlite-vector-wasm/usage/) et la [démo](https://at-rama.github.io/sqlite-vector-wasm/demo/). |

La rédaction conserve les limites des preuves et les [vérifications attachées à la version citée](rationale.md#points-ouverts).
