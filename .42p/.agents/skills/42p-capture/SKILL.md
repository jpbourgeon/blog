---
name: 42p-capture
description: Maintain a compact, reconciled, non-authoritative working projection of the current design state for one change. Use when the user asks to create or update a Capture from exploration or source material, or explicitly invokes the Capture skill.
---

skill 42p-capture

Purpose
Maintain, for one change, the smallest persistent, reconciled, non-authoritative projection of the current design state that is sufficient for a fresh context to resume and revise the work correctly.
A Capture is a current working set, not an archive, transcript, changelog, decision authority, OpenSpec workflow state, or exhaustive knowledge base.
Do not infer an OpenSpec stage unless the available material explicitly establishes it.
Bind and acquire
Resolve the target change from explicit identity, purpose, scope, and continuity of work. Semantic or lexical similarity alone is insufficient.
A source may contribute to several changes. Project only the contribution relevant to the target change.
If the target is unambiguous, proceed without asking. Ask the user only when a materially relevant ambiguity cannot be resolved legitimately, especially change identity, substantial scope/purpose drift, an unestablished split or merge, unresolved authority precedence, or another sovereign choice.
Acquire any available material that may affect the target state. Overlap with prior passes is allowed. Correctness must not depend on knowing exactly what was previously processed.
Do not infer deletion, retraction, refutation, or supersession from absence in the current input.
Do not claim exact message, byte, document, or corpus coverage unless a separate operational mechanism actually proves it.
Treat the existing Capture as current state input, never as independent evidence.
Treat prior CAPTURE-generated assistant messages, receipts, summaries, or questions as operational output, never as evidence. Assistant-authored material becomes a derived source only when the user explicitly supplies or designates it as such. A user's answer to a human gate may constitute new source material.
Adoption discipline
Do not promote a model-originated proposal, option, implementation choice, interpretation, or conclusion to established current state merely because the user continued the discussion, did not object, or asked to continue.
Treat it as established only when at least one of these holds:
the user explicitly adopts or confirms it;
it follows necessarily from already established material;
independent source evidence establishes it within the relevant scope.
Otherwise, if it remains material, preserve its provisional or model-proposed status. If it is no longer material, omit it rather than silently promoting it.
User silence is not adoption.
Represent only material state
Use natural language with stable visible handles when persistent identity is materially useful:
"Q-" — question
"O-" — option
"C-" — criterion or constraint
"R-" — rationale proposition
"S-" — source
Handles are unique within the change, short, mnemonic, untranslated, and stable while conceptual identity persists. Never encode mutable status in a handle. Never rename a handle for style.
Do not create handles for transient statements that need no future reference, revision, provenance, or dependency tracking.
Conceptual identity is independent of wording: different wording may denote the same element; identical wording may denote different elements. A material change of scope, modality, purpose, or meaning is a revision even when vocabulary remains similar.
Preserve separately when material:
epistemic state;
design/work state;
authority.
Never collapse relevance, admissibility, and current orientation into one status.
A technically competent source is not automatically a design authority. Evidence does not institute a decision. Capture itself has no authority.
Reconcile
Reconcile acquired material against the current state. Prefer the smallest semantic change consistent with the available material.
New material may leave an element unchanged, add information, refine it, revise it, contest it, supersede it, reopen dependent work, or make old material non-material. These are internal effects, not required Capture primitives.
Never resolve contradiction by arrival order, recency alone, wording strength, document length, apparent majority, or model preference.
Use scope, provenance, source competence, authority where established, revision/supersession relations, and material dependencies.
Distinguish when material:
unknown or absent information;
ambiguity or underdetermination;
genuine conflict;
resolved state.
Do not close by silence.
When an element materially changes, reconsider only the elements that depend on it. Propagate the need to reconsider, not the verdict itself. Stop propagation when the dependency no longer carries the change.
Dependencies themselves may be revised or removed.
Granularity does not imply dependency. An open subquestion does not automatically reopen its parent; a resolved parent does not automatically resolve its subquestions. Propagate between levels only through a material dependency.
Preserve material trade-offs explaining why an orientation currently holds and what would require its reconsideration.
Preserve materially relevant alternatives even when they are not selected or currently admissible. Do not equate “not selected” with “refuted”.
Preserve material boundaries
Preserve an established distinction or boundary whenever losing it could change how a fresh context answers a materially plausible question or revises future state.
This especially includes boundaries such as:
reversible vs irreversible;
active vs archived;
before vs after Institution;
permitted vs prohibited under a condition;
technical convergence vs authoritative Institution;
current orientation vs merely relevant alternative.
A boundary may remain material even when it is a derived conclusion rather than a separately named "Q-", "O-", "C-", or "R-".
Do not compress two states or operations into one when their distinction changes lifecycle behavior, authority, admissibility, or future revision.
Sources and provenance
Give a source an "S-" handle when its identity is materially useful.
Keep enough provenance to retrieve, verify, reinterpret, or distinguish the source when future revision may depend on it.
A source handle is not its locator. One source may have multiple locators or representations.
Do not count copies, common ancestry, or derived summaries as independent corroboration.
Distinguish primary and derived material when that distinction affects reasoning.
If a source becomes inaccessible, preserve the known provenance and the access limitation. Do not reconstruct missing content by plausibility.
Currentness and passage conditions
Capture represents current state, not accumulated history.
Keep historical matter only while it remains necessary to explain the current state, preserve a material alternative, support provenance, disambiguate revision, preserve a material boundary, or enable foreseeable reconsideration.
Passage conditions are current readiness conditions for a materially forthcoming commitment. They are not general lifecycle rules, operation preconditions, or a restatement of the model.
Preserve a passage condition only when prior work has explicitly established that its resolution materially governs such a forthcoming commitment.
Do not make every open question a blocker. Do not duplicate stable lifecycle invariants or ordinary operation preconditions as passage conditions.
Recalculate passage conditions whenever relevant state changes. A condition may remain, be satisfied, become irrelevant, be reformulated, or be replaced by a deeper condition.
Name a target such as “before Propose” only when that target commitment is itself established.
If no current readiness condition meets this threshold, omit the passage-conditions section.
Do not preserve completed conditions as a checklist history.
Confluence and replay
Reingesting equivalent material must not create new semantic state.
For equivalent relevant source matter and relations, aim for equivalent current state regardless of arrival order, repeated ingestion, division into multiple passes, corpus partitioning, or parallel branches.
Temporal, causal, revision, and authority relations present in the sources still matter; ingestion order does not replace them.
Never merge branch Captures by concatenating or text-merging their projections. Reconcile their semantic matter and provenance, factoring common ancestry rather than double-counting it.
Project
Project the reconciled state as compact Markdown, primarily in natural language.
A preferred presentation is:

1. change identity, purpose, and scope;

2. material criteria/constraints;

3. material questions with relevant options, rationale, dependencies, trade-offs, and material lifecycle boundaries;

4. current passage conditions, if any;

5. material sources.

This order is editorial, not semantic.
Use handles naturally in prose for material relations. Do not introduce a graph DSL merely to encode relations.
Preserve unaffected text and handles as far as reasonably possible. Rewrite only material impact closure.
Compression must not strengthen, weaken, broaden, or narrow meaning. Preserve material scope, modality, temporality, epistemic qualification, authority, ambiguity, dependency, and lifecycle boundaries.
Never silently transform, for example:
"possible → established"
"provisional → decided"
"model-proposed → adopted"
"not selected → refuted"
"reported → verified"
"relevant → admissible"
"admissible → selected"
"decision → preference"
Compact material that is no longer needed for correct resumption or revision. Persistent identity does not imply permanent retention.
Expose only as much rationale and provenance as correct resumption and foreseeable revision require.
Check before completion
Before completing CAPTURE, verify that:
the target change is sufficiently unambiguous;
handles are unique, stable, and all internal references resolve;
projection does not strengthen or weaken the reconciled state;
model-originated proposals were not promoted by silence or mere continuation;
material scope, ambiguity, conflict, trade-offs, dependencies, provenance, authority, and lifecycle boundaries survived;
affected dependents were reconsidered and obsolete dependencies removed;
any passage conditions are genuine current readiness conditions, not duplicated lifecycle rules or operation preconditions;
no unrelated change material entered the projection;
no inaccessible or absent source was treated as negative evidence;
no Capture or CAPTURE-generated output corroborates itself;
the amount of rewritten text is proportionate to the semantic change;
the result remains compact enough for practical fresh-context resumption.
Ask, in particular:
«Could a fresh context now answer a materially plausible lifecycle, reversibility, authority, or readiness question differently because a distinction established in the source material was compressed away?»
If yes, restore the smallest sufficient distinction.
Passing these checks certifies only consistency with the Capture contract. It does not certify truth, design quality, or authority.
Human gates
Do not ask the user to perform ordinary reconciliation.
Resolve what the sources legitimately determine. Preserve representable unresolved ambiguity or conflict without interrupting.
Ask one focused question only when correct continuation requires a materially discriminating human decision that cannot legitimately be derived, including unresolved change identity, substantial purpose/scope continuity, unestablished split/merge, unresolved authority precedence, or another explicitly sovereign choice.
State only the irreducible issue and the alternatives needed to decide it.
After the user answers, treat the answer according to its actual semantic and authority role; do not automatically elevate every answer into a permanent rule.
Chat output
The persistent Capture is the semantic output. The chat response is only an operational receipt.
On successful creation or update, respond briefly with:
Capture identity;
"created", "updated", or "unchanged";
optionally the few materially affected handles or the nature of the reconciliation.
Do not automatically restate, summarize, or duplicate the Capture in chat.
If a human gate is required, output the focused gate question instead of a synthetic resolution.
Never use CAPTURE's own chat output as evidence in a later CAPTURE invocation
