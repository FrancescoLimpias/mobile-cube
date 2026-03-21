// story.js - Manages the game's story passages and metadata

window.Story = (function() {
  const story = {
    title: "",
    name: "", // Alias for title
    startPassage: null,
    passages: {}, // pid -> passage data
    passageNames: {}, // name -> pid

    /**
     * Parse the Twine HTML structure (`tw-storydata` and `tw-passagedata`)
     */
    init: function() {
      const storyData = document.querySelector('tw-storydata');
      if (!storyData) {
        console.error("Story: No <tw-storydata> found. This doesn't look like a Twine project.");
        return;
      }

      this.title = storyData.getAttribute('name');
      this.name = this.title;
      const startNodeId = storyData.getAttribute('startnode');
      
      // Extract passages
      const passageNodes = storyData.querySelectorAll('tw-passagedata');
      passageNodes.forEach(node => {
        const pid = node.getAttribute('pid');
        const name = node.getAttribute('name');
        const text = node.textContent;
        const tagsAttribute = node.getAttribute('tags');
        const tags = tagsAttribute ? tagsAttribute.split(' ') : [];
        
        const passage = { 
            pid, 
            name, 
            tags,
            text 
        };
        this.passages[pid] = passage;
        this.passageNames[name] = pid;
      });

      // Resolve start node
      if (startNodeId && this.passages[startNodeId]) {
        this.startPassage = this.passages[startNodeId].name;
      } else {
        console.warn("Story: No valid start node found.");
      }

      // Load custom styles
      const customStyle = storyData.querySelector('style[type="text/twine-css"]');
      if (customStyle) {
          const styleEl = document.createElement('style');
          styleEl.textContent = customStyle.textContent;
          document.head.appendChild(styleEl);
      }

      // Load custom scripts
      const customScript = storyData.querySelector('script[type="text/twine-javascript"]');
      if (customScript) {
          try {
              (new Function(customScript.textContent))();
          } catch(e) {
              console.error("Story: Error evaluating custom story JavaScript:", e);
          }
      }
    },

    /**
     * Checks if a passage exists by its name.
     */
    has: function(title) {
        return this.passageNames[title] !== undefined;
    },

    /**
     * Retrieves a passage by its name.
     */
    get: function(title) {
        if (!this.has(title)) {
            return null;
        }
        return this.passages[this.passageNames[title]];
    }
  };

  return story;
})();
