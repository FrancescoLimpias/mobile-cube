// engine.js - Runs the passage transitions and game loop

window.Engine = (function() {
  const engine = {
    /**
     * Play a specific passage.
     * @param {string} title - The passage title to play
     * @param {boolean} isRestore - Whether this play is due to a state restoration (load/backward/forward)
     */
    play: function(title, isRestore = false) {
      if (!Story.has(title)) {
          console.error(`Engine: Passage "${title}" does not exist.`);
          return;
      }

      const passage = Story.get(title);

      // If this is a normal navigation, push a new state
      if (!isRestore) {
          State.push(title);
      }

      this.renderPassage(passage);
    },

    /**
     * Move backward in the history array
     */
    backward: function() {
        if (State.index > 0) {
            State.restore(State.index - 1);
            this.play(State.currentPassageName, true);
        }
    },

    /**
     * Move forward in the history array
     */
    forward: function() {
        if (State.index < State.history.length - 1) {
            State.restore(State.index + 1);
            this.play(State.currentPassageName, true);
        }
    },

    /**
     * Restart the story completely
     */
    restart: function() {
        State.reset();
        this.play(Story.startPassage);
    },

    /**
     * Internal rendering pipeline logic using Wikifier.
     */
    renderPassage: function(passage) {
      const passagesContainer = document.getElementById('passages');
      if (!passagesContainer) return;
      
      // Clear previous passage
      passagesContainer.innerHTML = '';

      const passageEl = document.createElement('div');
      passageEl.className = 'passage';
      
      // Use Wikifier to parse the content and append the resulting DocumentFragment
      new Wikifier(passageEl, passage.text);
      
      passagesContainer.appendChild(passageEl);
      window.scrollTo(0, 0);

      // Autosave after rendering a new moment
      Save.autosave.save();

      // Dispatch :passageend event for custom scripts
      document.dispatchEvent(new CustomEvent(':passageend', { detail: { passage: passage } }));
    }
  };

  return engine;
})();
