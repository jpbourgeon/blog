# Système éditorial — workflow de conception et de rédaction

## Identité et intention

**Changement :** `system-editorial-workflow`. Faire évoluer le workflow du blog pour distinguer la maturation des idées, leur structuration éditoriale, leur composition et leur expression, tout en conservant la souveraineté de l'auteur, la vérification indépendante et la maîtrise de la publication.

**R-fondation — Rationale :** avant cette révision, le skill `editorial-write` concentrait la construction du raisonnement, l'organisation du texte et sa rédaction. Découvrir après rédaction un défaut de thèse, de sources ou de progression entraîne une reprise coûteuse et peut masquer un problème de fond sous des corrections de style. Des responsabilités distinctes permettent de stabiliser progressivement la matière, puis la composition, sans figer prématurément l'exploration. Le processus doit rester réversible et frugal, sans nouveaux contrôles mécaniques dépourvus de garantie utile.

## Workflow cible

1. **Exploration libre.** Échange et recherche ouverts, sans livrable ni formalisme obligatoire.
2. **`42p-capture`.** Capture initiale lorsque la matière le justifie, puis réconciliation des deltas à tout moment. Elle conserve l'état actuel utile à la reprise : décisions, contraintes, questions, alternatives, raisons et provenance matérielles. Elle n'est ni un transcript ni une autorité.
3. **`editorial-explore` (nouveau).** Exploration éditoriale dialoguée, inspirée de l'esprit d'OpenSpec Explore : thèse, intention et lecteur ; prémisses, arguments, objections, implications et compromis ; sourcing et preuves manquantes ; angles, progressions et articulations possibles ; exemples, code, analogies et figures ; arbitrages entre profondeur, clarté et périmètre. L'exploration propose et critique sans instituer ses propres options comme décisions de l'auteur.
4. **`editorial-plan` (nouveau).** Échafaudage intermédiaire facultatif et révisable : thèse, lecteur, perspective, fonction et articulation des sections, arguments, exemples, sources, figures pertinentes et incertitudes. Assez précis pour permettre la rédaction dans un nouveau contexte, il ne contient pas la prose finale. « Sans la voix » signifie sans style rédigé, non sans point de vue. Lorsqu'il existe et est retenu par l'auteur, il contraint la composition du document final.
5. **`editorial-write` (recentré).** Rédaction naturelle et personnelle à partir des décisions et, s'il existe, du plan retenu, avec la voix de l'auteur. Révision substantielle et production des candidats FR/EN. Des ajustements rédactionnels sans changement de fond sont permis ; tout écart substantiel au plan ou nouvel argument appelle l'arbitrage de l'auteur, puis la réconciliation des artefacts concernés.
6. **`editorial-verify` (existant).** Vérification indépendante des textes, sources, décisions, composition, voix, figures éventuelles et parité FR/EN ; examen de la réalisation du plan lorsqu'il existe. Distinguer conformité et suggestions d'amélioration. L'absence de plan n'empêche ni la rédaction ni un PASS ; le verdict ne se substitue pas au jugement de l'auteur.

**R-frontières — Distinctions structurantes :** Capture = état des décisions et questions ; Explore = élaboration des possibilités ; Plan = composition retenue, lorsqu'il existe ; Write = expression ; Verify = garanties. Ni Capture ni plan n'ont d'autorité autonome : l'auteur décide. La Capture est transversale et les retours aux étapes précédentes restent possibles ; le cycle n'impose pas six opérations à chaque publication.

## Critères et implications

- **C-autorité.** L'auteur décide du sens, de la position, des arbitrages et de la publication. Aucune proposition d'agent n'est adoptée par silence. Le plan n'a pas plus d'autorité que la Capture ; sa force contraignante sur le texte vient de son adoption par l'auteur. Le lui soumettre avant rédaction complète ne crée pas de gate technique.
- **C-fidélité.** Le plan n'est pas un inventaire de rubriques : il explicite la contribution des développements et leur progression. S'il existe, la rédaction respecte sa composition sans rigidifier les formulations. Sans plan, le contenu est composé directement à partir des décisions disponibles.
- **C-preuves.** Les assertions et exemples restent liés à des sources vérifiables ; hypothèses, faits établis et décisions demeurent distincts. Une figure est justifiée par son apport de compréhension, non par une obligation de format.
- **C-frugalité.** Réutiliser `42p-capture`, `editorial-write` et `editorial-verify` ; créer `editorial-explore` et `editorial-plan` sans dépendance à la CLI OpenSpec. Pas de plan ni de Capture obligatoires, de duplication entre artefacts, de formalisme d'exploration, de nouveaux gates automatiques ou de référence au plan dans l'identité technique du PASS.
- **C-révision.** `editorial-plan` gère création et révision d'un contenu publié, sans deuxième skill. Un plan de révision est distinct de celui de référence ; Git suffit aux ajustements ordinaires avant publication. La vérification de révision est préparée à part, puis remplace l'attestation publique lors de la promotion autorisée ; Git préserve l'historique. Pas de `rationale.revision.md` systématique : la Capture est déjà réconciliable.
- **C-publication.** Préparation, vérification, approbation humaine et déploiement demeurent distincts. Le workflow proposé n'autorise ni publication, ni exposition d'aperçu, ni changement direct des versions publiques.

## Organisation du canon cible

**R-colocalisation — Rationale :** regrouper par identité de contenu sa Capture, son échafaudage et ses vérifications facilite leur lecture et leur maintien cohérent, sans confondre leurs rôles.

```text
.42p/design/
  article_<slug>/
    rationale.md
    plan.md
    plan.revision.md
    verification.md
    verification.revision.md
  page_<slug>/
    ...
  system-editorial-workflow/
    rationale.md
```

Seuls les fichiers nécessaires sont présents. Préserver les identifiants stables : préfixes `article_` et `page_` pour éviter les collisions, identifiant propre pour une unité système. `rationale.md` est la Capture courante ; `plan.md` le plan de référence ; `plan.revision.md` le plan de révision d'un contenu déjà publié ; `verification.md` le rapport initial puis l'attestation de la version publique ; `verification.revision.md` le rapport d'une révision candidate.

## Alignement du canon

- Ajouter `editorial-explore` (investigation libre, sans écriture de contenu) et `editorial-plan` (plan optionnel et contraignant lorsqu'il est retenu).
- Recentrer `editorial-write` sur la rédaction ; faire examiner le plan éventuel par `editorial-verify` et en rendre compte dans le corps du rapport, **sans** l'ajouter aux références obligatoires du PASS.
- Actualiser `AGENTS.md` et `README.md` : étapes, caractère facultatif et réversible, chemins du canon.
- Migrer les Captures et rapports existants vers `.42p/design/<slug>/` ; adapter les chemins et références dans les skills, les frontmatters, `scripts/publication/content.mts`, `review.mts`, `gate.mts` et les tests. Préserver les PASS existants, les versions vérifiées et les garanties de publication ; laisser `editorial-publish` et la mécanique de déploiement inchangés dans leur principe.

## Sources et statut

- **S-auteur (primaire)** — Workflow en six étapes proposé le 19 novembre 2026 ; le 20 novembre 2026, décisions explicites sur le plan comme échafaudage contraignant mais non autoritatif, l'organisation unifiée `.42p/design/`, le plan facultatif et l'absence d'obligation de le lier au PASS ; adoption expresse de la dernière proposition d'organisation et de migration.
- **S-exploration (dérivé, adopté pour les points ci-dessus)** — Exploration du canon à partir du skill officiel `openspec-explore` sans CLI, puis proposition de colocalisation et d'adaptation des skills et scripts, acceptée par l'auteur. La comparaison porte sur le canon courant, non sur une implémentation déjà réalisée.
- **S-dépôt (état avant application, commit `8b2ae7617b34d9c28c22bc8e61cdcf120582fb3d`) —** [AGENTS.md](../../../AGENTS.md), [`42p-capture`](../../.agents/skills/42p-capture/SKILL.md), [`editorial-write`](../../.agents/skills/editorial-write/SKILL.md), [`editorial-verify`](../../.agents/skills/editorial-verify/SKILL.md), [standard éditorial](../../../standards/editorial.md) et [voix](../../../standards/voice.md).

**État :** workflow et rangement décidés. L’[Allocation](allocation.md) répartit la réalisation et Git en conserve les étapes. L’autorité éditoriale et les règles de publication continuent de s’appliquer.
