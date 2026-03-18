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
     * Internal rendering pipeline logic.
     * In MobileCube, this also involves parsing SugarCube links manually for MVP.
     */
    renderPassage: function(passage) {
      const passagesContainer = document.getElementById('passages');
      if (!passagesContainer) return;
      
      // Clear previous passage
      passagesContainer.innerHTML = '';

      const passageEl = document.createElement('div');
      passageEl.className = 'passage';
      
      // Basic text parser (similar to original core.js MVP)
      let html = this.parseText(passage.text);
      
      passageEl.innerHTML = html;
      passagesContainer.appendChild(passageEl);
      window.scrollTo(0, 0);

      // Autosave after rendering a new moment
      Save.autosave.save();
    },

    /**
     * Simple MVP text parser logic mostly for links in Twine formatting.
     */
    parseText: function(text) {
      // Escape HTML
      let parsed = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // Parse links: [[Link]] or [[Title|Link]] or [[Title->Link]] or [[Link<-Title]]
      parsed = parsed.replace(/\\[\\[(.*?)\\]\\]/g, (match, inner) => {
        let title = inner;
        let target = inner;

        if (inner.includes('|')) {
          [title, target] = inner.split('|');
        } else if (inner.includes('->')) {
          [title, target] = inner.split('->');
        } else if (inner.includes('<-')) {
          [target, title] = inner.split('<-');
        }

        title = title.trim();
        target = target.trim();

        const exists = Story.has(target);
        const className = exists ? 'link-internal' : 'link-broken';
        const action = exists ? `onclick="Engine.play('${target.replace(/'/g, "\\'")}')"` : '';

        return `<a href="javascript:void(0)" class="${className}" ${action}>${title}</a>`;
      });

      // Convert newlines to paragraphs
      parsed = '<p>' + parsed.split(/\\n\\n+/).join('</p><p>') + '</p>';
      parsed = parsed.replace(/\\n/g, '<br>');

      return parsed;
    }
  };

  return engine;
})();
