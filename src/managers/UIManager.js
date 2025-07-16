// UI Manager - Handles all user interface interactions
export class UIManager {
    constructor() {
        this.isInitialized = false;
    }

    async init() {
        console.log('🎨 Initializing UI Manager...');
        this.isInitialized = true;
        return Promise.resolve();
    }

    updateCurrency(hasanat, knowledge) {
        const hasanatEl = document.getElementById('hasanat-amount');
        const knowledgeEl = document.getElementById('knowledge-amount');
        
        if (hasanatEl) hasanatEl.textContent = hasanat.toLocaleString();
        if (knowledgeEl) knowledgeEl.textContent = knowledge.toLocaleString();
    }

    updatePlayerLevel(level) {
        const levelEl = document.getElementById('player-level');
        if (levelEl) levelEl.textContent = level;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}