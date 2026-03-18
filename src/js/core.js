// core.js - Bootstrapper and global exporter for MobileCube

window.MobileCube = (function() {
  const core = {
    init: function() {
      // 1. Initialize Story to parse passages
      Story.init();

      // 2. Initialize UI (Sidebar, etc.)
      UI.init();

      // 3. Update Document Title
      if (Story.title) {
        document.title = Story.title;
        const titleEl = document.getElementById('story-title');
        if (titleEl) titleEl.textContent = Story.title;
      }

      // 3. Attempt to load autosave. If failed, play start passage.
      const loaded = Save.autosave.load();
      if (!loaded && Story.startPassage) {
        // Reset state and play the start passage
        State.reset();
        Engine.play(Story.startPassage);
      } else if (!loaded) {
        console.error("MobileCube: No autosave and no start passage found.");
      }
    }
  };

  // Run init when DOM is fully loaded
  window.addEventListener('DOMContentLoaded', () => {
    core.init();
  });

  return core;
})();
