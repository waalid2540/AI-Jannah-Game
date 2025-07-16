// Gameplay Manager - Handles actual game mechanics and interactions
export class GameplayManager {
    constructor() {
        this.gameState = {
            hasanat: 100,
            knowledge: 0,
            level: 1,
            experience: 0,
            plantsGrowing: 0,
            plantsHarvested: 0,
            totalSeedsPlanted: 0,
            prayersCompleted: 0,
            questsCompleted: 0,
            learningStreak: 0,
            gardenSize: 9, // 3x3 grid
            unlockedContent: new Set(['basic-quran', 'basic-hadith'])
        };
        
        this.garden = {
            plots: new Map(),
            maxPlots: 9,
            plotStates: new Map() // 'empty', 'planted', 'growing', 'ready', 'withered'
        };
        
        this.islamicContent = {
            seeds: new Map([
                ['quran-seed', {
                    id: 'quran-seed',
                    name: 'Quran Verse',
                    nameArabic: 'آية قرآنية',
                    emoji: '📖',
                    cost: 10,
                    growthTime: 30000, // 30 seconds
                    hasanatReward: 25,
                    knowledgeReward: 15,
                    level: 1,
                    verses: [
                        { arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم', english: 'In the name of Allah, the Most Gracious, the Most Merciful' },
                        { arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', english: 'Praise be to Allah, Lord of the worlds' },
                        { arabic: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ', english: 'I did not create jinn and humans except to worship Me' }
                    ]
                }]),
                ['hadith-seed', {
                    id: 'hadith-seed',
                    name: 'Hadith Wisdom',
                    nameArabic: 'حكمة الحديث',
                    emoji: '📜',
                    cost: 20,
                    growthTime: 45000, // 45 seconds
                    hasanatReward: 40,
                    knowledgeReward: 25,
                    level: 2,
                    hadiths: [
                        { arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ', english: 'Actions are but by intention' },
                        { arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', english: 'Whoever believes in Allah and the Last Day should speak good or remain silent' }
                    ]
                }]),
                ['dua-seed', {
                    id: 'dua-seed',
                    name: 'Dua Garden',
                    nameArabic: 'حديقة الدعاء',
                    emoji: '🤲',
                    cost: 15,
                    growthTime: 20000, // 20 seconds
                    hasanatReward: 30,
                    knowledgeReward: 20,
                    level: 1,
                    duas: [
                        { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', english: 'Our Lord, give us good in this world and good in the hereafter, and save us from the punishment of the Fire' },
                        { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', english: 'My Lord, expand my chest and make my task easy for me' }
                    ]
                }]),
                ['character-seed', {
                    id: 'character-seed',
                    name: 'Character Tree',
                    nameArabic: 'شجرة الأخلاق',
                    emoji: '🌳',
                    cost: 50,
                    growthTime: 60000, // 60 seconds
                    hasanatReward: 75,
                    knowledgeReward: 50,
                    level: 3,
                    traits: ['Patience (Sabr)', 'Gratitude (Shukr)', 'Honesty (Sidq)', 'Kindness (Rahma)', 'Humility (Tawadu)']
                }]
            ]),
            
            quests: new Map([
                ['daily-1', {
                    id: 'daily-1',
                    title: 'Morning Blessing',
                    titleArabic: 'بركة الصباح',
                    description: 'Plant your first seed of the day',
                    type: 'daily',
                    requirement: 'plant-seed',
                    target: 1,
                    progress: 0,
                    reward: { hasanat: 20, knowledge: 10 },
                    completed: false
                }]),
                ['daily-2', {
                    id: 'daily-2',
                    title: 'Knowledge Seeker',
                    titleArabic: 'طالب العلم',
                    description: 'Learn 3 new Islamic concepts',
                    type: 'daily',
                    requirement: 'learn-concept',
                    target: 3,
                    progress: 0,
                    reward: { hasanat: 40, knowledge: 30 },
                    completed: false
                }]),
                ['weekly-1', {
                    id: 'weekly-1',
                    title: 'Garden Master',
                    titleArabic: 'سيد الحديقة',
                    description: 'Harvest 10 plants this week',
                    type: 'weekly',
                    requirement: 'harvest-plants',
                    target: 10,
                    progress: 0,
                    reward: { hasanat: 100, knowledge: 75 },
                    completed: false
                }])
            ])
        };
        
        this.isInitialized = false;
        this.gameTimer = null;
        this.saveInterval = null;
    }

    async init() {
        console.log('🎮 Initializing Gameplay Manager');
        
        // Initialize garden plots
        this.initializeGarden();
        
        // Load saved game state
        this.loadGameState();
        
        // Start game timers
        this.startGameTimers();
        
        // Update UI
        this.updateUI();
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('✅ Gameplay Manager initialized');
    }

    initializeGarden() {
        // Create 3x3 garden grid
        for (let i = 0; i < this.gameState.gardenSize; i++) {
            this.garden.plots.set(i, {
                id: i,
                state: 'empty',
                plant: null,
                plantedAt: null,
                readyAt: null,
                lastWatered: null
            });
            this.garden.plotStates.set(i, 'empty');
        }
        
        // Create visual garden
        this.createGardenVisual();
    }

    createGardenVisual() {
        const gameCanvas = document.getElementById('game-canvas');
        
        // Clear existing content and create garden
        gameCanvas.innerHTML = `
            <div class="garden-container">
                <div class="garden-header">
                    <h2>🌱 Your Islamic Garden 🌱</h2>
                    <p>Plant seeds of knowledge and watch them grow into wisdom</p>
                </div>
                
                <div class="garden-grid" id="garden-grid">
                    ${Array.from({ length: this.gameState.gardenSize }, (_, i) => `
                        <div class="garden-plot" data-plot-id="${i}" onclick="selectPlot(${i})">
                            <div class="plot-content">
                                <div class="plot-emoji"></div>
                                <div class="plot-status"></div>
                                <div class="plot-timer"></div>
                            </div>
                            <div class="plot-number">${i + 1}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="garden-actions">
                    <button class="game-btn primary" onclick="showSeedShop()">
                        🌱 Plant Seeds
                    </button>
                    <button class="game-btn secondary" onclick="waterGarden()">
                        💧 Water Garden
                    </button>
                    <button class="game-btn success" onclick="harvestAll()">
                        🎯 Harvest All
                    </button>
                </div>
                
                <div class="learning-section">
                    <div class="current-lesson" id="current-lesson">
                        <h3>📚 Today's Learning</h3>
                        <div class="lesson-content">
                            <p>Welcome to AI Jannah! Start by planting your first seed to begin your Islamic learning journey.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Global functions for gameplay
        window.selectPlot = (plotId) => this.selectPlot(plotId);
        window.showSeedShop = () => this.showSeedShop();
        window.waterGarden = () => this.waterGarden();
        window.harvestAll = () => this.harvestAll();
        window.plantSeed = (seedId) => this.plantSeed(seedId);
        window.buySeed = (seedId) => this.buySeed(seedId);
        window.learnConcept = (conceptId) => this.learnConcept(conceptId);
        
        // Update existing UI functions
        window.startLearning = () => {
            this.showLearningDialog();
        };
        
        window.exploreGarden = () => {
            this.focusOnGarden();
        };
    }

    selectPlot(plotId) {
        const plot = this.garden.plots.get(plotId);
        if (!plot) return;
        
        // Remove previous selection
        document.querySelectorAll('.garden-plot').forEach(p => p.classList.remove('selected'));
        
        // Select new plot
        const plotElement = document.querySelector(`[data-plot-id="${plotId}"]`);
        plotElement.classList.add('selected');
        
        // Show plot info
        this.showPlotInfo(plot);
        
        console.log(`🌱 Selected plot ${plotId + 1}:`, plot);
    }

    showPlotInfo(plot) {
        const infoHTML = `
            <div class="plot-info">
                <h4>Plot ${plot.id + 1}</h4>
                <p>Status: ${plot.state}</p>
                ${plot.plant ? `<p>Plant: ${plot.plant.emoji} ${plot.plant.name}</p>` : ''}
                ${plot.readyAt ? `<p>Ready: ${this.formatTime(plot.readyAt - Date.now())}</p>` : ''}
            </div>
        `;
        
        // Update side panel with plot info
        const gardenPanel = document.getElementById('garden-panel');
        const existingInfo = gardenPanel.querySelector('.plot-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        gardenPanel.insertAdjacentHTML('beforeend', infoHTML);
    }

    showSeedShop() {
        const modal = document.getElementById('seed-select-modal');
        const seedOptions = document.getElementById('seed-options');
        
        seedOptions.innerHTML = '';
        
        // Add available seeds
        for (const [seedId, seed] of this.islamicContent.seeds) {
            const canAfford = this.gameState.hasanat >= seed.cost;
            const canPlant = this.gameState.level >= seed.level;
            
            const seedHTML = `
                <div class="seed-option ${canAfford && canPlant ? 'available' : 'unavailable'}">
                    <div class="seed-header">
                        <span class="seed-emoji">${seed.emoji}</span>
                        <div class="seed-info">
                            <h4>${seed.name}</h4>
                            <p class="arabic">${seed.nameArabic}</p>
                        </div>
                    </div>
                    <div class="seed-stats">
                        <div class="stat">
                            <span class="label">Cost:</span>
                            <span class="value">✨ ${seed.cost}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Growth:</span>
                            <span class="value">⏱️ ${seed.growthTime / 1000}s</span>
                        </div>
                        <div class="stat">
                            <span class="label">Reward:</span>
                            <span class="value">✨ ${seed.hasanatReward} + 📚 ${seed.knowledgeReward}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Level:</span>
                            <span class="value">🎯 ${seed.level}</span>
                        </div>
                    </div>
                    <button class="plant-btn ${canAfford && canPlant ? 'enabled' : 'disabled'}" 
                            onclick="buySeed('${seedId}')" 
                            ${canAfford && canPlant ? '' : 'disabled'}>
                        ${canAfford && canPlant ? '🌱 Plant Seed' : 
                          !canAfford ? '💰 Need More Hasanat' : '🔒 Level Required'}
                    </button>
                </div>
            `;
            
            seedOptions.insertAdjacentHTML('beforeend', seedHTML);
        }
        
        modal.classList.add('show');
    }

    buySeed(seedId) {
        const seed = this.islamicContent.seeds.get(seedId);
        if (!seed) return;
        
        // Check if player can afford and has required level
        if (this.gameState.hasanat < seed.cost) {
            this.showMessage('Not enough Hasanat! Complete more learning activities.', 'error');
            return;
        }
        
        if (this.gameState.level < seed.level) {
            this.showMessage(`Level ${seed.level} required for this seed!`, 'error');
            return;
        }
        
        // Find empty plot
        const emptyPlot = this.findEmptyPlot();
        if (emptyPlot === null) {
            this.showMessage('No empty plots available! Harvest some plants first.', 'error');
            return;
        }
        
        // Plant the seed
        this.plantSeed(seedId, emptyPlot);
        
        // Close modal
        document.getElementById('seed-select-modal').classList.remove('show');
    }

    plantSeed(seedId, plotId = null) {
        const seed = this.islamicContent.seeds.get(seedId);
        if (!seed) return;
        
        // Find plot to plant in
        if (plotId === null) {
            plotId = this.findEmptyPlot();
            if (plotId === null) {
                this.showMessage('No empty plots available!', 'error');
                return;
            }
        }
        
        const plot = this.garden.plots.get(plotId);
        if (!plot || plot.state !== 'empty') {
            this.showMessage('Plot is not available!', 'error');
            return;
        }
        
        // Deduct cost
        this.gameState.hasanat -= seed.cost;
        this.gameState.totalSeedsPlanted++;
        
        // Plant the seed
        plot.state = 'growing';
        plot.plant = { ...seed };
        plot.plantedAt = Date.now();
        plot.readyAt = Date.now() + seed.growthTime;
        
        this.garden.plotStates.set(plotId, 'growing');
        this.gameState.plantsGrowing++;
        
        // Update visual
        this.updatePlotVisual(plotId);
        
        // Update quest progress
        this.updateQuestProgress('plant-seed');
        
        // Show learning content
        this.showLearningContent(seed);
        
        // Update UI
        this.updateUI();
        
        this.showMessage(`${seed.emoji} ${seed.name} planted successfully!`, 'success');
        
        console.log(`🌱 Planted ${seed.name} in plot ${plotId + 1}`);
    }

    showLearningContent(seed) {
        const lessonContent = document.querySelector('.lesson-content');
        if (!lessonContent) return;
        
        let content = '';
        
        if (seed.verses) {
            const verse = seed.verses[Math.floor(Math.random() * seed.verses.length)];
            content = `
                <div class="learning-item">
                    <h4>📖 Quran Verse</h4>
                    <p class="arabic">${verse.arabic}</p>
                    <p class="english">${verse.english}</p>
                    <button class="learn-btn" onclick="learnConcept('quran-verse')">
                        📚 Learn More
                    </button>
                </div>
            `;
        } else if (seed.hadiths) {
            const hadith = seed.hadiths[Math.floor(Math.random() * seed.hadiths.length)];
            content = `
                <div class="learning-item">
                    <h4>📜 Hadith</h4>
                    <p class="arabic">${hadith.arabic}</p>
                    <p class="english">${hadith.english}</p>
                    <button class="learn-btn" onclick="learnConcept('hadith')">
                        📚 Learn More
                    </button>
                </div>
            `;
        } else if (seed.duas) {
            const dua = seed.duas[Math.floor(Math.random() * seed.duas.length)];
            content = `
                <div class="learning-item">
                    <h4>🤲 Dua</h4>
                    <p class="arabic">${dua.arabic}</p>
                    <p class="english">${dua.english}</p>
                    <button class="learn-btn" onclick="learnConcept('dua')">
                        📚 Learn More
                    </button>
                </div>
            `;
        } else if (seed.traits) {
            const trait = seed.traits[Math.floor(Math.random() * seed.traits.length)];
            content = `
                <div class="learning-item">
                    <h4>🌳 Islamic Character</h4>
                    <p class="trait">${trait}</p>
                    <p>Develop this noble character trait through daily practice and reflection.</p>
                    <button class="learn-btn" onclick="learnConcept('character')">
                        📚 Learn More
                    </button>
                </div>
            `;
        }
        
        lessonContent.innerHTML = content;
    }

    learnConcept(conceptId) {
        // Award knowledge and experience
        this.gameState.knowledge += 10;
        this.gameState.experience += 15;
        
        // Update quest progress
        this.updateQuestProgress('learn-concept');
        
        // Check level up
        this.checkLevelUp();
        
        // Update UI
        this.updateUI();
        
        this.showMessage('📚 Knowledge gained! Keep learning.', 'success');
        
        console.log(`📚 Learned concept: ${conceptId}`);
    }

    waterGarden() {
        let wateredCount = 0;
        
        for (const [plotId, plot] of this.garden.plots) {
            if (plot.state === 'growing') {
                // Speed up growth by 20%
                const remainingTime = plot.readyAt - Date.now();
                const speedup = remainingTime * 0.2;
                plot.readyAt -= speedup;
                
                plot.lastWatered = Date.now();
                wateredCount++;
                
                // Update visual
                this.updatePlotVisual(plotId);
            }
        }
        
        if (wateredCount > 0) {
            this.showMessage(`💧 Watered ${wateredCount} plants! Growth accelerated.`, 'success');
        } else {
            this.showMessage('💧 No plants need watering right now.', 'info');
        }
        
        console.log(`💧 Watered ${wateredCount} plants`);
    }

    harvestAll() {
        let harvestedCount = 0;
        let totalHasanat = 0;
        let totalKnowledge = 0;
        
        for (const [plotId, plot] of this.garden.plots) {
            if (plot.state === 'growing' && Date.now() >= plot.readyAt) {
                // Harvest the plant
                totalHasanat += plot.plant.hasanatReward;
                totalKnowledge += plot.plant.knowledgeReward;
                
                // Reset plot
                plot.state = 'empty';
                plot.plant = null;
                plot.plantedAt = null;
                plot.readyAt = null;
                
                this.garden.plotStates.set(plotId, 'empty');
                harvestedCount++;
                
                // Update visual
                this.updatePlotVisual(plotId);
            }
        }
        
        if (harvestedCount > 0) {
            this.gameState.hasanat += totalHasanat;
            this.gameState.knowledge += totalKnowledge;
            this.gameState.experience += totalHasanat;
            this.gameState.plantsGrowing -= harvestedCount;
            this.gameState.plantsHarvested += harvestedCount;
            
            // Update quest progress
            this.updateQuestProgress('harvest-plants', harvestedCount);
            
            // Check level up
            this.checkLevelUp();
            
            // Update UI
            this.updateUI();
            
            this.showMessage(`🎯 Harvested ${harvestedCount} plants! +${totalHasanat} Hasanat +${totalKnowledge} Knowledge`, 'success');
        } else {
            this.showMessage('🎯 No plants ready for harvest yet.', 'info');
        }
        
        console.log(`🎯 Harvested ${harvestedCount} plants`);
    }

    findEmptyPlot() {
        for (const [plotId, plot] of this.garden.plots) {
            if (plot.state === 'empty') {
                return plotId;
            }
        }
        return null;
    }

    updatePlotVisual(plotId) {
        const plotElement = document.querySelector(`[data-plot-id="${plotId}"]`);
        if (!plotElement) return;
        
        const plot = this.garden.plots.get(plotId);
        const emojiElement = plotElement.querySelector('.plot-emoji');
        const statusElement = plotElement.querySelector('.plot-status');
        const timerElement = plotElement.querySelector('.plot-timer');
        
        // Clear previous classes
        plotElement.classList.remove('empty', 'growing', 'ready', 'withered');
        
        if (plot.state === 'empty') {
            plotElement.classList.add('empty');
            emojiElement.textContent = '🏔️';
            statusElement.textContent = 'Empty';
            timerElement.textContent = '';
        } else if (plot.state === 'growing') {
            plotElement.classList.add('growing');
            emojiElement.textContent = plot.plant.emoji;
            statusElement.textContent = 'Growing';
            
            // Update timer
            const remainingTime = plot.readyAt - Date.now();
            if (remainingTime > 0) {
                timerElement.textContent = this.formatTime(remainingTime);
            } else {
                // Plant is ready
                plot.state = 'ready';
                this.updatePlotVisual(plotId);
            }
        } else if (plot.state === 'ready') {
            plotElement.classList.add('ready');
            emojiElement.textContent = plot.plant.emoji;
            statusElement.textContent = 'Ready! 🌟';
            timerElement.textContent = '✨ Harvest';
        }
    }

    updateQuestProgress(questType, amount = 1) {
        for (const [questId, quest] of this.islamicContent.quests) {
            if (quest.requirement === questType && !quest.completed) {
                quest.progress = Math.min(quest.progress + amount, quest.target);
                
                if (quest.progress >= quest.target) {
                    quest.completed = true;
                    this.gameState.hasanat += quest.reward.hasanat;
                    this.gameState.knowledge += quest.reward.knowledge;
                    this.gameState.questsCompleted++;
                    
                    this.showMessage(`🎯 Quest completed: ${quest.title}! +${quest.reward.hasanat} Hasanat +${quest.reward.knowledge} Knowledge`, 'success');
                }
            }
        }
        
        this.updateQuestDisplay();
    }

    updateQuestDisplay() {
        const questsList = document.getElementById('quests-list');
        if (!questsList) return;
        
        questsList.innerHTML = '';
        
        for (const [questId, quest] of this.islamicContent.quests) {
            const progress = Math.min(quest.progress, quest.target);
            const percentage = (progress / quest.target) * 100;
            
            const questHTML = `
                <div class="quest-item ${quest.completed ? 'completed' : ''}">
                    <div class="quest-header">
                        <h4>${quest.title}</h4>
                        <p class="arabic">${quest.titleArabic}</p>
                    </div>
                    <p class="quest-description">${quest.description}</p>
                    <div class="quest-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        <span class="progress-text">${progress}/${quest.target}</span>
                    </div>
                    <div class="quest-reward">
                        <span>✨ ${quest.reward.hasanat}</span>
                        <span>📚 ${quest.reward.knowledge}</span>
                    </div>
                </div>
            `;
            
            questsList.insertAdjacentHTML('beforeend', questHTML);
        }
    }

    checkLevelUp() {
        const expRequired = this.gameState.level * 100;
        if (this.gameState.experience >= expRequired) {
            this.gameState.level++;
            this.gameState.experience -= expRequired;
            
            // Unlock new content
            this.unlockContent();
            
            this.showMessage(`🎉 Level Up! Now level ${this.gameState.level}!`, 'success');
            
            console.log(`🎉 Level up! Now level ${this.gameState.level}`);
        }
    }

    unlockContent() {
        // Unlock new seeds based on level
        if (this.gameState.level >= 2) {
            this.gameState.unlockedContent.add('hadith-advanced');
        }
        if (this.gameState.level >= 3) {
            this.gameState.unlockedContent.add('character-development');
        }
        if (this.gameState.level >= 5) {
            this.gameState.unlockedContent.add('islamic-history');
        }
    }

    startGameTimers() {
        // Main game update loop
        this.gameTimer = setInterval(() => {
            this.updateGame();
        }, 1000); // Update every second
        
        // Auto-save every 30 seconds
        this.saveInterval = setInterval(() => {
            this.saveGameState();
        }, 30000);
    }

    updateGame() {
        // Update growing plants
        for (const [plotId, plot] of this.garden.plots) {
            if (plot.state === 'growing') {
                this.updatePlotVisual(plotId);
            }
        }
        
        // Update timers in UI
        this.updateUI();
    }

    updateUI() {
        // Update currency displays
        document.getElementById('hasanat-amount').textContent = this.gameState.hasanat.toLocaleString();
        document.getElementById('knowledge-amount').textContent = this.gameState.knowledge.toLocaleString();
        document.getElementById('player-level').textContent = this.gameState.level;
        
        // Update garden stats
        document.getElementById('plants-count').textContent = this.gameState.plantsGrowing;
        document.getElementById('knowledge-trees').textContent = this.gameState.plantsHarvested;
        
        // Update quest display
        this.updateQuestDisplay();
    }

    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `game-message ${type}`;
        messageElement.textContent = message;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 300);
        }, 3000);
    }

    showLearningDialog() {
        // Switch to Noor AI panel
        document.querySelector('[data-panel="noor"]').click();
        
        // Add welcome message
        const dialogue = document.getElementById('noor-dialogue');
        dialogue.innerHTML = `
            <div class="noor-message ai">
                <p>Assalamu Alaikum! 🌟 Welcome to your Islamic learning journey!</p>
                <p>I'm Noor, your AI companion. I can help you:</p>
                <ul>
                    <li>📖 Learn about Quran and Hadith</li>
                    <li>🤲 Understand Islamic prayers and duas</li>
                    <li>🌳 Develop good character traits</li>
                    <li>🎯 Complete daily spiritual goals</li>
                </ul>
                <p>What would you like to learn about today?</p>
            </div>
        `;
    }

    focusOnGarden() {
        // Switch to garden panel
        document.querySelector('[data-panel="garden"]').click();
        
        // Highlight garden
        const gardenGrid = document.getElementById('garden-grid');
        if (gardenGrid) {
            gardenGrid.style.animation = 'pulse 2s ease-in-out';
            setTimeout(() => {
                gardenGrid.style.animation = '';
            }, 2000);
        }
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    saveGameState() {
        const saveData = {
            gameState: this.gameState,
            garden: {
                plots: Array.from(this.garden.plots.entries()),
                plotStates: Array.from(this.garden.plotStates.entries())
            },
            quests: Array.from(this.islamicContent.quests.entries()),
            timestamp: Date.now()
        };
        
        localStorage.setItem('ai-jannah-save', JSON.stringify(saveData));
        console.log('💾 Game saved');
    }

    loadGameState() {
        const savedData = localStorage.getItem('ai-jannah-save');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                // Load game state
                this.gameState = { ...this.gameState, ...data.gameState };
                
                // Load garden
                if (data.garden) {
                    this.garden.plots = new Map(data.garden.plots);
                    this.garden.plotStates = new Map(data.garden.plotStates);
                }
                
                // Load quests
                if (data.quests) {
                    this.islamicContent.quests = new Map(data.quests);
                }
                
                console.log('📥 Game loaded');
            } catch (error) {
                console.error('❌ Failed to load game:', error);
            }
        }
    }

    dispose() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        if (this.saveInterval) {
            clearInterval(this.saveInterval);
        }
        
        // Save before disposing
        this.saveGameState();
        
        console.log('🎮 Gameplay Manager disposed');
    }
}