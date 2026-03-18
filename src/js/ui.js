// ui.js - Manages global UI components like the Sidebar and Dialogs

window.UI = (function() {
  const ui = {
    isOpen: false,

    init: function() {
      // Create the sidebar if it doesn't exist
      if (!document.getElementById('mobilecube-ui-sidebar')) {
        this.buildSidebar();
      }

      // Bind UI Bar Toggle
      const toggleBtn = document.getElementById('ui-bar-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
             this.toggleSidebar();
        });
      }
    },

    buildSidebar: function() {
      const sidebar = document.createElement('div');
      sidebar.id = 'mobilecube-ui-sidebar';
      sidebar.className = 'mc-sidebar-closed';

      const content = `
        <div class="mc-sidebar-header">
            <h2>${Story.title || 'Story'}</h2>
            <button id="mc-sidebar-close" aria-label="Close Sidebar">&times;</button>
        </div>
        <div class="mc-sidebar-body">
            <button class="mc-btn" onclick="Engine.backward()">Backward</button>
            <button class="mc-btn" onclick="Engine.forward()">Forward</button>
            <hr>
            <button class="mc-btn" onclick="Save.autosave.save(); alert('Autosaved!')">Autosave</button>
            <button class="mc-btn" onclick="Save.autosave.load()">Load Autosave</button>
            <hr>
            <button class="mc-btn mc-btn-danger" onclick="if(confirm('Restart story?')) Engine.restart()">Restart</button>
        </div>
      `;

      sidebar.innerHTML = content;
      document.body.appendChild(sidebar);

      document.getElementById('mc-sidebar-close').addEventListener('click', () => {
          this.closeSidebar();
      });
    },

    toggleSidebar: function() {
        if (this.isOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    },

    openSidebar: function() {
        const sidebar = document.getElementById('mobilecube-ui-sidebar');
        if (sidebar) {
            sidebar.className = 'mc-sidebar-open';
            this.isOpen = true;
        }
    },

    closeSidebar: function() {
        const sidebar = document.getElementById('mobilecube-ui-sidebar');
        if (sidebar) {
            sidebar.className = 'mc-sidebar-closed';
            this.isOpen = false;
        }
    }
  };

  return ui;
})();
