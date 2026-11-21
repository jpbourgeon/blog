# ChatGPT Work — Vérification indépendante des allocations d'assurance qualité

**Cible :** dépôt `jpbourgeon/blog`, PR **#29**, branche `docs/capture-system-publication-assurance`.

**Mission :** vérifier sur un **commit précis**, indépendamment de l'agent exécutant, la réalisation des responsabilités **A1–A3** et la préservation des garanties professionnelles du workflow de publication.

**Lecture et essais uniquement.** Ne modifier aucun fichier, aucune Capture, Allocation, configuration ou PR ; ne pas fusionner, publier, déployer ou exposer d'aperçu. Les comptes rendus et PASS de l'agent exécutant ne sont pas des preuves.

## 1. Fixer l'état examiné

1. Relever le **SHA exact du HEAD**, sa base, le diff complet et l'historique utile de la PR. Lire `AGENTS.md` et les règles effectives du dépôt. Si la branche évolue pendant l'examen, ne pas étendre le verdict au nouveau HEAD sans nouvelle vérification.
2. Lire intégralement [rationale.md](rationale.md) et [allocation.md](allocation.md) dans `.42p/design/system_publication-assurance/`, **dans le commit examiné**. Vérifier l'identité de la Capture, sa provenance, les attributions A1–A3, leurs frontières, dépendances et exclusions. Ne pas déduire les exigences du présent prompt.
3. Lire le code, les tests, les scripts, le workflow GitHub Pages, `AGENTS.md`, `README.md` et `editorial-publish` réellement affectés, ainsi que leurs interfaces non modifiées. Comparer aux comportements de la base lorsque nécessaire.
4. Séparer **décision de l'auteur**, **projections Capture/Allocation**, **réalisation observée** et **preuves exécutées**. Signaler toute contradiction sans arbitrer à la place de l'auteur.

## 2. Vérifier les trois unités

- **A1 — Visibilité des changements.** Vérifier que le relevé préalable à l'autorisation couvre le différentiel pertinent depuis le dernier déploiement jusqu'au SHA cible, notamment contenus FR/EN, composants, configuration et ressources statiques affectant l'exposition. Vérifier que les retraits restent soumis aux règles existantes, que les contenus publics exigent un PASS et qu'aucun fichier technique ne reçoit artificiellement un PASS éditorial. Le relevé ne doit pas être présenté comme preuve d'accord humain.
- **A2 — Préflight local.** Vérifier l'ordre réel **gate → build Docusaurus/Pagefind → Lighthouse sur artefact local → déploiement**, sur le SHA ciblé. Auditer le choix des URL : nouvelles pages FR/EN et pages représentatives impactées, y compris les changements transversaux. Vérifier que l'impossibilité d'exécuter l'audit ou l'échec d'un contrôle essentiel retenu empêche le déploiement, sans seuil global arbitraire sur les scores. Confirmer l'absence de smoke test post-déploiement et de publication automatique, et le maintien de `inspect` sans exposition et de `publish` sous accord humain.
- **A3 — Régression minimale.** Relier les tests conservés aux **sept défaillances** de la Capture et à la transformation Markdown/MDX sans perte. Contrôler que les suppressions correspondent à des doublons ou à des protections sans utilité actuelle, sans perdre de comportement distinct : PASS exact, intégrité FR/EN, révisions, brouillons/aperçus, retrait avant suppression, exclusion Pagefind, déclenchement manuel et SHA exact. Vérifier aussi la protection des nouveaux contrôles A1/A2. Ne pas confondre baisse du nombre de tests et amélioration de couverture.

**Interfaces :** A1 informe la sélection des pages affectées par A2 lorsque nécessaire ; A3 exerce les risques pertinents d'A1/A2. Un composant peut fonctionner isolément alors que le chemin complet de publication est invalide.

## 3. Établir la couverture bidirectionnelle

- **Capture → réalisation :** pour chaque obligation, frontière et exclusion matérielle du modèle consolidé, retrouver l'attribution puis la preuve concrète de réalisation. Identifier explicitement omissions, lacunes ou conditions non démontrées.
- **Réalisation → Capture :** justifier chaque modification matérielle du diff par une attribution qualifiée. Repérer complexité ajoutée, gates nouveaux, règles doublonnées ou contradictoires, retrait de garanties préexistantes et modifications hors périmètre.

Vérifier le **canon encore actif**, pas uniquement les lignes modifiées. Des tests verts ne démontrent pas, à eux seuls, la fidélité des décisions.

## 4. Exercer les garanties

Dans un checkout du SHA examiné, lorsque l'environnement le permet :

```sh
npm ci
npm run typecheck
npm run test:publication
npm run publication -- gate none
npm run build
```

Exercer également le préflight sur le build local **sans déployer**. Compléter, si nécessaire, par des essais ciblés temporaires et non persistants, notamment : changements techniques et statiques effectivement relevés, sélection correcte des pages FR/EN, refus d'une erreur essentielle Lighthouse, conservation des garanties FR/EN/PASS et vérification du workflow manuel sur SHA exact. Inspecter le workflow réel plutôt que simuler une autorisation humaine ou lancer `publish`.

Consigner les commandes, résultats, extraits et chemins vérifiables. Si une exécution est impossible, décrire exactement la preuve manquante ; ne pas déclarer PASS par lecture seule lorsqu'un comportement essentiel reste non démontré.

## 5. Verdict

Pour chaque unité :

- **PASS** : obligation et frontière vérifiées, preuves suffisantes, pas d'anomalie matérielle.
- **FAIL** : manquement, régression ou ajout non autorisé démontré.
- **INCONCLUSIVE** : preuve insuffisante, accès impossible ou décision non résolue.

**PASS global** uniquement avec A1–A3 PASS, couverture bidirectionnelle complète, intégration cohérente et garanties essentielles effectivement éprouvées.

Rendre un rapport **en français, concis** : SHA/base et essais réalisés ; tableau A1–A3 avec verdicts et preuves localisables ; couverture dans les deux sens ; défauts bloquants ou améliorations facultatives nettement séparés ; verdict global et correction minimale proposée pour chaque défaut. En cas de FAIL ou INCONCLUSIVE, **ne rien corriger** dans la PR. Toute correction ultérieure doit être revérifiée sur son propre SHA.

La vérification n'est ni un accord de publication, ni une fusion, ni une preuve de disponibilité HTTP du site déployé.
