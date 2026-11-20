# Assurance qualité du workflow de publication

## Identité et objectif

**Changement :** `system-publication-assurance`.

Ramener le dispositif de vérification du blog au nécessaire et suffisant pour une qualité professionnelle, selon un compromis 80/20. Tester les transitions à risque plutôt que toutes les étapes. Une garantie doit être compréhensible, vérifiée au bon endroit et ne pas être répétée sans apport distinct.

## Modèle retenu

Quatre garanties complémentaires :

1. **Verify — qualité éditoriale.** Revue indépendante du fond, des sources, de la fidélité à l'auteur, de la composition, de la voix et de la cohérence FR/EN ; PASS pour les contenus conformes. Le jugement et l'autorisation de publier restent à l'auteur.
2. **Promote — identité du contenu.** Les versions FR/EN promues correspondent exactement aux versions vérifiées : PASS applicable, empreintes et projection sans perte.
3. **Publish — intégrité et autorisation.** Gate sur le commit exact, build valide et absence d'exposition de changements publics non autorisés ; déploiement manuel après accord explicite de l'auteur.
4. **Post-publish — qualité réellement servie.** Smoke test des ressources publiées ou affectées et Lighthouse ciblé sur les nouvelles pages FR/EN. Le smoke test contrôle le fonctionnement effectif ; Lighthouse évalue performance, accessibilité, bonnes pratiques et SEO. Ne pas fixer de seuil global arbitraire bloquant sur des scores fluctuants ; traiter les défauts significatifs.

Exploration, Capture, plan et rédaction n'ont **aucun gate déterministe obligatoire**. Les vérifications pertinentes sont réalisées aux frontières suivantes, non à chaque étape.

## Noyau de régression déterministe

Conserver le minimum de tests comportementaux qui démontrent la prévention des échecs suivants :

1. Publication sans PASS applicable ou avec contenu différent de la version vérifiée.
2. Promotion FR/EN incomplète ou incorrecte.
3. Altération de la version publique pendant la préparation d'une révision.
4. Exposition involontaire de brouillons ou d'aperçus.
5. Suppression de contenu exposé sans retrait préalable.
6. Indexation par Pagefind de contenus qui doivent en être exclus.
7. Déploiement automatique ou ciblage d'une référence Git incorrecte.

Conserver également la preuve de transformation sans perte du Markdown/MDX, nécessaire à la fiabilité des empreintes. Un scénario peut contenir plusieurs assertions ; le nombre de tests n'est pas une cible. Supprimer les vérifications d'implémentation, variantes redondantes et compatibilités historiques seulement lorsqu'elles ne protègent plus de garantie distincte. Ne pas affaiblir les invariants pour réduire artificiellement la suite.

**Frontière des preuves :** les tests de régression démontrent le comportement des mécanismes ; les gates valident une publication particulière ; la revue indépendante et l'accord humain ne se prouvent pas par un test déterministe. Le smoke test après déploiement constate un résultat exposé : son échec appelle correction, pas prévention rétroactive de l'exposition.

## Périmètre de réalisation

Réévaluer les tests et contrôles existants en partant de ce noyau, puis réaliser les adaptations minimales. Le relevé des changements publics soumis à autorisation doit couvrir aussi les modifications techniques et ressources statiques qui affectent le site, sans leur imposer de PASS éditorial. Ne pas créer d'outillage ni de gates supplémentaires sans garantie distincte.

## Sources

- **Décision de l'auteur, 20 novembre 2026 :** adoption explicite du dernier modèle réduit à quatre garanties et à un noyau de scénarios essentiels ; demande de ne pas conserver les pistes antérieures dans cette Capture.
- **État technique initial :** [AGENTS.md](../../../AGENTS.md), [workflow Pages](../../../.github/workflows/pages.yml), [scripts de publication](../../../scripts/publication/) et [skills éditoriaux](../../.agents/skills/), branche `main` au commit `ff59bf3d390db618c7ce1bc9e9547a87e4585c02`.

**État :** modèle adopté ; aucune adaptation technique encore appliquée dans ce changement.
