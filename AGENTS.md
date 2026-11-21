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
- [`editorial-explore`](.42p/.agents/skills/editorial-explore/SKILL.md) — approfondir et mettre à l'épreuve le fond, les sources et les angles possibles.
- [`editorial-plan`](.42p/.agents/skills/editorial-plan/SKILL.md) — préparer ou réviser une composition que l'auteur peut adopter avant rédaction.
- [`editorial-write`](.42p/.agents/skills/editorial-write/SKILL.md) — rédiger les versions candidates FR/EN d’une page ou d’un article en préservant l’intention, les sources et la voix de l’auteur.
- [`editorial-verify`](.42p/.agents/skills/editorial-verify/SKILL.md) — vérifier indépendamment les versions candidates FR/EN et consigner le verdict dans un rapport éditorial.
- [`editorial-publish`](.42p/.agents/skills/editorial-publish/SKILL.md) — gérer les aperçus exposés, les publications et les retraits autorisés. Pour une promotion canonique, vérifier le PASS correspondant et déployer le commit exact.

Lire le skill concerné avant l’opération.

## Cycle

Articles et pages suivent les mêmes responsabilités. L'exploration libre est
ouverte sans livrable. Utiliser `42p-capture` quand une trace aide à reprendre le
travail et réconcilier les deltas à tout moment. `editorial-explore` approfondit
la matière et ses preuves. `editorial-plan` peut préparer la composition.
`editorial-write` rédige les candidats FR/EN à partir des décisions et suit
le plan si l'auteur l'a adopté. `editorial-verify` contrôle les candidats
indépendamment avant la décision de publier.

La Capture et le plan sont facultatifs. L'auteur tranche les choix de fond
et adopte explicitement les propositions qu'il retient. Le cycle autorise les
retours à l'exploration, aux décisions ou au plan quand le travail le demande.
Chaque tâche commence à l'étape pertinente, sans passage obligatoire par les
précédentes. La promotion et le déploiement suivent l'accord de l'auteur.

Préparer toute révision dans une candidate distincte jusqu'à son approbation.
42P conserve le Canon (Captures, vérifications et preuves) ; pages et articles
sont du Code, même à l'état candidat. Les drafts de pages vont dans
`src/drafts/pages/{fr,en}/`, hors des routes Docusaurus ;
les articles utilisent `draft: true` et, avec autorisation, `unlisted`.
Pour supprimer un contenu déployé et exposé (`public` ou `unlisted`),
déployer d’abord son retrait. Passer l’article en `draft` ou déplacer la page
vers `src/drafts/pages/{fr,en}/`. La suppression physique peut ensuite être effectuée
sans rapport spécifique. Conserver les ressources et Captures encore référencées.
Une page n'a pas de preview `unlisted` native : utiliser une branche de revue.
`unlisted` est accessible publiquement et ne doit pas être indexé.

Le canon d'une unité est regroupé sous `.42p/design/<identité>/`.
L'identité stable est `article_<slug>` pour un article, `page_<slug>` pour
une page et `system_<slug>` pour une unité système. Pour les articles et les
pages, encoder les séparateurs d'un slug imbriqué en `%2F`. Un slug système
se compose de segments de lettres minuscules ASCII et de chiffres séparés
par des tirets. Créer uniquement les fichiers utiles.

- `rationale.md` contient la Capture courante.
- `plan.md` contient le plan de référence et `plan.revision.md` celui d'une
  révision du texte publié.
- `verification.md` contient le premier rapport puis l'attestation publique.
  Le rapport de révision est établi dans `verification.revision.md`.
  À la promotion autorisée, installer le PASS de révision au chemin public
  avec les textes FR/EN et retirer le rapport de travail dans le même commit.

Le frontmatter `rationale` peut référencer une seule Capture principale ;
`rationaleContext` peut ajouter des références contextuelles FR/EN identiques.
Les preuves d'une Capture proviennent de ses sources.

## Ingénierie et publication

Préférer les fonctions natives, KISS et YAGNI. Éviter les contrôles sans
garantie éditoriale utile. Respecter les licences et les standards.
Tester les changements pertinents. Les collections seront fondées sur les
tags natifs ; ne pas créer de collection ou de composant prématurément.
Les références d'un PASS attestent les versions utilisées lors de sa vérification ;
elles n'imposent pas une conformité rétroactive aux standards modifiés.
Le gate valide l'état public du commit cible ; le différentiel avec le dernier
déploiement sert aux retraits et au relevé présenté dans le run `inspect`
du SHA cible avant autorisation. Le relevé inclut le code, la configuration
et les ressources statiques. Tout déploiement exige un PASS pour les
contenus publics, sans exception. Le déploiement
public reste manuel, après gate indépendant sur le commit exact, build
bilingue avec Pagefind et préflight Lighthouse sur cet artefact ;
un push ou une PR ne déploie jamais. Préserver les URL canoniques, les
traductions et l'exclusion des brouillons/aperçus de Pagefind.
