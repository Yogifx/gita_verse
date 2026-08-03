# Product Architecture

**Product:** GitaVerse  
**Document type:** Product & application architecture  
**Audience:** Engineering, design, AI, and product stakeholders  
**Scope:** How the product is organized — not how it looks  
**Status:** Ready for engineering planning

---

## 1. Product Overview

GitaVerse is an AI-powered creative workspace for producing **authentic educational content** grounded in the **Shrimad Bhagavad Gita**.

It is not a chat toy, not a generic LMS, and not a social feed. It is a **project-centric authoring environment** where educators, creators, and institutions build structured knowledge — lessons, explainers, study guides, scripts, and multimedia education plans — with AI assistance that respects scriptural context, pedagogical clarity, and editorial control.

### What the product delivers

| Capability | Description |
| --- | --- |
| Knowledge Projects | Durable containers for a course, series, or educational initiative |
| Creative Workspace | Editor-first environment for drafting, structuring, and refining content |
| AI Collaboration | Specialized agents that research, outline, draft, verify, and adapt tone |
| Gita Grounding | Content generation and review anchored to chapter/verse context |
| Publishing Readiness | Paths from draft → review → export/publish-ready artifacts |

### Primary users

- Independent educators and spiritual teachers
- Content creators producing Gita-aligned educational media
- Small teams / institutions building curricula or study programs
- Editors who need authenticity checks and structure at scale

### Core outcome

A creator can open a Knowledge Project, work with AI as a disciplined collaborator, and leave with **trustworthy, structured educational materials** — not unverified AI prose.

---

## 2. Product Philosophy

GitaVerse treats the Bhagavad Gita as a **source of truth and reverence**, and treats AI as a **skilled assistant under human authority**.

### Guiding beliefs

1. **Authenticity over speed.** Faster drafts are useless if they invent meaning. Grounding and review outrank volume.
2. **Projects over prompts.** Work lives in Knowledge Projects with durable structure, not disposable chat threads.
3. **Human final authority.** AI proposes; the creator decides, edits, and publishes.
4. **Teaching is the product.** Every feature should improve educational clarity, not just generate text.
5. **Calm craftsmanship.** The workspace should feel scholarly and focused — a studio, not a dashboard circus.
6. **Composable intelligence.** Multiple specialized agents beat one monolithic “do everything” model.

### What GitaVerse is not

- Not a verse memorization game as the primary product
- Not an ungrounded chatbot wrapped in spiritual branding
- Not a social network or engagement farm
- Not a replacement for traditional study, gurus, or scholarly commentary traditions
- Not a black-box generator that hides provenance

---

## 3. Core Principles

| Principle | Architectural implication |
| --- | --- |
| **Project-centricity** | All meaningful work belongs to a Knowledge Project. Cross-cutting features (search, agents, media) scope to project context by default. |
| **Source grounding** | AI outputs must be attachable to scripture references (chapter, verse, commentary notes) and reviewable. |
| **Separation of concerns** | Authoring, knowledge, AI orchestration, media, and publishing are distinct modules with clear boundaries. |
| **Editor as the center of gravity** | The creative workspace (rich text / structured documents) is the primary interaction surface. |
| **Agent specialization** | Agents have roles (research, outline, draft, authenticity, pedagogy, adaptation). They do not silently mutate project state without explicit apply flows. |
| **Deterministic product shell, probabilistic AI core** | Navigation, permissions, persistence, and workflows are deterministic. Generation is probabilistic and sandboxed behind review. |
| **Progressive disclosure** | Simple create → write → refine path first; advanced agent/orchestration features layer on without blocking basics. |
| **Auditability** | Important AI actions produce traces: prompts context, sources cited, acceptance/rejection. |
| **Token-driven UI consistency** | Presentation follows the design system; architecture does not encode visual decisions. |
| **Scalable modularity** | Features grow as modules under `src/features` with owned domains, not as page-level tangles. |

---

## 4. Application Modules

The application is organized into **product modules**. Each module owns a domain of capability. Modules may share infrastructure (auth, data access, design tokens) but must not reach into each other’s internals.

### 4.1 Shell & Navigation

**Purpose:** Global application chrome, routing shell, workspace framing, account entry points.  
**Owns:** App frame, primary nav model, theme application, session-aware layout boundaries.  
**Does not own:** Document content, agent logic, project domain rules.

### 4.2 Identity & Access

**Purpose:** Who the user is and what they may do.  
**Owns:** Authentication, session, roles (owner, editor, viewer — future), project membership.  
**Does not own:** Content editing or AI execution.

### 4.3 Knowledge Projects

**Purpose:** The primary product entity — lifecycle and organization of educational work.  
**Owns:** Project create/open/archive, metadata, structure (sections, documents, assets), project settings.  
**Does not own:** Low-level editor rendering or raw LLM calls.

### 4.4 Creative Workspace (Authoring)

**Purpose:** Where content is written and structured.  
**Owns:** Document model, editor integration (Tiptap), outlines, blocks, local draft state, versioning hooks.  
**Does not own:** Scripture corpus storage or agent orchestration internals.

### 4.5 Gita Knowledge Layer

**Purpose:** Canonical and reference knowledge used for grounding.  
**Owns:** Chapter/verse addressing, translations/commentaries references (as licensed), citation objects, lookup APIs.  
**Does not own:** User-generated lesson prose.

### 4.6 AI Agent Orchestration

**Purpose:** Coordinating specialized agents against project + document + scripture context.  
**Owns:** Agent registry, run lifecycle, tool permissions, apply/reject of suggestions, run history.  
**Does not own:** Final persisted document truth (that remains Authoring + Projects after user apply).

### 4.7 Media & Assets

**Purpose:** Images, audio, thumbnails, and educational media attached to projects.  
**Owns:** Upload, storage references, metadata, attachment to documents/projects.  
**Does not own:** Script generation logic.

### 4.8 Review & Authenticity

**Purpose:** Quality gates before content is considered publish-ready.  
**Owns:** Authenticity checks, citation coverage, pedagogical review checklists, review status.  
**Collaborates with:** AI Agents (authenticity/pedagogy agents), Knowledge Layer.

### 4.9 Export & Publishing

**Purpose:** Turning project documents into external artifacts.  
**Owns:** Export formats, publish pipelines, share links (future), CMS/hand-off integrations (future).  
**Does not own:** Authoring UX.

### 4.10 Insights & Activity (secondary)

**Purpose:** Lightweight awareness of project progress and AI usage.  
**Owns:** Activity feed within project, usage summaries, incomplete-section signals.  
**Not:** Vanity analytics or social metrics as a core product.

### Module map (logical)

```
┌─────────────────────────────────────────────────────────────┐
│                     Shell & Navigation                        │
├──────────────┬──────────────────────┬───────────────────────┤
│ Identity &   │  Knowledge Projects  │  Insights & Activity  │
│ Access       │                      │                       │
├──────────────┴──────────┬───────────┴───────────────────────┤
│   Creative Workspace    │     Review & Authenticity         │
│      (Authoring)        │                                   │
├──────────────┬──────────┴───────────┬───────────────────────┤
│ Gita Knowledge│  AI Agent           │  Media & Assets       │
│ Layer         │  Orchestration      │                       │
├───────────────┴─────────────────────┴───────────────────────┤
│                  Export & Publishing                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Knowledge Project Architecture

The **Knowledge Project** is the atomic unit of value in GitaVerse.

### 5.1 Definition

A Knowledge Project is a durable workspace container representing one educational initiative, for example:

- A 18-chapter study series
- A workshop curriculum on Karma Yoga
- A YouTube education series bible
- A school module on a selected set of verses

### 5.2 Internal structure

```
Knowledge Project
├── Metadata (title, intent, audience, language, status)
├── Scripture Scope (chapters/verses in focus)
├── Information Architecture
│   ├── Sections / Modules
│   └── Documents (lessons, scripts, notes, outlines)
├── Assets (media, references, downloads)
├── AI Run History (agent sessions scoped to project)
├── Review State (draft | in_review | approved | archived)
└── Members & Permissions (future multiplayer)
```

### 5.3 Document types (logical)

| Type | Role |
| --- | --- |
| Outline | Hierarchical plan for the project or a module |
| Lesson | Learner-facing educational document |
| Explainer | Concept deep-dive tied to verses |
| Script | Spoken/video script derived from lessons |
| Study Notes | Creator working notes (may remain private) |
| Source Board | Collected citations and commentary excerpts |

Documents are **first-class project children**, not chat messages.

### 5.4 Scripture scope

Each project declares a **scripture scope** (e.g., Chapter 2; or BG 2.47–2.53). Agents and review tools default to this scope. Expanding scope is an explicit project action.

### 5.5 State model (project lifecycle)

`draft` → `active` → `in_review` → `publish_ready` → `archived`

Transitions may require authenticity/review checks. Archiving preserves content; it does not delete history by default.

### 5.6 Isolation rules

- AI context is **project-scoped** (plus selected document + scripture scope).
- Search and assets are **project-scoped** by default.
- Cross-project templates may exist later; cross-project silent data bleed is forbidden.

---

## 6. Navigation Architecture

Navigation is **project-aware** and **task-oriented**.

### 6.1 Levels

| Level | Purpose |
| --- | --- |
| **App level** | Account, project list/home, settings, design-system theme |
| **Project level** | Sections, documents, assets, agents, review, export |
| **Document level** | Editor focus, outline side rail, agent side panel, citations |

### 6.2 Primary destinations (logical IA)

**App**

- Home / Project Library
- Create Project
- Account & Preferences
- Help / Principles (optional)

**Inside a Project**

- Overview (intent, scope, status)
- Documents
- Workspace (active document editor)
- Sources (Gita scope + citations)
- Agents (runs & suggestions)
- Assets
- Review
- Export

### 6.3 Navigation rules

1. Entering the product lands on **Project Library** (or last active project — product decision, not UI detail).
2. Deep work happens in **Workspace** with document context.
3. Agents are reachable from Workspace without leaving the document context.
4. Review and Export are **downstream** of Authoring — not parallel homes.
5. Global settings never interrupt an unsaved editor session without a safe hand-off.

### 6.4 URL philosophy (logical, not implemented)

URLs should reflect hierarchy:

- `/` — library
- `/projects/:projectId` — project overview
- `/projects/:projectId/docs/:documentId` — workspace
- `/projects/:projectId/agents` — agent history
- `/projects/:projectId/review` — review
- `/projects/:projectId/export` — export

Exact routing is an engineering concern; the hierarchy above is the architectural contract.

---

## 7. User Flow

### 7.1 Primary happy path (Create → Teach-ready)

1. **Arrive** — Authenticated user opens Project Library.
2. **Create Knowledge Project** — Define title, audience, learning intent, scripture scope.
3. **Generate or write structure** — Create outline (manual or Outline Agent).
4. **Open Workspace** — Select or create a Lesson/Script document.
5. **Author with assistance** — Draft in editor; invoke agents for outline expansion, explanation, or adaptation.
6. **Ground content** — Attach or verify verse citations via Knowledge Layer.
7. **Review** — Run authenticity / pedagogy checks; resolve flags.
8. **Export / publish-ready** — Produce artifact or mark project publish-ready.
9. **Return** — Continue next document or archive when complete.

### 7.2 AI-assisted drafting flow

1. User selects intent (e.g., “Explain BG 2.47 for beginners”).
2. Orchestrator gathers: project metadata + scripture scope + document excerpt + agent role.
3. Agent returns **suggestion** (not silent overwrite).
4. User **applies, edits, or rejects**.
5. Accepted content becomes document truth; run is logged.

### 7.3 Review flow

1. User marks document or project for review.
2. Authenticity Agent + rule checks evaluate claims vs. scope/citations.
3. Issues appear as review items (missing citation, overclaim, tone mismatch).
4. User resolves items → status advances.

### 7.4 Secondary flows

- Resume last project / last document
- Import notes into a Source Board
- Attach media to a lesson
- Duplicate project as template (future)
- Invite collaborator (future)

---

## 8. Data Flow

### 8.1 High-level flow

```
User Action
    ↓
Product Module (Projects / Authoring / Agents / Review)
    ↓
Domain Services (validation, permissions, orchestration)
    ↓
┌───────────────────┬────────────────────┬──────────────────┐
│ Persistence       │ Knowledge Layer    │ Model Providers  │
│ (projects, docs,  │ (verse refs,       │ (LLM / tools)    │
│  assets, runs)    │  citations)        │                  │
└───────────────────┴────────────────────┴──────────────────┘
    ↓
Projected state → Workspace / Review / Export surfaces
```

### 8.2 Authoring data flow

1. Editor maintains local document state (client).
2. Changes sync to persistence (debounce/save strategy — engineering detail).
3. Document snapshots may feed agent context **explicitly** (selection or full doc policy).
4. Applied agent output merges into document state through the Authoring module.

### 8.3 AI data flow

| Stage | Data |
| --- | --- |
| Input assembly | Project metadata, scripture scope, selected text, agent instructions, guardrail policy |
| Execution | Provider call + optional retrieval from Knowledge Layer |
| Output | Structured suggestion + citations + warnings |
| Persistence | Run record (inputs summary, outputs, status, timestamps) |
| Apply | User-approved patch into document |

**Rule:** Model output never becomes canonical project content without an apply path.

### 8.4 Knowledge grounding flow

1. Resolve verse addresses from scope or user citation.
2. Retrieve reference text / metadata from Knowledge Layer.
3. Attach citation objects to document nodes or review items.
4. Review module validates citation coverage where required.

### 8.5 State ownership

| State | Owner |
| --- | --- |
| Session / auth | Identity & Access |
| Project graph | Knowledge Projects |
| Document content | Creative Workspace |
| Agent runs | AI Agent Orchestration |
| Scripture references | Gita Knowledge Layer |
| Review findings | Review & Authenticity |
| Theme preference | Shell (design tokens / theme attribute) |
| Ephemeral UI chrome | Client stores (Zustand) — non-canonical |

Canonical business data lives in persistence — not in ephemeral client stores.

---

## 9. Feature Relationships

```
Knowledge Projects
    ├── owns → Documents (Authoring)
    ├── owns → Assets (Media)
    ├── scopes → Scripture Scope (Knowledge Layer)
    ├── scopes → Agent Runs
    └── gates → Review → Export

Authoring
    ├── reads → Knowledge Layer (citations)
    ├── invokes → Agent Orchestration
    └── emits → Review candidates

Agent Orchestration
    ├── reads → Project + Document + Knowledge Layer
    ├── writes → Suggestions + Run History
    └── informs → Review (authenticity/pedagogy agents)

Review
    ├── reads → Documents + Citations + Agent findings
    └── unlocks → Export / publish_ready

Export
    └── reads → Approved documents + assets
```

### Dependency direction (allowed)

- Features may depend **inward** on shared `lib`, `types`, `config`, design tokens.
- Features must not depend on other features’ private internals.
- Cross-feature collaboration happens through **public module APIs / domain events / shared types**.

### Critical coupling to manage

| Coupling | Risk | Mitigation |
| --- | --- | --- |
| Editor ↔ Agents | Tight UI entanglement | Suggestion protocol + apply API |
| Projects ↔ Knowledge | Hard-coded verse assumptions | Scope object + Knowledge Layer API |
| Review ↔ Agents | Duplicate logic | Shared evaluation schemas |
| Export ↔ Document schema | Format lock-in | Stable document interchange model |

---

## 10. Future Expansion

Architecture must allow growth without rewriting the project model.

### Near-term extensions

- Multi-document templates (course kits)
- Stronger authenticity evaluation harnesses
- Bilingual projects (e.g., English + Hindi)
- Media generation briefs (script → storyboard notes)

### Mid-term extensions

- Collaborative editing & roles
- Institutional workspaces (org → many projects)
- Commentary pack plugins (licensed sources)
- Learner-facing preview mode (still creator-owned)

### Long-term extensions

- Marketplace of educational project templates
- Assessment / reflection activity builders
- API for institutional LMS export
- On-device or private-model routing for sensitive institutions

### Expansion rule

New capabilities should appear as **new modules or agents**, not as conditionals bolted onto the editor. The Knowledge Project remains the stable center.

---

## 11. Scalability Notes

### Product scale dimensions

| Dimension | Strategy |
| --- | --- |
| Users | Stateless app shell; horizontal web tier; auth-bound access |
| Projects per user | Library indexing + pagination; archive to reduce active set |
| Documents per project | Hierarchical sections; lazy-load document bodies |
| Agent runs | Async job model; rate limits; retain summaries not raw megatraces forever |
| Scripture knowledge | Read-optimized reference store; cache hot verses |
| Assets | Object storage; CDN for delivery; project-scoped keys |
| Collaboration (future) | CRDT/OT or document-locking strategy decided at collaboration milestone |

### Engineering scale practices

- Feature modules under `src/features/*` with clear public surfaces
- Shared utilities only in `src/lib` when truly cross-cutting
- AI provider adapters isolated so models can be swapped
- Document schema versioned for migrations
- Design tokens remain the only presentation contract (see Design System docs)

### Performance priorities

1. Editor responsiveness under normal lesson length  
2. Fast project library  
3. Predictable agent run feedback (progress + cancellation)  
4. Export correctness over export speed  

---

## 12. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| **Scriptural hallucination** | Trust collapse | Grounding required; authenticity review; cite-or-flag policy |
| **Over-automation** | Creators lose voice / accuracy | Suggestion/apply model; human authority principle |
| **Monolithic agent** | Unmaintainable prompts | Specialized agents + orchestration contracts |
| **Chat-centric drift** | Product becomes a wrapper chatbot | Enforce project/document architecture in roadmap reviews |
| **Editor–state divergence** | Lost work / conflicts | Clear save model; canonical persistence; conflict policy |
| **Licensing of commentaries** | Legal exposure | Separate licensed packs; default to permitted sources only |
| **Scope creep into LMS/social** | Diluted product | Non-goals enforced in PRD/backlog grooming |
| **Token/cost blowups** | Unsustainable AI usage | Context budgets; project-scoped retrieval; caching |
| **Weak information architecture** | Users lost in tools | Navigation architecture + project overview as home base |
| **Design inconsistency** | Unprofessional scholarly brand | Mandatory design tokens; no hardcoded visual values |

---

## 13. Technical Decisions

These decisions constrain engineering. They are product-architecture choices, not UI specs.

| Decision | Choice | Rationale |
| --- | --- | --- |
| Application framework | Next.js 15 (App Router) | Server/client split, routing, modern React platform |
| UI library baseline | React 19 + TypeScript | Type-safe product surface |
| Styling | Tailwind CSS + design tokens + shadcn/ui later | Token-driven, scalable UI system |
| Client state | Zustand | Lightweight ephemeral UI/workspace state; not source of truth |
| Motion | Framer Motion | Intentional presence; not decorative noise |
| Rich text | Tiptap | Structured educational documents; extensible schemas |
| AI approach | Multi-agent orchestration | Specialized quality > one generic chat |
| Content center | Knowledge Project | Durable educational work, not ephemeral threads |
| Persistence stance | Canonical server-side project/document store | Auditability, multi-device, future collaboration |
| Theme | Dark default; light prepared | Matches design system; theme via `data-theme` |
| Code organization | `src/app` routes + `src/features` domains + `src/components` primitives | Clear ownership, scalable teams |
| Quality tooling | ESLint + Prettier | Consistent engineering hygiene |

### Explicit non-decisions (to resolve later)

- Exact database vendor and ORM
- Exact LLM provider mix and routing
- Auth vendor
- Real-time collaboration protocol
- Export format priority order (PDF / Markdown / LMS package)

These belong in Database, AI Agents, and subsequent ADR documents — not as silent assumptions in feature work.

---

## 14. Folder Ownership

Ownership maps product modules to the repository. **No UI implementation is implied** — this is boundary ownership for future engineering.

| Path | Owns | Notes |
| --- | --- | --- |
| `docs/` | Product truth | Architecture, PRD, IA, agents, database, design |
| `public/` | Static assets | Fonts, images, icons — not domain logic |
| `src/app/` | Routing shell | Route entries only; no heavy domain logic |
| `src/components/ui/` | Design-system primitives | shadcn/ui and base primitives |
| `src/components/layout/` | Shell layout pieces | App frame, nav chrome |
| `src/components/editor/` | Editor-presentational pieces | Tied to Authoring module |
| `src/components/shared/` | Cross-feature presentational shared UI | No domain rules |
| `src/features/` | Product modules | One folder per domain feature |
| `src/features/projects/` | Knowledge Projects module | |
| `src/features/workspace/` | Creative Workspace / Authoring | |
| `src/features/knowledge/` | Gita Knowledge Layer | |
| `src/features/agents/` | AI Agent Orchestration | |
| `src/features/media/` | Media & Assets | |
| `src/features/review/` | Review & Authenticity | |
| `src/features/export/` | Export & Publishing | |
| `src/features/auth/` | Identity & Access | |
| `src/hooks/` | Shared React hooks | Only when truly cross-feature |
| `src/lib/ai/` | Provider adapters, orchestration primitives | No feature UI |
| `src/lib/utils/` | Generic utilities | No product policy |
| `src/stores/` | Ephemeral client stores | Zustand; non-canonical |
| `src/styles/` | Design foundation | Tokens, themes, utilities |
| `src/types/` | Shared TypeScript contracts | Cross-module types |
| `src/constants/` | Shared constants | |
| `src/config/` | App & design configuration | Includes design-token maps |

### Ownership rules

1. **Feature code lives in `src/features/<module>`** — not in `src/app` beyond route wiring.
2. **`src/app` may compose features; it may not reimplement them.**
3. **Shared code must be truly shared** — do not invent a “common” dumping ground for feature logic.
4. **AI provider details stay in `src/lib/ai`**; product policy stays in `src/features/agents`.
5. **Visual values come only from `src/styles` tokens** (see Design Tokens documentation).

---

## 15. Module Responsibilities

### Shell & Navigation

- Provide application frame and route composition
- Apply theme and global accessibility baseline
- Expose navigation to library, project, and settings

### Identity & Access

- Authenticate users
- Authorize project actions
- Represent membership and roles (as introduced)

### Knowledge Projects

- CRUD and lifecycle of projects
- Maintain project metadata and scripture scope
- Organize sections, documents list, and project settings
- Enforce project isolation boundaries

### Creative Workspace (Authoring)

- Document schema and editing experience
- Local draft behavior and save semantics (with persistence)
- Structure outlines and educational document types
- Integrate agent suggestions via apply/reject

### Gita Knowledge Layer

- Resolve and serve verse-addressable references
- Provide citation objects for documents and reviews
- Encapsulate licensed source constraints

### AI Agent Orchestration

- Register agent roles and capabilities
- Build bounded context for runs
- Execute, cancel, and record runs
- Emit structured suggestions and warnings
- Never silently overwrite canonical documents

### Media & Assets

- Store and attach media to projects/documents
- Track metadata and permissions
- Supply export with asset references

### Review & Authenticity

- Define review statuses and checklists
- Surface authenticity and pedagogy findings
- Gate publish-ready transitions

### Export & Publishing

- Transform approved documents into target formats
- Preserve citations and required metadata
- Fail safely when review gates are unmet

### Insights & Activity

- Summarize recent project activity
- Surface incomplete sections or pending reviews
- Remain secondary to authoring outcomes

---

## Related Documents

| Document | Relationship |
| --- | --- |
| [00_README](./00_README.md) | Documentation index & stack |
| [01_MANIFESTO](./01_MANIFESTO.md) | Beliefs (to be filled; philosophy here aligns) |
| [02_PRODUCT_BLUEPRINT](./02_PRODUCT_BLUEPRINT.md) | Product summary (to be filled) |
| [03_PRD](./03_PRD.md) | Requirements detail (to be filled) |
| [04_INFORMATION_ARCHITECTURE](./04_INFORMATION_ARCHITECTURE.md) | IA detail (nav here is architectural contract) |
| [05_DESIGN_SYSTEM](./05_DESIGN_SYSTEM.md) | Visual system — presentation only |
| [06_AI_AGENTS](./06_AI_AGENTS.md) | Agent roles deep-dive (to be filled) |
| [07_DATABASE](./07_DATABASE.md) | Persistence model (to be filled) |
| [08_BACKLOG](./08_BACKLOG.md) | Delivery sequencing |
| [18_DESIGN_TOKENS](./18_DESIGN_TOKENS.md) | Token implementation contract |

---

## Document Control

| Field | Value |
| --- | --- |
| ID | GV-003 |
| Title | Product Architecture |
| Authoring mode | Product Architect (no UI / no React implementation) |
| Next expected docs | Filled PRD, IA, AI Agents, Database ADRs |
