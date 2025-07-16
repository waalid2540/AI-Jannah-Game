// AI Jannah Game Engine - Core Game Logic
import { IslamicGarden } from '../game/IslamicGarden.js';
import { PlayerManager } from '../managers/PlayerManager.js';
import { QuestManager } from '../managers/QuestManager.js';
import { NoorAI } from '../ai/NoorAI.js';
import { PrayerTimeManager } from '../managers/PrayerTimeManager.js';

export class GameEngine {
    constructor(uiManager, audioManager, saveManager) {
        this.uiManager = uiManager;
        this.audioManager = audioManager;
        this.saveManager = saveManager;
        
        // Core game systems
        this.islamicGarden = null;
        this.playerManager = null;
        this.questManager = null;
        this.noorAI = null;
        this.prayerTimeManager = null;
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.gameLoop = null;
        this.lastUpdate = 0;
        
        // Islamic game data
        this.islamicContent = null;
        this.currentSeason = 'spring'; // spring, summer, autumn, winter
        this.currentEvent = null; // Ramadan, Hajj, etc.
    }

    async init() {
        console.log('🎮 Initializing Game Engine...');
        
        // Initialize core managers
        this.playerManager = new PlayerManager();
        this.questManager = new QuestManager();
        this.noorAI = new NoorAI();
        this.prayerTimeManager = new PrayerTimeManager();
        
        // Initialize Islamic garden
        this.islamicGarden = new IslamicGarden(document.getElementById('game-canvas'));
        
        // Setup managers
        await this.playerManager.init();
        await this.questManager.init();
        await this.noorAI.init();
        await this.prayerTimeManager.init();
        await this.islamicGarden.init();
        
        // Setup UI connections
        this.setupUIConnections();
        
        console.log('✅ Game Engine Initialized');
    }

    async loadIslamicContent() {
        // Load Islamic educational content
        this.islamicContent = {
            seeds: {
                quran: {
                    id: 'quran_seed',
                    name: 'Quran Verse Seed',
                    nameArabic: 'بذرة آية قرآنية',
                    description: 'Plant a verse from the Holy Quran',
                    cost: 10,
                    growthTime: 300000, // 5 minutes
                    hasanatReward: 50,
                    knowledgeReward: 25,
                    verses: [
                        {
                            arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
                            english: 'And whoever fears Allah, He will make for him a way out',
                            reference: 'Quran 65:2'
                        },
                        {
                            arabic: 'وَبَشِّرِ الصَّابِرِينَ',
                            english: 'And give good tidings to the patient',
                            reference: 'Quran 2:155'
                        }
                    ]
                },
                hadith: {
                    id: 'hadith_seed',
                    name: 'Hadith Wisdom Seed',
                    nameArabic: 'بذرة حكمة الحديث',
                    description: 'Grow prophetic wisdom',
                    cost: 15,
                    growthTime: 450000, // 7.5 minutes
                    hasanatReward: 75,
                    knowledgeReward: 40,
                    teachings: [
                        {
                            arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
                            english: 'Actions are but by intention',
                            source: 'Bukhari & Muslim'
                        }
                    ]
                },
                character: {
                    id: 'character_seed',
                    name: 'Character Tree Seed',
                    nameArabic: 'بذرة شجرة الأخلاق',
                    description: 'Develop Islamic character traits',
                    cost: 20,
                    growthTime: 600000, // 10 minutes
                    hasanatReward: 100,
                    knowledgeReward: 60,
                    traits: ['Patience', 'Honesty', 'Compassion', 'Gratitude', 'Humility']
                }
            },
            companions: {
                cat: {
                    id: 'islamic_cat',
                    name: 'Blessed Cat',
                    nameArabic: 'القط المبارك',
                    description: 'A cat that helps tend your garden, inspired by the Prophet\'s love for cats',
                    ability: 'auto_water',
                    cost: 100,
                    benefit: 'Automatically waters plants every hour'
                },
                butterfly: {
                    id: 'knowledge_butterfly',
                    name: 'Knowledge Butterfly',
                    nameArabic: 'فراشة المعرفة',
                    description: 'Spreads knowledge between plants',
                    ability: 'knowledge_boost',
                    cost: 150,
                    benefit: 'Increases knowledge rewards by 25%'
                }
            },
            quests: {
                daily: [
                    {
                        id: 'morning_dhikr',
                        title: 'Morning Remembrance',
                        titleArabic: 'ذكر الصباح',
                        description: 'Plant a seed while reciting morning dhikr',
                        reward: { hasanat: 30, knowledge: 15 },
                        requirement: 'Plant 1 seed before Dhuhr'
                    },
                    {
                        id: 'quran_reflection',
                        title: 'Quranic Reflection',
                        titleArabic: 'تدبر القرآن',
                        description: 'Spend time reflecting on a Quran verse',
                        reward: { hasanat: 50, knowledge: 25 },
                        requirement: 'Complete AI reflection session'
                    }
                ],
                weekly: [
                    {
                        id: 'community_garden',
                        title: 'Community Garden',
                        titleArabic: 'حديقة المجتمع',
                        description: 'Help 5 community members with their gardens',
                        reward: { hasanat: 200, knowledge: 100 },
                        requirement: 'Visit and help 5 gardens'
                    }
                ]
            }
        };
    }

    setupUIConnections() {
        // Connect UI elements to game functions
        document.getElementById('plant-btn').addEventListener('click', () => {
            this.showSeedSelection();
        });

        document.getElementById('water-btn').addEventListener('click', () => {
            this.waterPlants();
        });

        document.getElementById('harvest-btn').addEventListener('click', () => {
            this.harvestPlants();
        });

        document.getElementById('expand-btn').addEventListener('click', () => {
            this.expandGarden();
        });

        // Noor AI chat
        document.getElementById('noor-send').addEventListener('click', () => {
            this.sendMessageToNoor();
        });

        document.getElementById('noor-chat').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessageToNoor();
            }
        });

        // Panel switching
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchPanel(tab.dataset.panel);
            });
        });
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.lastUpdate = Date.now();
        this.gameLoop = setInterval(() => this.update(), 1000); // Update every second
        
        // Start prayer time monitoring
        this.prayerTimeManager.start();
        
        console.log('🌟 AI Jannah Game Started');
    }

    update() {
        if (this.isPaused) return;
        
        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;
        
        // Update game systems
        this.islamicGarden.update(deltaTime);
        this.questManager.update(deltaTime);
        this.playerManager.update(deltaTime);
        
        // Update UI
        this.updateUI();
    }

    updateUI() {
        // Update currency displays
        const playerData = this.playerManager.getPlayerData();
        document.getElementById('hasanat-amount').textContent = playerData.hasanat.toLocaleString();
        document.getElementById('knowledge-amount').textContent = playerData.knowledge.toLocaleString();
        document.getElementById('player-level').textContent = playerData.level;
        
        // Update garden stats
        const gardenStats = this.islamicGarden.getStats();
        document.getElementById('plants-count').textContent = gardenStats.plantsGrowing;
        document.getElementById('knowledge-trees').textContent = gardenStats.knowledgeTrees;
        
        // Update prayer time
        const nextPrayer = this.prayerTimeManager.getNextPrayer();
        if (nextPrayer) {
            document.getElementById('current-prayer').textContent = nextPrayer;
        }
    }

    showSeedSelection() {
        const modal = document.getElementById('seed-select-modal');
        const seedOptions = document.getElementById('seed-options');
        
        // Clear previous options
        seedOptions.innerHTML = '';
        
        // Add seed options
        Object.values(this.islamicContent.seeds).forEach(seed => {
            const seedDiv = document.createElement('div');
            seedDiv.className = 'seed-option';
            seedDiv.innerHTML = `
                <div class="seed-info">
                    <h4>${seed.name}</h4>
                    <p class="arabic-text">${seed.nameArabic}</p>
                    <p>${seed.description}</p>
                    <div class="seed-stats">
                        <span>Cost: ${seed.cost} Hasanat</span>
                        <span>Growth: ${Math.round(seed.growthTime / 60000)}min</span>
                        <span>Reward: ${seed.hasanatReward} Hasanat</span>
                    </div>
                </div>
                <button class="select-seed-btn" data-seed-id="${seed.id}">
                    Plant Seed
                </button>
            `;
            seedOptions.appendChild(seedDiv);
        });
        
        // Add event listeners for seed selection
        seedOptions.querySelectorAll('.select-seed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seedId = e.target.dataset.seedId;
                this.plantSeed(seedId);
                modal.classList.remove('show');
            });
        });
        
        modal.classList.add('show');
        
        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    plantSeed(seedId) {
        const seed = this.islamicContent.seeds[Object.keys(this.islamicContent.seeds).find(key => 
            this.islamicContent.seeds[key].id === seedId
        )];
        
        if (!seed) return;
        
        // Check if player has enough Hasanat
        if (!this.playerManager.spendHasanat(seed.cost)) {
            this.showMessage('Not enough Hasanat!', 'error');
            return;
        }
        
        // Plant seed in garden
        const planted = this.islamicGarden.plantSeed(seed);
        if (planted) {
            this.showMessage(`${seed.name} planted! May Allah bless its growth.`, 'success');
            this.audioManager.playSound('plant');
        }
    }

    waterPlants() {
        const wateredCount = this.islamicGarden.waterAllPlants();
        if (wateredCount > 0) {
            this.showMessage(`Watered ${wateredCount} plants with reflection and dhikr`, 'success');
            this.audioManager.playSound('water');
        } else {
            this.showMessage('No plants need watering right now', 'info');
        }
    }

    harvestPlants() {
        const harvestResults = this.islamicGarden.harvestReadyPlants();
        if (harvestResults.length > 0) {
            let totalHasanat = 0;
            let totalKnowledge = 0;
            
            harvestResults.forEach(result => {
                totalHasanat += result.hasanatReward;
                totalKnowledge += result.knowledgeReward;
            });
            
            this.playerManager.addHasanat(totalHasanat);
            this.playerManager.addKnowledge(totalKnowledge);
            
            this.showMessage(`Harvested: +${totalHasanat} Hasanat, +${totalKnowledge} Knowledge`, 'success');
            this.audioManager.playSound('harvest');
        } else {
            this.showMessage('No plants ready for harvest', 'info');
        }
    }

    expandGarden() {
        const expansionCost = this.islamicGarden.getExpansionCost();
        if (this.playerManager.spendHasanat(expansionCost)) {
            this.islamicGarden.expand();
            this.showMessage('Garden expanded! More space for spiritual growth.', 'success');
            this.audioManager.playSound('expand');
        } else {
            this.showMessage(`Need ${expansionCost} Hasanat to expand garden`, 'error');
        }
    }

    async sendMessageToNoor() {
        const chatInput = document.getElementById('noor-chat');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        chatInput.value = '';
        
        // Show user message
        this.addNoorMessage(message, 'user');
        
        // Get AI response
        try {
            const response = await this.noorAI.processMessage(message);
            this.addNoorMessage(response, 'ai');
        } catch (error) {
            this.addNoorMessage('I apologize, I\'m having trouble responding right now. Please try again.', 'ai');
        }
    }

    addNoorMessage(message, sender) {
        const dialogue = document.getElementById('noor-dialogue');
        const messageDiv = document.createElement('div');
        messageDiv.className = `noor-message ${sender}`;
        messageDiv.innerHTML = `<p>${message}</p>`;
        dialogue.appendChild(messageDiv);
        dialogue.scrollTop = dialogue.scrollHeight;
    }

    switchPanel(panelName) {
        // Update tab appearance
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-panel="${panelName}"]`).classList.add('active');
        
        // Update panel content
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${panelName}-panel`).classList.add('active');
    }

    showMessage(text, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = text;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    handleResize() {
        this.islamicGarden.handleResize();
    }

    getPlayerData() {
        return this.playerManager.getPlayerData();
    }

    loadPlayerData(data) {
        this.playerManager.loadPlayerData(data);
    }
}