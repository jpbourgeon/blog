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
Les brouillons d'articles utilisent `draft: true` ; ceux des pages restent
hors des routes publiques dans `.42p/editorial-drafts/pages/`. Les prévisualisations
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
l'artefact construit. Ne déclenche `publish` qu'après approbation des contenus et
changements publics du commit. Ni un PASS éditorial ni un build réussi n'accordent
cette approbation.

`npm run publication -- prepare <fr> <en> [<baseline-fr> <baseline-en>]`
calcule les identités du contenu candidat et de sa cible. Le compte rendu
éditorial est enregistré dans `.42p/editorial-reviews/`, commité avant la
promotion. `check <rapport>` revalide son identité ; `project <rapport>`
produit les octets à promouvoir pour un rapport PASS autorisé.

L'historique Git fait foi pour les versions. Pagefind indexe les routes
publiées du sitemap, et exclut les brouillons et les aperçus non listés.

## Licences

[Contenus : CC BY-NC-ND 4.0](LICENSE).
[Code et composants du site : modalités complémentaires](LICENSE-ADDITIONAL.md).
