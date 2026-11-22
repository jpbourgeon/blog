---
content: article/sqlite-vector-wasm-launch
mode: new
candidates:
  fr:
    path: blog/2026-11-22-sqlite-vector-wasm-launch.md
    content_sha256: d03d574b7c5c4e6d32db32fbe1c230fb510c624d0eada465f888ca5797f6acaa
  en:
    path: i18n/en/docusaurus-plugin-content-blog/2026-11-22-sqlite-vector-wasm-launch.md
    content_sha256: 022cfb4c4c662b55251f393c97bcf48ee7b3984d173781be2792fe41d7fa6829
targets:
  fr:
    path: blog/2026-11-22-sqlite-vector-wasm-launch.md
    content_sha256: d03d574b7c5c4e6d32db32fbe1c230fb510c624d0eada465f888ca5797f6acaa
  en:
    path: i18n/en/docusaurus-plugin-content-blog/2026-11-22-sqlite-vector-wasm-launch.md
    content_sha256: 022cfb4c4c662b55251f393c97bcf48ee7b3984d173781be2792fe41d7fa6829
references:
  - path: standards/editorial.md
    git_blob_sha: 848650f4a16d218198b9228efe8fa74f0cc31774
  - path: standards/voice.md
    git_blob_sha: 9de8dd5bff300acca547514bb6ae78eecc6185ff
  - path: .42p/design/article_sqlite-vector-wasm-launch/rationale.md
    git_blob_sha: fd4ffb5caacbb2158fb1ef4ff89f5f797ac5109b
result: PASS
---

# Vérification éditoriale indépendante — sqlite-vector-wasm

Vérification du 2026-11-22. [PR #31](https://github.com/jpbourgeon/blog/pull/31), candidats français et anglais au commit [`1e5976b044b036075ba7d81359910bfe352794c2`](https://github.com/jpbourgeon/blog/commit/1e5976b044b036075ba7d81359910bfe352794c2). Le contexte de vérification est distinct de la rédaction des deux commits correctifs.

**Verdict global : PASS.** Le dernier écart relevé sur `a1470dc` est résolu dans les deux langues. Au §5, le rôle de la décision humaine et la qualification post-fusion suffisent à expliquer le contrôle de la mise à jour. Les deux versions suivent l’arbitrage éditorial sur les limites et conservent les faits vérifiés sur la release 0.4.0.

| Axe | Verdict | Constat |
| --- | --- | --- |
| Exactitude et preuves | PASS | Exemple RGB, choix techniques, chronologie et pièces de la 0.4.0, notices et mesure d’empreinte étayés. |
| Intention, Capture et composition | PASS | Les contributions du plan V4 sont réalisées dans les deux versions. La réserve redondante au §5 a été supprimée dans les deux langues. |
| Standard éditorial | PASS | Portée des garanties, conditions d’usage et interprétation des tailles restent explicites. |
| Voix française | PASS | Le besoin, l’exemple, les choix techniques et leurs effets sur la maintenance forment une progression concrète. |
| Voix anglaise | PASS | La même progression et le même registre technique sont conservés. |
| Parité sémantique FR/EN | PASS | Métadonnées, exemple, garanties, chiffres, liens et limites concordent. |
| Liens | PASS | Guide, ancre Vite, démo, dépôts et documentation accessibles. Paquet confirmé par le registre npm. |
| Préparation technique | PASS | Identités recalculées, 25 tests de publication, TypeScript, build FR/EN avec Pagefind et rendu local des deux articles. |

## Intention, composition et correspondance dans les deux sens

| Composante de la Capture et du plan V4 | Preuve dans les deux candidats |
| --- | --- |
| Intention et usage local | L’introduction relie l’indisponibilité du serveur au besoin d’interroger les données locales et présente SQLite, FTS5 et SQLite-Vector. Les §1–2 passent du cas RGB aux usages embarqués et aux trois primitives. |
| Exemple d’ouverture | Le §1 reprend les quatre triplets, les opérations OO1, le BLOB Float32, la configuration par connexion, la requête L2 et la fermeture. Les résultats dans l’ordre attendu figurent dans le tableau. Le §7 situe la portée de l’exemple. |
| Écosystème et composition | Le §3 reconnaît sqlite-vec et le WASM enrichi de SQLite.ai. Float32 et BIT/Hamming motivent le choix de SQLite-Vector, et l’absence de Sync et Memory éclaire le périmètre de maintenance. |
| Architecture et périmètre | Le §4 expose C/OO1, l’intégration statique, l’enregistrement automatique des fonctions et l’initialisation de colonne sur chaque connexion. Le guide Vite et les conditions Worker/OPFS relient l’architecture à l’utilisation. Le §7 fixe la frontière avec l’application. |
| Construction, qualification et suivi | Le §5 relie les entrées épinglées et le manifeste aux contrôles de l’archive, aux oracles indépendants et à la réouverture OPFS après arrêt ordonné. La sélection et la fusion humaines précèdent la qualification finale, puis la livraison automatique. |
| Licences et preuves de release | Le §5 décrit les licences du projet et des composants, cite les pièces accessibles de la 0.4.0 et précise quel contrôle d’empreinte a effectivement été effectué. |
| Empreinte et essai | Le §6 reprend la date, le périmètre et les valeurs du relevé. Le §7 regroupe les limites de l’usage et du relevé, avec les quatre points d’entrée d’essai. |

Dans le sens contenu → Capture, les trois cas d’usage sont des illustrations du plan. Les instructions Worker/Vite proviennent du guide. Les garanties, licences et pièces du §5 sont rattachées aux choix C-durabilite et C-licences et aux preuves ci-dessous. La chronologie corrigée explicite le contrôle humain sans engagement de durée. Le delta depuis `a1470dc` se limite à la suppression de la réserve FR et EN. Le plan indique que ses deux figures sont facultatives. Les tableaux fournissent les résultats et les valeurs mesurées. [Capture](https://github.com/jpbourgeon/blog/blob/1e5976b044b036075ba7d81359910bfe352794c2/.42p/design/article_sqlite-vector-wasm-launch/rationale.md) · [Plan V4](https://github.com/jpbourgeon/blog/blob/1e5976b044b036075ba7d81359910bfe352794c2/.42p/design/article_sqlite-vector-wasm-launch/plan.md)

## Contrôles et limites des preuves

- **Release 0.4.0.** La PR produit #100 est fusionnée par l’auteur au commit `8dfeda79fcd14e2f43afa34f31ee53420a74ce24`. Le manifeste distingue l’archive candidate et la qualification finale réussie sur le commit intégré. Le workflow de ce commit enchaîne qualification et publication. Le SHA-256 du tarball npm contrôlé concorde avec les empreintes de l’archive consignées dans le manifeste et les métadonnées GitHub `9b7382d48be1bd76eb8bff2246fd63028b31cb34eeb974aea2ca3abf8cbc1259`. L’attestation décodée désigne ce commit et cette archive. La vérification cryptographique de sa signature reste hors du contrôle effectué. Le reçu référence le manifeste et consigne l’acceptation npm. La release GitHub est finalisée. [PR produit #100](https://github.com/at-rama/sqlite-vector-wasm/pull/100) · [Workflow](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/.github/workflows/release.yml) · [Pièces de la release](https://github.com/at-rama/sqlite-vector-wasm/releases/tag/dist/v0.4.0)
- **Intégration et licences.** Le code de construction et la documentation produit étayent la conservation des interfaces, l’intégration statique, les oracles L2/Hamming et le scénario de reprise OPFS. Le tarball comporte `LICENSE` et `NOTICE` à la racine, ainsi que les notices des composants et leurs origines sous `licenses/`. Le `NOTICE` confirme les attributions des brouillons. [Construction](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/build.md) · [Qualification](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/acceptance.md) · [Notice](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/tools/package/NOTICE-vector.txt)
- **Exemple RGB.** Les blocs identiques octet pour octet à ceux du commit examiné ont été exécutés de nouveau sous Chromium Headless Shell 153.0.8010.0 à partir du paquet npm 0.4.0 servi en local. Dans les deux langues, le classement attendu donne 15,779733658, 23,151674271 et 193,749832153. Le calcul indépendant √249, √536, √37539 confirme les résultats à 10⁻⁵ près.
- **Empreinte.** Les trois valeurs normalisées de 483 824, 517 404 et 583 616 octets donnent +6,9405 % et −11,3451 %, arrondis dans les deux textes à +6,9 % et −11,3 %. Le contrôle s’appuie sur le relevé publié et le recalcul des écarts. [Relevé du 2 novembre](https://github.com/at-rama/sqlite-vector-wasm/blob/8dfeda79fcd14e2f43afa34f31ee53420a74ce24/docs/runtime-footprint.md)
- **Liens et build.** Les liens des deux textes concordent. Tous les liens des articles hors vitrine npm répondent 200, et l’ancre Vite existe. La vitrine renvoie HTTP 403 depuis l’environnement de vérification, tandis que le registre confirme le paquet et permet de télécharger l’archive. Node.js 26.13.1 exécute les 25 tests, le contrôle TypeScript et le build exact FR/EN avec Pagefind. Ce build exclut les brouillons. Une projection strictement locale, limitée au changement temporaire du champ de visibilité, rend les deux articles et produit leurs balises `noindex`. Docusaurus signale l’absence de séparateur d’extrait. [Guide Vite](https://at-rama.github.io/sqlite-vector-wasm/usage/#vite-production-build) · [Démonstration](https://at-rama.github.io/sqlite-vector-wasm/demo/) · [Registre](https://registry.npmjs.org/@at-rama%2Fsqlite-vector-wasm/0.4.0)

## Voix et améliorations éditoriales

En français, les trois opérations sur la palette donnent une raison de suivre l’explication des API au §4. Le redémarrage du Worker au §5 rend observable la garantie de reprise. En anglais, « what works in the archive actually shipped » préserve le même lien entre l’objet livré et les contrôles. Le §6 prolonge dans les deux langues le choix de composition en donnant son coût mesuré en octets. Ces passages reprennent les positions consignées dans la Capture et dans l’historique des arbitrages en conservant un registre adapté au lectorat technique.

Le §5 gagnerait à lier directement « release 0.4.0 » aux pièces que le lecteur peut consulter. Le paragraphe sur les licences gagnerait aussi à distinguer plus nettement les fichiers à la racine des notices sous `licenses/` et à rapprocher la reconstruction des enregistrements de construction. Ces deux améliorations relèvent de l’accès aux preuves et de la lisibilité.

Human editorial approval: not granted by this report
