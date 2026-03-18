# MobileCube Feature Roadmap

## Main Goals & Core Design Principles

1. **Mobile-First & Gesture Navigation**: The format is designed primarily for mobile devices, utilizing gestures for smooth forward and backward movement:
   - **Backward**: Scroll up while at the top of the current passage to return to the previous one.
   - **Forward**: Scroll down past the bottom of a passage to advance to the next one.
   - **Choices**: Make selections by swiping or scrolling right, left, or bottom. Traditional links are also supported for passages with more than three choices and to maintain SugarCube compatibility.
2. **Single-Handed Usability**: The UI is redesigned from the ground up to allow users to comfortably play stories with just one hand on a mobile phone. A two-handed mode is also available for desktop browsers or for increased navigation speed, while still providing the full SugarCube feature set.
3. **Built-in Interactive Audio**: Audio is seamlessly integrated into the experience. The story format will provide built-in, satisfying "Nintendo Switch-like" sound effects and feedback for UI interactions.

---

This roadmap outlines a phased approach for gradually introducing and integrating standard SugarCube 2 features into the MobileCube ecosystem. This structured rollout ensures stability while systematically building out a complete, interactive storytelling engine.

## Phase 1: Foundational Engine & State Management
* **Objective**: Establish the core runtime, memory management, and basic state tracking.

- [x] **Core Initialization**: Set up the baseline engine runtime, ensuring compatibility.
- [x] **State & History Tracking**: Implement the basic backward/forward navigation systems.
- [x] **Story Variables Framework**: Establish logic for `$variables` and `_temporaryVariables` strictly bound to the story history.
- [x] **Basic Save/Load Pipeline**: Introduce core save slots and autosave functionality.

## Phase 2: Core UI & Interactive Elements
* **Objective**: Introduce player-facing interfaces and basic interactive logic.

- [x] **Built-in UI Bar**: Create the foundational navigation sidebar (restart, saves, settings stubs).
- [x] **Standard Interactive Macros**: Implement standard `<<link>>`, `<<button>>`, and `<<textbox>>` components.
- [x] **Logic & Control Flow**: Introduce standard TwineScript structural macros (`<<if>>`, `<<switch>>`, `<<set>>`).
- [x] **DOM Manipulation Macros**: Add `<<replace>>`, `<<append>>`, and `<<prepend>>` for dynamic inline content updates.

## Phase 3: Advanced APIs & Extensibility
* **Objective**: Provide tools for deeper customization and developer extensibility.

- [ ] **Dialog API**: Implement floating modal windows and interactive popups.
- [ ] **Settings API**: Introduce a persistent settings menu that remembers player preferences across sessions.
- [ ] **Widget System**: Support the `<<widget>>` macro so creators can build reusable, modular code blocks.
- [ ] **Lifecycle Event Hooks**: Expose core navigation/rendering events (e.g., `:passagestart`, `:passagerender`) for custom JS injection.
- [ ] **External Module Support**: Allow standard ECMAScript modules (`<script type="module">`) and global configurations to be loaded before engine initialization.
- [ ] **Dynamic Asset Loading**: Introduce an API or macro to fetch external passages or JSON at runtime, supporting episodic content or massive projects without bloating the initial HTML file.
## Phase 4: Multimedia, Polish, & Accessibility
* **Objective**: Enhance the audiovisual experience and ensure the engine meets modern web standards.

- [ ] **SimpleAudio Integration**: Introduce advanced audio tracking (fades, loops, volume layering, playlists).
- [ ] **Accessibility (A11y)**: Standardize ARIA attributes across all generated UI elements and ensure full keyboard navigability.
- [ ] **Localization (L10n)**: Build the L10n object framework to support internationalization of built-in UI strings.
- [ ] **Save Export/Import**: Add advanced capabilities allowing players to save/load `.save` files to and from the local disk.
- [ ] **Theme & CSS Engine**: Finalize unopinionated HTML scaffolding for seamless custom stylesheet integrations. 

## Phase 5: Developer Tools & Ecosystem
* **Objective**: Empower creators to build large-scale projects using modern development workflows outside of the Twine UI.

- [ ] **Twee 3 Specification Compatibility**: Ensure the engine and format output are fully compatible with command-line compilers like Tweego and Extwee.
- [ ] **MobileCube Starter Kit**: Create an official Node.js boilerplate (`create-mobilecube-app`) for organizing `.twee`, `.js`, and `.scss` files with a local live-reload dev server.
- [ ] **VS Code Integration**: Provide standard configurations, snippets, or an extension for Visual Studio Code to auto-suggest MobileCube macros and TwineScript.
