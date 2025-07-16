// Save Manager - Handles game data persistence
export class SaveManager {
    constructor() {
        this.storageKey = 'ai-jannah-game-save';
        this.isInitialized = false;
    }

    async init() {
        console.log('💾 Initializing Save Manager...');
        this.isInitialized = true;
        return Promise.resolve();
    }

    async savePlayerData(playerData) {
        try {
            const saveData = {
                ...playerData,
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            console.log('✅ Game saved successfully');
        } catch (error) {
            console.error('❌ Failed to save game:', error);
        }
    }

    async loadPlayerData() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const playerData = JSON.parse(savedData);
                console.log('📥 Game loaded successfully');
                return playerData;
            }
        } catch (error) {
            console.error('❌ Failed to load game:', error);
        }
        return null;
    }

    clearSaveData() {
        localStorage.removeItem(this.storageKey);
        console.log('🗑️ Save data cleared');
    }
}