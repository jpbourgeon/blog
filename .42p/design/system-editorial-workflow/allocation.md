# Allocation — system-editorial-workflow

## Source et portée

- **Capture courante :** [rationale.md](rationale.md).
- **Source de l’allocation initiale :** `.42p/rationale-units/system-editorial-workflow/capture.md`, Git blob `2a4ffcd737b178a3f9fd87bea3e82041c797c7e2`, commit `c3b4409090e4af426d344be5bcba463c9dc39350` (branche `docs/capture-system-editorial-workflow`).
- **Portée :** allocation complète du workflow, de l'organisation cible et de l'alignement du canon ; aucun contenu éditorial ni déploiement à réaliser dans cette opération.
- **Statut :** la présente Allocation répartit les responsabilités. La Capture reste la source des exigences et de leurs modalités. Les commits de la PR portent la réalisation.

## Unités de responsabilité

| ID | Responsabilité | Attributions qualifiées dans la Capture | Frontière et dépendances |
| --- | --- | --- | --- |
| **A1 — Orchestration** | Aligner les instructions générales du dépôt sur le cycle éditorial cible. | « Workflow cible » §1–2 (exploration libre, Capture facultative et transversale), §6 (séquence non imposée) ; **R-frontières**, **C-autorité**, **C-frugalité**, **C-publication** ; « Alignement du canon » (AGENTS/README). | Porte les règles de navigation entre étapes et l'autorité humaine, sans créer de gate ni modifier les règles de publication. Reflète les responsabilités A2–A7 après leur définition. |
| **A2 — Exploration éditoriale** | Fournir la capacité de recherche et d'exploration critique sans réalisation ni institution. | « Workflow cible » §3 ; **R-fondation** (séparer élaboration et rédaction), **R-frontières** (Explore), **C-autorité**, **C-preuves**, **C-frugalité** ; « Alignement du canon » (création d'`editorial-explore`). | N'écrit ni candidat ni plan imposé ; peut alimenter la Capture par arbitrage de l'auteur (A1), sans dépendance à la CLI OpenSpec. |
| **A3 — Planification éditoriale** | Fournir l'échafaudage détaillé, facultatif, révisable et contraignant lorsqu'il est retenu. | « Workflow cible » §4 ; **R-frontières** (Plan), **C-autorité**, **C-fidélité**, **C-preuves**, **C-frugalité**, **C-révision** ; « Organisation du canon cible » (`plan.md`, `plan.revision.md`) ; « Alignement du canon » (création d'`editorial-plan`). | Livre la composition sans prose finale, ni décision de fond à la place de l'auteur ; s'appuie sur l'emplacement des artefacts défini par A6. Un plan n'est pas requis pour A4 ou A5. |
| **A4 — Rédaction** | Recentrer `editorial-write` sur l'expression et les candidats bilingues. | « Workflow cible » §5, et §4 pour le plan éventuel ; **R-frontières** (Write), **C-autorité**, **C-fidélité**, **C-preuves**, **C-révision** ; « Alignement du canon » (recentrage). | Respecte le plan adopté s'il existe ; les changements substantiels repartent à l'arbitrage et à la réconciliation appropriée. Les ajustements rédactionnels non substantiels restent libres. Dépend des conventions de référence d'A3 et A6 lorsqu'elles s'appliquent. |
| **A5 — Vérification éditoriale** | Adapter `editorial-verify` pour examiner la réalisation du plan éventuel sans en faire une condition du PASS. | « Workflow cible » §6 et §4 (plan facultatif) ; **R-frontières** (Verify), **C-autorité**, **C-fidélité**, **C-preuves**, **C-frugalité**, **C-révision** ; « Alignement du canon » (examen du plan dans le corps du rapport). | Contrôle indépendant des candidats FR/EN, des sources, de la voix et de la composition ; ne décide ni de l'intérêt de publier ni de l'approbation. Ne crée pas de référence normative au plan dans le PASS ; coordonnées des rapports selon A6/A7. |
| **A6 — Organisation et migration des artefacts** | Établir l'organisation par identité `.42p/design/<slug>/` et migrer les fichiers et liens existants. | **R-colocalisation** et totalité de « Organisation du canon cible » (noms, présence facultative, identifiants, statuts et transitions des fichiers) ; **C-révision** (séparation des variantes, historique Git) ; « Alignement du canon » (migration des Captures, rapports, frontmatters et références). | Déplace/reconnecte les artefacts sans changer leur sens ni inventer de nouveaux états. Migration et adaptations techniques A7 doivent aboutir dans un même état cohérent, sans perdre la provenance ni les PASS. |
| **A7 — Compatibilité des garanties de publication** | Adapter les contrats de chemins et les tests de publication au nouvel emplacement. | « Alignement du canon » (`content.mts`, `review.mts`, `gate.mts`, tests, préservation des PASS) ; **C-frugalité** (pas de plan dans l'identité technique du PASS) ; **C-révision**, **C-publication**, **R-colocalisation** (rapports regroupés). | Maintient les identités de contenu, les vérifications exactes, l'historique et les conditions de promotion/retrait. Ne modifie pas le principe d'`editorial-publish` ni le déclenchement manuel des déploiements. Réalisation coordonnée avec A6 ; validation technique sur nouveaux contenus et révisions. |

Les contraintes transversales de **R-fondation**, **R-frontières**, **C-autorité**, **C-frugalité** et **C-publication** s'appliquent selon les contributions ci-dessus ; elles ne justifient pas chacune une unité supplémentaire.

## Correspondance inverse : Capture → Allocation

| Matière examinée | Attribution ou traitement |
| --- | --- |
| Identité, intention ; **R-fondation** | A1 (cycle), A2–A5 (séparation des responsabilités) ; justification, pas d'unité autonome. |
| « Workflow cible » §1 (exploration libre) | A1 ; absence de skill dédié intentionnelle. |
| « Workflow cible » §2 (Capture et deltas) | A1 ; `42p-capture` existant conservé, sans changement fonctionnel. |
| « Workflow cible » §3 (Explore) | A2 (capacité), A1 (orientation). |
| « Workflow cible » §4 (Plan) | A3 (composition et révisions), A4 (respect), A5 (examen facultatif), A6 (stockage). |
| « Workflow cible » §5 (Write) | A4 ; A1 pour le retour aux arbitrages. |
| « Workflow cible » §6 (Verify) | A5 (contrôle), A7 (compatibilité des rapports). |
| **R-frontières** | A1 (transversalité et retours), A2–A5 (frontières respectives). |
| **C-autorité** | A1–A5 ; A7 préserve la séparation PASS / décision de publier. |
| **C-fidélité** | A3 (plan articulé), A4 (respect ou composition sans plan), A5 (évaluation). |
| **C-preuves** | A2 (recherche), A3 (sources dans le plan), A4 (affirmations), A5 (contrôle). |
| **C-frugalité** | A1–A5 (pas d'obligation ou de gate), A7 (pas de liaison technique du plan au PASS). |
| **C-révision** | A3 (plan initial/révision), A4–A5 (candidats/révues), A6 (fichiers et Git), A7 (transitions garanties). |
| **C-publication** | A1 (autorité et cycle), A5 (pas d'approbation), A7 (gates et déploiement inchangés). |
| **R-colocalisation** ; « Organisation du canon cible » (arborescence, identifiants, présence et rôle des fichiers) | A6 (organisation, migration), A3 (plans), A5 (rapports), A7 (contrats techniques). Le dossier d'unité système est couvert par A6. |
| « Alignement du canon à réaliser » — skills, instructions, migration, tests | A2–A5 (skills), A1 (AGENTS/README), A6 (artefacts/liens), A7 (scripts, tests, maintien des garanties). |
| « Sources et statut » | Provenance et état de travail ; aucun chantier distinct. Les sources restent accessibles via la Capture, les décisions validées sont allouées. |

## Contrôle de couverture

- **Capture → Allocation :** toutes les étapes, critères, rationales, règles de cycle et de révision, organisation cible et opérations d'alignement disposent d'une attribution qualifiée ou d'un traitement contextuel explicite. Aucun élément matériel non attribué identifié.
- **Allocation → Capture :** chacune des sept responsabilités, ses frontières et ses dépendances correspondent à des passages identifiés de la Capture. Aucun besoin fonctionnel ajouté.
- **Chevauchement explicite :** A3 produit le plan ; A4 le suit ; A5 en vérifie la réalisation si présent. A6 migre les artefacts ; A7 rend leurs références vérifiables et préserve la chaîne de publication. Ces partages sont des contributions distinctes.
- **Limite :** cette revue établit la couverture des *responsabilités allouées*, pas leur réalisation, la réussite des tests ni la validité d'une future migration.
