// core.js - MobileCube Core Engine

window.MobileCube = (function() {
  const engine = {
    storyName: "",
    startNodeId: null,
    passages: {}, // pid -> passage data
    passageNames: {}, // name -> pid
    currentPassage: null,

    init: function() {
      // Parse story data
      const storyData = document.querySelector('tw-storydata');
      if (!storyData) return;

      this.storyName = storyData.getAttribute('name');
      this.startNodeId = storyData.getAttribute('startnode');
      
      // Update UI
      const titleEl = document.getElementById('story-title');
      if (titleEl) titleEl.textContent = this.storyName;
      document.title = this.storyName;

      // Extract passages
      const passageNodes = storyData.querySelectorAll('tw-passagedata');
      passageNodes.forEach(node => {
        const pid = node.getAttribute('pid');
        const name = node.getAttribute('name');
        const text = node.textContent;
        
        const passage = { pid, name, text };
        this.passages[pid] = passage;
        this.passageNames[name] = pid;
      });

      // Start story
      if (this.startNodeId && this.passages[this.startNodeId]) {
        this.gotoId(this.startNodeId);
      } else {
        console.error("No start passage found.");
      }
    },

    gotoId: function(pid) {
      if (!this.passages[pid]) return;
      this.renderPassage(this.passages[pid]);
    },

    goto: function(name) {
      const pid = this.passageNames[name];
      if (pid) {
        this.gotoId(pid);
      }
    },

    renderPassage: function(passage) {
      this.currentPassage = passage;
      const passagesContainer = document.getElementById('passages');
      
      // Clear previous passage
      passagesContainer.innerHTML = '';

      const passageEl = document.createElement('div');
      passageEl.className = 'passage';
      
      // MVP Parser: Handle simple paragraph breaks and `[[Link]]` / `[[Link Title|Passage Name]]`
      let html = this.parseText(passage.text);
      
      passageEl.innerHTML = html;
      passagesContainer.appendChild(passageEl);
      window.scrollTo(0, 0);
    },

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

        // Clean up whitespace
        title = title.trim();
        target = target.trim();

        // Check if target exists
        const exists = this.passageNames[target] !== undefined;
        const className = exists ? 'link-internal' : 'link-broken';
        const action = exists ? `onclick="MobileCube.goto('${target.replace(/'/g, "\\'")}')"` : '';

        return `<a href="javascript:void(0)" class="${className}" ${action}>${title}</a>`;
      });

      // Convert newlines to paragraphs
      parsed = '<p>' + parsed.split(/\\n\\n+/).join('</p><p>') + '</p>';
      parsed = parsed.replace(/\\n/g, '<br>');

      return parsed;
    }
  };

  // Run init on load
  window.addEventListener('DOMContentLoaded', () => {
    engine.init();
  });

  return engine;
})();
