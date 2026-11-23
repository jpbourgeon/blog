# Article de lancement de sqlite-vector-wasm — Capture

## Identité et intention

`article_sqlite-vector-wasm-launch` prépare un article technique bilingue pour les développeurs et architectes qui travaillent sur le navigateur, les applications local-first ou la recherche embarquée. Le blog porte la publication canonique. Dev.to et LinkedIn restent des relais possibles, à décider séparément.

**R-fondation** — Présenter une distribution ciblée de SQLite et SQLite-Vector pour le navigateur. Elle ajoute la recherche vectorielle à l'usage familier de SQLite et évite au développeur d'assembler et de maintenir lui-même l'intégration SQLite, SQLite-Vector et WASM, tout en gardant la composition du runtime sous contrôle. La construction, la qualification de l'archive et le suivi des projets amont donnent un contenu concret à l'intention de maintenance durable. L'angle retenu est celui des choix et des garanties observables.

La [composition V4 adoptée](plan.md) guide la rédaction. Un plan distinct reste facultatif dans le workflow.

## Choix éditoriaux

La continuité d'usage suppose que les données locales restent interrogeables lorsque le serveur est inaccessible. SQL pour les filtres et relations, FTS5 pour le texte, vecteurs pour la proximité numérique, éventuellement sémantique selon les embeddings fournis. La réplication, les conflits, la production d'embeddings et la stratégie de recherche hybride relèvent de l'application ou d'autres composants.

Faire apparaître la valeur pour le développeur : une distribution intégrée et prête à utiliser, sans avoir à assembler et maintenir lui-même les composants. Faire des API navigateur SQLite C/OO1 le contrat, sans façade JavaScript, ORM ni dialecte de remplacement. L'intégration statique et l'enregistrement automatique des fonctions SQL contribuent à la simplicité d'usage et réduisent la surface spécifique à maintenir. Le runtime livré cible le navigateur et exclut Node.js, le natif et WASI. Workers, VFS et bundlers ont leurs propres conditions d'usage.

Présenter la composition ciblée sans revendication d'exclusivité sur SQLite/WASM, la recherche vectorielle, Workers ou OPFS. Laisser SQLite-Sync et SQLite-Memory hors de la distribution réduit la composition à maintenir et reporte les besoins correspondants sur l'application.

**C-upstreams** — Garder la reconnaissance des projets amont sans raconter la migration depuis sqlite-vec, étape de développement hors sujet. Les explications de 42P/OpenSpec et les variantes d'usage détaillées restent hors du propos.

**C-licences** — Présenter les licences et notices vérifiées de notre distribution. L'ambiguïté des informations de licence sur SQLite.ai a conduit l'auteur à écarter cet argument comparatif. Seul un nouvel arbitrage de l'auteur peut rouvrir ce choix.

**C-revision-cta-tags (23 novembre 2026)** — Pour la révision de l'article publié, ajouter avant `<!-- truncate -->` un accès direct à la démonstration, au guide et au code source, en conservant le §7 intégralement. Remplacer les quatre tags thématiques par le seul tag de collection `laidback` en FR et EN. Inscrire les conventions générales conditionnelles dans `standards/editorial.md`. Ne pas modifier le plan V4 historique ni les originaux publiés avant approbation, vérification et promotion.

## Exemple d'ouverture

Pour l’ouverture « aussi simple que SQLite », montrer un cas concret : une application de dessin recherche, dans sa palette locale, les couleurs numériquement les plus proches d’une couleur choisie. Chaque couleur est représentée par un vecteur Float32 à trois composantes RGB : rouge corail `[230,57,70]`, rouge profond `[214,40,40]` et bleu acier `[69,123,157]`. La recherche porte sur `[220,50,60]` et classe les couleurs par distance euclidienne L2 : corail, rouge profond, puis bleu acier.

L'exemple utilise une table SQLite en mémoire contenant un nom de couleur et son vecteur. Montrer l'initialisation [SQLite OO1][usage], l'encodage avec `vector_as_f32()`, l'association de la colonne avec `vector_init()` (`type=FLOAT32,dimension=3,distance=L2`), puis la recherche avec `vector_full_scan()` comme dans le [guide Float32][usage-l2]. Les fichiers du runtime sont servis sous `/sqlite/` et la connexion est fermée à la fin. Un code bref et commenté doit suffire à rendre la requête et son résultat compréhensibles.

L’exemple illustre la primitive de proximité vectorielle, et non un cas complet d'application local-first : la base en mémoire ne démontre pas la persistance ou le fonctionnement hors connexion. Il ne démontre pas une recherche sémantique ni une mesure fidèle à la perception humaine des couleurs : RGB/L2 est une simplification pédagogique, non un choix recommandé pour la colorimétrie exigeante. Aucune génération d’embeddings, synchronisation, persistance ou mesure de performances n'est requise.

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

En gzip normalisé, sqlite-vector-wasm dépasse SQLite officiel de 6,9 % et occupe 11,3 % de moins que SQLite.ai. Versions, fonctions et frontières d'empaquetage diffèrent. Les tailles portent sur la paire chargeur/WASM de cette observation datée, hors fichiers compagnons, transferts HTTP observés, mémoire et performances. Les fichiers compactés sont des sorties de mesure. Les tailles ne ventilent pas le coût des extensions et ne préjugent pas des prochaines releases.

## Sources et provenance

- **S-decisions — primaire, éditoriale.** Arbitrages de l'auteur en octobre–novembre 2026 et confirmation dans la mission de reprise. Fond, progression V4, proximité des API SQLite, usages embarqués, exemple RGB pédagogique, valeur de l'intégration prête à utiliser, retrait du détour sur la cohérence distribuée et de l'historique sqlite-vec et de la différenciation juridique, garanties et mesure comparative. Les échanges historiques n'ont pas de permalien public.
- **S-plan — dérivée, éditoriale.** Composition V4 proposée par l'assistant et adoptée par l'auteur. La [Capture historique de #20][prior] en conserve la trace, y compris les corrections sur l'exemple et la mesure. L'adoption couvre le fond et la structure, avec des formulations et illustrations à composer.
- **S-package — primaire, technique.** Documentation à la révision `8dfeda79fcd14e2f43afa34f31ee53420a74ce24` : [usage][usage], [acquisition][inputs], [construction][build], [assemblage][packaging], [qualification][acceptance], [publication][publication], [Watch][watch], [notices][notice], [empreinte et reproduction][footprint]. Les [releases du package](https://github.com/at-rama/sqlite-vector-wasm/releases) portent les pièces par version. Les documents décrivent le périmètre des mécanismes et des observations.
- **S-amont — références techniques.** [SQLite WASM](https://sqlite.org/wasm), [FTS5](https://www.sqlite.org/fts5.html), [sqlite-vec](https://github.com/asg017/sqlite-vec), [SQLite-Vector](https://github.com/sqliteai/sqlite-vector), [SQLite.ai WASM](https://github.com/sqliteai/sqlite-wasm).
- **Cadre du blog** — [instructions](../../../AGENTS.md), [standard éditorial](../../../standards/editorial.md) et [voix](../../../standards/voice.md).
- **État avant découpage** — [Capture précédente](previous-capture.md).

[prior]: https://github.com/jpbourgeon/blog/blob/935bdb4134d4a31bbe90942015675ad670be6b08/.42p/design/article_sqlite-vector-wasm-launch/rationale.md
[usage]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/usage.md#host-and-initialize
[usage-l2]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/usage.md#float32-nearest-neighbors
[inputs]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/source-acquisition.md
[build]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/build.md
[packaging]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/packaging.md
[acceptance]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/acceptance.md
[publication]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/publication.md
[watch]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/watch.md
[notice]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/tools/package/NOTICE-vector.txt
[footprint]: https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/runtime-footprint.md
