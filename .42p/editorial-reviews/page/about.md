---
content: page/about
mode: new
candidates:
  fr:
    path: src/drafts/pages/fr/about.md
    content_sha256: c6539cfc405c51d76055d5c732a9882ec32f297a76b98c74d3ff739d606633b3
  en:
    path: src/drafts/pages/en/about.md
    content_sha256: 63d47922e8b5e2e9b4073c79467f306db7dd1e2ba30751ef7c8080c5e489a542
targets:
  fr:
    path: src/pages/about.md
    content_sha256: c6539cfc405c51d76055d5c732a9882ec32f297a76b98c74d3ff739d606633b3
  en:
    path: i18n/en/docusaurus-plugin-content-pages/about.md
    content_sha256: 63d47922e8b5e2e9b4073c79467f306db7dd1e2ba30751ef7c8080c5e489a542
references:
  - path: standards/editorial.md
    git_blob_sha: 716485bd766edfe112bfe9d09d2bd903d2445fcb
  - path: standards/voice.md
    git_blob_sha: 9de8dd5bff300acca547514bb6ae78eecc6185ff
  - path: .42p/rationale-units/page_about/capture.md
    git_blob_sha: e490b576cc59c3154b4adc5f02d95bc3fa6c2ab1
result: PASS
---

# Vérification éditoriale — À propos / About

**PASS.** Revue indépendante du 15 novembre 2026 sur le [commit e812518](https://github.com/jpbourgeon/blog/commit/e812518aef57e3cd6ae38f0f906d050b9927e2f8) de la [PR 16](https://github.com/jpbourgeon/blog/pull/16).

## Verdicts

| Axe | Verdict | Éléments probants |
| --- | --- | --- |
| Intention et standard éditorial | PASS | Page pérenne, à la première personne. Le rôle public est annoncé dans la signature et la prise de parole personnelle est précisée dans l’introduction. Les productions sont distinguées des sujets de réflexion. |
| Couverture de la Capture | PASS | Les deux versions couvrent les décisions de fond et de présentation. La correspondance est détaillée ci-dessous. |
| Voix FR | PASS | « expliquer les raisons de son choix, la maintenir, vérifier qu’elle répond au besoin et savoir qui en garde la maîtrise » ancre la perspective dans des critères concrets. Le passage sur les contraintes de conception, d’usage et de maintenance relie la réflexion à l’expérience du code. Le rôle, la curiosité et la pratique en équipe sont étayés par les décisions de l’auteur. |
| Voix EN | PASS | « That curiosity stays with me whether I’m writing code or working with a team » prolonge l’introduction par une pratique identifiable. « explain why it was chosen » et « know who remains in control » conservent un registre direct. Le passage sur le code présente une tournure perfectible sans rupture de ton. |
| Parité FR/EN | PASS | Les deux versions conservent la signature validée, les mêmes critères de conception, le même périmètre de publication et les mêmes déclarations de confidentialité. « Incoming referrer » désigne le référent à l’arrivée sur le site. |
| Faits et liens | PASS | 13 destinations répondent HTTP 200. LinkedIn renvoie 999 en accès automatisé. Le profil public indexé confirme l’identité et le chemin. L’adresse de GitHub correspond à celle de sa documentation et les licences renvoient aux références du dépôt. |
| Mentions légales | PASS | C-legal consigne la vérification et la décision de l’auteur. Les deux notices approuvées sont identiques à celles de f7162c5. Identité, statut déclaré, hébergeur, adresse et licences concordent dans les deux langues. |
| Confidentialité et consentement | PASS | C-privacy consigne la vérification et la décision de l’auteur sur les notices et le consentement. Le code, le script chargé et la documentation corroborent les affirmations techniques examinées. Les paramètres du compte sont attestés par l’auteur. |
| Intégration technique | PASS | Projection locale des sources exactes, build FR/EN et Pagefind avec Node 26.13.1. Vérification des deux routes, URL canoniques, entrées de sitemap, ancres légales et référence au portrait local. Les 33 tests de publication et le contrôle TypeScript passent. |

Les décisions C-legal et C-privacy sont attribuées à l’auteur, qui confirme avoir mené les vérifications et statué sur les deux notices de f7162c5. Le diff jusqu’à e812518 touche uniquement la Capture. La présente revue vérifie l’application de ces décisions et la concordance des affirmations avec les éléments observables. Elle n’a identifié aucune contradiction dans le code ou la documentation qui justifie de rouvrir les points tranchés. La vérification juridique reste celle de l’auteur. [Commit des notices](https://github.com/jpbourgeon/blog/commit/f7162c580961daf6040a455025bb325082d5cb94)

## Capture vers candidats et candidats vers Capture

| Décision | Application dans les deux langues et rattachement des passages |
| --- | --- |
| C-identite, signature et portrait | L’en-tête utilise le portrait WebP local de 104 × 104 px, avec texte alternatif traduit, nom et signature exacte. L’introduction présente le travail sur les systèmes et les organisations sans répéter le titre, puis précise l’indépendance vis-à-vis de l’employeur. |
| C-perspective et C-domaines | « Pourquoi ce blog » et « Why this blog » relient curiosité, pratique en équipe, critères de conception, frugalité et maîtrise face à l’automatisation. Les domaines apparaissent dans le fil du texte, sans annoncer de collections. |
| C-productions | La section des productions explique en quoi le code met les idées à l’épreuve et renvoie à at-rama. Elle n’ajoute aucun projet particulier. |
| C-contact et Q-profiles | La section de contact renvoie à GitHub, dev.to et LinkedIn. Le renvoi à at-rama reste dans les productions. |
| C-statut et C-legal | Les notices identifient Jean-Philippe Bourgeon, le statut déclaré, GitHub Pages et les licences. Leurs choix de contenu sont ceux arbitrés par l’auteur. |
| C-privacy | Les deux notices reprennent l’hébergement, les données transmises, les traitements temporaires et les réglages déclarés. |
| Cadre technique | Les candidats sont hors des routes publiques. Les routes, les ancres et le portrait fonctionnent dans la projection. |

Les descriptions de page condensent la signature. Chaque section substantielle des candidats se rattache aux décisions ci-dessus.

## Sources techniques

- Le [module GoatCounter du blog](https://github.com/jpbourgeon/blog/blob/e812518aef57e3cd6ae38f0f906d050b9927e2f8/src/client/goatcounter.ts) envoie le chemin avec la chaîne de requête et le titre. Le référent est renseigné pour l’arrivée seulement, s’il est disponible. Le [script chargé](https://gc.zgo.at/count.js) transmet la largeur de l’écran. La notice distingue la transmission de la largeur de l’usage statistique, déclaré désactivé par l’auteur.
- La [documentation GoatCounter](https://www.goatcounter.com/help/privacy) décrit la mesure sans cookie de suivi, l’usage temporaire de l’IP et du User-Agent et l’absence de stockage des IP brutes dans la base. Les sessions, référents, pays, 365 jours de conservation et la désactivation de la statistique de largeur relèvent de la déclaration de l’auteur.
- [Adresse postale GitHub](https://docs.github.com/en/site-policy/content-removal-policies/guide-to-submitting-a-dmca-takedown-notice), [licences et exceptions du dépôt](https://github.com/jpbourgeon/blog/blob/main/LICENSE-ADDITIONAL.md) et [profil LinkedIn indexé](https://fr.linkedin.com/in/jpbourgeon).

## Améliorations éditoriales non bloquantes

- En français, « L’architecture logicielle, la cybernétique et les systèmes sociotechniques nourrissent cette réflexion » gagnerait à préciser ce que l’un de ces domaines aide à comprendre ou à maîtriser, pour prolonger le raisonnement du paragraphe précédent.
- En anglais, « Design, usage, and maintenance constraints force me to make precise what looked straightforward on paper » préserve le sens, mais la tournure « make precise what » est moins naturelle que le reste du texte. Privilégier le vocabulaire usuel de la pratique logicielle.

La revue mobile du portrait relève de l’auteur. Les liens de navigation et de pied de page seront vérifiables après leur ajout lors de la promotion.

Human editorial approval: not granted by this report
