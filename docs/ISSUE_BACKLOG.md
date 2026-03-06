# EmpowerChain Finance — GitHub Issues Backlog Draft

This backlog is derived from a codebase review of frontend, API, contracts, and project tooling. Each item is written as a ready-to-create GitHub issue.

## 1) API: add request validation and consistent error responses
- **Type:** bug / security
- **Priority:** High
- **Problem:** API endpoints trust request payloads and query params without schema validation, allowing malformed values and poor error quality.
- **Evidence:** `server/index.js` accepts raw body/query fields for applications, investments, and profiles.
- **Acceptance criteria:**
  - Introduce request schemas (e.g., Zod/Joi) for all write endpoints.
  - Return `400` with field-level validation messages for invalid payloads.
  - Standardize error format across all endpoints.

## 2) API: use transactional logic for investments + loan funding updates
- **Type:** bug / data integrity
- **Priority:** High
- **Problem:** Investment creation and loan funding update are separate queries; partial failure can cause inconsistent data.
- **Evidence:** `/api/investments` inserts into `investments`, then separately updates `loans`.
- **Acceptance criteria:**
  - Wrap insert + loan update in a single DB transaction.
  - Add rollback behavior and proper error handling.
  - Add test case for mid-transaction failure.

## 3) API: improve database SSL and environment configuration
- **Type:** bug / ops
- **Priority:** High
- **Problem:** SSL config currently hardcodes `rejectUnauthorized: false`, which weakens transport security.
- **Evidence:** pool initialization in `server/index.js`.
- **Acceptance criteria:**
  - Read SSL mode from env (`DB_SSL_MODE`, optional CA cert path).
  - Support secure default for production, relaxed local dev mode only when explicit.
  - Document env combinations in README.

## 4) Frontend: remove silent mock-data fallback in production paths
- **Type:** bug / UX
- **Priority:** High
- **Problem:** `useLoans` silently falls back to mock data, potentially misleading lenders and borrowers.
- **Evidence:** `src/hooks/useLoans.ts` sets mock loans when API data is empty or unavailable.
- **Acceptance criteria:**
  - Only use mock data in explicit development mode.
  - Show user-visible API availability banner/state.
  - Add telemetry hook for API failures.

## 5) Frontend: add loading/error/empty states consistently across pages
- **Type:** enhancement
- **Priority:** Medium
- **Problem:** Data-fetching surfaces are inconsistent in loading and error feedback.
- **Evidence:** Dashboard and lending views rely on optimistic assumptions.
- **Acceptance criteria:**
  - Standard skeleton and error components.
  - Empty-state CTAs for loans, investments, and applications.
  - Accessibility-friendly status announcements.

## 6) Wallet UX: support more connectors + chain guardrails
- **Type:** feature
- **Priority:** High
- **Problem:** Wallet context currently only uses injected connector and does not strongly guide users to supported networks.
- **Evidence:** `src/context/WalletContext.tsx` uses only `injected()` connector.
- **Acceptance criteria:**
  - Add WalletConnect + Coinbase connector support.
  - Add “wrong network” warning and one-click switch.
  - Add reconnect/session handling improvements.

## 7) Borrow flow: persist draft applications and resume support
- **Type:** feature
- **Priority:** Medium
- **Problem:** Loan application progress can be lost on refresh/navigation.
- **Evidence:** Form flow exists but persistence strategy is not enforced.
- **Acceptance criteria:**
  - Auto-save draft locally (and optionally server-side).
  - Restore draft on next visit.
  - Add explicit “clear draft” action.

## 8) Learn flow: connect module completion to on-chain badge minting
- **Type:** feature
- **Priority:** High
- **Problem:** Literacy modules award UI rewards but are not integrated with badge contract mint flow.
- **Evidence:** `src/pages/Learn.tsx` and module UI track completion client-side.
- **Acceptance criteria:**
  - Trigger mint call after passing module quiz.
  - Persist completion proofs.
  - Display minted badge status/history in dashboard.

## 9) Dashboard: add repayment and portfolio analytics
- **Type:** feature
- **Priority:** Medium
- **Problem:** Dashboard stats are basic and do not provide repayment schedules, risk view, or trend analytics.
- **Evidence:** `src/pages/Dashboard.tsx` computes only top-level totals.
- **Acceptance criteria:**
  - Repayment calendar and next due amount.
  - Portfolio allocation and realized/unrealized return charts.
  - CSV export for personal records.

## 10) Contracts: add comprehensive automated tests
- **Type:** quality
- **Priority:** High
- **Problem:** Contract artifacts exist, but there is no visible test suite validating lifecycle rules and edge cases.
- **Evidence:** `contracts/` includes scripts/artifacts but no robust test coverage directory.
- **Acceptance criteria:**
  - Add unit tests for Loan, Lending, LiteracyBadge.
  - Include negative-path tests (reentrancy/permissions/invalid state transitions).
  - Gate CI on contract test pass.

## 11) End-to-end testing for critical product journeys
- **Type:** quality
- **Priority:** High
- **Problem:** No automated E2E coverage for borrower/lender happy paths.
- **Acceptance criteria:**
  - Add E2E tests for Apply → Fund → Dashboard verify.
  - Add basic wallet connection and network mismatch scenarios.
  - Produce CI artifact for failed runs.

## 12) Security hardening: auth, rate limits, and abuse controls
- **Type:** security
- **Priority:** High
- **Problem:** Open API endpoints can be spammed and have no per-wallet or per-IP safeguards.
- **Evidence:** `server/index.js` lacks authentication/rate-limiting middleware.
- **Acceptance criteria:**
  - Add request rate limiting and request size limits.
  - Add signature-based wallet auth for protected actions.
  - Add abuse event logging.

## 13) Accessibility pass (WCAG 2.1 AA) and keyboard navigation
- **Type:** enhancement
- **Priority:** Medium
- **Problem:** UI has strong visual styling but needs explicit accessibility verification and fixes.
- **Acceptance criteria:**
  - Keyboard navigability for all interactive elements.
  - Color contrast checks and remediation.
  - Screen-reader labels and aria-live for async actions.

## 14) Internationalization foundation (i18n)
- **Type:** feature
- **Priority:** Medium
- **Problem:** Product currently appears English-only, limiting global reach.
- **Acceptance criteria:**
  - Introduce i18n framework and locale routing strategy.
  - Externalize all user-facing strings.
  - Ship initial locales (EN + 1 additional language).

## 15) DevEx: add CI for lint/build/tests and commit checks
- **Type:** quality
- **Priority:** Medium
- **Problem:** No visible CI pipeline ensuring consistent quality gates.
- **Acceptance criteria:**
  - GitHub Actions workflow for lint/build/unit tests.
  - Optional pre-commit hooks (lint-staged) for changed files.
  - PR status checks required before merge.
