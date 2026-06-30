# Changelog

All notable changes to `@drask-dev/scan` are documented here.

## [0.6.1] — 2026-06-27

### Fixed
- Sort code validator no longer rejects valid UK sort codes with a `20-xx-xx` prefix (Barclays, one of the UK's largest banks) or `19-xx-xx`. The heuristic that treated these as date-like was incorrect and introduced false negatives for common real-world sort codes.
- NHS number test assertion now correctly validates that detection fires (`toBeGreaterThan(0)` instead of the always-passing `toBeGreaterThanOrEqual(0)`).

### Added
- `resetToDefaultPatterns()` export — restores the 26 built-in patterns after `clearPatterns()`, with no need to re-import or re-instantiate.
- IPv6 detection now covers compressed forms (RFC 4291): `2001:db8::1`, `fe80::1`, `::ffff:…` etc., in addition to the existing full 8-group notation. Loopback (`::1`) and all-zeros (`::`) are still excluded.
- CI matrix now runs on Node.js 18, 20, and 22 (previously Node 20 only), matching the declared `engines: ">=18.0.0"`.
- `.npmrc` is now tracked in git (it contains only registry config, no secrets; the prior gitignore entry was a mistake).

## [0.6.0] — 2026-06-24

Rebrand from Velare → Drask and rename package from `@velare/detection` → `@drask-dev/scan`.

## [0.3.0] — 2026-04-19

### Added
- npm publish workflow with OIDC provenance signing (`--provenance`).
- Unicode support: regex patterns use the `u` flag; redaction correctly handles multi-byte characters and emoji.
- Large-input guard: inputs exceeding 100 KB skip scanning and return the original text unchanged (`maxInputBytes` config option).
- Scan latency warning (`scanWarnMs` config option, default 100 ms).
- Edge case hardening: zero-length match protection, null bytes, control characters.

## [0.2.0] — 2026-04-14

### Added
- NER detection via [compromise.js](https://github.com/spencermountain/compromise): person names, organisations, locations detected alongside regex patterns.
- Two-pass scan: regex first, then NER; overlapping detections deduplicated by keeping the highest-confidence match.
- Debit card patterns (Maestro, Visa Electron) with Luhn validation.
- Sort code, UTR, and passport patterns.
- `source: "regex" | "ner"` field on each `PiiEntity`.
- `NER_ENTITY_TYPES` export.

## [0.1.0] — 2026-04-11

Initial release.

### Features
- 18 regex patterns across 7 categories: email, phone (UK/US/international), credit card, IBAN, National Insurance, NHS number, IPv4, IPv6, UK postcode, date of birth (3 formats), AWS keys, API keys, Bearer tokens, JWTs, Slack/GitHub/Stripe tokens.
- Luhn validation for credit cards; modulus-11 validation for NHS numbers; NI prefix exclusion.
- Configurable sensitivity (`low` / `medium` / `high`), entity type filtering, and exclusion lists.
- ESM + CJS dual build with TypeScript declarations and source maps.
- MIT licence.
