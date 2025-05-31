// Sidebar component for Rental Investment Analyzer
// Handles rendering, updating, and basic interactivity

class Sidebar {
    constructor() {
        this.sidebarId = 'rental-investment-analyzer-sidebar';
        this.floatingBtnId = 'ria-floating-btn';
        this.injectFloatingButton();
        this.injectSidebar();
    }

    injectFloatingButton() {
        if (document.getElementById(this.floatingBtnId)) return; // Prevent duplicates
        const floatingBtn = document.createElement('div');
        floatingBtn.id = this.floatingBtnId;
        floatingBtn.innerHTML = 'RIA';
        floatingBtn.style.position = 'fixed';
        floatingBtn.style.right = '20px';   
        floatingBtn.style.bottom = '20px';
        floatingBtn.style.zIndex = '999999';
        floatingBtn.style.backgroundColor = '#1976d2';
        floatingBtn.style.color = 'white';
        floatingBtn.style.padding = '10px 15px';
        floatingBtn.style.borderRadius = '4px';
        floatingBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        floatingBtn.style.cursor = 'pointer';
        floatingBtn.style.fontFamily = "'Segoe UI', Arial, sans-serif";
        floatingBtn.style.fontWeight = 'bold';
        floatingBtn.style.fontSize = '14px';
        floatingBtn.style.transition = 'background 0.2s';
        floatingBtn.onmouseover = () => { floatingBtn.style.backgroundColor = '#1565c0'; };
        floatingBtn.onmouseout = () => { floatingBtn.style.backgroundColor = '#1976d2'; };
        floatingBtn.onclick = () => this.toggle();
        document.body.appendChild(floatingBtn);
    }

    injectSidebar() {
        if (document.getElementById(this.sidebarId)) return; // Prevent duplicates
        const sidebar = document.createElement('div');
        sidebar.id = this.sidebarId;
        sidebar.innerHTML = `
            <div class="ria-sidebar-header">
                <span>Rental Investment Analyzer</span>
                <button id="ria-close-btn" title="Close">&times;</button>
            </div>
            <div class="ria-sidebar-content">
                <div id="ria-property-data">Loading...</div>
                <button id="ria-refresh-btn">Refresh</button>
                <button id="ria-config-btn">⚙️</button>
            </div>
        `;
        // Hide sidebar by default
        sidebar.style.display = 'none';
        document.body.appendChild(sidebar);
        this.addEventListeners();
    }

    addEventListeners() {
        document.getElementById('ria-close-btn').onclick = () => this.hide();
        document.getElementById('ria-refresh-btn').onclick = () => window.location.reload();
        document.getElementById('ria-config-btn').onclick = () => this.showConfigPanel();
    }

    show() {
        const sidebar = document.getElementById(this.sidebarId);
        if (sidebar) sidebar.style.display = 'block';
    }

    hide() {
        const sidebar = document.getElementById(this.sidebarId);
        if (sidebar) sidebar.style.display = 'none';
    }

    toggle() {
        const sidebar = document.getElementById(this.sidebarId);
        if (sidebar) {
            if (sidebar.style.display === 'none') {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    updatePropertyData(html) {
        const dataDiv = document.getElementById('ria-property-data');
        if (dataDiv) dataDiv.innerHTML = html;
    }

    showConfigPanel() {
        // Placeholder for config panel logic
        alert('Configuration panel coming soon!');
    }
}

export default Sidebar; 