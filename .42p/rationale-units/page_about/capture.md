# Page « À propos » — Capture du plan V2

## Identité et portée

Préparer une page pérenne « À propos » pour le blog personnel jpbourgeon, bilingue FR/EN, qui permette à un lecteur venu d'un article de comprendre l'auteur, sa perspective, ses domaines de réflexion et les moyens de retrouver ses travaux. Inclure en fin de page les mentions légales et l'information sur la confidentialité. Cette Capture est un état de travail non autoritatif : elle ne constitue ni la page rédigée, ni une autorisation de publication.

La structure a été explicitement validée par l'auteur ; les corrections ultérieures ci-dessous priment sur le cadrage initial. Le plan V2 est désigné comme matière à capturer, mais les formulations illustratives restent à confirmer lors de la rédaction.

## Orientation éditoriale

- **C-identite** — Exprimer une voix personnelle, à la première personne, sobre et précise ; éviter le CV, le manifeste, le discours institutionnel et l'autopromotion. Présenter le directeur technique et directeur adjoint d'une DSI du secteur public, à la croisée du management des organisations et de l'ingénierie logicielle. Ne pas parler au nom de l'employeur.
- **C-perspective** — Relier conception et compréhension des systèmes, gouvernance des décisions/responsabilités, maîtrise humaine, simplicité, frugalité, vérifiabilité et pérennité ; ne pas anticiper un manifeste STI.
- **C-domaines** — Présenter cinq territoires éditoriaux sans créer cinq collections vides, sans appartenance obligatoire des articles et sans composants promotionnels :
  - **APE** : management, expériences et pratiques humaines et organisationnelles, tensions entre intentions et travail réel.
  - **42P** : gouvernance des productions et changements, spécification, justification, vérification, traçabilité.
  - **STI — Sovereignty Through Institution** : souveraineté humaine face à l'IA, délégation, autorité et institutions.
  - **FluidJ** : **projet applicatif de gouvernance des responsabilités individuelles** ; ne pas le réduire à une famille d'architectures logicielles.
  - **Cybernetic ITSM** (nom provisoire) : management des services informatiques, ITIL, approche systémique et cybernétique.
  Ces descriptions sont des propositions de cadrage pour le texte, non des définitions définitives de chaque projet.
- **C-productions** — Distinguer territoires de réflexion et réalisations. Orienter vers l'organisation GitHub `at-rama` et les productions effectivement publiques (par exemple `sqlite-vector-wasm`), sans inventaire de projets ni annonces non publiées.
- **C-contact** — Mettre en avant GitHub, dev.to, LinkedIn et l'adresse électronique personnelle de l'auteur, avec liens/coordonnées exacts à fournir ou confirmer. Pas de formulaire.
- **C-statut** — L'intention de l'auteur est un **blog personnel** ; cette intention ne résout pas automatiquement la qualification juridique de l'édition professionnelle/non professionnelle.

## Structure de page retenue

1. **Identité — Qui je suis** (environ 70–100 mots) : portrait, nom, situation professionnelle et introduction.
2. **Perspective — Pourquoi ce blog** (environ 100–150 mots) : concevoir/comprendre, gouverner/maîtriser, simplicité.
3. **Territoires éditoriaux — Ce que j'explore** (environ 180–250 mots) : cinq présentations courtes, sans collections prématurées.
4. **Productions et contributions** (environ 70–110 mots) : travaux open source, liens vérifiables.
5. **Me retrouver et échanger** (environ 60–90 mots) : GitHub, dev.to, LinkedIn, email personnel.
6. **Mentions légales** (longueur dictée par les besoins) : identification/statut, responsable de publication, hébergeur GitHub Pages, droits et licences.
7. **Confidentialité** (courte et factuelle) : hébergement et mesure d'audience GoatCounter, traitements réels, information et éventuel consentement suivant configuration.

Les volumes sont indicatifs, non des seuils normatifs. Préserver une page courte et fluide, sans cartes, icônes ou infrastructure de collections prématurées.

## Portrait : choix de mise en œuvre

**O-gravatar-local (recommandation du plan V2, à confirmer éditorialement)** : utiliser comme portrait une **copie statique du Gravatar** dans `static/img/`, chargée localement et non via un service tiers à chaque visite. Portrait circulaire et discret (ordre de grandeur : 88–112 px), près du nom/introduction, adapté au mobile. Intérêt : identité humaine et continuité visuelle entre plateformes ; coût : mise à jour manuelle occasionnelle. Ne pas ajouter d'API, de synchronisation, de dépendance, ni de composant React dédié. Le pictogramme montré en maquette était un substitut, non le portrait réel.

Alternatives considérées : absence de portrait (techniquement minimale mais moins identifiante) ; Gravatar distant (automatique mais requête tierce et dépendance). La recommandation privilégie la copie locale pour souveraineté, confidentialité des visiteurs et KISS.

## Cadre technique et publication

- Docusaurus natif ; routes envisagées `/blog/about/` et `/blog/en/about/`, avec navigation « À propos » et lien de pied de page vers l'ancre des mentions légales.
- Deux versions cohérentes FR/EN, traduction non nécessairement littérale ; page permanente non datée, indexable quand publique.
- Pas de nouvelle dépendance ou mécanisme de publication. Respecter `AGENTS.md`, `standards/editorial.md` et `standards/voice.md`.
- Pages candidates hors des routes publiques dans `.42p/editorial-drafts/pages/{fr,en}/` ; vérification indépendante, décision de l'auteur, gate et déploiement manuel sur accord explicite. **Cette PR de Capture ne prépare ni n'expose un aperçu, et ne publie aucun contenu.**
- Réutiliser les licences existantes : contenus originaux CC BY-NC-ND 4.0, exceptions et code selon `LICENSE-ADDITIONAL.md`.

## Points à établir avant la version publiée

- **Q-legal** — Vérifier la qualification juridique effective du blog personnel et les mentions requises : ne pas assimiler « personnel » à « juridiquement non professionnel », ni publier de coordonnées privées inutiles.
- **Q-privacy** — Décrire à partir de la configuration déployée les traitements GitHub Pages et GoatCounter, les données/conditions de conservation, l'information et l'éventuelle exemption de consentement ; ne pas conclure à une exemption du seul fait de l'absence de cookies.
- **Q-profiles** — Confirmer les URL exactes GitHub, dev.to, LinkedIn et l'adresse email personnelle à afficher.
- **Q-avatar** — Obtenir/valider l'image Gravatar et confirmer l'option locale au moment de la rédaction.

## Sources de travail

- Décisions de l'auteur dans la présente discussion : validation de la structure ; correction FluidJ ; choix de contacts et de blog personnel ; demande d'évaluation Gravatar ; demande de capturer le plan V2.
- Plan V2 de l'assistant dans la discussion : source dérivée **explicitement désignée** pour cette capture ; recommandations et formulations non validées individuellement restent distinguées des décisions de l'auteur.
- Dépôt : `AGENTS.md`, `standards/editorial.md`, `standards/voice.md`, `docusaurus.config.ts`, `src/client/goatcounter.ts`, `LICENSE`, `README.md`.

## Suite envisagée

Consolider les formulations ; acquérir le portrait et les coordonnées ; rédiger FR, vérifier le cadre légal et confidentialité, traduire EN ; vérifier éditorialement ; demander validation et autorisation distincte avant tout aperçu ou déploiement.
