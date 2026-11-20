# Assurance qualité du workflow de publication

## Identité et objectif

**Changement :** `system-publication-assurance`.

Garantir une qualité de publication professionnelle par le minimum de contrôles nécessaires et suffisants (compromis 80/20). Vérifier les transitions à risque, une fois et au bon endroit, sans confondre qualité éditoriale, intégrité de la promotion et qualité technique du site.

## Modèle adopté

1. **Verify — qualité éditoriale.** Revue indépendante du fond, des sources, de la fidélité à l'auteur, de la composition, de la voix et de la cohérence FR/EN ; PASS pour les contenus conformes. L'auteur conserve le jugement et l'autorisation de publication.
2. **Promote — identité du contenu.** PASS applicable, empreintes exactes des versions FR/EN et projection sans perte du contenu vérifié vers le contenu canonique.
3. **Publish — intégrité et autorisation.** Accord humain explicite sur les changements publics depuis le dernier déploiement, SHA exact, gate, build Docusaurus FR/EN et Pagefind ; déploiement manuel.
4. **Preflight — qualité technique avant exposition.** Après le build, servir localement l'artefact et exécuter Lighthouse sur les nouvelles pages FR/EN et les pages représentatives affectées. Audit de performance, accessibilité, SEO et bonnes pratiques. Échec bloquant si l'audit ne peut pas s'exécuter correctement ou si un contrôle essentiel explicitement retenu échoue ; scores diagnostiques sans seuil global arbitraire.

**Chaîne cible :** Verify → Promote → autorisation humaine et gate du SHA exact → build Docusaurus + Pagefind → Lighthouse local → déploiement GitHub Pages de l'artefact vérifié.

Pas de gate déterministe obligatoire pendant Explore, Capture, Plan ou Write. Pas de smoke test post-déploiement. Le résultat d'`actions/deploy-pages` est le retour technique retenu, sans prétendre contrôler le service HTTP de bout en bout.

## Noyau de régression déterministe

Garder uniquement les scénarios nécessaires pour démontrer la prévention de :

1. Publication sans PASS applicable ou avec contenu différent de la version vérifiée.
2. Promotion FR/EN incomplète ou incorrecte.
3. Altération de la version publique pendant la préparation d'une révision.
4. Exposition involontaire de brouillons ou d'aperçus.
5. Suppression d'un contenu exposé sans retrait préalable.
6. Indexation Pagefind de contenus exclus.
7. Déploiement automatique ou sur une mauvaise référence Git.

Conserver aussi la preuve de transformation sans perte du Markdown/MDX qui fonde les empreintes. Réévaluer les 37 tests actuels selon ces garanties : fusionner les redondances et retirer les scénarios sans protection distincte, sans viser un nombre arbitraire ni affaiblir les invariants.

Les tests de régression prouvent les mécanismes ; les gates valident un état de publication particulier ; ni l'indépendance de la revue ni l'accord humain ne sont démontrables par un test déterministe.

## Périmètre de réalisation

- Compléter le relevé des changements publics soumis à autorisation, y compris code et ressources statiques, sans leur imposer de PASS éditorial.
- Rationaliser les tests autour du noyau essentiel.
- Ajouter le préflight Lighthouse local entre build et déploiement, sans infrastructure de monitoring.
- Aligner `AGENTS.md`, `README.md` et `editorial-publish` sur le modèle.

Préserver les skills éditoriaux, les contrats `prepare`/`check`/`project`, les empreintes et PASS, les routes et traductions, Pagefind, la décision humaine et le déploiement manuel. Ne pas refondre le moteur de publication.

## Sources et état

- **S-auteur — décisions explicites du 20 novembre 2026 :** adoption du modèle de garanties minimal, puis validation de sa consolidation avec Lighthouse en préflight et sans smoke test post-publication.
- **S-dépôt — état technique avant réalisation :** [AGENTS.md](../../../AGENTS.md), [workflow Pages](../../../.github/workflows/pages.yml), [scripts de publication](../../../scripts/publication/), [skills éditoriaux](../../.agents/skills/) ; `main` au commit `ff59bf3d390db618c7ce1bc9e9547a87e4585c02`.

**État :** modèle validé ; Capture actualisée. Aucune modification technique encore appliquée dans ce changement.
