---
content: article/sqlite-vector-wasm-launch
mode: revision
candidates:
  fr:
    path: blog/2026-11-22-sqlite-vector-wasm-launch-revision.md
    content_sha256: cf9d410b6820d8ddfc4c586f504054530ab3b08192a5fbd2a29a17e28807fafd
  en:
    path: i18n/en/docusaurus-plugin-content-blog/2026-11-22-sqlite-vector-wasm-launch-revision.md
    content_sha256: 831f0c8b8e41dc0a5c5d0499a9208410a1f4d02942ca3af7f58a7f414d5ffa5d
targets:
  fr:
    path: blog/2026-11-22-sqlite-vector-wasm-launch.md
    content_sha256: fbd6fac0c4e8538ea7b9304dc3d702b41f20a6a0e6330b75e487c9c4aa363c93
  en:
    path: i18n/en/docusaurus-plugin-content-blog/2026-11-22-sqlite-vector-wasm-launch.md
    content_sha256: 539bdf1dca82684ab217162f03e05b8cb8b7c845668f735a1f9dfb9e7afad6e0
references:
  - path: standards/editorial.md
    git_blob_sha: 3b14527a213f999378b1431e0cfa8728e4e0ef4b
  - path: standards/voice.md
    git_blob_sha: 9de8dd5bff300acca547514bb6ae78eecc6185ff
  - path: .42p/design/article_sqlite-vector-wasm-launch/rationale.md
    git_blob_sha: 9c77f0ce82bc0f6908221e09588083dee7a20865
baseline:
  fr:
    path: blog/2026-11-22-sqlite-vector-wasm-launch.md
    git_blob_sha: 271f83291fa9b113033ce4bd0786e6c8aede7ce9
  en:
    path: i18n/en/docusaurus-plugin-content-blog/2026-11-22-sqlite-vector-wasm-launch.md
    git_blob_sha: e8a7277d262c6a9669fbc6bce79ade5d46262c7c
result: PASS
---


# Vérification éditoriale indépendante — Révision du CTA et de la collection de sqlite-vector-wasm

Vérification du 2026-11-23 sur les candidats FR et EN du commit [`2b2f1dc`](https://github.com/jpbourgeon/blog/commit/2b2f1dcaf5458d2b0efcab4eeb340369e3650cdd) de la [PR #37](https://github.com/jpbourgeon/blog/pull/37), dans un contexte distinct de la rédaction.

| Axe | Verdict | Constat |
| --- | --- | --- |
| Exactitude et sources | PASS | L’ajout donne accès à trois ressources existantes. L’exemple RGB, les garanties, les licences et la mesure conservent les éléments vérifiés ci-dessous. |
| Intention, Capture et composition | PASS | Le diff des textes confirme les trois accès demandés avant la coupure, le seul tag `laidback` et l’identité octet par octet de tout ce qui suit le séparateur, dont le §7 intégral, dans chaque langue. Le plan V4 historique est intact. |
| Standard éditorial et extrait | PASS | Chaque introduction pose le problème, présente la distribution et permet de l’essayer ou de l’examiner avant l’unique marqueur Markdown natif. Le nouvel accès précède naturellement l’exemple. Les conventions ajoutées au standard respectent le caractère conditionnel de l’accès précoce et le rattachement facultatif à une collection. |
| Voix française | PASS | « Stocker localement ne suffit pas » donne une conséquence immédiate de la panne de réseau. « Essayer la démo » transforme l’intention en action dans le même registre direct. L’exemple RGB donne ensuite un objet concret aux choix d’API et la séquence d’arrêt ordonné précise la garantie de persistance. |
| Voix anglaise | PASS | « Local storage alone is not enough » garde cette entrée concrète. « Try the browser demo » et les deux autres libellés restent usuels pour le lectorat visé. « What works in the archive actually shipped » relie la construction à une preuve vérifiable. |
| Parité sémantique FR/EN | PASS | Même ordre et mêmes destinations pour démo, guide et dépôt. La coupure, la collection, l’exemple, les chiffres, les sept sections et les réserves gardent leur sens dans les deux langues. |
| Liens | PASS | Les trois liens d’introduction répondent en HTTPS. L’ancre Vite existe dans le guide déployé. Le registre npm donne accès au paquet malgré le HTTP 403 de la vitrine npm depuis cet environnement. |
| Préparation technique | PASS | `publication prepare` sur le commit propre, contrôle TypeScript et 25 tests de publication réussis. Builds Docusaurus et Pagefind réussis en FR/EN sur le commit candidat et sur sa projection locale. |

## Capture, décisions et composition

La PR applique les arbitrages du 23 novembre consignés dans `C-revision-cta-tags`. Le diff de la Capture ne contient que cet ajout. Aucun `plan.revision.md` n’accompagne les candidats. Le plan V4 adopté reste la référence des sept sections. Ses figures sont facultatives. Les tableaux du classement RGB et de l’empreinte suffisent à lire les valeurs. Les positions sur le périmètre du paquet, les garanties et les mesures proviennent des décisions d’auteur consignées dans la Capture. [Capture](rationale.md) · [Plan V4](plan.md) · [Vérification de la version publique](verification.md)

| Capture et plan → candidats FR et EN | Réalisation |
| --- | --- |
| Fondation, exemple d’ouverture et usages embarqués | Introduction sur le besoin de requêter les données locales. Les §1–2 passent de la palette en mémoire aux cas d’usage et à la complémentarité SQL, FTS5 et vecteurs. Le §7 borne ce que l’exemple démontre. |
| `C-upstreams`, architecture et périmètre | Les §3–4 situent sqlite-vec, SQLite-Vector et SQLite.ai. API C/OO1, intégration statique, enregistrement des fonctions et déclaration par connexion expliquent l’intégration prête à l’emploi. Worker, Vite et OPFS précisent ses conditions. Le §7 laisse embeddings, synchronisation, conflits et classement hybride à l’application. |
| `C-licences` et `C-durabilite` | Le §5 rattache licences, entrées et traces d’assemblage à l’archive réelle, puis détaille qualification, oracles de distance, reprise OPFS, sélection humaine et livraison. Le §7 borne le test à l’arrêt ordonné. |
| Empreinte mesurée | Le §6 donne le périmètre, les trois valeurs et le compromis de composition. Le §7 rappelle les limites de comparaison. |
| `C-revision-cta-tags` | Trois liens avant le marqueur, seul tag `laidback` dans les deux candidats et §7 intégral. Le standard consigne les deux conventions. Les chemins publics, le plan V4 et le rapport public sont identiques à la base de la PR. |

Dans le sens candidats → Capture, les seules additions au texte sont les trois accès prévus par `C-revision-cta-tags`. Le tag suit le même arbitrage. Le reste s’appuie sur les éléments mappés ci-dessus. La comparaison des corps avec chaque original établit que le raisonnement demeure continu. La palette donne une raison de s’intéresser aux API, l’intégration motive la qualification de l’archive, puis les octets mesurés rendent le coût du choix observable avant l’invitation finale. Le vocabulaire et le niveau de détail restent adaptés à des lecteurs qui intègrent un runtime navigateur.

## Contrôles indépendants

- Les deux requêtes RGB ont été rejouées sur les fichiers JavaScript et WASM de l’archive npm 0.4.0 avec une adaptation du chargement sous Node. Elles renvoient dans les deux langues les trois voisins dans l’ordre attendu. Distances observées 15,779733658, 23,151674271 et 193,749832153, conformes au calcul euclidien indépendant. Les assertions navigateur et OPFS s’appuient sur la qualification produit et le rapport public antérieur. Le rejeu local porte sur l’exemple en mémoire. [Guide épinglé](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/usage.md) · [Qualification épinglée](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/acceptance.md)
- Le SHA-256 de l’archive npm (`9b7382d48be1bd76eb8bff2246fd63028b31cb34eeb974aea2ca3abf8cbc1259`) concorde avec le manifeste de publication, l’asset GitHub et le sujet de l’attestation décodée. Le contrôle porte sur les identités et les pièces, hors validation cryptographique de la signature. L’archive contient les licences et origines annoncées. Le contrat de livraison distingue le manifeste, l’attestation et le reçu. [Release 0.4.0](https://github.com/at-rama/sqlite-vector-wasm/releases/tag/dist/v0.4.0) · [Registre npm](https://registry.npmjs.org/@at-rama%2Fsqlite-vector-wasm/0.4.0) · [Contrat épinglé](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/publication.md)
- Le relevé du 2 novembre 2026 confirme les valeurs de 483 824, 517 404 et 583 616 octets en gzip normalisé pour les paires chargeur/WASM. Le recalcul donne +6,9405 % et −11,3451 %, arrondis correctement. Les textes préservent les différences de versions et de périmètres. [Relevé épinglé](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/runtime-footprint.md)
- Les liens vers la démo, le guide, le dépôt, les projets amont et les documents cités répondent. L’ancre `vite-production-build` est présente dans le guide. Le lien de la vitrine npm figure déjà dans le §7 public et le registre confirme la disponibilité de la version examinée. [Démo](https://at-rama.github.io/sqlite-vector-wasm/demo/) · [Guide](https://at-rama.github.io/sqlite-vector-wasm/usage/#vite-production-build) · [Dépôt](https://github.com/at-rama/sqlite-vector-wasm)
- Le HTML de projection affiche les trois liens dans les listes FR/EN avant « Lire plus » / « Read more », le seul tag `laidback` et sa page de collection dans les deux langues. Les deux articles canoniques gardent leurs sept sections et leurs URL. Sur les deux builds, les chemins de révision sont absents du HTML public et des sitemaps utilisés par Pagefind. La projection a été produite localement par la même fonction que `publication project`.

## Améliorations non bloquantes

Au §5, la mention « release 0.4.0 » introduit les pièces de livraison dans les deux langues. Un lien directement sur cette mention permettrait au lecteur d’accéder aux pièces au moment où il découvre la preuve. Dans l’introduction anglaise, « while shipping an integration that each application does not have to rebuild » retarde l’expression du bénéfice. Une formulation centrée sur le travail d’intégration épargné rendrait cette idée plus immédiate.

Human editorial approval: not granted by this report
