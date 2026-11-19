---
content: page/about
mode: revision
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
    git_blob_sha: 848650f4a16d218198b9228efe8fa74f0cc31774
  - path: standards/voice.md
    git_blob_sha: 9de8dd5bff300acca547514bb6ae78eecc6185ff
  - path: .42p/rationale-units/page_about/capture.md
    git_blob_sha: 4deee6d1fc3e8bf0570bc1b9eed98984f9872473
baseline:
  fr:
    path: src/pages/about.md
    git_blob_sha: 8b43466ce94176d3449942f44ae95d973384e416
  en:
    path: i18n/en/docusaurus-plugin-content-pages/about.md
    git_blob_sha: 7536308af6155c987959de095728b47dbb9ef98a
result: FAIL
---

# Vérification éditoriale — copies À propos / About

**FAIL — voix FR et EN : progression insuffisante dans la présentation personnelle.**
Revue indépendante du 19 novembre 2026, sans réécriture des candidats, sur le [commit 389c0d3](https://github.com/jpbourgeon/blog/commit/389c0d3fc5e05c9dab9a7812bc900693b5b314de) de la [PR 24](https://github.com/jpbourgeon/blog/pull/24).

La méthode appliquée est la version ajustée d’[editorial-verify au commit 2b4f04a](https://github.com/jpbourgeon/blog/blob/2b4f04aeb353459aa1a2e1dc6655763b68e4bcdd/.42p/.agents/skills/editorial-verify/SKILL.md), blob `51707b3cece413d50c538a13eb7c168da9112968`, validée par l’auteur dans la PR 23. Elle n’est pas encore présente dans la branche examinée. Les références normatives ci-dessus sont celles des candidats, non celles du rapport historique.

Les copies sont identiques, octet pour octet, aux pages canoniques. Ce rapport porte sur leur réexamen comme candidates à une révision ; il ne retire pas rétroactivement la vérification historique de la version publique, conservée dans Git. Il n’autorise aucune publication.

## Verdicts et éléments probants

| Axe | Verdict | Éléments probants |
| --- | --- | --- |
| Intention et standard éditorial | PASS | L’identité, la prise de parole personnelle, la perspective professionnelle et les productions sont identifiables. Le niveau de détail convient à une page permanente. La faiblesse de composition est évaluée séparément dans la voix. |
| Couverture et fidélité à la Capture | FAIL | Les sujets et décisions factuelles sont couverts. En revanche, C-domaines demande de relier les domaines plutôt que répéter un inventaire : la phrase FR « L’architecture logicielle, la cybernétique et les systèmes sociotechniques nourrissent cette réflexion, tout comme l’open source et les technologies local-first » et son équivalent EN les juxtaposent sans préciser leur contribution. La couverture thématique ne satisfait donc pas complètement la relation demandée. |
| Voix FR | FAIL | La langue est sobre, claire et étayée. Les paragraphes de « Pourquoi ce blog » passent cependant de la curiosité aux critères de conception, puis à la frugalité, à cinq domaines et à l’usage des agents, sans développer suffisamment les relations entre ces éléments ni leur rapport à la démarche de publication. Voir l’analyse ci-dessous. |
| Voix EN | FAIL | La même succession dans « Why this blog » reproduit la faiblesse de composition. Les liens locaux sont naturels, mais « inform this thinking, alongside… » n’explicite pas davantage l’apport des domaines. |
| Parité FR/EN | PASS | Identité, curiosité, critères de choix, simplicité, automatisation, domaines, rôle des agents, code, contacts, notices et paramètres déclarés concordent. L’anglais partage les limites du français sans en modifier le sens. |
| Faits et liens | PASS | Les fonctions, motivations et paramètres de compte sont rattachés aux décisions de l’auteur, non à une expertise inventée. Les 14 destinations distinctes des deux copies répondent HTTP 200 lors de cette revue. Le portrait local existe ; les licences concordent avec le dépôt. |
| Application des décisions légales | PASS | C-legal est une décision déclarée et vérifiée par l’auteur. Les notices des copies restent identiques aux notices canoniques approuvées ; aucun nouvel arbitrage juridique n’est formulé ici. L’adresse GitHub est corroborée par sa documentation. |
| Application des décisions de confidentialité | PASS | C-privacy est conservée et attribuée à l’auteur. Le module envoie chemin, titre et référent d’arrivée ; le script chargé contient la transmission de screen.width. La documentation confirme les traitements temporaires et agrégés décrits. Les options du compte et la conservation restent attestées par l’auteur. |
| Préparation technique des candidats | FAIL | Les copies exactes ne comportent pas `draft: true`. Le contrôle réel `publication prepare` refuse les candidates avec « Page candidates must be drafts ». Elles sont hors des routes natives, donc ce défaut ne constitue pas une exposition publique. Aucun correctif n’a été appliqué, conformément à la demande de conserver les copies. |
| Compilation et rendu final | INCONCLUSIVE | TypeScript et les 33 tests de publication passent. Aucun nouveau build FR/EN, contrôle Pagefind ou rendu navigateur n’a été exécuté : les sources publiques sont inchangées et prepare est bloqué. Les contrôles historiques ne sont pas présentés comme nouvellement exécutés. |

## Progression : qualités locales et défaut d’ensemble

L’ouverture FR/EN relie utilement les systèmes informatiques aux organisations, puis situe la parole personnelle. Le début de « Pourquoi ce blog » / « Why this blog » introduit une curiosité commune au code et au travail en équipe. Le paragraphe suivant établit une relation explicite : les exigences d’explication, de maintenance, de vérification et de maîtrise justifient l’intérêt conjoint pour l’ingénierie et la gouvernance. Ce lien est réel ; le texte n’est donc pas une simple liste du début à la fin.

La suite ajoute toutefois plusieurs dimensions sans développer ce qui les relie. « Je recherche la simplicité et la frugalité » explique le refus de complexité inutile, mais rattache peu cette recherche aux exigences précédentes. La phrase suivante rend la compréhension et la maîtrise plus importantes avec l’IA, sans préciser pourquoi. Le paragraphe des domaines fournit alors des noms, sans montrer l’éclairage qu’ils apportent. Enfin, l’usage éditorial des agents est déclaré sans que la section ait expliqué ce qui conduit l’auteur à écrire et partager ces réflexions. La proximité des thèmes assure la cohérence du sujet, pas une progression suffisamment exprimée.

En anglais, « That is why… » assure le même lien local ; « I seek… », « inform this thinking, alongside… » et « I work with AI agents… » reprennent ensuite la même juxtaposition. La traduction n’est pas la cause du défaut.

Le passage des productions explique bien une relation entre code et idées : les contraintes obligent à préciser la pensée. Il apporte une substance propre, mais arrive comme une nouvelle composante plutôt que comme un prolongement suffisamment construit du développement précédent. Les bons passages isolés ne suffisent pas à justifier une appréciation globale favorable.

Le défaut concerne ainsi l’organisation du principal développement personnel, pas une seule transition. Il relève des principes 3 et 7 de voix et de la nouvelle consigne d’appréciation globale. Les sections contact, mentions légales et confidentialité ont une fonction autonome et n’exigent pas un enchaînement argumentatif. Le FAIL ne demande ni anecdote personnelle, ni intimité, ni jugement mesurable sur une « âme » : les raisons et expériences ne doivent pas être inventées.

## Capture vers contenu et contenu vers Capture

| Décisions | Application et limites FR/EN |
| --- | --- |
| C-identite, signature, portrait | Nom, signature validée, portrait local circulaire de 104 px, rôle et indépendance sont présents. |
| C-perspective | Curiosité, responsabilité, critères de conception, simplicité et automatisation sont présents ; leur développement commun reste partiellement explicite, comme analysé ci-dessus. |
| C-domaines | Domaines présents sans collections futures, mais leur simple juxtaposition ne respecte pas l’exigence de les relier dans le texte. |
| C-redaction | La fin de Pourquoi/Why attribue exploration, rédaction, traduction et vérification aux agents, décision et approbation à l’auteur. |
| C-productions | Le code est présenté comme mise à l’épreuve ; le lien at-rama est conservé, sans inventaire de projets. |
| C-contact, Q-profiles | Les quatre URL validées sont présentes, avec at-rama dans les productions et les trois profils dans les contacts. |
| C-statut, C-legal, C-privacy | Identité, statut, hébergeur, licences, traitements et paramètres déclarés sont conservés dans les deux langues. |
| Cadre technique | Copies hors routes publiques, mêmes routes de destination et portrait ; absence du marqueur draft requis par les outils, sans modification à cette étape. |

En sens inverse, les descriptions condensent la signature ; les assertions substantielles des deux copies se rattachent aux décisions ci-dessus. Aucune nouvelle conviction, expérience, réalisation nommée ou fonctionnalité future n’a été ajoutée. Aucune figure n’est demandée par les décisions applicables : leur absence n’est pas un défaut.

La Capture autorise explicitement à rapprocher, déplacer ou condenser les éléments. Elle ne contraint donc pas à conserver la succession actuelle des paragraphes.

## Amélioration éditoriale non bloquante

En anglais, « force me to make precise what looked straightforward on paper » est compréhensible mais peu naturel. Employer le vocabulaire usuel de clarification d’une idée préserverait le sens. Cette réserve locale est indépendante du défaut global de progression.

## Contrôles exécutés et limites de préparation

Sur un checkout propre de 389c0d3 :

- Identité des blobs Git de chaque copie et de sa page canonique confirmée.
- Empreintes ci-dessus calculées avec les fonctions réelles `readMarkdown`, `normalize` et `sha256` du dépôt. Elles sont calculées séparément car prepare ne peut pas générer son frontmatter sur ces fichiers.
- `npm ci --ignore-scripts --no-audit --no-fund` exécuté.
- `npm run typecheck` : PASS.
- `npm run test:publication` : 33/33 PASS.
- `npm run publication -- prepare src/drafts/pages/fr/about.md src/drafts/pages/en/about.md src/pages/about.md i18n/en/docusaurus-plugin-content-pages/about.md` : échec, `Page candidates must be drafts: src/drafts/pages/fr/about.md`.
- Contrôle des liens par requêtes HTTP et relecture des sources officielles ci-dessous.

Environnement : Node 24.22.3 et npm 11.9.0. Le projet demande Node >=26 ; les contrôles exécutés ne constituent donc pas une validation dans l’environnement cible. Le refus de draft est une exigence explicite du code, pas un échec dû à cette différence de version.

Le frontmatter consigne les identités calculables, le mode revision et la baseline réelle. Il n’a pas été généré avec succès par prepare et ne doit pas être présenté comme un sceau techniquement validé. Le résultat de `publication check` après enregistrement est consigné dans la restitution de cette revue. Les candidats, les pages publiques et la Capture restent inchangés.

## Sources vérifiées

- [Module GoatCounter au commit examiné](https://github.com/jpbourgeon/blog/blob/389c0d3fc5e05c9dab9a7812bc900693b5b314de/src/client/goatcounter.ts) et [script chargé](https://gc.zgo.at/count.js).
- [Documentation de confidentialité GoatCounter](https://www.goatcounter.com/help/privacy) : agrégation, options de collecte et traitement temporaire de l’IP et du navigateur ; paramètres du compte attribués à l’auteur.
- [Confidentialité GitHub](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) et [adresse GitHub](https://docs.github.com/en/site-policy/content-removal-policies/guide-to-submitting-a-dmca-takedown-notice).
- [Licences et exceptions](https://github.com/jpbourgeon/blog/blob/389c0d3fc5e05c9dab9a7812bc900693b5b314de/LICENSE-ADDITIONAL.md), standards et Capture identifiés dans le frontmatter.

Human editorial approval: not granted by this report
