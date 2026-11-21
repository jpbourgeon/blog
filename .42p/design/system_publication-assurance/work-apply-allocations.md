# ChatGPT Work — Application des allocations d'assurance qualité

**Cible :** dépôt `jpbourgeon/blog`, PR **#29**, branche `docs/capture-system-publication-assurance`. Travailler sur cette PR, sans en créer une autre. Ne pas fusionner, publier, déployer ni exposer d'aperçu.

## Sources et autorité

Avant d'écrire, lire l'état réel de la PR (HEAD, base, diff), `AGENTS.md`, les scripts, tests et workflows concernés, ainsi que **l'intégralité** de [rationale.md](rationale.md) et [allocation.md](allocation.md) dans `.42p/design/system_publication-assurance/`. Vérifier leurs identités, références, limites et éventuelles évolutions depuis le présent prompt.

La Capture porte le modèle adopté ; l'Allocation répartit les responsabilités **A1–A3**, sans instituer d'exigences nouvelles. Respecter l'autorité de l'auteur et les garanties existantes. Ne pas modifier Capture ou Allocation pour justifier une décision d'implémentation. Si une contradiction matérielle exige un choix de l'auteur, ne pas la résoudre seul.

## Application itérative

Réaliser **A1 → A2 → A3**, sauf dépendance avérée nécessitant un regroupement. Pour chaque unité :

1. **Délimiter :** retrouver ses attributions exactes dans la Capture, examiner l'existant et identifier la modification minimale. Distinguer responsabilités nouvelles et invariants déjà satisfaits.
2. **Appliquer :** modifier seulement les fichiers nécessaires, sans refonte, nouveau gate éditorial ni infrastructure de monitoring. Réconcilier les instructions et supprimer les prescriptions devenues obsolètes plutôt que les juxtaposer.
3. **Éprouver :** inspecter le diff et exécuter les contrôles pertinents. Vérifier dans les deux sens : toutes les obligations attribuées sont couvertes (**Capture → réalisation**) et chaque modification matérielle est justifiée (**réalisation → Capture**). Vérifier les interfaces avec les unités précédentes et les garanties préexistantes.
4. **Corriger ou arrêter :** corriger puis retester toute anomalie dans le périmètre autorisé. Si arbitrage souverain, extension substantielle ou preuve indisponible empêchent de conclure, marquer **BLOCKED**, exposer le point exact et s'arrêter. Ne jamais déclarer PASS par hypothèse.
5. **Consolider :** après PASS démontré, créer un commit cohérent sur la branche sans écraser d'éventuelles modifications concurrentes, puis passer à l'unité suivante.

### Points propres aux unités

- **A1 — Visibilité des changements :** compléter l'information présentée avant autorisation par le différentiel pertinent entre dernier déploiement et SHA cible, incluant code, configuration et ressources statiques affectant le site. Conserver le gate existant sur les contenus publics, les PASS et les règles de retrait. Le relevé doit informer la décision humaine ; il ne la remplace pas et n'impose aucun PASS éditorial aux fichiers techniques.
- **A2 — Préflight :** après le build Docusaurus/Pagefind, auditer avec Lighthouse **l'artefact local destiné au déploiement**, sur les nouvelles pages FR/EN et les pages représentatives affectées. L'audit ou les contrôles essentiels explicitement retenus peuvent bloquer ; les scores globaux sont diagnostiques, sans seuil arbitraire. Garder le chemin `inspect` sans exposition et le chemin `publish` manuel sur SHA exact. Ne pas ajouter de smoke test post-déploiement, de site de prévisualisation public ou de système de mesures historiques.
- **A3 — Régression minimale :** repartir des sept défaillances de la Capture et de la projection Markdown/MDX sans perte. Fusionner uniquement les tests réellement redondants ; préserver les scénarios différenciés et les PASS historiques lorsqu'ils protègent encore un invariant. Couvrir les risques introduits par A1/A2, notamment la sélection du SHA, l'absence de déploiement automatique et l'exécution du préflight **avant** upload/déploiement. Ne pas viser un nombre fixe de tests.

Aligner, seulement si nécessaire, `AGENTS.md`, `README.md` et `editorial-publish`. Préserver `prepare`/`check`/`project`, les empreintes FR/EN, l'intégrité des révisions, les routes, Pagefind, l'accord de l'auteur et le déploiement manuel.

**Intégration :** si A1/A2 et leurs tests ne peuvent former séparément des états valides, les traiter dans un commit d'intégration cohérent, avec preuve distincte pour chaque responsabilité. Ne pas enregistrer un état cassé sous prétexte de progression.

## Vérification finale

Relire Capture et Allocation dans leur état courant et contrôler **tout le diff de la PR** contre sa base, y compris les instructions encore en vigueur. Démontrer la couverture bidirectionnelle A1–A3, le maintien des garanties existantes et l'absence de mécanisme superflu.

Exécuter dans l'environnement disponible les commandes adaptées : `npm ci`, `npm run typecheck`, `npm run test:publication`, `npm run publication -- gate none`, `npm run build`, puis un essai réel du préflight sur l'artefact local. Ne jamais déclencher `publish` pour tester. Indiquer précisément les essais impossibles ; en cas d'incertitude matérielle, conclure **BLOCKED**, pas PASS.

## Compte rendu

Communiquer **en français**, brièvement, après chaque unité : `A# — PASS — changement essentiel — preuve`, ou `BLOCKED` et son motif, puis s'arrêter. Terminer par un tableau compact **A1–A3** : verdict, commit, preuves et couverture globale. Distinguer explicitement appliqué, testé, commité, vérifié indépendamment, fusionné et publié. Ne revendiquer aucune étape non réalisée.
