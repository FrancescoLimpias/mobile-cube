// state.js - Manages the player's history and variables

window.State = (function() {
  /**
   * Helper function to perform a deep clone of the variables object
   * Currently uses JSON stringification for simplicity and complete isolation, 
   * which matches SugarCube's deep object cloning for most basic data types.
   */
  function cloneVariables(vars) {
    if (!vars) return {};
    return JSON.parse(JSON.stringify(vars));
  }

  const state = {
    variables: {}, // Equivalent to $variables
    temporary: {}, // Equivalent to _variables
    history: [],   // Array of state "moments"
    index: -1,     // Current position in the history array

    /**
     * Restores state to a specific history index
     */
    restore: function(index) {
        if (index < 0 || index >= this.history.length) return false;
        
        this.index = index;
        const moment = this.history[index];
        this.variables = cloneVariables(moment.variables);
        this.temporary = {}; // Temporary variables reset on navigation
        return true;
    },

    /**
     * Push a new state moment to history
     */
    push: function(passageName) {
        // If we are currently not at the end of the history array
        // (meaning the user has navigated backwards), truncate the forward history
        if (this.index < this.history.length - 1) {
            this.history = this.history.slice(0, this.index + 1);
        }

        const newVars = cloneVariables(this.variables);
        
        const moment = {
            passage: passageName,
            variables: newVars,
            // To mimic SugarCube, we'd also store a clone of variables here
        };

        this.history.push(moment);
        this.index = this.history.length - 1;

        // Reset temporary variables for the new passage
        this.temporary = {};
        
        // Re-assign variables so any object references in macros manipulate the correct object
        this.variables = newVars;
    },

    /**
     * Clear all state history
     */
    reset: function() {
        this.variables = {};
        this.temporary = {};
        this.history = [];
        this.index = -1;
    },

    /**
     * Retrieve the name of the current passage according to history
     */
    get currentPassageName() {
        if (this.index >= 0 && this.index < this.history.length) {
            return this.history[this.index].passage;
        }
        return null;
    }
  };

  return state;
})();
