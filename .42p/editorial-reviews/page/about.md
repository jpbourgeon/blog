---
content: page/about
mode: new
candidates:
  fr:
    path: src/drafts/pages/fr/about.md
    content_sha256: 3a99242da330519d79ea0c95e3e980cec52e2a7931ced937938c971fbf4c6d6a
  en:
    path: src/drafts/pages/en/about.md
    content_sha256: 3182b780993369fb4b1512cbf3b8dcbb244b788bc94775638944960aeaebfa81
targets:
  fr:
    path: src/pages/about.md
    content_sha256: 3a99242da330519d79ea0c95e3e980cec52e2a7931ced937938c971fbf4c6d6a
  en:
    path: i18n/en/docusaurus-plugin-content-pages/about.md
    content_sha256: 3182b780993369fb4b1512cbf3b8dcbb244b788bc94775638944960aeaebfa81
references:
  - path: standards/editorial.md
    git_blob_sha: 716485bd766edfe112bfe9d09d2bd903d2445fcb
  - path: standards/voice.md
    git_blob_sha: 9de8dd5bff300acca547514bb6ae78eecc6185ff
  - path: .42p/rationale-units/page_about/capture.md
    git_blob_sha: 4deee6d1fc3e8bf0570bc1b9eed98984f9872473
result: FAIL
---

# Vérification éditoriale — À propos / About

**FAIL.** Les deux versions passent la revue éditoriale. La navigation commune de la PR contient un lien d’accueil vide accessible au clavier. Revue indépendante du 16 novembre 2026 sur le [commit b78d5ef](https://github.com/jpbourgeon/blog/commit/b78d5efdaa4f351bc99e47e4a9c28f7343c129a7) de la [PR 16](https://github.com/jpbourgeon/blog/pull/16).

## Verdicts

| Axe | Verdict | Éléments probants |
| --- | --- | --- |
| Intention et standard éditorial | PASS | Page pérenne, à la première personne. Le rôle public est annoncé dans la signature et la prise de parole personnelle est précisée dans l’introduction. Les productions sont distinguées des sujets de réflexion. |
| Couverture de la Capture | PASS | Les deux versions couvrent les décisions de fond et de présentation. La correspondance est détaillée ci-dessous. |
| Voix FR | PASS | « expliquer les raisons de son choix, la maintenir, vérifier qu’elle répond au besoin et savoir qui en garde la maîtrise » ancre la perspective dans des critères concrets. Le passage sur les contraintes de conception, d’usage et de maintenance relie la réflexion à l’expérience du code. Le rôle, la curiosité et la pratique en équipe sont étayés par les décisions de l’auteur. |
| Voix EN | PASS | « That curiosity stays with me whether I’m writing code or working with a team » prolonge l’introduction par une pratique identifiable. « explain why it was chosen » et « know who remains in control » conservent un registre direct. Le passage sur le code présente une tournure perfectible sans rupture de ton. |
| Parité FR/EN | PASS | Les deux versions conservent la signature validée, les mêmes critères de conception, la même répartition des rôles éditoriaux, le même périmètre de publication et les mêmes déclarations de confidentialité. « Incoming referrer » désigne le référent à l’arrivée sur le site. |
| Faits et liens | PASS | 13 destinations répondent HTTP 200. LinkedIn renvoie 999 en accès automatisé. Le profil public indexé confirme l’identité et le chemin. L’adresse de GitHub correspond à celle de sa documentation et les licences renvoient aux références du dépôt. |
| Mentions légales | PASS | C-legal consigne la vérification et la décision de l’auteur. Les deux notices approuvées sont identiques à celles de f7162c5. Identité, statut déclaré, hébergeur, adresse et licences concordent dans les deux langues. |
| Confidentialité et consentement | PASS | C-privacy consigne la vérification et la décision de l’auteur sur les notices et le consentement. Le code, le script chargé et la documentation corroborent les affirmations techniques examinées. Les paramètres du compte sont attestés par l’auteur. |
| Intégration technique | FAIL | Projection locale des sources exactes, build FR/EN et Pagefind avec Node 26.13.1. Vérification des deux routes, URL canoniques, entrées de sitemap, ancres légales et référence au portrait local. Les 33 tests de publication et le contrôle TypeScript passent. La barre de navigation introduit un lien d’accueil vide sans nom accessible dans les deux langues. |

Les décisions C-legal et C-privacy sont attribuées à l’auteur, qui confirme avoir mené les vérifications et statué sur les deux notices de f7162c5. Les sections de mentions légales et de confidentialité sont identiques, octet pour octet, aux sections retenues. Le module GoatCounter est inchangé depuis ce commit. La présente revue vérifie l’application de ces décisions et la concordance des affirmations avec les éléments observables. Elle n’a identifié aucune contradiction dans le code ou la documentation qui justifie de rouvrir les points tranchés. La vérification juridique reste celle de l’auteur. [Commit des notices](https://github.com/jpbourgeon/blog/commit/f7162c580961daf6040a455025bb325082d5cb94)

## Capture vers candidats et candidats vers Capture

| Décision | Application dans les deux langues et rattachement des passages |
| --- | --- |
| C-identite, signature et portrait | L’en-tête utilise le portrait WebP local de 104 × 104 px, au-dessus du nom civil, suivi de la signature validée en retrait. Le texte alternatif identifie le portrait dans les deux langues. L’introduction présente le travail sur les systèmes et les organisations sans répéter le titre, puis précise l’indépendance vis-à-vis de l’employeur. |
| C-perspective et C-domaines | « Pourquoi ce blog » et « Why this blog » relient curiosité, pratique en équipe, critères de conception, frugalité et maîtrise face à l’automatisation. Les domaines apparaissent dans le fil du texte, sans annoncer de collections. |
| C-redaction | Le dernier paragraphe de « Pourquoi ce blog » et « Why this blog » attribue aux agents d’IA l’exploration, la rédaction, la traduction et la vérification. L’auteur décide du propos et valide chaque publication dans les deux versions. |
| C-productions | La section des productions explique en quoi le code met les idées à l’épreuve et renvoie à at-rama. Elle n’ajoute aucun projet particulier. |
| C-contact et Q-profiles | La section de contact renvoie à GitHub, dev.to et LinkedIn. Le renvoi à at-rama reste dans les productions. |
| C-statut et C-legal | Les notices identifient Jean-Philippe Bourgeon, le statut déclaré, GitHub Pages et les licences. Leurs choix de contenu sont ceux arbitrés par l’auteur. |
| C-privacy | Les deux notices reprennent l’hébergement, les données transmises, les traitements temporaires et les réglages déclarés. |
| Cadre technique | Les candidats sont hors des routes publiques. Les routes, les ancres et le portrait fonctionnent dans la projection. |

Les descriptions de page condensent la signature. Chaque section substantielle des candidats se rattache aux décisions ci-dessus.

## Sources techniques

- Le [module GoatCounter du blog](https://github.com/jpbourgeon/blog/blob/b78d5efdaa4f351bc99e47e4a9c28f7343c129a7/src/client/goatcounter.ts) envoie le chemin avec la chaîne de requête et le titre. Le référent est renseigné pour l’arrivée seulement, s’il est disponible. Le [script chargé](https://gc.zgo.at/count.js) transmet la largeur de l’écran. La notice distingue la transmission de la largeur de l’usage statistique, déclaré désactivé par l’auteur.
- La [documentation GoatCounter](https://www.goatcounter.com/help/privacy) décrit la mesure sans cookie de suivi, l’usage temporaire de l’IP et du User-Agent et l’absence de stockage des IP brutes dans la base. Les sessions, référents, pays, 365 jours de conservation et la désactivation de la statistique de largeur relèvent de la déclaration de l’auteur.
- [Adresse postale GitHub](https://docs.github.com/en/site-policy/content-removal-policies/guide-to-submitting-a-dmca-takedown-notice), [licences et exceptions du dépôt](https://github.com/jpbourgeon/blog/blob/main/LICENSE-ADDITIONAL.md) et [profil LinkedIn indexé](https://fr.linkedin.com/in/jpbourgeon).

## Améliorations éditoriales non bloquantes

- En français, « L’architecture logicielle, la cybernétique et les systèmes sociotechniques nourrissent cette réflexion » gagnerait à préciser ce que l’un de ces domaines aide à comprendre ou à maîtriser, pour prolonger le raisonnement du paragraphe précédent.
- En anglais, « Design, usage, and maintenance constraints force me to make precise what looked straightforward on paper » préserve le sens, mais la tournure « make precise what » est moins naturelle que le reste du texte. Privilégier le vocabulaire usuel de la pratique logicielle.

Le contrôle local sous Chromium couvre les deux langues à 320, 393 et 1 440 px. L’avatar circulaire affiche 104 × 104 px au-dessus du nom et de la signature. Aucun débordement horizontal ni erreur JavaScript relevés. Sur les deux accueils, le titre d’onglet est `jpbourgeon/blog`. Les deux pages À propos conservent leur titre propre suivi de ce nom. Le nom du site est absent de la barre de navigation. Après suppression du titre de la barre, Docusaurus génère encore un lien `a.navbar__brand` vide, sans nom accessible et atteignable au clavier, sur les deux accueils et les deux pages À propos. Ce défaut relève de la navigation commune de la PR et bloque le verdict technique. Vérifier sa suppression effective du parcours clavier avant de renouveler le verdict. La validation visuelle finale du portrait revient à l’auteur. Les liens de navigation vers la page et de pied de page vers `#legal` seront à contrôler après leur ajout lors de la promotion.

Human editorial approval: not granted by this report
