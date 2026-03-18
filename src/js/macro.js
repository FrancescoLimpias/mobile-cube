// macro.js - The Macro API for registering and executing Twine macros

window.Macro = (function() {
  const macros = {};

  const api = {
    /**
     * Register a new macro
     * @param {string|string[]} name 
     * @param {object} handlerDef 
     */
    add: function(name, handlerDef) {
        let names = Array.isArray(name) ? name : [name];
        names.forEach(n => {
            macros[n] = handlerDef;
            macros[n].name = n;
        });
    },

    /**
     * Get a registered macro handler
     */
    get: function(name) {
        return macros[name] || null;
    },

    /**
     * Check if a macro is registered
     */
    has: function(name) {
        return macros[name] !== undefined;
    }
  };

  return api;
})();
