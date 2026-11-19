---
content: page/about
mode: revision
candidates:
  fr:
    path: src/drafts/pages/fr/about.md
    content_sha256: d00d5a0272e8a36e1ef0f0d32dc6a0fd308f7c1f09d82137ef955378fe7e6caa
  en:
    path: src/drafts/pages/en/about.md
    content_sha256: 9457c20b9b2ecf246f595d3c94e7196e877c61f5fba8a2efbb42b27e26b6b3df
targets:
  fr:
    path: src/pages/about.md
    content_sha256: d00d5a0272e8a36e1ef0f0d32dc6a0fd308f7c1f09d82137ef955378fe7e6caa
  en:
    path: i18n/en/docusaurus-plugin-content-pages/about.md
    content_sha256: 9457c20b9b2ecf246f595d3c94e7196e877c61f5fba8a2efbb42b27e26b6b3df
references:
  - path: standards/editorial.md
    git_blob_sha: 848650f4a16d218198b9228efe8fa74f0cc31774
  - path: standards/voice.md
    git_blob_sha: 9de8dd5bff300acca547514bb6ae78eecc6185ff
  - path: .42p/rationale-units/page_about/capture.md
    git_blob_sha: 26195f2d787df42f95cb842a1ffdbff8a2aad342
baseline:
  fr:
    path: src/pages/about.md
    git_blob_sha: 8b43466ce94176d3449942f44ae95d973384e416
  en:
    path: i18n/en/docusaurus-plugin-content-pages/about.md
    git_blob_sha: 7536308af6155c987959de095728b47dbb9ef98a
result: FAIL
---

# Vérification éditoriale — À propos / About

**FAIL** pour les candidates FR et EN de la [PR #23](https://github.com/jpbourgeon/blog/pull/23) au [commit 75ea196](https://github.com/jpbourgeon/blog/commit/75ea19649f77d827cac25d55ed48567da66ce8a9). Revue indépendante du 2026-11-19. La progression de la page fonctionne dans les deux langues. L’ouverture au lecteur et une partie du champ éditorial restent insuffisamment développées pour satisfaire la Capture.

| Axe | Verdict | Éléments probants |
| --- | --- | --- |
| Intention et standard éditorial | FAIL | La page explique pourquoi exposer le travail à la contradiction. Elle laisse implicite l’usage que le lecteur peut faire des questions et des raisonnements ainsi exposés. |
| Couverture de la Capture | FAIL | C-lecteur, C-perspective et C-domaines sont partiels en FR et EN. C-publication conserve son noyau, avec des dimensions secondaires absentes. |
| Voix et progression FR | PASS | Le risque de tenir des hypothèses pour évidentes donne un motif concret à la publication. Le paragraphe suivant applique ce motif aux travaux à différents stades. |
| Voix et progression EN | PASS | La même relation entre hypothèses, confrontation et travaux en cours structure la section. Le registre est personnel et la profondeur adaptée au format. |
| Parité FR/EN | PASS | Les signatures, les intentions exprimées, la progression et les omissions de fond concordent. |
| Faits et liens | PASS | Les destinations répondent en HTTP 200, sauf LinkedIn qui renvoie 999 à l’accès automatisé. Le profil public indexé confirme l’identité et le chemin. |
| Mentions légales et confidentialité | PASS | Les notices bilingues correspondent aux textes retenus par l’auteur. Le dépôt et les sources des services corroborent les éléments observables. Les réglages de compte restent attribués à l’auteur. |
| Intégration technique | PASS | Les identités de la révision sont calculées, la projection locale des sources exactes compile en FR et EN et le contrôle de la version publique passe. |

## Correspondance entre la Capture et les candidates

Les décisions sont celles de la [Capture au commit vérifié](https://github.com/jpbourgeon/blog/blob/75ea19649f77d827cac25d55ed48567da66ce8a9/.42p/rationale-units/page_about/capture.md). Les déclarations de l’auteur sur la pérennisation, la mise au monde de ses travaux et la recherche d’une contradiction utile éclairent l’équilibre visé. La mention « reste à reprendre » dans la Capture décrit l’état de travail. Le verdict de composition repose sur les candidates.

| Décision | Correspondance FR et EN |
| --- | --- |
| C-identite, signature et O-avatar-local | Portrait WebP local de 104 × 104 px avec texte alternatif, nom et signature validée en retrait. L’introduction situe l’activité entre informatique et organisations, puis précise la prise de parole personnelle. Les descriptions condensent la signature. |
| C-perspective | L’introduction relie la simplicité à la maîtrise dans la durée et fixe deux critères concrets, expliquer les choix et vérifier la réponse au besoin. La curiosité ouvre la section sur le blog et la pratique du code apparaît dans les productions. Le travail en équipe comme lieu où s’exerce cette responsabilité manque. |
| C-publication | Écrire donne forme au raisonnement et conserve son cheminement. Publier l’expose à d’autres regards. Le deuxième paragraphe inclut les questions non résolues. La diversité des travaux laisse deviner la démarche plus large. L’expérimentation de l’écriture et de l’initiative créatrice demeure absente, avec un poids secondaire dans la Capture. La sobriété respecte l’arbitrage sur la notoriété. |
| C-lecteur | Les textes disent que les idées peuvent être prolongées ou contestées et que les travaux intermédiaires auront leur place. Le deuxième paragraphe explique ce que l’auteur veut montrer, puis laisse au lecteur le soin de déduire comment les questions, essais et raisonnements peuvent nourrir ses propres choix ou être adaptés à son contexte. Cette ouverture est centrale dans la Capture. |
| C-progression | Deux paragraphes de fond suivis d’une note brève sur les agents. L’introduction situe la pratique, puis la section sur le blog pose une question nouvelle, celle de l’exposition du raisonnement à la contradiction. Le rappel de la curiosité à l’ouverture sert ce passage, avec un léger recouvrement local. |
| C-domaines | La conception, le code et le pilotage de l’évolution des SI sont identifiables. Le management et la gouvernance restent implicites. La maîtrise humaine des systèmes face à l’automatisation manque. La note sur l’IA traite de l’autorité éditoriale dans la fabrication du blog. |
| C-redaction | La dernière note de la section attribue aux agents l’exploration, la rédaction, la traduction et la vérification. L’auteur décide du propos et valide chaque publication dans les deux langues. |
| C-productions et C-contact | Le code met les idées à l’épreuve des contraintes de conception, d’usage et de maintenance. Les contributions renvoient à at-rama. Les trois profils personnels occupent leur section propre. |
| C-statut, C-legal et C-privacy | Les notices reprennent les deux textes retenus par l’auteur. Identité du responsable, statut déclaré, hébergeur, adresse, licences, traitement des données et réglages déclarés concordent. |
| Cadre de réalisation | L’ordre de la page correspond aux fonctions fixées dans la Capture. Les brouillons sont hors des routes publiques et leurs cibles conservent les chemins canoniques. La Capture ne demande aucune figure supplémentaire. |

La lecture des candidates vers la Capture rattache l’identité et l’introduction à C-identite et C-perspective. L’expérience des hypothèses devenues évidentes et les formes de travaux partagés développent C-publication et C-lecteur. Le code et ses contraintes concrétisent C-productions. La transparence sur les agents, les contacts et les notices reprennent leurs décisions dédiées. Aucun ajout substantiel dépourvu d’appui n’a été relevé.

## Voix, composition et parité

En français, « un raisonnement peut être cohérent sans avoir rencontré les objections qui comptent » transforme la curiosité initiale en motif de publication. Écrire permet de fixer la démarche. Publier permet de soumettre ses hypothèses à d’autres regards. Le paragraphe suivant donne une conséquence éditoriale à ce choix en incluant les questions et essais en cours. La section des productions prolonge la mise à l’épreuve sur un autre terrain, celui des contraintes du code.

En anglais, « a line of reasoning can be coherent without having faced the objections that matter » porte le même pivot. « The work I share here is at different stages » étend le propos à la diversité des travaux, puis le passage sur le code explique ce que l’implémentation oblige à préciser. Les deux langues gardent une voix personnelle, soutenue par les motivations exprimées par l’auteur. La transparence, les profils et les notices remplissent des fonctions de référence et trouvent leur place en fin de page.

La relation la moins développée se situe entre l’ouverture à la contradiction et la place des travaux en cours. Le texte établit pourquoi l’auteur les partage. L’usage qu’un lecteur peut en faire reste à inférer. Cet écart pèse sur la fidélité à C-lecteur. Le fil général de la page demeure lisible.

## Sources et contrôles techniques

- Les mentions et la confidentialité sont identiques, octet pour octet en FR et EN, aux notices approuvées au [commit f7162c5](https://github.com/jpbourgeon/blog/commit/f7162c580961daf6040a455025bb325082d5cb94). L’adresse et la licence concordent avec les références. [Coordonnées GitHub](https://docs.github.com/en/site-policy/content-removal-policies/guide-to-submitting-a-dmca-takedown-notice) · [Licence des textes](https://creativecommons.org/licenses/by-nc-nd/4.0/) · [Licences et exceptions du dépôt](https://github.com/jpbourgeon/blog/blob/main/LICENSE-ADDITIONAL.md)
- Le module, identique depuis f7162c5, fournit le chemin, le titre et le référent à l’arrivée. Le script chargé transmet la largeur d’écran. La documentation confirme l’usage temporaire d’informations de connexion pour distinguer les visites et l’absence de conservation des IP brutes en base. Les sessions, référents, pays, durée de 365 jours et largeur exclue des statistiques sont des réglages déclarés par l’auteur. [Module de mesure](https://github.com/jpbourgeon/blog/blob/75ea19649f77d827cac25d55ed48567da66ce8a9/src/client/goatcounter.ts) · [Script de mesure](https://gc.zgo.at/count.js) · [Confidentialité GoatCounter](https://www.goatcounter.com/help/privacy) · [Confidentialité GitHub](https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement)
- Contrôle HTTP des 14 destinations distinctes et du script. LinkedIn renvoie 999 pour l’URL utilisée dans les candidates. L’identité et le chemin sont corroborés par le [profil public indexé](https://fr.linkedin.com/in/jpbourgeon).
- `publication prepare` réussit sur le commit exact et fournit le chemin de ce rapport de révision. `publication gate none` reconnaît la page publique et son PASS existant. Le [correctif #25](https://github.com/jpbourgeon/blog/pull/25) lève le blocage de 1d95bac. Les empreintes des candidates, des références et de la version de référence sont identiques à celles de la revue de 1d95bac.
- Sous Node 26.13.1, TypeScript et les 35 tests de publication passent. Le build local de la projection calculée par le dépôt réussit dans les deux langues, avec Pagefind. Le HTML contient le texte candidat, les routes et URL canoniques attendues, le portrait local et les ancres légales. Les deux routes figurent au sitemap et les brouillons restent hors routage. La revue visuelle mobile relève de l’auteur. La [CI Pages du commit examiné](https://github.com/jpbourgeon/blog/actions/runs/44526714815) passe également.
- `git diff --check origin/main...HEAD` relève un espace final sur le nom et une ligne vide en fin de fichier EN, sans effet sur le rendu.

## Améliorations de formulation non bloquantes

- **FR.** Dans « Écrire m’aide à lui donner forme […] publier permet de la confronter », les pronoms peuvent reprendre plusieurs éléments. Nommer ce qui est exposé à la contradiction rendrait le pivot plus net.
- **EN.** Dans « publishing opens it to other perspectives, where it can be taken further or challenged », « where » rattache l’action à une abstraction. Rendre les personnes qui prolongent ou contestent l’idée plus visibles renforcerait le passage vers le deuxième paragraphe.

Human editorial approval: not granted by this report
