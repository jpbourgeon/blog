# Diffusion éditoriale sur les réseaux — Capture

## Identité et finalité

**Changement :** `system_social-distribution`. Définir la diffusion d'articles du blog vers des communautés externes sans créer un second système éditorial ni automatiser les plateformes.

**R-directrice — Séparer connaissance, adaptation et conversation.** Le blog FR/EN demeure la publication canonique des articles. Chaque post externe est un contenu dérivé, adapté à son public et capable de nourrir une conversation sur sa plateforme. Un article peut être remis en lumière plusieurs fois si chaque nouvelle publication apporte un angle utile. La visibilité ne justifie pas, à elle seule, une publication.

**C-autorité.** L'auteur choisit les sujets, les angles, les canaux, les versions et le moment de diffusion. Les agents explorent, rédigent et contrôlent ; ils ne valident ni ne publient à sa place. La diffusion est **manuelle, par copier-coller**, sur tous les réseaux. Pas d'API sociale, de scheduler, de synchronisation ou de skill « campagne » multicanale.

## Contrats des formats

- **`devto_repost` — anglais, technique.** Republication substantielle et autonome d'un article pertinent pour le lectorat développeur ; renvoi et `canonical_url` vers l'article original **EN du blog** lorsqu'il s'agit bien d'une reprise de contenu. La pertinence technique prime : logiciel, architecture, outils, IA technique ; ni management ni IA conceptuelle ne déclenchent automatiquement un repost.
- **`devto_snack` — anglais, technique.** Publication autonome sur un angle circonscrit (garantie, choix, exemple, enseignement, évolution) ; renvoi vers le **repost dev.to**. Peut servir à la première diffusion ciblée ou remettre ce repost en lumière des semaines ou mois plus tard. Ne pas confondre son lien éditorial vers le repost et un `canonical_url` de republication.
- **`ln_snack` — français, professionnel.** Une idée utile en elle-même, contextualisée pour le réseau LinkedIn ; renvoi vers l'article **FR du blog**. Sert à la diffusion initiale et aux remises en lumière ultérieures, avec des angles distincts.

**C-temporalité.** Aucun canal obligatoire, aucune fréquence ni nombre de snacks imposés. Une même source peut susciter plusieurs adaptations, mais ni répétition promotionnelle ni transformation automatique ne constituent un motif éditorial.

**C-conversation.** Le blog ne propose pas de commentaires internes. La centralisation imposée des conversations par verrouillage des commentaires a été explorée puis écartée comme orientation recommandée : elle accroît la friction et peut réduire les interactions spontanées. **Orientation proposée, non décision explicite de l'auteur :** commentaires ouverts par défaut sur chaque publication ; verrouillage ponctuel possible. Les discussions restent propres aux communautés et aux posts.

## Rationale des publications dérivées

**C-unités-dérivées.** Un snack mérite sa propre exploration et une Capture de son intention, de son angle, de ses choix, de ses sources et de ses écarts éventuels avec l'article parent. La Capture de l'article apporte le contexte, pas une autorité sur les nouveaux choix. Ne pas inventer de prémisses, d'expériences ou d'assertions pour singulariser un post. Un repost fidèle peut ne nécessiter qu'une Capture minimale s'il n'introduit aucune décision nouvelle.

Ranger chaque adaptation dans un **sous-dossier** de l'unité de design de l'article :

```text
.42p/design/article_<slug>/social/
  <date_iso>_<devto|ln>_<repost|snack>/
    rationale.md
    post.md
```

`rationale.md` contient la Capture propre à l'adaptation ; `post.md`, le livrable destiné au réseau. Le plan et une trace de vérification restent facultatifs si leur matérialisation apporte une garantie utile. Distinguer identité de la sous-unité et date effective de diffusion ; résoudre une collision de noms sans changer l'identité du post déjà créé. Les adaptations sont du contenu dérivé, **ni des Captures parentes, ni des attestations de publication canonique**.

## Responsabilités minimales

**R-rédaction — Un skill rédactionnel commun** (nom proposé : `editorial-social`) pour les trois profils ; pas de skill par canal ni d'orchestrateur. À partir de l'article publié, de sa Capture et des décisions propres au post : explorer l'angle, capturer si nécessaire, rédiger et contrôler fidélité, cohérence avec les standards éditoriaux et la voix, preuves, liens et contraintes du format. Préparer **titre, texte, tags et paramètres** de saisie (notamment URL canonique si applicable). Livrer un texte prêt à copier-coller ; aucune opération sur la plateforme.

**R-discussion — Composant natif au blog.** Un bloc visuel « Discuter de cet article » en fin de page d'article, fidèle au style Docusaurus existant. Alimenté par une collection de **plateformes et URLs déclarées dans le frontmatter** ; absent si la collection est vide ou absente. Ne pas limiter le modèle à LinkedIn et dev.to, ni importer de script ou de compteur social. Le bloc oriente vers des discussions existantes, sans mutualiser les commentaires ni énumérer automatiquement tous les snacks successifs.

**R-rattachement — Un second skill distinct** (nom proposé : `editorial-social-link`). Après **publication manuelle**, l'auteur fournit les URLs à référencer. L'agent les accepte comme valides, sans consultation du réseau ; il prépare exclusivement la modification des références dans les frontmatters des versions FR/EN, sans retoucher les corps des articles. Éviter les doublons, préserver les autres métadonnées, respecter les autorisations de modification et de déploiement du blog. Ce skill **ne publie pas sur les réseaux**.

## Arbitrages à résoudre avant implémentation

**Q-gate — Mise à jour des références sans altérer les garanties.** Le gate actuel vérifie un PASS correspondant aux empreintes des textes canoniques FR/EN ; un ajout de frontmatter modifie ces empreintes, même si le corps reste inchangé. Deux voies : (a) révision éditoriale complète selon le contrat existant ; (b) opération restreinte aux seules références sociales, explicitement autorisée et contrôlée mécaniquement pour prouver l'absence de changement du fond, tout en conservant gate et déploiement manuel. **Aucune dérogation n'est instituée** par cette Capture. L'arbitrage est requis avant de mettre en œuvre le skill de rattachement.

**Q-références — Contrat de présentation.** Schéma exact de frontmatter, règles FR/EN et sélection des discussions mises en avant lorsque plusieurs posts existent sur une même plateforme restent à fixer. Orientation proposée : une publication de référence choisie par plateforme (repost dev.to et premier snack LinkedIn lorsqu'ils existent), sans interdire d'autres liens ni figer deux plateformes.

## Sources et état

- **S-auteur (primaire) :** échanges du 23 au 25 novembre 2026 sur stratégie de diffusion, formats, remise en lumière, conversation, rationale dédié, composant de discussion, publication manuelle et skill de rattachement ; pas de permalink de conversation disponible. Les options proposées par l'assistant sans adoption explicite restent qualifiées comme telles.
- **S-canon (dépôt) :** [AGENTS.md](../../../AGENTS.md), [standard éditorial](../../../standards/editorial.md), [voix](../../../standards/voice.md), [42p-capture](../../.agents/skills/42p-capture/SKILL.md), [rationale du workflow éditorial](../system_editorial-workflow/rationale.md), [contrat de normalisation](../../../scripts/publication/content.mts) et [gate](../../../scripts/publication/gate.mts).

**État :** stratégie capturée pour examen, sans institution de ses propositions techniques. Aucun skill, composant, contrat de gate ou contenu social n'est créé par ce changement.
