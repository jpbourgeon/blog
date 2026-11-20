# ChatGPT Work — Vérification indépendante des allocations réalisées

**Cible :** `jpbourgeon/blog`, PR **#27**, branche `docs/capture-system-editorial-workflow`.
**Mission :** établir, sur un commit précis, si la réalisation complète des allocations **A1–A7** est fidèle à la Capture, sans perte des garanties existantes.

Travailler dans un **contexte distinct de celui de l'agent exécutant**. Ne considérer ni ses comptes rendus, ni ses PASS unitaires, ni les assertions de la PR comme preuves de conformité. **Vérification seule :** ne corriger aucun fichier, ne modifier ni le canon ni la PR, ne fusionner, publier, déployer ou exposer d'aperçu.

## 1. Établir le périmètre et les sources

1. Lire la PR, son diff complet contre sa base, son historique, l'arbre du commit de tête et `AGENTS.md`. Identifier le **SHA exact du commit examiné** et la base de comparaison ; relever tout changement intervenant durant la revue.
2. Lire **intégralement** la Capture `system-editorial-workflow` et son Allocation, en retrouvant leur emplacement réel dans le commit examiné : historiquement `.42p/rationale-units/system-editorial-workflow/{capture,allocation}.md`, ou `.42p/design/system-editorial-workflow/{rationale,allocation}.md` après migration. Ne pas inférer le contenu depuis le prompt ou l'ancien chemin.
3. Pour chaque attribution, consulter dans la Capture le passage complet — contraintes, conditions, exceptions, frontières et dépendances, **y compris la prose hors handles**. Lire les skills, standards, règles de publication, scripts, tests, fichiers déplacés et références effectivement touchés. Consulter au besoin les versions antérieures pour vérifier les migrations.
4. Si Capture, Allocation, décisions de l'auteur ou état du dépôt se contredisent, **ne pas arbitrer par préférence de l'agent**. Exposer le conflit et son incidence sur le verdict.

Distinguer trois plans : **décisions de l'auteur** (autorité), **Capture et Allocation** (projections de référence), **fichiers et tests observés** (réalisation et preuves). Ne jamais assimiler couverture annoncée par l'Allocation et couverture réalisée.

## 2. Vérifier chaque responsabilité

Pour **A1 à A7**, établir séparément les faits et un verdict :

- **A1 — Orchestration :** exploration libre, Capture facultative et transversale, étapes non obligatoires, retours possibles, autorité de l'auteur ; cohérence d'`AGENTS.md`, `README.md` et des autres consignes.
- **A2 — Exploration :** `editorial-explore` réellement disponible et opérationnel comme investigation dialoguée (arguments, sources, objections, exemples, figures, alternatives), sans rédaction, institution automatique ni dépendance CLI OpenSpec.
- **A3 — Plan :** `editorial-plan` produit un échafaudage détaillé et articulé, sans prose stylistique ; facultatif, révisable, distinct de la Capture, contraignant pour la composition **lorsqu'adopté** et sans autorité propre. Vérifier les parcours initial/révision.
- **A4 — Rédaction :** `editorial-write` respecte le plan retenu s'il existe, rédige aussi **sans plan**, conserve voix personnelle et candidats FR/EN ; ne modifie pas silencieusement les arguments ou la structure substantielle ; autorise les seuls ajustements non substantiels sans nouvel arbitrage.
- **A5 — Vérification éditoriale :** indépendance effective, contrôle des sources, décisions, progression, voix, figures et parité FR/EN ; examen du plan **s'il existe seulement** ; recommandations distinctes des échecs, aucune nouvelle obligation de plan pour obtenir un PASS.
- **A6 — Artefacts :** organisation `.42p/design/<slug>/`, identité stable `article_`/`page_`, fichiers `rationale.md`, `plan.md`, `plan.revision.md`, `verification.md`, `verification.revision.md` selon leur nécessité ; migration complète des Captures, rapports, frontmatters, liens et références, sans perte de provenance ni d'historique.
- **A7 — Publication :** chemins et contrats de `content.mts`, `review.mts`, `gate.mts` et tests cohérents avec A6 ; maintien des identités, sceaux PASS historiques, correspondances de versions et transitions initiale/révision/promotion/retrait ; pas de plan dans l'identité technique du PASS, pas de déploiement automatique ni d'assouplissement des autorisations.

Vérifier particulièrement les **interfaces** A3→A4→A5 et **l'intégration indissociable A6+A7** : chaque unité peut être correcte isolément tout en laissant un canon incohérent.

## 3. Prouver la couverture dans les deux sens

Établir une matrice concise et **vérifiable** :

- **Capture → réalisation :** pour chaque étape, critère, rationale porteur d'une contrainte, distinction matérielle et opération d'alignement, retrouver l'unité responsable **et l'élément de réalisation qui la satisfait**. Mentionner les portions non couvertes ; une référence de fichier seule ne prouve pas le respect sémantique.
- **Réalisation → Capture :** pour chaque changement matériel du diff et chaque prescription encore active, retrouver sa justification qualifiée dans la Capture et l'Allocation. Repérer dérives, renforcement des obligations, affaiblissement des garanties, chemins obsolètes, prescriptions doublonnées ou contradictoires, responsabilités orphelines et effets hors périmètre.

Vérifier l'ensemble du canon **en vigueur**, pas seulement les lignes modifiées. Les anciennes règles périmées doivent être remplacées, pas conservées en parallèle. Distinguer les contributions partagées légitimes des doublons normatifs.

Ne pas transformer en nouvelles exigences les rationales explicatifs, les exemples ou les possibilités facultatives.

## 4. Exercer les garanties, pas seulement lire les tests

Exécuter dans un checkout du **SHA examiné**, si l'environnement le permet :

```sh
npm ci
npm run typecheck
npm run test:publication
npm run publication -- gate none
npm run build
```

Compléter les suites existantes par des vérifications ciblées **sans modifier la PR**. Contrôler au minimum, par lecture, tests existants ou essais non persistants :

- préparation, vérification, promotion autorisée et révision des contenus FR/EN, avec rapports déplacés et références exactes ;
- conservation du PASS de la version publique pendant une révision candidate et installation du PASS de révision uniquement à la promotion ;
- validité des références d'une Capture déplacée, correspondance des contenus et des rapports, absence d'exigence de plan ;
- refus d'un PASS absent, obsolète, discordant ou d'un changement public non autorisé, selon le modèle existant ;
- retrait avant suppression d'un contenu déjà exposé ; prévisualisations et brouillons non publiés ;
- maintien du déploiement **manuel** sur SHA exact et de l'accord explicite de l'auteur.

**Ne pas créer artificiellement des preuves.** Si un essai est impossible, noter précisément ce qui n'est pas vérifié. Les tests verts n'établissent pas à eux seuls la fidélité du fond ; une revue documentaire sans essais ne démontre pas la compatibilité technique.

## 5. Verdict et compte rendu

À chaque allocation, attribuer :

- **PASS** : obligations et frontières observées, preuves suffisantes, aucune anomalie matérielle.
- **FAIL** : omission, contradiction, régression ou effet non autorisé **démontré**.
- **INCONCLUSIVE** : preuve matérielle insuffisante, accès impossible ou décision souveraine non résolue ; **jamais un PASS par défaut**.

**PASS global uniquement si A1–A7 PASS, si les deux sens de couverture sont complets, si les interfaces sont cohérentes et si les garanties techniques essentielles sont validées.** Ne pas compenser un échec par des réussites ailleurs.

Rendre **en français**, sans surargumenter :

1. **Périmètre :** SHA vérifié, base, sources et commandes réellement exécutées.
2. **Tableau A1–A7 :** verdict, preuve localisable (fichier, passage ou test) et écart éventuel.
3. **Couverture bidirectionnelle :** résultat et lacunes exactes.
4. **Régressions et problèmes**, classés par gravité, avec reproduction/localisation, décision en défaut et correction minimale proposée. Séparer défauts bloquants et améliorations facultatives.
5. **Verdict global : PASS / FAIL / INCONCLUSIVE**, limites et action nécessaire.

En cas de FAIL ou INCONCLUSIVE, **ne rien corriger dans la PR** : transmettre des instructions correctives localisées à l'agent exécutant, ou une question précise à l'auteur si un arbitrage est indispensable. Une correction ultérieure exige une **nouvelle vérification du commit corrigé**, y compris des effets de bord.

Si la branche change pendant l'examen, préciser la révision effectivement vérifiée et **ne pas attribuer le verdict au nouveau HEAD** sans l'avoir examiné. La vérification ne vaut ni approbation de l'auteur, ni autorisation de fusion ou de publication.
