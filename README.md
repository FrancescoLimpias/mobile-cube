# MobileCube

**A mobile-first story format for Twine based on SugarCube.**

## Context

MobileCube is designed primarily for mobile devices, utilizing gestures for smooth forward and backward movement. It provides a single-handed usability experience while maintaining a full SugarCube-compatible feature set for interactive storytelling in Twine.

## Quick Start

MobileCube uses a completely containerized development environment via Docker to ensure OS agnosticism.

To start the local Hot-Reloading development server:

1. Ensure Docker Desktop or Docker Engine is running on your host machine.
2. In the `mobile-cube` directory, simply run:

   ```bash
   docker compose up dev
   ```

3. Open your browser to `http://localhost:8000/` to test and view the MobileCube format output.

## Architecture

The project generates a Twine story format via a containerized build script (`build.py`). It reads source files from `src/` (including HTML, CSS, and modular JS scripts like engine, state, and macros) and concatenates them into a single `format.js` payload in the `dist/` directory.

The `test-story` demo handles building the actual Twine format HTML output using the compiled engine and serving it to the local browser.

## Docs Map

- Engine Architecture: `docs/engine-architecture.md` — 🔜 Pending
- State & History Management: `docs/state-management.md` — 🔜 Pending
- UI & Macro Implementation: `docs/ui-macros.md` — 🔜 Pending

## License

Author: FrancescoLimpias
License: BSD-2-Clause
