# jpbourgeon — Publications

Sources canoniques de mes publications professionnelles, en français et en anglais.
Articles, pages pérennes et, à terme, collections thématiques (APE, 42P, STI,
FluidJ, Cybernetic ITSM) coexistent sans imposer de rattachement à une collection.
Les publications sur LinkedIn et dev.to sont des relais, pas les sources.

Site : https://jpbourgeon.github.io/blog/ — Docusaurus sur GitHub Pages.

## Contribuer

Le dépôt est l'espace de rédaction. Les agents appliquent [AGENTS.md](AGENTS.md),
[les standards éditoriaux](standards/editorial.md) et les skills sous
`.42p/.agents/skills/`. L'auteur conserve la décision éditoriale.

Cycle identique pour articles et pages : exploration (Capture facultative),
rédaction FR/EN, vérification indépendante, accord explicite, publication.
Chaque contenu conserve son rapport PASS ; les PR peuvent regrouper plusieurs
contenus et un déploiement peut regrouper plusieurs PR. La fusion d'une PR
ne constitue pas, à elle seule, une approbation éditoriale.
42P conserve les Captures et rapports ; les contenus éditoriaux sont du Code.
Les brouillons d'articles utilisent `draft: true` ; ceux des pages restent
hors des routes publiques dans `src/drafts/pages/`. Les prévisualisations
d'articles `unlisted` sont publiques par URL ; les pages sont prévisualisées
dans une branche ou un site de revue avant leur publication.

L'article suit les routes natives du blog ; la page suit les routes natives de
`src/pages/`. Les tags du blog permettront d'organiser les futures collections :
leur présentation enrichie (hero, image, articles épinglés) sera ajoutée
uniquement lors de la création effective des premières collections.

## Vérifier

```sh
npm ci
npm run typecheck
npm run test:publication
npm run build
```

Le build produit le site bilingue et l'index statique Pagefind. Il ne publie rien.
Sur PR et push, GitHub Actions vérifie seulement le code et le build.

## Publier

La publication reste **manuelle**, depuis **Actions → Pages → Run workflow**
sur `main` avec son SHA complet. Le mode `inspect` vérifie le commit sans
déployer ; `publish` applique le contrôle indépendant puis déploie exactement
l'artefact construit. Ne déclenche `publish` qu'après approbation explicite de **l'ensemble des
changements publics depuis le dernier déploiement**, qu'ils proviennent d'une
ou de plusieurs PR. Ni un PASS éditorial ni un build réussi n'accordent
cette approbation.

`npm run publication -- prepare <fr> <en> [<baseline-fr> <baseline-en>]`
calcule les identités du contenu candidat et de sa cible. Le compte rendu
éditorial est enregistré dans `.42p/editorial-reviews/`, commité avant la
promotion. `check <rapport>` revalide son identité ; `project <rapport>`
produit les octets à promouvoir pour un rapport PASS autorisé.

Le gate valide les contenus publics présents dans le commit cible à partir de
leurs sceaux PASS exacts, sans imposer la validité des révisions intermédiaires.
Les empreintes des standards et de la Capture éventuelle sont des preuves
historiques : leur évolution ultérieure n'invalide pas un PASS existant.
Une nouvelle vérification utilise les versions courantes des références.
La comparaison avec le dernier déploiement sert au contrôle des retraits et au
relevé des changements à autoriser. **Dès le premier déploiement**, toute page
ou tout article public doit disposer d'un sceau PASS, y compris s'il est
inchangé depuis un déploiement précédent. Aucune exception historique.

L'historique Git fait foi pour les versions. Pagefind indexe les routes
publiées du sitemap, et exclut les brouillons et les aperçus non listés.

## Licences

[Contenus : CC BY-NC-ND 4.0](LICENSE).
[Code et composants du site : modalités complémentaires](LICENSE-ADDITIONAL.md).

## Retirer et supprimer

Un contenu exposé par un déploiement (`public` ou `unlisted`) ne peut pas être supprimé directement.
Après décision explicite de l'auteur, il est d'abord retiré de l'exposition :
`draft: true` pour un article ; déplacement de la paire FR/EN d'une page
vers `src/drafts/pages/`, hors des routes publiques.
L'état retiré doit être **déployé** avant de pouvoir supprimer les fichiers.

La suppression ultérieure retire les versions FR/EN et, si elle n'est pas
partagée, la rationale-unit associée. Les contenus jamais déployés ou déjà
retirés peuvent être effacés directement. Les références des objets conservés
doivent rester valides. Les aperçus `unlisted` restent accessibles par URL et
sont signalés dans le relevé dès le premier déploiement. Aucun rapport de suppression ni sceau PASS supplémentaire
n'est requis ; la décision de retrait figure dans le rapport de publication.
Git conserve l'historique des fichiers supprimés.
