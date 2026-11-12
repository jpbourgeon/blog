# Page « À propos » — Capture du plan V2

## Identité et portée

Préparer une page pérenne « À propos » pour le blog personnel jpbourgeon, bilingue FR/EN, qui permette à un lecteur venu d'un article de comprendre l'auteur, sa perspective, ses domaines de réflexion et les moyens de retrouver ses travaux. Inclure en fin de page les mentions légales et l'information sur la confidentialité. Cette Capture est un état de travail non autoritatif : elle ne constitue ni la page rédigée, ni une autorisation de publication.

La structure a été explicitement validée par l'auteur ; les corrections ultérieures ci-dessous priment sur le cadrage initial. Le plan V2 est désigné comme matière à capturer, mais les formulations illustratives restent à confirmer lors de la rédaction.

## Orientation éditoriale

- **C-identite** — Exprimer une voix personnelle, à la première personne, sobre et précise ; éviter le CV, le manifeste, le discours institutionnel et l'autopromotion. Présenter le directeur technique et directeur adjoint d'une DSI du secteur public, à la croisée du management des organisations et de l'ingénierie logicielle. Ne pas parler au nom de l'employeur.
- **C-perspective** — Relier conception et compréhension des systèmes, gouvernance des décisions/responsabilités, maîtrise humaine, simplicité, frugalité, vérifiabilité et pérennité ; ne pas anticiper un manifeste STI.
- **C-domaines** — Dans la page « À propos », évoquer les thèmes qui structurent la réflexion de l'auteur (conception, développement et pilotage des systèmes d'information ; ingénierie logicielle, management, gouvernance et maîtrise humaine face à l'automatisation), sans dresser la liste ni détailler les cinq collections. Signaler sobrement que certains sujets se prolongent dans des collections réunissant publications et ressources. L'organisation et les intitulés des collections relèvent de la navigation et de leurs pages propres, non de la présentation personnelle. Ne pas imposer le rattachement d'un article à une collection, ni créer de collections vides ou de composants promotionnels. La formulation du paragraphe reste à travailler selon la voix de l'auteur.
- **C-productions** — Distinguer territoires de réflexion et réalisations. Orienter vers l'organisation GitHub `at-rama` et les productions effectivement publiques (par exemple `sqlite-vector-wasm`), sans inventaire de projets ni annonces non publiées.
- **C-contact** — Mettre en avant les profils personnels [GitHub](https://github.com/jpbourgeon), [dev.to](https://dev.to/jpbourgeon), [LinkedIn](https://www.linkedin.com/in/jpbourgeon). Présenter séparément l'organisation de production [at-rama](https://github.com/at-rama). Pas de formulaire.
- **C-statut** — L'auteur confirme que le blog personnel est **édité à titre juridiquement non professionnel** et demande de ne pas publier de coordonnées privées inutiles. Rédiger les mentions en conséquence et vérifier les informations légalement exigées.

## Structure de page retenue

1. **Identité — Qui je suis** (environ 70–100 mots) : portrait, nom, situation professionnelle et introduction.
2. **Perspective — Pourquoi ce blog** (environ 100–150 mots) : concevoir/comprendre, gouverner/maîtriser, simplicité.
3. **Thèmes de réflexion** : un court paragraphe dans le fil de la présentation, juste après la perspective personnelle, sans titre supplémentaire ni énumération des collections ; mentionner leur existence sans en faire le sommaire du site.
4. **Productions et contributions** (environ 70–110 mots) : travaux open source, liens vérifiables.
5. **Me retrouver et échanger** (environ 60–90 mots) : GitHub, dev.to et LinkedIn.
6. **Mentions légales** (longueur dictée par les besoins) : identification/statut, responsable de publication, hébergeur GitHub Pages, droits et licences.
7. **Confidentialité** (courte et factuelle) : hébergement et mesure d'audience GoatCounter, traitements réels, information et éventuel consentement suivant configuration.

Les volumes sont indicatifs, non des seuils normatifs. Préserver une page courte et fluide, sans cartes, icônes, section dédiée aux collections ou infrastructure de collections prématurées.

## Portrait : choix de mise en œuvre

**O-avatar-local (choix validé et fichier fourni par l'auteur)** : le portrait choisi par l'auteur est versionné dans la branche de cette PR à `static/img/avatar.webp`. L'intégrer directement dans les candidates FR/EN, avec un texte alternatif approprié. **Présentation validée : profil compact, sans hero** ; avatar circulaire d'environ 96–112 px à gauche du nom et de la fonction professionnelle, en haut de page. Conserver une disposition compacte et lisible sur mobile, suivie de l'introduction en paragraphes courts. Aucun slogan, fond décoratif, service Gravatar, image distante, synchronisation, dépendance ou composant React dédié. Vérifier le rendu réel avant publication.

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
- **Q-avatar** — **Fichier fourni par l'auteur et présent dans la PR** : `static/img/avatar.webp`. Acquisition terminée ; restent l'intégration dans les candidates FR/EN et la vérification du rendu avant publication.

## Sources de travail

- Décisions éditoriales ultérieures de l'auteur : la page « À propos » présente les thèmes de réflexion sans inventorier les collections, accessibles par la navigation ; court paragraphe intégré au corps de page. L'auteur a également validé la proposition visuelle d'un en-tête de profil compact avec avatar circulaire local, plutôt qu'un hero ou une intégration Gravatar.

- Décisions de l'auteur dans la présente discussion : validation de la structure ; correction FluidJ ; choix des contacts et du statut juridiquement non professionnel ; confirmation des quatre URL ; déclaration de configuration GoatCounter (session, referrer, country, 365 jours) ; choix d'une copie locale de l'avatar et retrait de l'email des contacts éditoriaux ; dépôt par l'auteur de `static/img/avatar.webp` dans la PR ; demande de capturer le plan V2.
- Plan V2 de l'assistant dans la discussion : source dérivée **explicitement désignée** pour cette capture ; recommandations et formulations non validées individuellement restent distinguées des décisions de l'auteur.
- Dépôt : `AGENTS.md`, `standards/editorial.md`, `standards/voice.md`, `docusaurus.config.ts`, `src/client/goatcounter.ts`, `LICENSE`, `README.md`.

## Suite envisagée

Intégrer le portrait local déjà fourni dans les candidates FR/EN et vérifier son rendu ; finaliser les vérifications des mentions légales et de la confidentialité contre la configuration effective ; procéder à la vérification éditoriale indépendante, puis demander validation et autorisation distincte avant tout aperçu ou déploiement.
