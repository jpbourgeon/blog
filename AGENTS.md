# Instructions du dépôt

Ce dépôt est la source canonique du blog professionnel de jpbourgeon
(Docusaurus, GitHub Pages, français/anglais). Consulter son état réel et
l'historique Git avant toute intervention.

## Autorité

L’auteur décide du sens, de la valeur et de la publication. L’agent peut
explorer, rédiger, traduire, vérifier et préparer. Obtenir l’accord explicite
de l’auteur avant d’exposer un aperçu ou de lancer un déploiement public.
Pour un déploiement, l’accord doit couvrir tous les changements publics du
commit cible depuis le dernier déploiement. Le PASS atteste la vérification.
L’accord de l’auteur reste requis.

## Références

- [Éditorial](standards/editorial.md) : fidélité, sources, pages et articles.
- [Voix](standards/voice.md) : style et authenticité.
- [`42p-capture`](.42p/.agents/skills/42p-capture/SKILL.md) — consolider l’état de travail d’un changement pour permettre sa reprise, en distinguant les décisions établies des pistes ouvertes.
- [`editorial-write`](.42p/.agents/skills/editorial-write/SKILL.md) — rédiger les versions candidates FR/EN d’une page ou d’un article en préservant l’intention, les sources et la voix de l’auteur.
- [`editorial-verify`](.42p/.agents/skills/editorial-verify/SKILL.md) — vérifier indépendamment les versions candidates FR/EN et consigner le verdict dans un rapport éditorial.
- [`editorial-publish`](.42p/.agents/skills/editorial-publish/SKILL.md) — gérer les aperçus exposés, les publications et les retraits autorisés. Pour une promotion canonique, vérifier le PASS correspondant et déployer le commit exact.

Lire le skill concerné avant l’opération.

## Cycle

Capture facultative → rédaction FR/EN → vérification indépendante →
décision de l'auteur → promotion et déploiement autorisés.
Articles et pages utilisent le même cycle. Ne jamais modifier directement
une version publique avant son approbation : préparer une candidate distincte.
Les drafts de pages vont dans `.42p/editorial-drafts/pages/{fr,en}/` ;
les articles utilisent `draft: true` et, avec autorisation, `unlisted`.
Pour supprimer un contenu déployé et exposé (`public` ou `unlisted`),
déployer d’abord son retrait. Passer l’article en `draft` ou déplacer la page
vers les drafts FR/EN. La suppression physique peut ensuite être effectuée
sans rapport spécifique. Conserver les ressources et Captures encore référencées.
Une page n'a pas de preview `unlisted` native : utiliser une branche de revue.
`unlisted` est accessible publiquement et ne doit pas être indexé.

Captures : `.42p/rationale-units/<slug>/capture.md` ; pour une page ou un article, nommer le dossier `page_<slug>` ou `article_<slug>` (identifiant stable, sans date).
Rapports : `.42p/editorial-reviews/<type>/<slug>.md`.
Le frontmatter `rationale` peut référencer une seule Capture principale ;
`rationaleContext` peut ajouter des références contextuelles FR/EN identiques.
Une Capture n'est ni une preuve autonome ni une obligation pour chaque contenu.

## Ingénierie et publication

Préférer les fonctions natives, KISS et YAGNI. Éviter les contrôles sans
garantie éditoriale utile. Respecter les licences et les standards.
Tester les changements pertinents. Les collections seront fondées sur les
tags natifs ; ne pas créer de collection ou de composant prématurément.
Les références d'un PASS attestent les versions utilisées lors de sa vérification ;
elles n'imposent pas une conformité rétroactive aux standards modifiés.
Le gate valide l'état public du commit cible ; le différentiel avec le dernier
déploiement sert aux retraits et au relevé des changements. Tout déploiement exige un PASS pour les contenus publics, sans exception. Le déploiement
public reste manuel, après gate indépendant sur le commit exact ;
un push ou une PR ne déploie jamais. Préserver les URL canoniques, les
traductions et l'exclusion des brouillons/aperçus de Pagefind.
