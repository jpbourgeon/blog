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
- **C-contact** — Mettre en avant les profils personnels [GitHub](https://github.com/jpbourgeon), [dev.to](https://dev.to/jpbourgeon), [LinkedIn](https://www.linkedin.com/in/jpbourgeon). Présenter séparément l'organisation de production [at-rama](https://github.com/at-rama). Pas de formulaire.
- **C-statut** — L'auteur confirme que le blog personnel est **édité à titre juridiquement non professionnel** et demande de ne pas publier de coordonnées privées inutiles. Rédiger les mentions en conséquence et vérifier les informations légalement exigées.

## Structure de page retenue

1. **Identité — Qui je suis** (environ 70–100 mots) : portrait, nom, situation professionnelle et introduction.
2. **Perspective — Pourquoi ce blog** (environ 100–150 mots) : concevoir/comprendre, gouverner/maîtriser, simplicité.
3. **Territoires éditoriaux — Ce que j'explore** (environ 180–250 mots) : cinq présentations courtes, sans collections prématurées.
4. **Productions et contributions** (environ 70–110 mots) : travaux open source, liens vérifiables.
5. **Me retrouver et échanger** (environ 60–90 mots) : GitHub, dev.to et LinkedIn.
6. **Mentions légales** (longueur dictée par les besoins) : identification/statut, responsable de publication, hébergeur GitHub Pages, droits et licences.
7. **Confidentialité** (courte et factuelle) : hébergement et mesure d'audience GoatCounter, traitements réels, information et éventuel consentement suivant configuration.

Les volumes sont indicatifs, non des seuils normatifs. Préserver une page courte et fluide, sans cartes, icônes ou infrastructure de collections prématurées.

## Portrait : choix de mise en œuvre

**O-avatar-local (choix validé par l'auteur)** : l'agent récupère de préférence l'avatar public du [profil LinkedIn](https://www.linkedin.com/in/jpbourgeon) et en intègre une copie statique dans `static/img/`, après vérification du rendu. Portrait discret près du nom et de l'introduction, adapté au mobile. Aucune intégration distante, synchronisation, dépendance ou composant React dédié.

## Cadre technique et publication

- Docusaurus natif ; routes envisagées `/blog/about/` et `/blog/en/about/`, avec navigation « À propos » et lien de pied de page vers l'ancre des mentions légales.
- Deux versions cohérentes FR/EN, traduction non nécessairement littérale ; page permanente non datée, indexable quand publique.
- Pas de nouvelle dépendance ou mécanisme de publication. Respecter `AGENTS.md`, `standards/editorial.md` et `standards/voice.md`.
- Pages candidates hors des routes publiques dans `.42p/editorial-drafts/pages/{fr,en}/` ; vérification indépendante, décision de l'auteur, gate et déploiement manuel sur accord explicite. **Cette PR de Capture ne prépare ni n'expose un aperçu, et ne publie aucun contenu.**
- Réutiliser les licences existantes : contenus originaux CC BY-NC-ND 4.0, exceptions et code selon `LICENSE-ADDITIONAL.md`.

## Décisions complémentaires et points résiduels

- **Q-legal** — Statut **non professionnel** explicitement confirmé par l'auteur ; publier uniquement les mentions légalement nécessaires, sans coordonnées privées superflues. La rédaction doit encore vérifier les mentions et modalités de contact de l'éditeur et de l'hébergeur effectivement requises.
- **Q-privacy** — Configuration GoatCounter déclarée par l'auteur : statistiques anonymes de **session, referrer et country**, avec **rétention de 365 jours**. Reprendre ces paramètres sans étendre la déclaration à d'autres données non confirmées ; vérifier la correspondance avec les traitements réels du site et les exigences d'information/consentement avant publication. Le terme « anonyme » reflète ici la déclaration de configuration, pas une qualification juridique auditée.
- **Q-profiles** — Profils validés : https://github.com/jpbourgeon ; https://dev.to/jpbourgeon ; https://www.linkedin.com/in/jpbourgeon ; organisation GitHub https://github.com/at-rama. Aucun email personnel à afficher dans les contacts éditoriaux ; les exigences légales de contact restent traitées séparément en Q-legal.
- **Q-avatar** — Copie locale de l'avatar **LinkedIn privilégiée et validée** ; reste à récupérer l'image et à vérifier son rendu.

## Sources de travail

- Décisions de l'auteur dans la présente discussion : validation de la structure ; correction FluidJ ; choix des contacts et du statut juridiquement non professionnel ; confirmation des quatre URL ; déclaration de configuration GoatCounter (session, referrer, country, 365 jours) ; choix d'une copie locale de l'avatar LinkedIn et retrait de l'email des contacts éditoriaux ; demande de capturer le plan V2.
- Plan V2 de l'assistant dans la discussion : source dérivée **explicitement désignée** pour cette capture ; recommandations et formulations non validées individuellement restent distinguées des décisions de l'auteur.
- Dépôt : `AGENTS.md`, `standards/editorial.md`, `standards/voice.md`, `docusaurus.config.ts`, `src/client/goatcounter.ts`, `LICENSE`, `README.md`.

## Suite envisagée

Consolider les formulations ; acquérir le portrait LinkedIn ; rédiger FR, vérifier les mentions légales et la description de confidentialité contre la configuration effective, traduire EN ; vérifier éditorialement ; demander validation et autorisation distincte avant tout aperçu ou déploiement.
