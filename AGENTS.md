# Instructions du dépôt

Ce dépôt est la source canonique du blog professionnel de jpbourgeon
(Docusaurus, GitHub Pages, français/anglais). Consulter son état réel et
l'historique Git avant toute intervention.

## Autorité

L'auteur décide du sens, de la valeur et de la publication. Un agent peut
explorer, rédiger, traduire, vérifier et préparer ; il ne s'auto-autorise
ni à exposer un aperçu ni à publier. Un rapport PASS prouve une vérification,
pas un consentement. Toute publication substantielle exige un accord explicite.

## Références

- [Éditorial](standards/editorial.md) : fidélité, sources, pages et articles.
- [Voix](standards/voice.md) : style et authenticité.
- Skills : `.42p/.agents/skills/{42p-capture,editorial-write,editorial-verify,editorial-publish}/SKILL.md`.
  Lire le skill concerné avant l'opération.

## Cycle

Capture facultative → rédaction FR/EN → vérification indépendante →
décision de l'auteur → promotion et déploiement autorisés.
Articles et pages utilisent le même cycle. Ne jamais modifier directement
une version publique avant son approbation : préparer une candidate distincte.
Les drafts de pages vont dans `.42p/editorial-drafts/pages/{fr,en}/` ;
les articles utilisent `draft: true` et, avec autorisation, `unlisted`.
Un contenu déployé et exposé (`public` ou `unlisted`) doit d'abord être retiré (article en `draft`,
page déplacée vers les drafts FR/EN), puis ce retrait doit être déployé
avant toute suppression physique. Aucun rapport de suppression spécifique ;
conserver les ressources et Captures encore référencées.
Une page n'a pas de preview `unlisted` native : utiliser une branche de revue.
`unlisted` est accessible publiquement et ne doit pas être indexé.

Captures : `.42p/rationale-units/<slug>/capture.md`.
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
