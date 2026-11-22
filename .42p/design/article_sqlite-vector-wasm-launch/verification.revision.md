---
content: article/sqlite-vector-wasm-launch
mode: revision
candidates:
  fr:
    path: blog/2026-11-22-sqlite-vector-wasm-launch-revision.md
    content_sha256: 4fadd03bbae8148b800d97986ec3f363bca7a96210cecb2b9532bf4a68c03931
  en:
    path: i18n/en/docusaurus-plugin-content-blog/2026-11-22-sqlite-vector-wasm-launch-revision.md
    content_sha256: 9b91870f8002d11deb0a573ae681e7482d4da9895f1e8ccee63c0168a834e2eb
targets:
  fr:
    path: blog/2026-11-22-sqlite-vector-wasm-launch.md
    content_sha256: e99a0608884301a9b687003b34e1864d71270ac25894976121c34b5591589747
  en:
    path: i18n/en/docusaurus-plugin-content-blog/2026-11-22-sqlite-vector-wasm-launch.md
    content_sha256: 7c021df54b8a8294ea54b22d0d03dd552111aae6f08c5779428ce9b71683ff4a
references:
  - path: standards/editorial.md
    git_blob_sha: 0ad387fb879722c1120dac051675f004e32d5fc3
  - path: standards/voice.md
    git_blob_sha: 9de8dd5bff300acca547514bb6ae78eecc6185ff
  - path: .42p/design/article_sqlite-vector-wasm-launch/rationale.md
    git_blob_sha: fd4ffb5caacbb2158fb1ef4ff89f5f797ac5109b
baseline:
  fr:
    path: blog/2026-11-22-sqlite-vector-wasm-launch.md
    git_blob_sha: 602eaf8b59bdb56d277c93b49a4817270c53d33a
  en:
    path: i18n/en/docusaurus-plugin-content-blog/2026-11-22-sqlite-vector-wasm-launch.md
    git_blob_sha: 20b21cf34028df31dbb7cbe3087e96ecc7b1ba73
result: PASS
---

# Vérification éditoriale indépendante — Révision des extraits de sqlite-vector-wasm

Vérification du 2026-11-22 sur les candidats FR et EN du commit [`ea27fd06`](https://github.com/jpbourgeon/blog/commit/ea27fd06f0abd8cde8b7737e873d611ada418ba7), introduits par la [PR #34](https://github.com/jpbourgeon/blog/pull/34). Ce contexte est distinct de la rédaction. La comparaison octet par octet avec la version publiée montre que la projection publique ajoute uniquement le marqueur et une ligne vide. Les champs de statut et de slug distinguent les candidats de leurs cibles.

| Axe | Verdict | Constat |
| --- | --- | --- |
| Exactitude et preuves | PASS | L’exemple, les garanties, les licences et le périmètre de la comparaison restent étayés. |
| Intention, Capture et composition | PASS | La révision applique l’arbitrage sur les extraits et conserve les contributions du plan V4 adopté. |
| Standard éditorial et extrait | PASS | Un séparateur natif Markdown suit les deux paragraphes d’introduction dans chaque langue. Le premier pose le problème du serveur inaccessible, le second présente le paquet et son choix d’API. Ces deux paragraphes forment un extrait autonome et préparent naturellement le cas RGB. |
| Voix française | PASS | « Stocker localement ne suffit pas » introduit une conséquence concrète. La palette donne un enjeu aux choix d’API, puis la réouverture du Worker précise ce que garantit le test. Les octets mesurés donnent une conséquence observable au choix de composition. |
| Voix anglaise | PASS | « Local storage alone is not enough » conserve l’entrée directe. « What works in the archive actually shipped » relie le choix technique à la preuve dans un registre naturel pour le lectorat visé. |
| Parité sémantique FR/EN | PASS | L’introduction, la coupure, les sept sections, les chiffres, les liens et les réserves concordent. |
| Liens | PASS | Les liens produit, amont, guide et démo répondent. L’ancre Vite est présente. Le registre npm fournit l’archive malgré un HTTP 403 de la vitrine depuis cet environnement. |
| Préparation technique | PASS | Empreintes recalculées avec `publication prepare`, 25 tests de publication et TypeScript réussis. Build bilingue et rendu HTML vérifiés sur la projection locale. |

## Capture, décisions et composition

Il n’existe pas de plan de révision distinct. Le plan V4 demeure la référence de composition puisque les deux textes gardent la structure précédemment vérifiée. Ses deux figures étaient facultatives. Les tableaux rendent directement lisibles le classement et les valeurs d’empreinte. [Capture](rationale.md) · [Plan de référence](plan.md) · [Vérification publique de référence](verification.md)

| Capture et plan → candidats FR et EN | Réalisation |
| --- | --- |
| R-fondation, besoin et ouverture | L’introduction motive les requêtes locales. Les §1–2 passent de la palette en mémoire aux usages embarqués et à la complémentarité SQL, FTS5 et vecteurs. |
| C-upstreams, architecture et périmètre | Les §3–4 situent sqlite-vec, SQLite-Vector et SQLite.ai, puis expliquent la composition ciblée, les API C/OO1, le lien statique, l’enregistrement automatique, l’initialisation par connexion et les conditions Worker/Vite/OPFS. |
| C-durabilite et C-licences | Le §5 relie les entrées et licences à l’archive qualifiée, aux oracles indépendants, à la reprise OPFS après arrêt ordonné, au suivi amont et aux pièces de la release. |
| Empreinte et accès à l’essai | Les §6–7 donnent le relevé daté, ses limites, les accès à l’essai et la frontière avec les responsabilités de l’application. |

Dans le sens candidats → Capture, la palette et les trois usages développent les exemples prévus. Worker et Vite concrétisent le contrat d’usage documenté. Les assertions sur les licences, la provenance et la livraison relèvent du choix de garanties et sont étayées par les pièces de release. La seule addition publique, le séparateur d’extrait, applique la décision prise dans la PR #34. Les candidats reprennent les positions d’auteur attestées par la Capture et le PASS de référence.

## Contrôles indépendants

- **Exemple et fonctions.** Les requêtes des deux exemples, identiques à celles du texte public dans leur langue, ont été rejouées sur les fichiers WASM et JavaScript de l’archive npm 0.4.0. Une adaptation du chargement a permis l’exécution sous Node avec les interfaces web nécessaires. Les trois distances obtenues, 15,779733658, 23,151674271 et 193,749832153, concordent avec le calcul indépendant. La qualification navigateur et OPFS est étayée par les preuves produit et par la vérification publique de référence. [Guide](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/usage.md) · [Qualification](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/acceptance.md)
- **Provenance et licences.** Le SHA-256 de l’archive npm (`9b7382d48be1bd76eb8bff2246fd63028b31cb34eeb974aea2ca3abf8cbc1259`) correspond au manifeste, au reçu, aux métadonnées de l’asset GitHub et au sujet de l’attestation décodée. Celle-ci désigne aussi le commit source. Contrôle de concordance, sans validation cryptographique de la signature. Le reçu référence le digest du manifeste. L’inventaire de l’archive contient `LICENSE`, `NOTICE` et les notices et origines sous `licenses/`. [Release 0.4.0](https://github.com/at-rama/sqlite-vector-wasm/releases/tag/dist/v0.4.0) · [Registre npm](https://registry.npmjs.org/@at-rama%2Fsqlite-vector-wasm/0.4.0) · [Contrat de livraison](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/publication.md)
- **Empreinte.** Le relevé confirme les valeurs de 483 824, 517 404 et 583 616 octets pour la paire chargeur/WASM. Le recalcul donne +6,9405 % et −11,3451 %, arrondis correctement dans les deux textes. [Relevé du 2 novembre](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/runtime-footprint.md)
- **Rendu.** Le build Docusaurus 3.10.2 et Pagefind réussit sous Node.js 26.13.1 sur le commit contrôlé et sur la projection locale dont les deux SHA-256 correspondent aux cibles calculées. Les listes déployées et le build du commit affichent les sept sections. Sur la projection, chaque liste contient les deux paragraphes d’introduction et un lien de lecture. Chaque URL canonique affiche toujours les sept sections. Les chemins de révision sont absents du rendu public et du sitemap. [Liste FR déployée](https://jpbourgeon.github.io/blog/) · [Liste EN déployée](https://jpbourgeon.github.io/blog/en/)

## Améliorations non bloquantes

Au §5, « La release 0.4.0 fournit un exemple concret des preuves conservées » et son équivalent anglais introduisent quatre pièces. Un lien depuis la mention de la release donnerait accès à ces pièces au moment où elles sont citées. Dans l’extrait anglais, la tournure « while shipping an integration that each application does not have to rebuild » peut exprimer plus directement le travail épargné au développeur.

Human editorial approval: not granted by this report
