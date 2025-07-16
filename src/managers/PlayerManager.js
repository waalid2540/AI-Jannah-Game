// Player Manager - Handles player data and progression
export class PlayerManager {
    constructor() {
        this.playerData = {
            hasanat: 100,
            knowledge: 0,
            level: 1,
            experience: 0,
            name: 'Seeker',
            gardenSize: 1,
            plantsGrown: 0,
            questsCompleted: 0,
            prayersCompleted: 0,
            joinDate: new Date().toISOString()
        };
        this.isInitialized = false;
    }

    async init() {
        console.log('👤 Initializing Player Manager...');
        this.isInitialized = true;
        return Promise.resolve();
    }

    getPlayerData() {
        return { ...this.playerData };
    }

    loadPlayerData(data) {
        this.playerData = { ...this.playerData, ...data };
        console.log('📥 Player data loaded');
    }

    addHasanat(amount) {
        this.playerData.hasanat += amount;
        this.addExperience(amount);
        console.log(`✨ +${amount} Hasanat earned`);
    }

    spendHasanat(amount) {
        if (this.playerData.hasanat >= amount) {
            this.playerData.hasanat -= amount;
            return true;
        }
        return false;
    }

    addKnowledge(amount) {
        this.playerData.knowledge += amount;
        this.addExperience(amount * 2);
        console.log(`📚 +${amount} Knowledge gained`);
    }

    addExperience(amount) {
        this.playerData.experience += amount;
        this.checkLevelUp();
    }

    checkLevelUp() {
        const requiredExp = this.playerData.level * 100;
        if (this.playerData.experience >= requiredExp) {
            this.playerData.level++;
            this.playerData.experience -= requiredExp;
            console.log(`🎉 Level up! Now level ${this.playerData.level}`);
            return true;
        }
        return false;
    }

    update(deltaTime) {
        // Update player-related systems
    }
}