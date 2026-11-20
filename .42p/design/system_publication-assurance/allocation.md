# Allocation — system_publication-assurance

## Source et portée

- **Capture courante :** [rationale.md](rationale.md), Git blob `5f9b84ac2d9a4928066988483e952a531be60a1c` (PR #29, branche `docs/capture-system-publication-assurance`).
- **Référence de comparaison :** `main` au commit `ff59bf3d390db618c7ce1bc9e9547a87e4585c02` ; [workflow Pages](../../../.github/workflows/pages.yml), [scripts de publication](../../../scripts/publication/), [instructions](../../../AGENTS.md) et [skill de publication](../../.agents/skills/editorial-publish/SKILL.md).
- **Portée :** première allocation complète de cette Capture ; répartit les responsabilités sans implémenter ni attester les garanties. Les capacités éditoriales déjà présentes restent en place.

## Unités de responsabilité

| ID | Responsabilité | Attribution dans la Capture | Frontière et dépendances |
| --- | --- | --- | --- |
| **A1 — Visibilité des changements** | Rendre inspectable l'ensemble des changements publics proposés à l'autorisation avant déploiement. | « Modèle adopté » §3 (Publish, autorisation) et « Périmètre de réalisation » (relevé exhaustif, y compris code et ressources statiques). | Complète le relevé produit à partir du dernier déploiement et du SHA cible. Préserve le gate éditorial existant : le relevé n'attribue pas de PASS aux changements techniques et ne remplace pas l'accord humain. Fournit la base d'identification des changements affectant le préflight A2. |
| **A2 — Préflight du site généré** | Contrôler avant exposition la qualité technique de l'artefact destiné à GitHub Pages. | « Modèle adopté » §4 (Preflight), « Chaîne cible », exclusion du smoke post-déploiement et « Périmètre de réalisation » (Lighthouse local). | Intervient après build Docusaurus/Pagefind et avant déploiement, sur les pages FR/EN ciblées ; conserve la distinction entre exécution/contrôles essentiels bloquants et scores diagnostiques. Ne crée ni contrôle HTTP post-déploiement ni plateforme de monitoring. Dépend de l'artefact construit et de l'identification des pages affectées (A1 lorsque pertinente). |
| **A3 — Couverture de régression minimale** | Conserver une preuve comportementale suffisante des garanties déterministes, en supprimant les doublons non utiles. | « Noyau de régression déterministe » en entier ; « Identité et objectif » (une vérification par risque), « Périmètre de réalisation » (rationalisation). | Porte les scénarios couvrant PASS, intégrité FR/EN, révisions, exposition, retraits, Pagefind, déclenchement et SHA, ainsi que la projection Markdown/MDX sans perte. Ne transforme ni contrôle humain ni jugement éditorial en assertion. Vérifie les mécanismes A1/A2 dans la seule mesure où leur défaillance crée un risque distinct ; ne prescrit pas un nombre cible de tests. |

**Alignement documentaire transversal :** les unités concernées mettent à jour les seules instructions correspondantes dans `AGENTS.md`, `README.md` et `editorial-publish`. Cette synchronisation ne justifie pas une quatrième responsabilité. Les opérations `prepare`/`check`/`project`, les PASS, Pagefind, le build bilingue, les règles de retrait et le déploiement manuel restent des contrats à préserver, non des chantiers à recréer.

## Correspondance inverse : Capture → Allocation

| Matière examinée | Attribution ou traitement |
| --- | --- |
| « Identité et objectif » (qualité professionnelle, 80/20, frontières et non-duplication) | Contrainte commune A1–A3 ; justification du découpage, pas de responsabilité supplémentaire. |
| « Modèle adopté » §1, Verify | Garantie existante conservée ; A3 protège la validité déterministe des attestations, sans modifier la revue indépendante. |
| « Modèle adopté » §2, Promote | Garantie existante conservée ; A3 couvre les empreintes et la projection FR/EN sans perte. |
| « Modèle adopté » §3, Publish | A1 (relevé et autorisation informée), A3 (gate, SHA et absence de déploiement automatique) ; maintien des mécanismes existants. |
| « Modèle adopté » §4, Preflight | A2 ; la distinction contrôles bloquants/scores diagnostiques y est conservée. |
| « Chaîne cible » | A1 et A3 avant exposition, A2 entre build et deploy ; enchaînement global à préserver, sans orchestrateur distinct. |
| Explore, Capture, Plan et Write sans gate obligatoire | Exclusion transverse pour A1–A3 ; aucune réalisation à créer. |
| Absence de smoke post-déploiement ; retour `actions/deploy-pages` | Frontière négative d'A2 ; aucune unité post-publication. |
| « Noyau de régression déterministe » (sept défaillances, transformation MDX, rationalisation) | A3, intégralement ; les tests d'A1/A2 nécessaires à la preuve de leurs contrôles relèvent aussi d'A3. |
| Distinction entre tests de régression, gates, revue et consentement | A1–A3 selon leurs frontières ; aucune tentative de preuve automatique de l'autorité humaine. |
| « Périmètre de réalisation » — relevé, rationalisation, Lighthouse | Respectivement A1, A3, A2. |
| « Périmètre de réalisation » — documentation et invariants préservés | Mise en cohérence locale par A1–A3 ; interdictions et contrats transversaux, sans unité dédiée. |
| « Sources et état » | Provenance et état de conception ; aucun chantier autonome. |

## Contrôle de couverture et état

- **Capture → Allocation :** chaque obligation et chaque exclusion du modèle consolidé possède une attribution ou un traitement explicite.
- **Allocation → Capture :** les trois responsabilités sont rattachées à des passages précis ; aucun nouveau critère de qualité ni mécanisme d'autorité n'est institué.
- **État observé :** `gate.mts` classe les changements éditoriaux mais pas l'ensemble des fichiers publics ; `pages.yml` construit avant déploiement, sans Lighthouse ; la suite de tests existe, sans rationalisation selon le nouveau noyau.
- **Limite :** allocation de responsabilités seulement ; ni implémentation, ni test exécuté, ni vérification de conformité du site. La sélection concrète des URL de préflight et des contrôles essentiels relève de la réalisation dans le cadre des choix déjà adoptés.
