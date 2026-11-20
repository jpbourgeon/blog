# ChatGPT Work — Application itérative des allocations éditoriales

**Cible :** dépôt `jpbourgeon/blog`, **PR #27**, branche `docs/capture-system-editorial-workflow`. Modifier uniquement cette branche. Ne pas créer de PR de remplacement, fusionner, publier, déployer ni exposer de prévisualisation.

## Références et autorité

Avant toute modification, lire l'état réel de la PR, son commit de tête, le diff, `AGENTS.md`, les skills, standards, scripts et tests concernés, puis intégralement la Capture et l'Allocation de `system-editorial-workflow`. Dans l'état migré, ouvrir [rationale.md](rationale.md) et [allocation.md](allocation.md) dans ce dossier. Pour reprendre un état antérieur, retrouver ces sources dans `.42p/rationale-units/system-editorial-workflow/{capture,allocation}.md`. Vérifier la cohérence de leur provenance, des références et des unités avec l'état de la branche avant de commencer.

La Capture projette les arbitrages de l'auteur ; l'Allocation répartit les responsabilités sans créer de nouvelles exigences. Les règles d'autorité, de vérification, d'intégrité et de publication du dépôt s'appliquent. Ne pas résoudre par préférence d'agent une contradiction matérielle que les décisions de l'auteur ne permettent pas de trancher.

## Boucle d'exécution

Traiter **A1 à A7**, dans l'ordre indiqué par l'Allocation, sauf dépendance réelle imposant un ordre différent. Ne pas demander de validation intermédiaire pour les opérations déjà autorisées et entièrement déterminées.

Pour chaque unité encore à réaliser :

1. **Délimiter.** Lire ses attributions qualifiées dans la Capture et ses dépendances. Identifier les obligations, exclusions, fichiers touchés et impacts nécessaires sur le canon. Distinguer ce qui existe déjà de ce qui reste à faire.
2. **Appliquer.** Produire le changement minimal, strictement borné à la responsabilité allouée et à ses dépendances indispensables. Réconcilier les doublons, contradictions et règles périmées dans le sens du workflow décidé : remplacer les prescriptions concurrentes, sans ajouter une couche contradictoire. Ne pas introduire de comportement, exigence, gate ou complexité non prévus.
3. **Vérifier.** Examiner le diff réel et effectuer les contrôles ciblés et les régressions pertinentes. Contrôler **sémantiquement dans les deux sens** :
   - **Capture → réalisation :** toutes les obligations et frontières attribuées à l'unité sont couvertes, avec leurs conditions, exceptions, dépendances et caractères facultatifs ; aucune omission ni dégradation.
   - **Réalisation → Capture :** chaque changement matériel est fondé sur une attribution identifiée ; aucun ajout non autorisé, contradiction résiduelle, duplication normative ou altération hors périmètre.

   Vérifier également les interactions avec les unités déjà réalisées et les garanties préexistantes. Appuyer le verdict sur les fichiers, passages et résultats de tests réellement observés ; des tests verts ne suffisent pas, à eux seuls, à démontrer la fidélité du fond.
4. **Corriger ou interrompre.** En cas d'anomalie, de test en échec, de couverture incomplète ou de preuve insuffisante, rechercher la cause, corriger dans le périmètre autorisé, puis revérifier. Si la résolution exige un arbitrage de l'auteur, une extension substantielle non autorisée ou demeure impossible, déclarer **BLOCKED**, interrompre immédiatement la boucle et poser la question minimale nécessaire, avec les alternatives pertinentes. Ne jamais poursuivre avec un FAIL, un INCONCLUSIVE ou un PASS supposé.
5. **Consolider et continuer.** Uniquement après **PASS**, enregistrer un commit cohérent sur la branche de la PR, sans écraser les modifications concurrentes. Associer au bilan de l'unité ses attributions et preuves de vérification. Passer directement à la suivante.

**Unités interdépendantes :** si deux responsabilités ne peuvent produire séparément un état valide du dépôt, notamment **A6 (migration)** et **A7 (compatibilité de publication)**, les réaliser comme une transaction d'intégration atomique et explicitement justifiée. Conserver les contrôles de couverture propres à chacune, tester conjointement et ne déclarer leur PASS qu'après validation de l'état complet. Ne pas commiter ni qualifier de PASS un état intermédiaire cassé.

## Vérification finale

Quand toutes les allocations ont un PASS, relire la Capture et l'Allocation **dans leur état courant**, puis vérifier l'ensemble du diff, des responsabilités et de leurs dépendances.

Contrôler la couverture bidirectionnelle globale, l'absence de prescriptions concurrentes dans les skills, instructions, standards, chemins, frontmatters, scripts et tests, ainsi que la préservation des invariants : exploration libre, Capture et plan facultatifs, plan contraignant lorsqu'il est adopté mais sans autorité propre, rédaction possible sans plan, voix FR/EN, sources vérifiables, vérification indépendante, PASS historiques, provenance, contrôle humain de publication et déploiement manuel.

Exécuter les vérifications complètes adaptées au dépôt (`npm run typecheck`, `npm run test:publication`, `npm run publication -- gate none`, `npm run build`, si applicables). Corriger toute anomalie détectée et répéter les contrôles affectés. Si la validation globale reste impossible, conclure **BLOCKED**, jamais PASS.

## Communication avec l'auteur

Rédiger les messages destinés à l'utilisateur **en français, pour sa compréhension** ; rédiger les textes destinés aux agents **pour leur exécution efficace et sans ambiguïté**. Ne pas surargumenter.

Après chaque unité terminée, communiquer brièvement : `A# — PASS — modification essentielle — preuve de vérification`. En cas de blocage, expliquer l'obstacle précis et la décision nécessaire, puis s'arrêter.

À la fin, fournir un tableau compact des sept unités, avec verdict, changements/commits et preuves, puis le résultat de couverture globale et les limites éventuelles. Distinguer clairement **appliqué, testé, commité, revu, fusionné et publié**. Ne jamais revendiquer une revue indépendante, une fusion ou une publication non effectuée.
