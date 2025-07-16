// Islamic Adventure Game - Journey to Knowledge
export class IslamicAdventureGame {
    constructor() {
        this.player = {
            name: '',
            level: 1,
            health: 100,
            knowledge: 0,
            faith: 100,
            hasanat: 0,
            inventory: new Map(),
            location: 'mecca',
            questsCompleted: [],
            companions: [],
            skills: {
                quranRecitation: 1,
                hadithKnowledge: 1,
                arabicLanguage: 1,
                islamicHistory: 1,
                leadership: 1
            }
        };
        
        this.gameWorld = {
            locations: new Map([
                ['mecca', {
                    name: 'The Sacred City of Mecca',
                    description: 'The holiest city in Islam, where the Kaaba stands majestically.',
                    challenges: ['pilgrimage-rituals', 'crowd-navigation', 'spiritual-focus'],
                    npcs: ['pilgrimage-guide', 'scholar-of-hadith', 'imam'],
                    items: ['blessed-water', 'prayer-beads', 'quran-copy'],
                    unlocked: true
                }],
                ['medina', {
                    name: 'The City of the Prophet',
                    description: 'The city where Prophet Muhammad (PBUH) established the first Islamic community.',
                    challenges: ['community-building', 'conflict-resolution', 'treaty-negotiation'],
                    npcs: ['companion-abu-bakr', 'companion-umar', 'ansar-leader'],
                    items: ['prophetic-sword', 'constitution-scroll', 'date-palm-branch'],
                    unlocked: false
                }],
                ['jerusalem', {
                    name: 'Al-Quds - The Holy City',
                    description: 'The third holiest site in Islam, where Prophet Muhammad ascended to heaven.',
                    challenges: ['interfaith-dialogue', 'historical-knowledge', 'spiritual-ascension'],
                    npcs: ['guardian-of-aqsa', 'christian-monk', 'jewish-scholar'],
                    items: ['golden-dome-key', 'ascension-ladder', 'peace-treaty'],
                    unlocked: false
                }],
                ['cordoba', {
                    name: 'Cordoba - City of Learning',
                    description: 'The heart of Islamic scholarship in Al-Andalus.',
                    challenges: ['academic-debate', 'translation-work', 'scientific-discovery'],
                    npcs: ['ibn-rushd', 'librarian', 'student-of-philosophy'],
                    items: ['philosophy-manuscript', 'astrolabe', 'medical-treatise'],
                    unlocked: false
                }],
                ['baghdad', {
                    name: 'Baghdad - House of Wisdom',
                    description: 'The center of the Islamic Golden Age and learning.',
                    challenges: ['research-project', 'invention-creation', 'wisdom-synthesis'],
                    npcs: ['al-kindi', 'translator', 'mathematician'],
                    items: ['algebra-book', 'astronomical-tool', 'wisdom-scroll'],
                    unlocked: false
                }]
            ]),
            
            quests: new Map([
                ['hajj-pilgrimage', {
                    id: 'hajj-pilgrimage',
                    title: 'The Great Pilgrimage',
                    description: 'Complete all the rituals of Hajj and gain spiritual purification.',
                    location: 'mecca',
                    objectives: [
                        'Perform Tawaf around the Kaaba',
                        'Run between Safa and Marwa',
                        'Stand at Arafat for prayer',
                        'Collect stones at Muzdalifah',
                        'Stone the pillars at Mina'
                    ],
                    rewards: { hasanat: 1000, faith: 50, knowledge: 100 },
                    difficulty: 'hard',
                    timeLimit: 300000, // 5 minutes
                    active: false,
                    completed: false
                }],
                ['build-community', {
                    id: 'build-community',
                    title: 'Building the Ummah',
                    description: 'Unite the tribes and establish a just Islamic society.',
                    location: 'medina',
                    objectives: [
                        'Mediate between Aws and Khazraj tribes',
                        'Draft the Constitution of Medina',
                        'Establish fair trade practices',
                        'Create education system',
                        'Build defense alliances'
                    ],
                    rewards: { hasanat: 800, leadership: 3, knowledge: 150 },
                    difficulty: 'expert',
                    timeLimit: 420000, // 7 minutes
                    active: false,
                    completed: false
                }],
                ['night-journey', {
                    id: 'night-journey',
                    title: 'The Night Journey (Isra and Miraj)',
                    description: 'Experience the spiritual journey from Mecca to Jerusalem and beyond.',
                    location: 'jerusalem',
                    objectives: [
                        'Purify your soul through prayer',
                        'Meet the prophets in the heavens',
                        'Receive the gift of five daily prayers',
                        'Return with divine wisdom',
                        'Teach others about the experience'
                    ],
                    rewards: { hasanat: 1500, faith: 75, knowledge: 200 },
                    difficulty: 'legendary',
                    timeLimit: 600000, // 10 minutes
                    active: false,
                    completed: false
                }]
            ]),
            
            challenges: new Map([
                ['quran-recitation', {
                    name: 'Quran Recitation Challenge',
                    description: 'Recite verses with proper Tajweed and understanding.',
                    type: 'skill',
                    difficulty: 'medium',
                    reward: { hasanat: 50, quranRecitation: 1 },
                    minLevel: 1
                }],
                ['hadith-knowledge', {
                    name: 'Hadith Authenticity Test',
                    description: 'Identify authentic Hadith and their chains of narration.',
                    type: 'knowledge',
                    difficulty: 'hard',
                    reward: { hasanat: 100, hadithKnowledge: 1 },
                    minLevel: 3
                }],
                ['arabic-translation', {
                    name: 'Arabic Translation Challenge',
                    description: 'Translate complex Arabic texts into multiple languages.',
                    type: 'language',
                    difficulty: 'expert',
                    reward: { hasanat: 150, arabicLanguage: 2 },
                    minLevel: 5
                }],
                ['strategic-battle', {
                    name: 'Battle of Badr Strategy',
                    description: 'Lead the Muslim army to victory using wisdom and tactics.',
                    type: 'strategy',
                    difficulty: 'legendary',
                    reward: { hasanat: 300, leadership: 3 },
                    minLevel: 7
                }]
            ])
        };
        
        this.gameState = {
            currentQuest: null,
            timeRemaining: 0,
            questTimer: null,
            gameTimer: null,
            score: 0,
            streak: 0,
            achievements: [],
            difficulty: 'normal'
        };
        
        this.isInitialized = false;
    }
    
    async initialize() {
        console.log('🏛️ Initializing Islamic Adventure Game');
        
        // Create game UI
        this.createGameInterface();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start game loop
        this.startGameLoop();
        
        // Show welcome screen
        this.showWelcomeScreen();
        
        this.isInitialized = true;
        console.log('✅ Islamic Adventure Game initialized');
    }
    
    createGameInterface() {
        const gameCanvas = document.getElementById('game-canvas');
        
        gameCanvas.innerHTML = `
            <div class="adventure-game-container">
                <div class="game-header">
                    <h1>🕌 Islamic Adventure: Journey to Knowledge</h1>
                    <div class="player-stats">
                        <div class="stat-item">
                            <span class="stat-label">Level:</span>
                            <span id="player-level">${this.player.level}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Health:</span>
                            <div class="health-bar">
                                <div class="health-fill" style="width: ${this.player.health}%"></div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Faith:</span>
                            <div class="faith-bar">
                                <div class="faith-fill" style="width: ${this.player.faith}%"></div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Knowledge:</span>
                            <span id="player-knowledge">${this.player.knowledge}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Hasanat:</span>
                            <span id="player-hasanat">${this.player.hasanat}</span>
                        </div>
                    </div>
                </div>
                
                <div class="game-content">
                    <div class="location-view" id="location-view">
                        <div class="location-header">
                            <h2 id="location-name">Select Your Journey</h2>
                            <p id="location-description">Choose your path in the Islamic adventure</p>
                        </div>
                        
                        <div class="location-grid" id="location-grid">
                            ${this.renderLocationGrid()}
                        </div>
                    </div>
                    
                    <div class="quest-view" id="quest-view" style="display: none;">
                        <div class="quest-header">
                            <h2 id="quest-title">Quest Title</h2>
                            <p id="quest-description">Quest description</p>
                            <div class="quest-timer">
                                <span>Time Remaining: </span>
                                <span id="timer-display">00:00</span>
                            </div>
                        </div>
                        
                        <div class="quest-objectives" id="quest-objectives">
                            <!-- Objectives will be populated dynamically -->
                        </div>
                        
                        <div class="quest-actions">
                            <button id="complete-objective" class="quest-btn primary">
                                Complete Current Objective
                            </button>
                            <button id="abandon-quest" class="quest-btn secondary">
                                Abandon Quest
                            </button>
                        </div>
                    </div>
                    
                    <div class="challenge-view" id="challenge-view" style="display: none;">
                        <div class="challenge-content">
                            <h2 id="challenge-title">Challenge Title</h2>
                            <p id="challenge-description">Challenge description</p>
                            <div id="challenge-interface">
                                <!-- Challenge-specific interface -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="game-actions">
                    <button id="view-inventory" class="action-btn">
                        🎒 Inventory
                    </button>
                    <button id="view-skills" class="action-btn">
                        📚 Skills
                    </button>
                    <button id="view-achievements" class="action-btn">
                        🏆 Achievements
                    </button>
                    <button id="save-game" class="action-btn">
                        💾 Save Game
                    </button>
                </div>
            </div>
        `;
    }
    
    renderLocationGrid() {
        let html = '';
        
        for (const [locationId, location] of this.gameWorld.locations) {
            const isUnlocked = location.unlocked || this.player.level >= this.getRequiredLevel(locationId);
            const cssClass = isUnlocked ? 'location-card unlocked' : 'location-card locked';
            
            html += `
                <div class="${cssClass}" data-location="${locationId}" onclick="selectLocation('${locationId}')">
                    <div class="location-icon">
                        ${this.getLocationIcon(locationId)}
                    </div>
                    <h3>${location.name}</h3>
                    <p>${location.description}</p>
                    <div class="location-info">
                        <span class="difficulty">${this.getLocationDifficulty(locationId)}</span>
                        <span class="rewards">Rewards: ${this.getLocationRewards(locationId)}</span>
                    </div>
                    ${!isUnlocked ? `<div class="lock-overlay">🔒 Level ${this.getRequiredLevel(locationId)} Required</div>` : ''}
                </div>
            `;
        }
        
        return html;
    }
    
    getLocationIcon(locationId) {
        const icons = {
            'mecca': '🕋',
            'medina': '🕌',
            'jerusalem': '🌙',
            'cordoba': '📚',
            'baghdad': '🏛️'
        };
        return icons[locationId] || '🏛️';
    }
    
    getLocationDifficulty(locationId) {
        const difficulties = {
            'mecca': 'Moderate',
            'medina': 'Hard',
            'jerusalem': 'Expert',
            'cordoba': 'Hard',
            'baghdad': 'Expert'
        };
        return difficulties[locationId] || 'Normal';
    }
    
    getLocationRewards(locationId) {
        const rewards = {
            'mecca': '1000 Hasanat',
            'medina': '800 Hasanat + Leadership',
            'jerusalem': '1500 Hasanat + Faith',
            'cordoba': '1200 Hasanat + Knowledge',
            'baghdad': '2000 Hasanat + Wisdom'
        };
        return rewards[locationId] || '500 Hasanat';
    }
    
    getRequiredLevel(locationId) {
        const levels = {
            'mecca': 1,
            'medina': 3,
            'jerusalem': 5,
            'cordoba': 4,
            'baghdad': 6
        };
        return levels[locationId] || 1;
    }
    
    setupEventListeners() {
        // Global functions for UI interaction
        window.selectLocation = (locationId) => this.selectLocation(locationId);
        window.startQuest = (questId) => this.startQuest(questId);
        window.completeObjective = () => this.completeObjective();
        window.abandonQuest = () => this.abandonQuest();
        window.viewInventory = () => this.viewInventory();
        window.viewSkills = () => this.viewSkills();
        window.viewAchievements = () => this.viewAchievements();
        window.saveGame = () => this.saveGame();
        
        // Button event listeners
        document.addEventListener('click', (e) => {
            if (e.target.id === 'complete-objective') {
                this.completeObjective();
            } else if (e.target.id === 'abandon-quest') {
                this.abandonQuest();
            } else if (e.target.id === 'view-inventory') {
                this.viewInventory();
            } else if (e.target.id === 'view-skills') {
                this.viewSkills();
            } else if (e.target.id === 'view-achievements') {
                this.viewAchievements();
            } else if (e.target.id === 'save-game') {
                this.saveGame();
            }
        });
    }
    
    selectLocation(locationId) {
        const location = this.gameWorld.locations.get(locationId);
        if (!location) return;
        
        const isUnlocked = location.unlocked || this.player.level >= this.getRequiredLevel(locationId);
        if (!isUnlocked) {
            this.showMessage(`Level ${this.getRequiredLevel(locationId)} required to access ${location.name}`, 'error');
            return;
        }
        
        this.player.location = locationId;
        this.showLocationDetails(location);
    }
    
    showLocationDetails(location) {
        const locationView = document.getElementById('location-view');
        const questView = document.getElementById('quest-view');
        
        locationView.style.display = 'block';
        questView.style.display = 'none';
        
        document.getElementById('location-name').textContent = location.name;
        document.getElementById('location-description').textContent = location.description;
        
        // Show available quests for this location
        const questsHtml = this.renderLocationQuests(location);
        document.getElementById('location-grid').innerHTML = questsHtml;
    }
    
    renderLocationQuests(location) {
        let html = '<h3>Available Quests:</h3><div class="quest-grid">';
        
        for (const [questId, quest] of this.gameWorld.quests) {
            if (quest.location === this.player.location) {
                const isCompleted = this.player.questsCompleted.includes(questId);
                const cssClass = isCompleted ? 'quest-card completed' : 'quest-card available';
                
                html += `
                    <div class="${cssClass}" onclick="startQuest('${questId}')">
                        <h4>${quest.title}</h4>
                        <p>${quest.description}</p>
                        <div class="quest-info">
                            <span class="difficulty">${quest.difficulty}</span>
                            <span class="time-limit">Time: ${Math.floor(quest.timeLimit / 60000)}:${((quest.timeLimit % 60000) / 1000).toFixed(0).padStart(2, '0')}</span>
                        </div>
                        <div class="quest-rewards">
                            Rewards: ${quest.rewards.hasanat} Hasanat, ${quest.rewards.knowledge} Knowledge
                        </div>
                        ${isCompleted ? '<div class="completed-overlay">✅ Completed</div>' : ''}
                    </div>
                `;
            }
        }
        
        html += '</div>';
        return html;
    }
    
    startQuest(questId) {
        const quest = this.gameWorld.quests.get(questId);
        if (!quest) return;
        
        if (this.player.questsCompleted.includes(questId)) {
            this.showMessage('Quest already completed!', 'info');
            return;
        }
        
        this.gameState.currentQuest = quest;
        this.gameState.timeRemaining = quest.timeLimit;
        quest.active = true;
        quest.currentObjective = 0;
        
        this.showQuestView(quest);
        this.startQuestTimer();
    }
    
    showQuestView(quest) {
        const locationView = document.getElementById('location-view');
        const questView = document.getElementById('quest-view');
        
        locationView.style.display = 'none';
        questView.style.display = 'block';
        
        document.getElementById('quest-title').textContent = quest.title;
        document.getElementById('quest-description').textContent = quest.description;
        
        this.updateQuestObjectives(quest);
        this.updateQuestTimer();
    }
    
    updateQuestObjectives(quest) {
        const objectivesContainer = document.getElementById('quest-objectives');
        let html = '<h3>Objectives:</h3><ul class="objectives-list">';
        
        quest.objectives.forEach((objective, index) => {
            const isCompleted = index < quest.currentObjective;
            const isCurrent = index === quest.currentObjective;
            const cssClass = isCompleted ? 'completed' : (isCurrent ? 'current' : 'pending');
            
            html += `<li class="objective ${cssClass}">${objective}</li>`;
        });
        
        html += '</ul>';
        objectivesContainer.innerHTML = html;
    }
    
    startQuestTimer() {
        if (this.gameState.questTimer) {
            clearInterval(this.gameState.questTimer);
        }
        
        this.gameState.questTimer = setInterval(() => {
            this.gameState.timeRemaining -= 1000;
            this.updateQuestTimer();
            
            if (this.gameState.timeRemaining <= 0) {
                this.failQuest();
            }
        }, 1000);
    }
    
    updateQuestTimer() {
        const minutes = Math.floor(this.gameState.timeRemaining / 60000);
        const seconds = Math.floor((this.gameState.timeRemaining % 60000) / 1000);
        document.getElementById('timer-display').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    completeObjective() {
        const quest = this.gameState.currentQuest;
        if (!quest) return;
        
        // Start appropriate challenge based on objective
        this.startObjectiveChallenge(quest, quest.currentObjective);
    }
    
    startObjectiveChallenge(quest, objectiveIndex) {
        const objective = quest.objectives[objectiveIndex];
        
        // Create challenge based on objective type
        const challengeType = this.getChallengeType(objective);
        this.showChallenge(challengeType, objective, () => {
            this.onObjectiveCompleted(quest, objectiveIndex);
        });
    }
    
    getChallengeType(objective) {
        if (objective.includes('Tawaf') || objective.includes('pray')) return 'spiritual';
        if (objective.includes('mediate') || objective.includes('unite')) return 'leadership';
        if (objective.includes('knowledge') || objective.includes('learn')) return 'knowledge';
        if (objective.includes('battle') || objective.includes('strategy')) return 'strategy';
        return 'general';
    }
    
    showChallenge(challengeType, objective, onComplete) {
        const challengeView = document.getElementById('challenge-view');
        const questView = document.getElementById('quest-view');
        
        questView.style.display = 'none';
        challengeView.style.display = 'block';
        
        document.getElementById('challenge-title').textContent = objective;
        document.getElementById('challenge-description').textContent = 
            `Complete this ${challengeType} challenge to proceed.`;
        
        // Create challenge interface based on type
        const challengeInterface = document.getElementById('challenge-interface');
        challengeInterface.innerHTML = this.getChallengeInterface(challengeType, onComplete);
    }
    
    getChallengeInterface(challengeType, onComplete) {
        switch (challengeType) {
            case 'spiritual':
                return this.createSpiritualChallenge(onComplete);
            case 'leadership':
                return this.createLeadershipChallenge(onComplete);
            case 'knowledge':
                return this.createKnowledgeChallenge(onComplete);
            case 'strategy':
                return this.createStrategyChallenge(onComplete);
            default:
                return this.createGeneralChallenge(onComplete);
        }
    }
    
    createSpiritualChallenge(onComplete) {
        const verses = [
            { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', english: 'Our Lord, give us good in this world and good in the hereafter, and save us from the punishment of the Fire' },
            { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', english: 'My Lord, expand my chest and make my task easy for me' },
            { arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', english: 'O Allah, help me to remember You, to give thanks to You, and to worship You well' }
        ];
        
        const randomVerse = verses[Math.floor(Math.random() * verses.length)];
        
        return `
            <div class="spiritual-challenge">
                <h4>Recite this verse with proper intention:</h4>
                <div class="verse-display">
                    <p class="arabic-text">${randomVerse.arabic}</p>
                    <p class="english-text">${randomVerse.english}</p>
                </div>
                <button onclick="(${onComplete})()" class="challenge-complete-btn">
                    Complete Recitation
                </button>
            </div>
        `;
    }
    
    createLeadershipChallenge(onComplete) {
        const scenarios = [
            'Two tribes are in conflict over water rights. How do you mediate?',
            'A merchant is accused of unfair practices. How do you investigate?',
            'Resources are scarce during a siege. How do you distribute them?'
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        return `
            <div class="leadership-challenge">
                <h4>Leadership Decision:</h4>
                <p>${scenario}</p>
                <div class="decision-options">
                    <button onclick="(${onComplete})()" class="decision-btn">
                        Apply Islamic justice principles
                    </button>
                    <button onclick="(${onComplete})()" class="decision-btn">
                        Seek consultation (Shura)
                    </button>
                    <button onclick="(${onComplete})()" class="decision-btn">
                        Study precedents from Prophet's time
                    </button>
                </div>
            </div>
        `;
    }
    
    createKnowledgeChallenge(onComplete) {
        const questions = [
            { question: 'What is the first pillar of Islam?', answer: 'Shahada' },
            { question: 'Which surah is known as the heart of the Quran?', answer: 'Ya-Sin' },
            { question: 'What does "Hadith" mean?', answer: 'Saying or tradition of Prophet Muhammad' }
        ];
        
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        
        return `
            <div class="knowledge-challenge">
                <h4>Knowledge Test:</h4>
                <p>${randomQuestion.question}</p>
                <input type="text" id="knowledge-answer" placeholder="Enter your answer">
                <button onclick="if(document.getElementById('knowledge-answer').value.toLowerCase().includes('${randomQuestion.answer.toLowerCase()}')) (${onComplete})(); else alert('Try again!');" class="challenge-complete-btn">
                    Submit Answer
                </button>
            </div>
        `;
    }
    
    createStrategyChallenge(onComplete) {
        return `
            <div class="strategy-challenge">
                <h4>Strategic Decision:</h4>
                <p>Plan your approach for the upcoming challenge:</p>
                <div class="strategy-grid">
                    <div class="strategy-option" onclick="(${onComplete})()">
                        <h5>Wisdom First</h5>
                        <p>Seek guidance through prayer and consultation</p>
                    </div>
                    <div class="strategy-option" onclick="(${onComplete})()">
                        <h5>Unity Building</h5>
                        <p>Focus on bringing people together</p>
                    </div>
                    <div class="strategy-option" onclick="(${onComplete})()">
                        <h5>Knowledge Approach</h5>
                        <p>Research and understand all aspects</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    createGeneralChallenge(onComplete) {
        return `
            <div class="general-challenge">
                <h4>Complete the Task:</h4>
                <p>Focus your intention and complete this objective with Islamic values in mind.</p>
                <button onclick="(${onComplete})()" class="challenge-complete-btn">
                    Complete with Bismillah
                </button>
            </div>
        `;
    }
    
    onObjectiveCompleted(quest, objectiveIndex) {
        // Hide challenge view and return to quest view
        document.getElementById('challenge-view').style.display = 'none';
        document.getElementById('quest-view').style.display = 'block';
        
        // Mark objective as completed
        quest.currentObjective++;
        
        // Award partial rewards
        const partialReward = Math.floor(quest.rewards.hasanat / quest.objectives.length);
        this.player.hasanat += partialReward;
        
        // Update UI
        this.updateQuestObjectives(quest);
        this.updatePlayerStats();
        
        // Check if quest is complete
        if (quest.currentObjective >= quest.objectives.length) {
            this.completeQuest(quest);
        } else {
            this.showMessage(`Objective completed! +${partialReward} Hasanat`, 'success');
        }
    }
    
    completeQuest(quest) {
        clearInterval(this.gameState.questTimer);
        
        // Award full rewards
        this.player.hasanat += quest.rewards.hasanat;
        this.player.knowledge += quest.rewards.knowledge || 0;
        this.player.faith += quest.rewards.faith || 0;
        
        // Level up if enough experience
        if (this.player.knowledge >= this.player.level * 100) {
            this.levelUp();
        }
        
        // Mark quest as completed
        quest.completed = true;
        quest.active = false;
        this.player.questsCompleted.push(quest.id);
        
        // Unlock new locations
        this.unlockNewContent();
        
        // Update UI
        this.updatePlayerStats();
        
        // Show completion message
        this.showQuestCompletionDialog(quest);
    }
    
    showQuestCompletionDialog(quest) {
        const dialog = document.createElement('div');
        dialog.className = 'quest-completion-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h2>🎉 Quest Completed!</h2>
                <h3>${quest.title}</h3>
                <div class="rewards-display">
                    <h4>Rewards Earned:</h4>
                    <p>✨ ${quest.rewards.hasanat} Hasanat</p>
                    <p>📚 ${quest.rewards.knowledge || 0} Knowledge</p>
                    <p>🤲 ${quest.rewards.faith || 0} Faith</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove(); window.returnToLocationView()" class="continue-btn">
                    Continue Journey
                </button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        window.returnToLocationView = () => {
            document.getElementById('quest-view').style.display = 'none';
            document.getElementById('location-view').style.display = 'block';
            document.getElementById('location-grid').innerHTML = this.renderLocationGrid();
        };
    }
    
    levelUp() {
        this.player.level++;
        this.player.knowledge = 0; // Reset knowledge for next level
        this.player.health = 100; // Restore health
        this.player.faith = Math.min(100, this.player.faith + 25); // Boost faith
        
        this.showMessage(`🎉 Level Up! You are now level ${this.player.level}!`, 'success');
        
        // Unlock new abilities or locations
        this.unlockNewContent();
    }
    
    unlockNewContent() {
        // Unlock locations based on level
        const unlockedLocations = [];
        
        if (this.player.level >= 3 && !this.gameWorld.locations.get('medina').unlocked) {
            this.gameWorld.locations.get('medina').unlocked = true;
            unlockedLocations.push('Medina');
        }
        
        if (this.player.level >= 4 && !this.gameWorld.locations.get('cordoba').unlocked) {
            this.gameWorld.locations.get('cordoba').unlocked = true;
            unlockedLocations.push('Cordoba');
        }
        
        if (this.player.level >= 5 && !this.gameWorld.locations.get('jerusalem').unlocked) {
            this.gameWorld.locations.get('jerusalem').unlocked = true;
            unlockedLocations.push('Jerusalem');
        }
        
        if (this.player.level >= 6 && !this.gameWorld.locations.get('baghdad').unlocked) {
            this.gameWorld.locations.get('baghdad').unlocked = true;
            unlockedLocations.push('Baghdad');
        }
        
        if (unlockedLocations.length > 0) {
            this.showMessage(`🔓 New locations unlocked: ${unlockedLocations.join(', ')}!`, 'info');
        }
    }
    
    failQuest() {
        clearInterval(this.gameState.questTimer);
        
        const quest = this.gameState.currentQuest;
        quest.active = false;
        this.gameState.currentQuest = null;
        
        // Penalty for failure
        this.player.faith = Math.max(0, this.player.faith - 10);
        this.player.health = Math.max(0, this.player.health - 20);
        
        this.updatePlayerStats();
        this.showMessage('⏰ Quest failed! Time ran out. Faith and health reduced.', 'error');
        
        // Return to location view
        document.getElementById('quest-view').style.display = 'none';
        document.getElementById('location-view').style.display = 'block';
    }
    
    abandonQuest() {
        if (this.gameState.currentQuest) {
            clearInterval(this.gameState.questTimer);
            this.gameState.currentQuest.active = false;
            this.gameState.currentQuest = null;
            
            // Small penalty for abandoning
            this.player.faith = Math.max(0, this.player.faith - 5);
            this.updatePlayerStats();
            
            // Return to location view
            document.getElementById('quest-view').style.display = 'none';
            document.getElementById('location-view').style.display = 'block';
            
            this.showMessage('Quest abandoned. Faith slightly reduced.', 'info');
        }
    }
    
    updatePlayerStats() {
        document.getElementById('player-level').textContent = this.player.level;
        document.getElementById('player-knowledge').textContent = this.player.knowledge;
        document.getElementById('player-hasanat').textContent = this.player.hasanat;
        
        document.querySelector('.health-fill').style.width = `${this.player.health}%`;
        document.querySelector('.faith-fill').style.width = `${this.player.faith}%`;
    }
    
    showWelcomeScreen() {
        const welcome = document.createElement('div');
        welcome.className = 'welcome-screen';
        welcome.innerHTML = `
            <div class="welcome-content">
                <h1>🕌 Welcome to Islamic Adventure</h1>
                <p>Embark on a spiritual journey through Islamic history and knowledge</p>
                <h2>Your Mission:</h2>
                <ul>
                    <li>🕋 Complete the sacred pilgrimage in Mecca</li>
                    <li>🏛️ Build the first Islamic community in Medina</li>
                    <li>🌙 Experience the miraculous Night Journey</li>
                    <li>📚 Seek knowledge in the great centers of learning</li>
                    <li>⚔️ Lead with wisdom and justice</li>
                </ul>
                <button onclick="this.parentElement.remove()" class="start-game-btn">
                    Begin Your Journey
                </button>
            </div>
        `;
        
        document.body.appendChild(welcome);
    }
    
    viewInventory() {
        // Implementation for inventory view
        this.showMessage('Inventory system coming soon!', 'info');
    }
    
    viewSkills() {
        // Implementation for skills view
        this.showMessage('Skills system coming soon!', 'info');
    }
    
    viewAchievements() {
        // Implementation for achievements view
        this.showMessage('Achievements system coming soon!', 'info');
    }
    
    saveGame() {
        const saveData = {
            player: this.player,
            gameState: this.gameState,
            timestamp: Date.now()
        };
        
        localStorage.setItem('islamic-adventure-save', JSON.stringify(saveData));
        this.showMessage('Game saved successfully!', 'success');
    }
    
    loadGame() {
        const savedData = localStorage.getItem('islamic-adventure-save');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.player = { ...this.player, ...data.player };
            this.gameState = { ...this.gameState, ...data.gameState };
            this.updatePlayerStats();
            this.showMessage('Game loaded successfully!', 'success');
        }
    }
    
    startGameLoop() {
        this.gameState.gameTimer = setInterval(() => {
            this.updateGame();
        }, 1000);
    }
    
    updateGame() {
        // Auto-save every 30 seconds
        if (Date.now() % 30000 < 1000) {
            this.saveGame();
        }
        
        // Regenerate faith slowly over time
        if (this.player.faith < 100) {
            this.player.faith = Math.min(100, this.player.faith + 0.1);
            this.updatePlayerStats();
        }
    }
    
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `game-message ${type}`;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(messageEl);
            }, 300);
        }, 3000);
    }
    
    dispose() {
        if (this.gameState.gameTimer) {
            clearInterval(this.gameState.gameTimer);
        }
        if (this.gameState.questTimer) {
            clearInterval(this.gameState.questTimer);
        }
        
        // Save before disposing
        this.saveGame();
        
        console.log('🏛️ Islamic Adventure Game disposed');
    }
}