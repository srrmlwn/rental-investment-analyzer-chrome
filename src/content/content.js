// Content script for Rental Investment Analyzer
console.log('Content script loaded');

class SidebarManager {
  constructor() {
    this.sidebar = null;
    this.isVisible = false;
  }

  createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'ria-sidebar hidden';
    sidebar.innerHTML = `
      <div class="ria-header">
        <h2>Rental Investment Analyzer</h2>
        <button class="ria-close-btn">×</button>
      </div>
      <div class="ria-content">
        <div class="ria-loading">Loading property data...</div>
      </div>
    `;

    // Add close button handler
    const closeBtn = sidebar.querySelector('.ria-close-btn');
    closeBtn.addEventListener('click', () => this.hideSidebar());

    return sidebar;
  }

  injectSidebar() {
    if (!this.sidebar) {
      this.sidebar = this.createSidebar();
      document.body.appendChild(this.sidebar);
    }
  }

  showSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.remove('hidden');
      this.isVisible = true;
    }
  }

  hideSidebar() {
    if (this.sidebar) {
      this.sidebar.classList.add('hidden');
      this.isVisible = false;
    }
  }

  toggleSidebar() {
    if (this.isVisible) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const sidebarManager = new SidebarManager();
  
  // Inject sidebar
  sidebarManager.injectSidebar();
  
  // Add keyboard shortcut (Ctrl/Cmd + Shift + R)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      sidebarManager.toggleSidebar();
    }
  });

  // TODO: Implement property data extraction
  console.log('Content script initialized');
}); 