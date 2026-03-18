// save.js - Manages saving and loading the game state

window.Save = (function() {
  
  function getFullKey(key) {
      const prefix = window.Story ? window.Story.title : "MobileCubeStore";
      return `mobilecube_${prefix}_${key}`;
  }

  const saveAPI = {
    /**
     * Serialize and save current engine state to a specific slot within local storage.
     */
    serialize: function() {
        return JSON.stringify({
            history: State.history,
            index: State.index,
            metadata: {
                date: new Date().toISOString(),
                passage: State.currentPassageName
            }
        });
    },

    deserialize: function(saveDataStr) {
        try {
            const data = JSON.parse(saveDataStr);
            if (data && data.history) {
                State.history = data.history;
                // Load the index, ensure it is within bounds
                State.restore(data.index);
                return data.metadata.passage;
            }
        } catch(e) {
            console.error("Save: Failed to deserialize save data", e);
        }
        return null;
    },

    slots: {
        save: function(slotId) {
            const json = saveAPI.serialize();
            localStorage.setItem(getFullKey('slot_' + slotId), json);
            return true;
        },
        load: function(slotId) {
            const json = localStorage.getItem(getFullKey('slot_' + slotId));
            if (!json) return false;
            
            const passageName = saveAPI.deserialize(json);
            if (passageName) {
                Engine.play(passageName, true); // true = is loading, avoid adding to history again
                return true;
            }
            return false;
        },
        has: function(slotId) {
            return localStorage.getItem(getFullKey('slot_' + slotId)) !== null;
        },
        delete: function(slotId) {
            localStorage.removeItem(getFullKey('slot_' + slotId));
        }
    },

    autosave: {
        save: function() {
            const json = saveAPI.serialize();
            localStorage.setItem(getFullKey('autosave'), json);
        },
        load: function() {
            const json = localStorage.getItem(getFullKey('autosave'));
            if (!json) return false;
            
            const passageName = saveAPI.deserialize(json);
            if (passageName) {
                Engine.play(passageName, true);
                return true;
            }
            return false;
        },
        has: function() {
            return localStorage.getItem(getFullKey('autosave')) !== null;
        },
        delete: function() {
            localStorage.removeItem(getFullKey('autosave'));
        }
    }
  };

  return saveAPI;
})();
