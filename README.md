# MobileCube

**A mobile-first story format for Twine based on SugarCube.**

## Context

MobileCube is designed primarily for mobile devices, utilizing gestures for smooth forward and backward movement. It provides a single-handed usability experience while maintaining a full SugarCube-compatible feature set for interactive storytelling in Twine.

## Quick Start

⚠️ **Placeholder:** *Instructions pending deployment documentation. See Docs Map below.*

## Architecture

The project generates a Twine story format via a build script (`build.js` or `build.py`). It reads source files from `src/` (including HTML, CSS, and modular JS scripts like engine, state, and macros) and concatenates them into a single `format.js` payload in the `dist/` directory `[unverified if further build steps exist]`.

## Docs Map

- Engine Architecture: `docs/engine-architecture.md` — 🔜 Pending
- State & History Management: `docs/state-management.md` — 🔜 Pending
- UI & Macro Implementation: `docs/ui-macros.md` — 🔜 Pending

## License

Author: FrancescoLimpias
License: BSD-2-Clause
