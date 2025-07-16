// Quest Manager - Handles daily/weekly Islamic quests
export class QuestManager {
    constructor() {
        this.activeQuests = [];
        this.completedQuests = [];
        this.isInitialized = false;
    }

    async init() {
        console.log('📋 Initializing Quest Manager...');
        this.generateDailyQuests();
        this.isInitialized = true;
        return Promise.resolve();
    }

    generateDailyQuests() {
        const dailyQuests = [
            {
                id: 'morning_dhikr',
                title: 'Morning Remembrance',
                titleArabic: 'ذكر الصباح',
                description: 'Plant a seed while reciting morning dhikr',
                progress: 0,
                target: 1,
                reward: { hasanat: 30, knowledge: 15 },
                type: 'daily'
            },
            {
                id: 'quran_reflection',
                title: 'Quranic Reflection',
                titleArabic: 'تدبر القرآن',
                description: 'Spend time reflecting on a Quran verse',
                progress: 0,
                target: 1,
                reward: { hasanat: 50, knowledge: 25 },
                type: 'daily'
            }
        ];

        this.activeQuests = dailyQuests;
        console.log('📅 Daily quests generated');
    }

    getActiveQuests() {
        return [...this.activeQuests];
    }

    completeQuest(questId) {
        const questIndex = this.activeQuests.findIndex(q => q.id === questId);
        if (questIndex !== -1) {
            const quest = this.activeQuests[questIndex];
            this.completedQuests.push(quest);
            this.activeQuests.splice(questIndex, 1);
            console.log(`✅ Quest completed: ${quest.title}`);
            return quest.reward;
        }
        return null;
    }

    updateQuestProgress(questId, progress = 1) {
        const quest = this.activeQuests.find(q => q.id === questId);
        if (quest) {
            quest.progress = Math.min(quest.progress + progress, quest.target);
            if (quest.progress >= quest.target) {
                return this.completeQuest(questId);
            }
        }
        return null;
    }

    update(deltaTime) {
        // Update quest timers and check for resets
    }
}