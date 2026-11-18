# Article de lancement de sqlite-vector-wasm — Capture éditoriale (V4)

## Identité, intention et portée

**Objet :** préserver le rationale et le plan validés de l'article technique de lancement de **sqlite-vector-wasm**. La publication canonique relève du blog personnel ; **dev.to** est un canal de diffusion secondaire. Le lectorat visé est celui des développeurs et architectes qui s'intéressent à SQLite, WebAssembly, local-first et à la recherche vectorielle.

**Thèse éditoriale (R-fondation) :** proposer une composition **SQLite + SQLite-Vector** pour le navigateur, qui enrichit les capacités locales de recherche **sans changer le modèle d'utilisation de SQLite**, et dont la construction, la vérification et le suivi des upstreams sont organisés pour permettre une maintenance durable.

Ce document capture des **choix de fond et de structure validés par l'auteur**. Ce n'est ni un article rédigé, ni une preuve indépendante des capacités annoncées, ni une autorisation de publication. Les exemples de formulation et les détails de réalisation doivent être vérifiés au moment de la rédaction. Ne pas figer dans l'article les versions, mesures ou états transitoires sans référence datée.

## Orientation éditoriale validée

- **C-demontrer** — Montrer très tôt une utilisation ressemblant à SQLite, puis expliquer les choix qui la rendent possible. Le fil narratif est : **usage immédiatement compréhensible → positionnement → architecture → garanties de pérennité → compromis mesurés → disponibilité**. Ce n'est ni un tutoriel complet, ni une annonce promotionnelle, ni une chronique des PR.
- **C-standard** — Faire de la proximité avec les **API natives de SQLite** l'argument architectural principal : API C/OO1, chargements et capacités du navigateur, sans ORM, SQL propriétaire ni façade JavaScript imposée. La frugalité est ici un choix de compatibilité et de réduction de la surface spécifique de maintenance, pas une simple préférence esthétique.
- **C-distribution** — Distinguer le moteur local des architectures qui l'emploient. Le package n'apporte ni réplication, ni résolution de conflits, ni génération d'embeddings, ni stratégie de recherche hybride imposée. L'autonomie locale n'est pas la continuité distribuée à elle seule.
- **C-upstreams** — Reconnaître explicitement SQLite, **sqlite-vec** et **SQLite-Vector / SQLite.ai**, sans déprécier les projets. Une phrase neutre explique le choix de SQLite-Vector à partir de la version 0.3, notamment les vecteurs Float32, les vecteurs binaires natifs et Hamming. Ne pas raconter la migration depuis sqlite-vec : c'était une étape de développement sans diffusion significative, non le sujet de l'article.
- **C-licences** — Présenter factuellement les licences de **notre** distribution et de ses composants, avec notices. **Ne pas opposer notre licence à un prétendu dual licensing de SQLite.ai** : les informations publiques examinées étaient ambiguës ; l'auteur a explicitement écarté cet argument comparatif.
- **C-durabilite** — Mettre en avant les garanties de conception, de qualification du package final, d'intégrité, de provenance, de publication et de suivi des versions officielles. Présenter une **intention de maintenance durable soutenue par un dispositif**, sans promettre une durée de support, une sécurité absolue ou des mises à jour autonomes.
- **C-sobriete** — Le théorème CAP sert d'**ancrage documentaire** au contexte distribué, pas de développement théorique. Ne pas expliquer 42P ou OpenSpec : montrer les garanties observables et renvoyer vers les documents techniques. Les liens détaillés et tutoriels vont dans la documentation d'usage.

## Plan V4 — Sept sections et équilibre validé

Les proportions servent à régler la densité relative ; elles ne sont pas des quotas mécaniques. **I–II : 15 % ; III : 15 % ; IV : 25 % ; V : 23 % ; VI : 17 % ; VII : 5 %.** Le cœur de l'article est **IV + V (48 %)**.

### I. Le besoin — Continuité, autonomie et distribution (avec II : 15 %)

Présenter rapidement la nécessité de pouvoir **exploiter et rechercher** des données locales lorsque la connexion au serveur manque ; le stockage seul ne suffit pas. La recherche sémantique/vectorielle prolonge ce besoin sans faire disparaître SQL ou FTS5.

**Accroche décidée :** après une très courte motivation, placer dès cette première partie le flash de code « **aussi simple que SQLite** ». Importer le module SQLite du package, ouvrir une base, appeler une fonction native de SQLite-Vector, fermer. Un appel à `vector_version()` **prouve la présence de l'extension**, pas une recherche de voisins : renvoyer au guide pour l'exemple fonctionnel complet et expliquer le mécanisme en IV.

CAP/CouchDB : citer une explication pédagogique en appui, **sans présenter CAP comme la démonstration de l'offline-first** ni confondre le package avec une couche de réplication.

### II. SQLite — Une fondation et des cas d'usage embarqués (avec I : 15 %)

Montrer la complémentarité de SQL (filtrage/relations), FTS5 (recherche lexicale) et vecteurs (proximité numérique, éventuellement sémantique si les embeddings la portent). Privilégier quelques **exemples illustratifs**, sans prétendre à des applications clientes attestées :

1. Intervention de terrain hors réseau : équipements, procédures, descriptions de pannes.
2. Base documentaire personnelle ou professionnelle locale : filtres, texte et similarité sans service de recherche distant.
3. Application web offline-first : catalogue ou espace de travail consultable localement, synchronisé par une autre couche quand le réseau revient.

Éviter les détails d'architecture de ces applications. Dire explicitement que sqlite-vector-wasm **n'infère pas les embeddings**.

### III. L'écosystème et le positionnement (15 %)

**III.A — Reconnaître l'existant.** Citer sqlite-vec en une phrase neutre ; présenter SQLite-Vector, ses capacités pertinentes et la raison fonctionnelle du choix à compter de 0.3, également en une phrase. Souligner que SQLite.ai propose déjà un package WebAssembly avec d'autres extensions intégrées : ne revendiquer **aucune exclusivité** sur l'association SQLite/WASM/vecteurs, Workers ou OPFS.

**III.B — Notre périmètre.** La proposition est une **distribution ciblée SQLite + SQLite-Vector**, compatible avec la philosophie et les interfaces amont ; l'absence de SQLite-Sync et SQLite-Memory dans notre composition est un choix, pas une mise en cause de ces outils. Éviter toute différenciation juridique incertaine vis-à-vis de SQLite.ai. Exposer seulement les licences et notices vérifiées de notre artefact.

### IV. L'architecture et les API natives (25 %)

**IV.A — Le standard est le contrat.** Conserver les API navigateur SQLite documentées, les modes C/OO1, les Workers et les VFS pertinents ; ne pas fabriquer une API concurrente. Rattacher ce choix à la compatibilité, la simplicité de consommation et la moindre maintenance de logique propriétaire.

**IV.B — Intégration statique.** SQLite-Vector est intégré au WASM et ses fonctions SQL sont automatiquement enregistrées à chaque nouvelle connexion : pas de chargement dynamique par l'application. **Distinguer** l'enregistrement de l'extension de `vector_init()`, qui initialise le contexte vectoriel des tables pour une connexion.

**IV.C — Retour explicatif sur le flash d'ouverture.** Comment le code initial reste natif ; une brève extension SQL peut illustrer stockage/recherche sans transformer l'article en tutoriel. Documentation détaillée en lien.

**IV.D — Frontière de distribution.** Navigateur uniquement ; pas de runtime Node.js, natif ni WASI livré. La portabilité des principes ne signifie pas fournir le même package sur tous les environnements.

### V. Les garanties, la release et la maintenance (23 %)

**V.A — Garanties de conception.** Présenter les propriétés à conserver : comportement et API natives, sources vérifiées, reproductibilité fonctionnelle, intégrité et limites explicites. Parler d'intentions de conception, puis des **preuves effectivement produites**, sans en faire des axiomes.

**V.B — Qualification sur l'artefact final.** Expliquer les tests en **vrai navigateur sur les fichiers packagés**, avec oracles de distances Float32/Hamming indépendants. Exemple probant : écriture et commit OPFS, fermeture, terminaison du Worker, nouvelle initialisation/connexion et relecture des données ordinaires et vectorielles. Ne pas extrapoler à une résistance universelle aux crashs ou aux navigateurs.

**V.C — Construction et publication contrôlées.** Sources upstream officielles, versions et SHA-256, outillage documenté, manifeste de composition, identité de la révision et de l'archive, cohérence des artefacts npm/GitHub et attestations lorsque réellement disponibles. Bien distinguer contrat, exécution de tests et preuve d'une release précise.

**V.D — Durabilité organisée.** Suivi périodique des releases officielles, identification des compositions candidates, sélection humaine, préparation et qualification contrôlées, publication liée à une intégration autorisée. Il s'agit d'une **intention opérationnalisée**, pas d'un SLA ni d'une autonomie éditoriale accordée aux agents.

### VI. L'empreinte et les compromis (17 %)

**VI.A — Trois points de référence :** SQLite WASM officiel **sans vecteurs** ; notre **SQLite + SQLite-Vector** ; distribution **SQLite.ai WASM enrichie**. Comparer capacités réellement embarquées et responsabilités de chacune, sans insinuation concurrentielle.

**VI.B — Empreinte comparée et reproductible (Q-empreinte résolue pour les distributions mesurées).** La [mesure du 2 novembre 2026](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/runtime-footprint.md) compare, selon un protocole commun, le **chargeur ESM compacté avec Terser + WASM inchangé**, puis les deux fichiers compressés séparément en gzip local : SQLite WASM officiel `3.54.1-build1` (**1 177 470 octets compactés ; 483 824 gzip**), sqlite-vector-wasm `0.3.2` (**1 268 943 ; 517 404 gzip**) et SQLite.ai WASM `3.50.4-wasm.1.0.0-sync.1.2.0-vector.1.2.0-memory.1.3.6` (**1 418 294 ; 583 616 gzip**). Dans ce périmètre, notre distribution est **6,9 % plus volumineuse que SQLite officiel** et **11,3 % plus légère que SQLite.ai** en gzip normalisé. Les archives npm, versions, fichiers, empreintes, outils et commandes de reproduction sont consignés dans la source. **Ce ne sont ni des transferts HTTP observés ni des tailles de packages recompactés effectivement publiés** ; les versions SQLite, les fonctionnalités et certaines frontières d'empaquetage diffèrent. Ces chiffres ne démontrent ni le coût isolé d'une extension, ni une économie mémoire, ni une supériorité de performances, ni un avantage garanti pour les releases futures. Une seule table/figure avec date, unités et périmètre suffit ; ne pas ajouter de benchmark mémoire/initialisation sans nécessité éditoriale.

**VI.C — Compromis assumé.** Moins de capacités intégrées peut signifier moins de dépendances et de surface de maintenance, mais aussi davantage de composition à la charge des applications. Ne pas promettre de performances vectorielles supérieures sans benchmark ni gommer les contraintes OPFS/Workers/bundlers.

### VII. Le résultat (5 %)

Conclure brièvement par la distribution utilisable, les API SQLite natives avec extension vectorielle, les garanties présentées et les liens vers **npm, dépôt, guide, démonstration interactive**. Pas de second plaidoyer ni de promesse de pérennité absolue. L'invitation finale doit permettre au lecteur d'essayer le composant.

## Questions et vérifications restant ouvertes

- **Q-sources** — Avant la rédaction et la publication, contrôler les liens et les assertions factuelles concernant SQLite.ai, sqlite-vec, SQLite-Vector, les restrictions exactes des VFS/Workers et les garanties de publication à la version effectivement citée. Préserver la décision **C-licences** même si de nouvelles sources sont examinées, sauf nouvel arbitrage de l'auteur.
- **Q-exemple** — Vérifier que le code d'ouverture correspond aux assets distribués et ne suggère pas que `vector_version()` constitue à lui seul une recherche vectorielle.
- **Q-diffusion** — Préparer les versions éditoriales dans le dépôt canonique et décider séparément de leur publication ; la Capture n'autorise aucun aperçu exposé, déploiement ou cross-posting.

Ces vérifications n'annulent pas le plan V4 validé. **Q-empreinte** est documentée par une mesure datée et reproductible pour le périmètre défini en VI.B ; les autres points portent sur l'exactitude et l'autorisation des versions à rédiger ou publier.

## Sources et provenance

**S-decisions — primaire, décisions de l'auteur dans les échanges de ce projet (octobre–novembre 2026).** Validation explicite du fond et des sept sections ; V4 demandé avec proportions **15 / 15 / 25 / 23 / 17 / 5** (I–II groupés) ; flash de code dès le début ; CAP comme référence courte ; priorité aux API standards, usages embarqués, garanties et maintenance durable ; sqlite-vec en une phrase sans historique de migration ; abandon de la comparaison juridique avec SQLite.ai ; comparaison d'empreinte envisagée. Aucun permalien public de conversation n'est disponible.

**S-plan — dérivé, plan V4 proposé par l'assistant puis retenu comme base éditoriale par l'auteur.** Les sous-développements, exemples et formulations restent des moyens de rédaction à vérifier, pas des paroles attribuées à l'auteur.

**S-blog — cadre du dépôt :** [AGENTS.md](../../../AGENTS.md), [standard éditorial](../../../standards/editorial.md), [voix](../../../standards/voice.md), [README](../../../README.md). Le blog est canonique, dev.to un relais ; l'auteur décide de toute publication.

**S-package — sources techniques primaires du projet :** [README](https://github.com/at-rama/sqlite-vector-wasm/blob/main/README.md), [usage](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/usage.md), [acceptance](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/acceptance.md), [publication](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/publication.md), [Watch](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/watch.md), [mesures d'empreinte comparées, protocole et résultats datés du 2 novembre 2026](https://github.com/at-rama/sqlite-vector-wasm/blob/main/docs/runtime-footprint.md), [NOTICE](https://github.com/at-rama/sqlite-vector-wasm/blob/main/tools/package/NOTICE-vector.txt). Les documents de `main` évoluent : relever version ou révision dans l'article final.

**S-amont — références à consulter lors de la rédaction :** [SQLite WASM](https://sqlite.org/wasm), [SQLite FTS5](https://www.sqlite.org/fts5.html), [sqlite-vec](https://github.com/asg017/sqlite-vec), [SQLite-Vector](https://github.com/sqliteai/sqlite-vector), [SQLite.ai WASM](https://github.com/sqliteai/sqlite-wasm), [CouchDB — cohérence](https://guide.couchdb.org/editions/1/en/consistency.html). Les références guident les vérifications, sans constituer ici une comparaison juridique ou un benchmark vérifié.

## État de travail

**Capture seule.** Aucune version FR/EN de l'article créée, aucun rapport de vérification produit, aucune autorisation d'aperçu ou de publication accordée. La prochaine opération éditoriale peut partir de ce rationale pour préparer des candidats distincts, sous décision de l'auteur.
