# Page « À propos » — Capture

## Objet

Page pérenne bilingue FR/EN présentant l'auteur, son regard sur les systèmes, la raison de publier ses travaux, ses contributions et ses contacts, puis les mentions légales et la confidentialité. Cette Capture est un état de travail non autoritatif, ni un texte validé ni une permission de publication. La structure et les arbitrages ci-dessous sont validés par l'auteur ; les formulations restent à composer.

## Intention éditoriale

- **C-identite** — Présenter personnellement le directeur technique et directeur adjoint d'une DSI publique, à la croisée de l'ingénierie logicielle et du management des organisations. La signature porte déjà le titre : ne pas le répéter immédiatement. L'auteur parle pour lui-même, jamais au nom de son employeur. Éviter le CV et l'autopromotion.
- **C-perspective** — Comprendre le fonctionnement des systèmes et imaginer ce qu'ils pourraient devenir ; assumer la responsabilité de concevoir des systèmes compréhensibles, maîtrisables et vérifiables. La pratique du code et du travail en équipe relie curiosité et responsabilité. Simplicité et frugalité sont des choix motivés par la maîtrise de la complexité, pas une déclaration de valeurs. Ne pas transformer cette perspective en manifeste STI.
- **C-publication** — Le blog est une composante d'une démarche plus vaste de réflexion, de conception et d'expérimentation, une œuvre en construction plutôt qu'un programme à exposer. Il sert à structurer et pérenniser les réflexions et expériences, puis à les « mettre au monde ». La publication ouvre les travaux, y compris les questions non résolues, à la contradiction : confronter les raisonnements à d'autres regards évite qu'ils restent enfermés dans leur cohérence interne. Ni recherche de notoriété ou de félicitations, ni attente de bruit social. Le blog est aussi un terrain d'essais pour l'écriture et l'initiative créatrice (entrepreneuriat au sens non économique), dimensions secondaires dans la présentation au lecteur.
- **C-lecteur** — Dans « Pourquoi ce blog », **faire sentir la démarche par ce qu'elle ouvre au lecteur**, non expliquer prioritairement les motivations privées de l'auteur. Préserver ensemble, avec leur hiérarchie, le noyau (réflexions, explorations et réalisations publiées pour être discutables), le terrain (systèmes techniques, humains et organisationnels, conçus ou interrogés autrement) et l'ouverture au lecteur (accéder aux questions et raisonnements autant qu'aux résultats, s'en saisir, les adapter ou les contester). Le terrain ne remplace pas la finalité de publier ; l'intérêt du lecteur n'efface pas la pensée de l'auteur. Ne réduire le blog ni à des retours d'expérience et décisions passées, ni à un exemple particulier comme l'automatisation, ni à un journal personnel. Ne pas promettre un bénéfice ou solliciter artificiellement des réactions.
- **C-progression** — « Pourquoi ce blog » tient en deux ou trois paragraphes, hors courte transparence sur les agents. Elle doit apporter une idée distincte de la présentation personnelle, qui expose déjà la curiosité pour les systèmes et l'exigence de justifier les choix. La composition, la progression intellectuelle et la voix relèvent de `editorial-write` et `standards/voice.md` ; la Capture n'impose ni accroche, ni exemple, ni plan de paragraphes, ni formulation issue d'une tentative antérieure.
- **C-domaines** — Faire apparaître sans catalogue la conception, le développement et le pilotage des SI, l'ingénierie logicielle, le management, la gouvernance et la maîtrise humaine face à l'automatisation. Ne pas annoncer de collections futures ou imposer un rattachement aux collections.
- **C-redaction** — À la fin de « Pourquoi ce blog » / « Why this blog », mentionner brièvement les agents d'IA utilisés pour explorer, rédiger, traduire et vérifier. L'auteur décide du propos et valide chaque publication. Cette transparence ne doit pas devenir le sujet de la section.
- **C-productions** — Distinguer les domaines d'intérêt des réalisations, évoquer la mise à l'épreuve des idées par le code, renvoyer à l'organisation GitHub [at-rama](https://github.com/at-rama). Pas d'inventaire, de projet particulier nommé ni de travaux non publiés annoncés.
- **C-contact** — Profils personnels : [GitHub](https://github.com/jpbourgeon), [dev.to](https://dev.to/jpbourgeon) et [LinkedIn](https://www.linkedin.com/in/jpbourgeon). Distinguer [at-rama](https://github.com/at-rama), organisation de production. Pas de formulaire ni d'email personnel dans les contacts.
- **C-statut** — Blog édité à titre non professionnel ; responsable de publication nommé dans les mentions légales : **Jean-Philippe Bourgeon**, sans coordonnées privées inutiles.

## Identité et présentation validées

Signatures retenues, à préserver dans leurs deux langues :

> Papa Poule · Directeur technique et directeur adjoint d'une DSI publique · Amateur de systèmes

> Papa Bear · Public-sector IT Technical Director & Deputy Director · Systems Enthusiast

Repères de sens pour la présentation personnelle : « Comprendre comment les choses fonctionnent, imaginer comment elles pourraient fonctionner autrement » / “Understanding how things work and imagining how they could work differently.” Champs d'intérêt : architecture logicielle, cybernétique, systèmes sociotechniques, IA, ingénierie frugale, open source, local-first. Ils ne constituent pas un inventaire à reproduire. Préserver la dimension parentale et curieuse de la signature ; « Papa Bear » est un choix explicite de l'auteur.

## Page et réalisation

Ordre de référence validé : identité et présentation personnelle ; « Pourquoi ce blog » ; thèmes intégrés dans le fil du texte, sans titre ni inventaire autonome ; « Productions et contributions » ; contacts ; mentions légales ; confidentialité. Cet ordre fixe les fonctions de la page, pas les paragraphes exacts. Page courte, sobre et fluide, FR/EN naturels et cohérents ; vouvoiement du lecteur en français.

- **O-avatar-local** — Portrait fourni, versionné à `static/img/avatar.webp`. Profil compact sans hero : avatar circulaire d'environ 96–112 px au-dessus du nom, signature en retrait. Pas de service distant, composant React dédié ou décoration. La revue du rendu mobile appartient à l'auteur.
- Docusaurus natif ; routes envisagées `/blog/about/` et `/blog/en/about/`. Candidates FR/EN hors routes publiques dans `src/drafts/pages/{fr,en}/` ; ne rien exposer ni publier sans accord. Préserver les licences existantes (textes CC BY-NC-ND 4.0, exceptions et code selon `LICENSE-ADDITIONAL.md`). Pas de fonctionnalité ou collection prématurée.

## Mentions et confidentialité — décisions closes

- **C-legal** — L'auteur a vérifié et retenu les notices FR/EN du commit `f7162c580961daf6040a455025bb325082d5cb94` : publication non professionnelle, identité du responsable, hébergement GitHub Pages / GitHub, Inc., coordonnées publiques de l'hébergeur, licences et exceptions. Conserver ces décisions.
- **C-privacy** — L'auteur a vérifié et retenu les notices FR/EN du même commit : hébergement GitHub Pages et GoatCounter, nature des informations transmises (page, titre, largeur d'écran, référent disponible), utilisation temporaire de l'IP et d'informations navigateur, statistiques agrégées possibles, pas de stockage d'IP brute en base selon GoatCounter. Configuration de compte déclarée par l'auteur : sessions, référents, pays, conservation de 365 jours ; largeur d'écran transmise par le script mais non utilisée dans les statistiques. Ne pas présenter ces réglages déclarés comme indépendamment vérifiés. Ces décisions sont closes, sauf contradiction précise ou changement matériel.

## État et sources

Les versions candidates FR/EN existent dans `src/drafts/pages/{fr,en}/about.md` ; la section « Pourquoi ce blog » reste à reprendre sur le plan de la composition. Ne pas confondre fidélité thématique et qualité de voix. Aucune formulation des essais successifs n'est validée comme texte définitif. La révision ne vaut ni vérification indépendante ni approbation éditoriale, ni publication. L'auteur conserve la revue visuelle mobile et l'autorité sur le contenu et sa diffusion.

Sources principales : décisions et déclarations directes de l'auteur du 13 au 19 novembre 2026 (motivation de publication et équilibre lecteur/auteur ; identité, structure, contacts et avatar) ; validation des notices légales/confidentialité lors du suivi de la PR #16 le 15 novembre 2026 ; plan V2 de l'assistant explicitement désigné comme matière de travail, non comme texte validé ; `AGENTS.md`, `standards/editorial.md`, `standards/voice.md`, configuration du site et notices FR/EN au commit cité.
