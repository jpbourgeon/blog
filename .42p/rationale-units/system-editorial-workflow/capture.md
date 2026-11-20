# Système éditorial — workflow de conception et de rédaction

## Identité et intention

**Changement :** `system-editorial-workflow`. Faire évoluer le workflow du blog pour distinguer la maturation des idées, leur structuration éditoriale, leur composition et leur expression, tout en conservant la souveraineté de l'auteur, la vérification indépendante et la maîtrise de la publication.

**R-fondation — Rationale :** le skill actuel `editorial-write` concentre la construction du raisonnement, l'organisation du texte et sa rédaction. Découvrir après rédaction un défaut de thèse, de sources ou de progression entraîne une reprise coûteuse et peut masquer un problème de fond sous des corrections de style. Des responsabilités distinctes permettent de stabiliser progressivement la matière, puis la composition, sans figer prématurément l'exploration. Le processus doit rester réversible et frugal, sans nouveaux contrôles mécaniques dépourvus de garantie utile.

## Workflow cible

1. **Exploration libre.** Échange et recherche ouverts, sans livrable ni formalisme obligatoire.
2. **`42p-capture`.** Capture initiale lorsque la matière le justifie, puis réconciliation des deltas à tout moment. Elle conserve l'état actuel utile à la reprise : décisions, contraintes, questions, alternatives, raisons et provenance matérielles. Elle n'est ni un transcript ni une autorité.
3. **`editorial-explore` (nouveau).** Exploration éditoriale dialoguée, inspirée de l'esprit d'OpenSpec Explore : thèse, intention et lecteur ; prémisses, arguments, objections, implications et compromis ; sourcing et preuves manquantes ; angles, progressions et articulations possibles ; exemples, code, analogies et figures ; arbitrages entre profondeur, clarté et périmètre. L'exploration propose et critique sans instituer ses propres options comme décisions de l'auteur.
4. **`editorial-plan` (nouveau).** Élaboration d'un plan détaillé constituant un livrable intermédiaire révisable : thèse, destinataire, perspective, rôle de chaque section, enchaînements argumentés, matières à développer, exemples, sources, figures pertinentes et incertitudes importantes. Le plan est assez précis pour qu'un nouveau contexte rédige sans réinterpréter les décisions, mais **ne rédige pas** la prose de l'article. « Sans la voix » signifie sans formulations stylistiques finales, non sans point de vue ni intention narrative.
5. **`editorial-write` (recentré).** Rédaction naturelle, cohérente et personnelle à partir des décisions et du plan retenu, avec la voix de l'auteur. Révision substantielle et production des candidats FR/EN ; pas d'introduction silencieuse de nouveaux arguments de fond.
6. **`editorial-verify` (existant).** Vérification indépendante des textes, des sources, de la fidélité aux décisions, de la composition, de la voix, des figures éventuelles et de la parité FR/EN. Distinguer conformité et suggestions d'amélioration ; le verdict ne se substitue pas au jugement éditorial de l'auteur.

**R-frontières — Distinctions structurantes :** Capture = état des décisions et questions ; Explore = élaboration des possibilités ; Plan = composition retenue ; Write = expression ; Verify = garanties. La Capture est transversale, non une étape irréversible : des retours à l'exploration, au plan ou à la Capture sont possibles dès qu'un élément matériel évolue.

## Critères et implications

- **C-autorité.** L'auteur décide du sens, de la position, de l'intérêt de publier et des arbitrages éditoriaux. Une proposition de l'agent, même approfondie, ne vaut pas adoption. Le plan doit être soumis à son appréciation avant rédaction complète ; cela ne crée pas automatiquement un gate technique à chaque transition.
- **C-fidélité.** Le plan ne doit pas se réduire à un inventaire de rubriques : il explicite la contribution de chaque développement et les relations qui font progresser le propos. La rédaction ne doit pas reconstituer librement la thèse à partir d'une liste de sujets.
- **C-preuves.** Les assertions et exemples restent liés à des sources vérifiables ; hypothèses, faits établis et décisions demeurent distincts. Une figure est justifiée par son apport de compréhension, non par une obligation de format.
- **C-frugalité.** Réutiliser `42p-capture`, `editorial-write` et `editorial-verify`, et introduire les deux nouveaux skills avec des interfaces minimales. Éviter duplication entre Capture et plan, états artificiels, formalisation obligatoire de l'exploration et gates automatiques redondants.
- **C-révision.** Un contenu existant peut faire l'objet d'une révision avec préservation de sa version de référence. La proposition est de faire porter à `editorial-plan` les modes `new` et `revision` plutôt que multiplier les skills ; les modalités exactes de stockage restent à définir. Pour une préparation encore non publiée, l'historique Git suffit normalement aux ajustements ordinaires.
- **C-publication.** Préparation, vérification, approbation humaine et déploiement demeurent distincts. Le workflow proposé n'autorise ni publication, ni exposition d'aperçu, ni changement direct des versions publiques.

## Points à préciser lors de l'implémentation

- **Q-livrable.** Format et emplacement minimaux du plan détaillé, et rattachement stable au contenu et à la Capture, sans duplication.
- **Q-révision.** Convention exacte pour le plan d'une révision et articulation avec les rapports de vérification existants.
- **Q-vérification.** Comment utiliser le plan retenu comme référence complémentaire de composition sans faire d'un choix stylistique indicatif un critère mécanique de FAIL, ni confondre plan et autorité de fond.
- **Q-transition.** Définir ce qui reste de la phase de composition actuellement portée par `editorial-write` après création des deux nouveaux skills.

Ces questions portent sur l'implémentation, pas sur la nécessité de séparer les responsabilités.

## Sources et statut

- **S-auteur (primaire)** — Proposition de workflow en six étapes dans l'échange du projet « Blog jpbourgeon » du 19 novembre 2026 ; demande expresse de capturer le workflow abouti et son rationale sous cette unité le 20 novembre 2026.
- **S-exploration (dérivé)** — Analyse et proposition d'affinage de l'assistant dans le même échange : frontière Explore/Plan, contenu des deux skills, Capture transversale, plan sans prose, garanties et sobriété. Les modalités opérationnelles proposées mais non explicitement arbitrées restent identifiées comme propositions ou questions.
- **S-dépôt (état de référence)** — [AGENTS.md](../../../AGENTS.md), [`42p-capture`](../../.agents/skills/42p-capture/SKILL.md), [`editorial-write`](../../.agents/skills/editorial-write/SKILL.md), [`editorial-verify`](../../.agents/skills/editorial-verify/SKILL.md), [standard éditorial](../../../standards/editorial.md) et [voix](../../../standards/voice.md). Les skills `editorial-explore` et `editorial-plan` restent à créer.

**État :** Capture du workflow cible et de son rationale, **sans implémentation** des skills, sans modification des règles de publication et sans institution d'une autorité nouvelle.
