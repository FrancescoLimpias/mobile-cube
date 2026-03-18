// macros/core.js - Built-in MobileCube macros

(function() {
  /**
   * The actual implementation of these macros in this MVP is handled mainly 
   * inside `wikifier.js` regex passes (like <<set>> and <<if>>).
   * 
   * However, for a fully compliant SugarCube-like macro system, we register them 
   * properly here. Future iteratons of Wikifier would call these handlers.
   */
  
  Macro.add('set', {
      handler: function() {
          // Handled natively by Wikifier in MVP
      }
  });

  Macro.add('if', {
      handler: function() {
          // Handled natively by Wikifier in MVP
      }
  });

  Macro.add('elseif', {
      handler: function() {
          // Handled natively by Wikifier in MVP
      }
  });

  Macro.add('else', {
      handler: function() {
          // Handled natively by Wikifier in MVP
      }
  });

  Macro.add('link', {
      handler: function() {
          // A full macro system would process the inner text and arguments here
      }
  });

  Macro.add('button', {
      handler: function() {
          // Handled mostly by Wikifier parsing in the MVP
      }
  });

  // DOM Replacements
  Macro.add('replace', {
      handler: function() {
          // Example future signature
      }
  });

  Macro.add('append', {
      handler: function() {
          // Example future signature
      }
  });

})();
