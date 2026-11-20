---
name: 42p-allocate
description: Create or reconcile a compact Capture-derived Allocation of responsibilities, incrementally or across the full design. Use when the user asks to allocate captured design, reconcile existing allocation units after Capture revisions, or examine bidirectional Capture/Allocation coverage. Support read-only proposals without implementing or verifying realization.
---

# 42p-allocate

Follow the host repository's authority, lifecycle, editorial and validation rules; report integration conflicts rather than silently changing those rules.

## Purpose and authority

Maintain the smallest Allocation sufficient to identify who takes responsibility for each material part of the captured design and to resume its realization correctly. Allocate responsibility without recreating its specification.

Treat instituted sources and decisions as design authority, Captures as reconciled working projections, and Allocation as a derived responsibility mapping. Treat existing Allocations and prior operational receipts as comparison state, never independent corroboration. Do not introduce product requirements, select an implementation architecture, resolve unsettled design, or infer successful realization through allocation.

## Bind and acquire

Resolve the target design, current Captures, existing Allocation, relevant repository rules, authorized scope and intended operation: first allocation, incremental reconciliation, full review, or read-only proposal. Read actual current artifacts; do not reconstruct them from memory or assume fixed filenames, versions, unit counts or completion status.

Identify each input by retrievable locator and immutable revision or content fingerprint. Acquire the complete relevant Capture contents, including material relationships, boundary prose and source/supersession context outside handles. Use historical snapshots for comparison where available. Missing comparison inputs limit the change analysis; absence from a newly supplied fragment does not establish deletion or supersession.

For existing units, inspect relevant downstream realization contracts and historical coverage/evidence when necessary to identify impacts. Distinguish active contracts from archived Changes and identity-bound historical evidence. Do not require every downstream artifact to exist before responsibility can be allocated; disclose limits where an impact cannot be assessed.

Read-only operation permits examination and conversational proposals only: do not write reports, alter artifacts, update fingerprints, run write-producing workflows, commit or publish. For authorized writes, change only the named Allocation scope and follow host validation rules. A request for a proposal is not adoption of its proposed allocations or authorization to implement them.

## Establish qualified responsibility references

Give each unit a stable identifier and a short human-recognizable purpose. Define a responsibility boundary rather than a required file, workflow, library, API or component. Preserve existing identities while their responsibility remains materially continuous; do not rename or repartition for style.

Reference each contributing element by Capture identity, scope-local handle or precise retrievable passage. Qualify the attributed portion when an element contains several responsibilities. Use the shortest locator and qualification that distinguish the portion; read the source for its full modalities, conditions, exclusions and exceptions. Do not copy or paraphrase detailed requirements into a competing specification. Do not invent new Capture handles to remedy inadequate upstream granularity.

For example, a compound source/integrity/reproduction criterion can contribute acquisition and integrity to one unit, toolchain and build reproduction to another, and verification of the complete path to a third. Keep those qualifications as attribution selectors, not restated requirements.

Permit several units to contribute to the same obligation when their roles are distinct and explicit, such as production, verification and publication control. Identify which contribution each owns, what it receives or supplies, and where its responsibility stops. Do not impose one owner per handle or treat every repeated reference as duplication. Detect ambiguous overlap, missing contributions and conflicting boundaries.

Constrain existing boundaries through references to material cross-cutting prohibitions and lifecycle rules without creating an artificial implementation unit for each invariant. Carry dependencies only where their loss could affect correct realization or future reconciliation. Sharing a calculation or technical mechanism does not by itself establish a new responsibility unit or prescribe a component.

## Reconcile incrementally

Compare semantic content and relations, not only handles or fingerprints. Unchanged identifiers can carry revised obligations; changed bytes can be purely editorial. Preserve scope, modality, conditions, exceptions, uncertainty and lifecycle distinctions when identifying a change.

Start with affected matter, examine its allocation references, and follow material dependencies to the responsibilities they affect. Reconsider affected downstream assumptions without propagating a conformity verdict. Stop propagation where the dependency no longer carries the change. Preserve unaffected identities, boundaries and text where reasonably possible.

- For additions, attribute the obligation to an existing suitable boundary or propose a distinct unit with a responsibility-based justification.
- For revisions under an existing handle, re-evaluate each attributed portion and its dependents; identifier continuity is not proof of continued coverage.
- For established removal or supersession, remove obsolete current attributions and examine responsibilities left without grounding. Preserve historical records and their original snapshots.
- For equivalent contributions from several Captures, relate them without counting copied or overlapping design as independent obligations or corroboration. Retain distinct contributions where they matter.
- For unit splits or merges, explain the changed responsibility boundary and preserve retrievable correspondence with former identities. Do not reassign historical Changes retroactively or assume structural proposals are adopted.
- For editorial-only changes, refresh authorized snapshot references without manufacturing a new responsibility or realization requirement.

Use established scope, provenance, authority and explicit revision relations to interpret current design. Do not settle a Capture conflict by recency, textual majority or model preference. Refer unresolved design conflicts or missing authority upstream; keep the affected mapping unresolved rather than inventing a synthesis.

Report material impacts outside the authorized scope without editing them. Do not silently narrow the examined dependency field to the permitted write set.

For a previously realized unit, distinguish its current attributed obligations, the contract realized at its historical snapshot, and evidence applicable to that snapshot. Identify active contract discrepancies or evidence applicability needing reassessment. Do not rewrite archives, invalidate all historical evidence indiscriminately, certify current conformity from past checks, or implement corrective work. Let the host lifecycle govern subsequent realization and Verification.

Reprocessing equivalent relevant inputs and relations must not create new responsibilities, duplicate units or cause cosmetic repartitioning. Aim for an equivalent mapping whether relevant material is acquired in one pass or several; retain materially causal and authoritative revision relations.

## Account for coverage in both directions

Examine the substance of every material captured element and relevant boundary, not its prefix alone. A rationale can contain an obligation; a criterion can describe a documentary operation rather than product realization. Preserve questions, alternatives, provenance and lifecycle conditions with their actual role; do not turn them into invented tasks or readiness gates.

Maintain a compact reverse mapping from each examined Capture element to its qualified unit contributions, contextual treatment, justified absence of current realization responsibility, or unresolved attribution. For a compound element, account for every material portion. Multiple portions can share a row only when their treatment remains inspectable.

Check both directions:

- Capture to Allocation: each current obligation requiring realization has all necessary responsibility contributions; other material elements have an explicit justified treatment.
- Allocation to Capture: each unit responsibility, boundary and material dependency is grounded in qualified current references, without added, strengthened, weakened or orphan obligations.

Resolve references and review their semantic correspondence. Handle, requirement and scenario counts help inventory the examined field; matching identifiers, valid links and fingerprints do not prove coverage. Do not multiply obligations because several projections repeat them.

Distinguish reconciliation of the affected field from completeness of the whole Allocation. Claim global bidirectional completeness only after examining the full current input set and every unit contribution, including material prose outside handles. State the actual scope, unresolved gaps and access limits. Do not carry forward a prior 100% claim after a relevant revision without renewed examination.

## Project and check

Keep the Allocation to three useful surfaces, adapted to the host format:

1. Exact input identities and examined reconciliation scope, with material limits.
2. Units containing a stable identifier, short purpose, qualified Capture references, necessary responsibility boundaries and material dependencies.
3. Reverse correspondence and justified treatment of the examined captured matter, without copying its specification.

Keep downstream impact findings distinguishable from allocation gaps and implementation verdicts. Put detailed realization requirements, scenarios and execution evidence in the host's realization and Verification artifacts. Do not add a second evidence checklist to every unit.

Before completion, check that input identities and qualified references resolve; assigned portions cover the examined matter; every unit contribution is grounded; repeated references have distinguishable roles; affected dependencies were reconsidered; obsolete current rules were replaced rather than juxtaposed; historical identities and records were preserved; and compression retained every material distinction needed to resume realization. Verify that consumers can retrieve the full attributed obligations through the references; report any host contract that assumes the unit text is a self-contained specification.

Ask whether a fresh context could assign, omit or implement a responsibility differently because a material distinction was compressed away. If so, restore the smallest sufficient qualification or boundary, preferably through a more precise source reference.

## Completion and human decisions

Resolve routine attribution from the established material without asking the user to perform reconciliation. Preserve representable uncertainty. Ask for a focused decision only when correct continuation requires an irreducible scope, authority or responsibility-structure choice not legitimately determined by current material or already authorized.

For a read-only proposal, present the proposed mapping, material discrepancies, downstream impacts and examination limits in the conversation; leave files unchanged. Distinguish source-established facts, proposed allocations and unresolved questions.

For an authorized update, return a short receipt identifying the Allocation, affected units, examined scope, coverage result and unresolved or out-of-scope impacts. Do not duplicate the Allocation in chat or claim realization, acceptance, merge or publication from documentary reconciliation.
