---
content: page/about
mode: revision
candidates:
  fr:
    path: src/drafts/pages/fr/about.md
    content_sha256: 7b605e19636c748a8e95ae0226eeb71e3c9bd35d7016a5a6d3d172b78f6d5ef8
  en:
    path: src/drafts/pages/en/about.md
    content_sha256: ed63f003fb8c0e732af6d2bfdbb45cb4fe4679539cf6d9e5be19fbb3a2173a3d
targets:
  fr:
    path: src/pages/about.md
    content_sha256: 7b605e19636c748a8e95ae0226eeb71e3c9bd35d7016a5a6d3d172b78f6d5ef8
  en:
    path: i18n/en/docusaurus-plugin-content-pages/about.md
    content_sha256: ed63f003fb8c0e732af6d2bfdbb45cb4fe4679539cf6d9e5be19fbb3a2173a3d
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
result: PASS
---

# Vérification éditoriale — À propos / About

**PASS** pour les candidates FR et EN de la [PR #23](https://github.com/jpbourgeon/blog/pull/23) au [commit c45f6bc](https://github.com/jpbourgeon/blog/commit/c45f6bcbe054467599e672ca7337c8694b0939fb). Revue indépendante du 2026-11-19.

| Axe | Verdict | Éléments probants |
| --- | --- | --- |
| Intention et standard éditorial | PASS | Le premier paragraphe de « Pourquoi ce blog » relie l’écriture à la clarification des idées et la publication à leur confrontation avec d’autres expériences. Le second part des éléments mis à disposition pour expliquer ce que le lecteur peut comprendre, adapter ou contester. |
| Couverture de la Capture | PASS | Le travail avec les équipes, le pilotage, les décisions et la maîtrise face à l’automatisation sont visibles. L’utilité des travaux en cours pour le lecteur est exprimée dans les deux versions. |
| Voix et progression FR | PASS | Des décisions et de leurs effets dans le travail, le texte passe à la raison d’exposer son raisonnement, puis à la manière dont le lecteur peut s’en saisir. La perspective personnelle est étayée par les décisions de l’auteur. |
| Voix et progression EN | PASS | La même progression relie la pratique professionnelle, la mise en discussion des idées et l’usage des raisonnements par le lecteur. Le registre reste personnel et direct. |
| Parité FR/EN | PASS | Les deux versions préservent les mêmes raisons de publier, la même place du lecteur, le même champ et les mêmes informations pratiques. Les signatures reprennent les choix propres à chaque langue. |
| Faits et liens | PASS | Les 14 destinations ont été revérifiées. LinkedIn répond 999 à l’accès automatisé et le profil public indexé corrobore l’identité et le chemin. Les autres destinations répondent 200. |
| Mentions légales et confidentialité | PASS | Les textes retenus par l’auteur sont conservés. Les différences dans les notices anglaises se limitent aux lignes vides. Le dépôt et les sources des services concordent avec les éléments observables. |
| Intégration technique | PASS | Identités recalculées, build des deux pages projetées, Pagefind, TypeScript et 35 tests de publication. |

## Correspondance entre la Capture et les candidates

La [Capture au commit vérifié](https://github.com/jpbourgeon/blog/blob/c45f6bcbe054467599e672ca7337c8694b0939fb/.42p/rationale-units/page_about/capture.md) et les décisions de l’auteur du 19 novembre fixent le sens applicable. La dernière demande éditoriale, partir de l’auteur pour aboutir au lecteur, est vérifiée sur les deux paragraphes de fond.

| Décision | Application dans les deux langues |
| --- | --- |
| C-identite et O-avatar-local | Portrait versionné de 104 × 104 px avec texte alternatif, nom, signature validée et en-têtes adaptés. L’introduction présente le travail sans répéter le titre et indique que l’auteur parle en son nom. Les descriptions reprennent les éléments de la signature. |
| C-perspective | « J’aime comprendre ce qui guide les décisions » et « I like understanding what drives decisions » ancrent la curiosité dans le travail. L’explication des choix, l’observation de leurs effets en pratique et le rôle des équipes rendent concrètes la responsabilité et la mise à l’épreuve. La préférence pour des solutions simples est liée à leur compréhension et à leur maîtrise. L’évolution possible des systèmes revient au début de la section sur le blog. |
| C-publication | Les réflexions, essais et réalisations rendent perceptible un travail plus large que le blog. Écrire clarifie et conserve le cheminement. Publier confronte les idées à d’autres expériences et objections, y compris quand des questions demeurent ouvertes. Le blog est aussi présenté comme un terrain d’essai, avec l’écriture comme exemple. L’initiative créatrice est perceptible à travers la démarche et les réalisations. Elle reste une dimension secondaire. |
| C-lecteur | Le texte explique pourquoi exposer les questions, essais et résultats ensemble. Cette matière permet de suivre la formation d’une idée, de comprendre les choix et d’identifier les difficultés qui persistent. Le lecteur peut alors s’emparer du raisonnement, l’adapter ou le contester. Les systèmes, leurs usages et leur évolution, reliés au travail des équipes dans l’introduction, donnent le terrain de cette réflexion. |
| C-progression | Deux paragraphes de fond et une note distincte sur les agents. La présentation personnelle situe la pratique. La section suivante explique ce que publier change pour le travail et ce que cette mise à disposition permet au lecteur. |
| C-domaines | Développement logiciel, conception, équipes qui font vivre les SI et pilotage sont dans l’ouverture. Management et gouvernance apparaissent par le rôle de direction, le travail avec les équipes et l’attention portée aux raisons et effets des décisions. La maîtrise face à l’automatisation est explicite. |
| C-redaction | Les agents aident à explorer, rédiger, traduire et vérifier. L’auteur choisit le propos et valide chaque publication. |
| C-productions et C-contact | La mise en œuvre soumet l’idée aux contraintes de conception, d’usage et de maintenance. At-rama est présenté comme organisation de production open source. Les trois profils personnels ont leur propre section. |
| C-statut, C-legal et C-privacy | Statut, responsable de publication, hébergeur, coordonnées, licences, mesure d’audience et réglages déclarés reprennent les choix approuvés pour les deux langues. |
| Cadre de réalisation | Ordre des fonctions de la page respecté. Portrait local et routes natives. Les candidates sont hors routage. Aucune figure supplémentaire n’est demandée. |

La lecture des candidates vers la Capture rattache l’introduction à l’identité et au regard sur le métier, les deux paragraphes sur le blog à la mise à l’épreuve des idées et à l’ouverture au lecteur, puis la transparence, les productions, les contacts et les notices à leurs décisions respectives. Aucun ajout substantiel hors de ces décisions n’a été relevé.

## Voix et composition

En français, « Je préfère les solutions simples, plus faciles à comprendre et à maîtriser » donne une raison à un choix de conception. La section suivante montre une autre façon de mettre les choix à l’épreuve. Les exposer avec « les questions de départ et les essais » donne au lecteur la matière grâce à laquelle il peut « suivre le raisonnement […] l’adapter à [son] contexte ou le contester ». Le passage aux contributions reprend cette idée de mise à l’épreuve par les contraintes effectives du code.

En anglais, « which choices were made, and what difficulties remain » précise ce que le lecteur pourra tirer du cheminement avant de prendre position. La phrase sur le terrain d’essai prolonge la motivation personnelle avec une précision secondaire. Placée juste après l’adresse au lecteur, elle atténue légèrement la fin du mouvement dans les deux langues. Cet effet local ne défait pas la progression.

## Sources et contrôles techniques

- Les notices reprennent les textes retenus au [commit f7162c5](https://github.com/jpbourgeon/blog/commit/f7162c580961daf6040a455025bb325082d5cb94). La comparaison confirme l’identité octet pour octet en FR et l’identité des lignes non vides en EN. [Coordonnées GitHub](https://docs.github.com/en/site-policy/content-removal-policies/guide-to-submitting-a-dmca-takedown-notice) · [Licence des textes](https://creativecommons.org/licenses/by-nc-nd/4.0/) · [Licences et exceptions du dépôt](https://github.com/jpbourgeon/blog/blob/main/LICENSE-ADDITIONAL.md)
- Le module de mesure est inchangé par rapport à la revue précédente. Il donne le chemin, le titre et le référent à l’arrivée. Le script de mesure transmet la largeur d’écran. L’usage temporaire des données de connexion et l’absence de conservation des IP brutes en base sont corroborés par la documentation. Les sessions, les référents, les pays, la durée de 365 jours et l’exclusion de la largeur des statistiques reposent sur la déclaration de l’auteur. [Module de mesure](https://github.com/jpbourgeon/blog/blob/c45f6bcbe054467599e672ca7337c8694b0939fb/src/client/goatcounter.ts) · [Script de mesure](https://gc.zgo.at/count.js) · [Confidentialité GoatCounter](https://www.goatcounter.com/help/privacy) · [Confidentialité GitHub](https://docs.github.com/fr/site-policy/privacy-policies/github-general-privacy-statement)
- Le contrôle HTTP couvre les 14 destinations distinctes et le script GoatCounter. Le code 999 observé sur LinkedIn limite le contrôle automatisé, et le [profil public indexé](https://fr.linkedin.com/in/jpbourgeon) confirme l’identité et le chemin.
- Sous Node 26.13.1, `publication prepare`, TypeScript, les 35 tests et `publication gate none` passent. Le build local de la projection FR/EN et Pagefind passent. Les sorties contiennent les passages candidats, les URL canoniques, les entrées de sitemap, les liens d’en-tête et de pied de page, l’ancre légale et le portrait local. La revue visuelle mobile relève de l’auteur. La [CI Pages du commit examiné](https://github.com/jpbourgeon/blog/actions/runs/44586300693) passe également.
- Le diff de la PR signale une ligne vide surnuméraire en fin de candidate EN, sans effet sur le rendu ni sur le verdict.

## Améliorations de formulation non bloquantes

- **FR.** Dans « Ils permettent de comprendre […] », le pronom peut sembler reprendre les seuls « résultats ». Faire porter explicitement la phrase sur le cheminement renforcerait la relation entre ce que l’auteur rend visible et ce que le lecteur peut en faire.
- **EN.** « Things I’ve built around systems » et les deux emplois proches de « evolve » rendent l’ouverture moins nette que la suite. Une formulation plus directe gagnerait à distinguer les systèmes que l’auteur étudie des réalisations qu’il partage.

Human editorial approval: not granted by this report
