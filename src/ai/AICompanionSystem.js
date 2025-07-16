// Advanced AI Companion System with GPT-4 Integration
export class AICompanionSystem {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.model = 'gpt-4';
        this.personality = 'islamic-scholar';
        this.knowledgeBase = new Map();
        this.conversationHistory = [];
        this.learningAnalytics = new Map();
        this.realTimeProcessing = true;
        this.voiceSynthesis = null;
        this.speechRecognition = null;
        this.multilingualSupport = ['en', 'ar', 'ur', 'id', 'tr', 'fr'];
        this.islamicContext = {
            quranKnowledge: true,
            hadithDatabase: true,
            islamicJurisprudence: true,
            islamicHistory: true,
            arabicLanguage: true,
            tajweed: true,
            islamicPhilosophy: true
        };
    }

    async initialize(config) {
        console.log('🤖 Initializing Advanced AI Companion System');
        
        // Initialize OpenAI API
        this.setupOpenAI(config);
        
        // Load Islamic knowledge base
        await this.loadIslamicKnowledgeBase();
        
        // Initialize voice capabilities
        await this.initializeVoiceCapabilities();
        
        // Setup real-time processing
        this.setupRealTimeProcessing();
        
        // Initialize learning analytics
        this.initializeLearningAnalytics();
        
        console.log('✅ AI Companion System initialized');
    }

    setupOpenAI(config) {
        this.config = {
            model: config.model || 'gpt-4',
            maxTokens: 2000,
            temperature: 0.7,
            topP: 1,
            frequencyPenalty: 0.2,
            presencePenalty: 0.1,
            systemPrompt: `You are Noor, an advanced Islamic AI companion in the AI Jannah game. You are:
            - A knowledgeable Islamic scholar with deep understanding of Quran, Hadith, and Islamic jurisprudence
            - Fluent in Arabic and multiple languages
            - Patient, wise, and encouraging in your teaching approach
            - Focused on spiritual growth and character development
            - Contextually aware of the player's progress and needs
            - Able to provide personalized Islamic education
            - Supportive of the player's journey toward spiritual excellence
            
            Always respond with Islamic greetings when appropriate, provide authentic Islamic knowledge with sources, and maintain a respectful, educational tone. Guide players through their spiritual journey with wisdom and compassion.`
        };
    }

    async loadIslamicKnowledgeBase() {
        console.log('📚 Loading comprehensive Islamic knowledge base');
        
        // Quran knowledge
        this.knowledgeBase.set('quran', {
            verses: await this.loadQuranData(),
            tafsir: await this.loadTafsirData(),
            themes: await this.loadQuranThemes(),
            recitation: await this.loadRecitationData()
        });
        
        // Hadith knowledge
        this.knowledgeBase.set('hadith', {
            bukhari: await this.loadHadithCollection('bukhari'),
            muslim: await this.loadHadithCollection('muslim'),
            tirmidhi: await this.loadHadithCollection('tirmidhi'),
            abuDawud: await this.loadHadithCollection('abu-dawud'),
            nasai: await this.loadHadithCollection('nasai'),
            ibnMajah: await this.loadHadithCollection('ibn-majah')
        });
        
        // Islamic jurisprudence
        this.knowledgeBase.set('fiqh', {
            worship: await this.loadFiqhData('worship'),
            transactions: await this.loadFiqhData('transactions'),
            family: await this.loadFiqhData('family'),
            criminal: await this.loadFiqhData('criminal'),
            contemporary: await this.loadFiqhData('contemporary')
        });
        
        // Islamic history
        this.knowledgeBase.set('history', {
            prophetMuhammad: await this.loadHistoryData('prophet'),
            companions: await this.loadHistoryData('companions'),
            caliphates: await this.loadHistoryData('caliphates'),
            scholars: await this.loadHistoryData('scholars'),
            civilizations: await this.loadHistoryData('civilizations')
        });
        
        console.log('✅ Islamic knowledge base loaded');
    }

    async loadQuranData() {
        // Comprehensive Quran data with multiple translations
        return {
            totalVerses: 6236,
            totalSurahs: 114,
            translations: ['english', 'arabic', 'urdu', 'indonesian', 'turkish', 'french'],
            recitations: ['abdul-basit', 'mishary', 'sudais', 'maher', 'minshawi'],
            themes: [
                'faith', 'worship', 'morality', 'stories', 'laws', 'afterlife',
                'prophethood', 'divine-attributes', 'guidance', 'wisdom'
            ]
        };
    }

    async loadTafsirData() {
        return {
            classical: ['ibn-kathir', 'al-tabari', 'al-qurtubi', 'al-baghawi'],
            contemporary: ['sayyid-qutb', 'maududi', 'al-mizan', 'al-azhar'],
            linguistic: ['al-zamakhshari', 'abu-hayyan', 'al-alusi'],
            thematic: ['moral-teachings', 'legal-rulings', 'spiritual-guidance']
        };
    }

    async loadHadithCollection(collection) {
        // Load authentic hadith collections
        return {
            collection,
            totalHadith: this.getHadithCount(collection),
            chapters: await this.getHadithChapters(collection),
            authenticity: 'sahih',
            searchable: true,
            multilingual: true
        };
    }

    getHadithCount(collection) {
        const counts = {
            'bukhari': 7563,
            'muslim': 5362,
            'tirmidhi': 3956,
            'abu-dawud': 5274,
            'nasai': 5761,
            'ibn-majah': 4341
        };
        return counts[collection] || 0;
    }

    async initializeVoiceCapabilities() {
        console.log('🎙️ Initializing voice capabilities');
        
        // Text-to-Speech
        if ('speechSynthesis' in window) {
            this.voiceSynthesis = {
                enabled: true,
                voices: speechSynthesis.getVoices(),
                currentVoice: null,
                rate: 1.0,
                pitch: 1.0,
                volume: 1.0,
                
                speak: (text, language = 'en') => {
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = language;
                    utterance.rate = this.voiceSynthesis.rate;
                    utterance.pitch = this.voiceSynthesis.pitch;
                    utterance.volume = this.voiceSynthesis.volume;
                    
                    if (this.voiceSynthesis.currentVoice) {
                        utterance.voice = this.voiceSynthesis.currentVoice;
                    }
                    
                    speechSynthesis.speak(utterance);
                }
            };
        }
        
        // Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.speechRecognition = new SpeechRecognition();
            
            this.speechRecognition.continuous = true;
            this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = 'en-US';
            
            this.speechRecognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                this.handleSpeechInput(transcript);
            };
        }
        
        console.log('✅ Voice capabilities initialized');
    }

    setupRealTimeProcessing() {
        console.log('⚡ Setting up real-time processing');
        
        this.realTimeProcessor = {
            queue: [],
            processing: false,
            maxConcurrent: 3,
            
            add: (task) => {
                this.realTimeProcessor.queue.push(task);
                this.processQueue();
            },
            
            processQueue: async () => {
                if (this.realTimeProcessor.processing || this.realTimeProcessor.queue.length === 0) {
                    return;
                }
                
                this.realTimeProcessor.processing = true;
                
                while (this.realTimeProcessor.queue.length > 0) {
                    const task = this.realTimeProcessor.queue.shift();
                    await this.processTask(task);
                }
                
                this.realTimeProcessor.processing = false;
            }
        };
    }

    initializeLearningAnalytics() {
        console.log('📊 Initializing learning analytics');
        
        this.learningAnalytics = {
            playerProgress: new Map(),
            learningPatterns: new Map(),
            knowledgeGaps: new Map(),
            recommendations: new Map(),
            
            trackProgress: (playerId, topic, progress) => {
                if (!this.learningAnalytics.playerProgress.has(playerId)) {
                    this.learningAnalytics.playerProgress.set(playerId, new Map());
                }
                this.learningAnalytics.playerProgress.get(playerId).set(topic, progress);
            },
            
            analyzePatterns: (playerId) => {
                const progress = this.learningAnalytics.playerProgress.get(playerId);
                if (!progress) return null;
                
                const patterns = {
                    strongAreas: [],
                    weakAreas: [],
                    learningStyle: 'adaptive',
                    recommendedTopics: []
                };
                
                for (const [topic, score] of progress) {
                    if (score > 80) patterns.strongAreas.push(topic);
                    if (score < 50) patterns.weakAreas.push(topic);
                }
                
                return patterns;
            },
            
            generateRecommendations: (playerId) => {
                const patterns = this.learningAnalytics.analyzePatterns(playerId);
                if (!patterns) return [];
                
                const recommendations = [];
                
                // Recommend advanced topics for strong areas
                patterns.strongAreas.forEach(topic => {
                    recommendations.push({
                        type: 'advanced',
                        topic: `Advanced ${topic}`,
                        reason: `You've mastered ${topic}. Ready for advanced concepts?`
                    });
                });
                
                // Recommend foundational work for weak areas
                patterns.weakAreas.forEach(topic => {
                    recommendations.push({
                        type: 'foundational',
                        topic: `Fundamentals of ${topic}`,
                        reason: `Let's strengthen your foundation in ${topic}`
                    });
                });
                
                return recommendations;
            }
        };
    }

    async processMessage(message, playerId, context = {}) {
        console.log(`🤖 Processing message from player ${playerId}: ${message}`);
        
        try {
            // Analyze message intent
            const intent = await this.analyzeIntent(message);
            
            // Get player context
            const playerContext = await this.getPlayerContext(playerId);
            
            // Prepare enhanced prompt
            const enhancedPrompt = this.buildEnhancedPrompt(message, intent, playerContext, context);
            
            // Generate response using GPT-4
            const response = await this.generateResponse(enhancedPrompt);
            
            // Post-process response
            const processedResponse = await this.postProcessResponse(response, intent, playerContext);
            
            // Update learning analytics
            this.updateLearningAnalytics(playerId, intent, message, processedResponse);
            
            // Store conversation
            this.storeConversation(playerId, message, processedResponse);
            
            return processedResponse;
            
        } catch (error) {
            console.error('❌ Error processing message:', error);
            return this.getFallbackResponse(message);
        }
    }

    async analyzeIntent(message) {
        const intents = {
            quran_question: /quran|verse|surah|ayah|revelation/i,
            hadith_question: /hadith|sunnah|prophet|muhammad|tradition/i,
            prayer_question: /prayer|salah|namaz|wudu|qibla/i,
            fiqh_question: /halal|haram|permissible|forbidden|ruling/i,
            history_question: /history|companion|caliph|battle|conquest/i,
            spiritual_guidance: /guidance|help|advice|spiritual|growth/i,
            learning_progress: /progress|level|achievement|learning/i,
            general_islamic: /islam|muslim|allah|faith|belief/i
        };
        
        for (const [intent, pattern] of Object.entries(intents)) {
            if (pattern.test(message)) {
                return intent;
            }
        }
        
        return 'general_conversation';
    }

    async getPlayerContext(playerId) {
        return {
            learningProgress: this.learningAnalytics.playerProgress.get(playerId) || new Map(),
            preferences: this.getPlayerPreferences(playerId),
            currentLevel: this.getPlayerLevel(playerId),
            recentTopics: this.getRecentTopics(playerId),
            learningStyle: this.getLearningStyle(playerId)
        };
    }

    buildEnhancedPrompt(message, intent, playerContext, gameContext) {
        const contextualInfo = [];
        
        // Add player progress context
        if (playerContext.learningProgress.size > 0) {
            contextualInfo.push(`Player's learning progress: ${Array.from(playerContext.learningProgress.entries()).map(([topic, score]) => `${topic}: ${score}%`).join(', ')}`);
        }
        
        // Add game context
        if (gameContext.currentActivity) {
            contextualInfo.push(`Current game activity: ${gameContext.currentActivity}`);
        }
        
        // Add intent-specific context
        switch (intent) {
            case 'quran_question':
                contextualInfo.push('Focus on Quranic knowledge with proper citations and Arabic text when relevant.');
                break;
            case 'hadith_question':
                contextualInfo.push('Provide authentic hadith with proper chain of narration and source.');
                break;
            case 'prayer_question':
                contextualInfo.push('Give practical prayer guidance with step-by-step instructions.');
                break;
            case 'spiritual_guidance':
                contextualInfo.push('Provide compassionate spiritual guidance with Islamic wisdom.');
                break;
        }
        
        return `${this.config.systemPrompt}
        
        Context: ${contextualInfo.join(' ')}
        
        Player's question: ${message}
        
        Please provide a helpful, authentic, and educational response that considers the player's learning level and current context.`;
    }

    async generateResponse(prompt) {
        // Mock OpenAI API call - in production, use actual API
        const mockResponses = {
            quran: "SubhanAllah! The Quran is indeed the final revelation from Allah (SWT). The verse you're asking about is from Surah Al-Baqarah (2:255), the famous Ayat al-Kursi. This verse speaks about Allah's absolute sovereignty and knowledge. Would you like me to explain its deeper meanings and how it relates to your spiritual journey in the garden?",
            hadith: "Assalamu alaikum! The hadith you're referring to is from Sahih Bukhari, where the Prophet ﷺ said: 'The deeds are considered by the intentions, and a person will get the reward according to his intention.' This is fundamental to Islamic ethics and directly relates to your actions in the AI Jannah game. Every seed you plant with sincere intention (niyyah) for learning becomes a source of spiritual growth.",
            prayer: "May Allah guide your prayer journey! The five daily prayers are indeed the pillars of our faith. For Fajr, the dawn prayer, it's recommended to recite longer surahs as the angels bear witness to this prayer. In your game garden, you can set prayer reminders and earn special Hasanat when you complete prayers on time. Would you like me to guide you through the proper prayer timings?",
            default: "Barakallahu feeki for your question! Islam teaches us that seeking knowledge is a lifelong journey. In your AI Jannah garden, every question you ask helps your spiritual tree grow stronger. How can I help you learn more about our beautiful religion today?"
        };
        
        // Simple intent-based response selection
        for (const [key, response] of Object.entries(mockResponses)) {
            if (prompt.toLowerCase().includes(key)) {
                return response;
            }
        }
        
        return mockResponses.default;
    }

    async postProcessResponse(response, intent, playerContext) {
        // Add personalization based on player context
        let processedResponse = response;
        
        // Add appropriate Islamic greetings
        if (!response.includes('Assalamu alaikum') && !response.includes('SubhanAllah') && !response.includes('Barakallahu')) {
            processedResponse = `Assalamu alaikum! ${processedResponse}`;
        }
        
        // Add learning encouragement
        if (playerContext.currentLevel < 5) {
            processedResponse += '\n\nYou\'re making great progress in your Islamic learning journey! Keep exploring and asking questions.';
        }
        
        // Add Quranic reference if relevant
        if (intent === 'quran_question' && !response.includes('Quran')) {
            processedResponse += '\n\n"And whoever fears Allah, He will make for him a way out" (Quran 65:2)';
        }
        
        return processedResponse;
    }

    updateLearningAnalytics(playerId, intent, question, response) {
        // Track learning patterns
        const patterns = this.learningAnalytics.learningPatterns.get(playerId) || {};
        patterns[intent] = (patterns[intent] || 0) + 1;
        this.learningAnalytics.learningPatterns.set(playerId, patterns);
        
        // Update progress based on question complexity
        const complexity = this.assessQuestionComplexity(question);
        const currentProgress = this.learningAnalytics.playerProgress.get(playerId)?.get(intent) || 0;
        const newProgress = Math.min(100, currentProgress + complexity);
        
        this.learningAnalytics.trackProgress(playerId, intent, newProgress);
    }

    assessQuestionComplexity(question) {
        const complexityIndicators = {
            basic: ['what', 'who', 'when', 'where'],
            intermediate: ['how', 'why', 'explain', 'describe'],
            advanced: ['analyze', 'compare', 'evaluate', 'discuss', 'interpret']
        };
        
        const words = question.toLowerCase().split(' ');
        
        for (const word of words) {
            if (complexityIndicators.advanced.includes(word)) return 15;
            if (complexityIndicators.intermediate.includes(word)) return 10;
            if (complexityIndicators.basic.includes(word)) return 5;
        }
        
        return 3; // Default complexity
    }

    storeConversation(playerId, message, response) {
        const conversation = {
            playerId,
            timestamp: new Date().toISOString(),
            message,
            response,
            intent: this.analyzeIntent(message)
        };
        
        this.conversationHistory.push(conversation);
        
        // Keep only last 100 conversations per player
        if (this.conversationHistory.length > 100) {
            this.conversationHistory.shift();
        }
    }

    getFallbackResponse(message) {
        return "I apologize, but I'm having trouble understanding your question right now. Please try rephrasing it, or ask me about specific Islamic topics like Quran, Hadith, prayer, or Islamic history. I'm here to help with your spiritual learning journey!";
    }

    // Voice interaction methods
    async speakResponse(text, language = 'en') {
        if (this.voiceSynthesis && this.voiceSynthesis.enabled) {
            this.voiceSynthesis.speak(text, language);
        }
    }

    startListening() {
        if (this.speechRecognition) {
            this.speechRecognition.start();
        }
    }

    stopListening() {
        if (this.speechRecognition) {
            this.speechRecognition.stop();
        }
    }

    handleSpeechInput(transcript) {
        console.log('🎤 Speech input received:', transcript);
        // Process speech input as regular message
        this.processMessage(transcript, 'voice-user');
    }

    // Utility methods
    getPlayerPreferences(playerId) {
        return {
            language: 'en',
            voiceEnabled: true,
            difficultyLevel: 'intermediate',
            focusAreas: ['quran', 'hadith', 'prayer']
        };
    }

    getPlayerLevel(playerId) {
        const progress = this.learningAnalytics.playerProgress.get(playerId);
        if (!progress) return 1;
        
        const averageProgress = Array.from(progress.values()).reduce((a, b) => a + b, 0) / progress.size;
        return Math.floor(averageProgress / 20) + 1; // Level 1-5
    }

    getRecentTopics(playerId) {
        return this.conversationHistory
            .filter(conv => conv.playerId === playerId)
            .slice(-5)
            .map(conv => conv.intent);
    }

    getLearningStyle(playerId) {
        const patterns = this.learningAnalytics.learningPatterns.get(playerId) || {};
        const totalQuestions = Object.values(patterns).reduce((a, b) => a + b, 0);
        
        if (totalQuestions === 0) return 'adaptive';
        
        const topIntent = Object.entries(patterns)
            .sort(([,a], [,b]) => b - a)[0][0];
        
        const learningStyles = {
            'quran_question': 'textual',
            'hadith_question': 'narrative',
            'prayer_question': 'practical',
            'spiritual_guidance': 'reflective'
        };
        
        return learningStyles[topIntent] || 'adaptive';
    }

    update(deltaTime) {
        // Update AI processing queue
        if (this.realTimeProcessor.queue.length > 0) {
            this.realTimeProcessor.processQueue();
        }
        
        // Update learning analytics
        this.updateAnalytics();
    }

    updateAnalytics() {
        // Perform periodic analytics updates
        for (const [playerId, progress] of this.learningAnalytics.playerProgress) {
            const recommendations = this.learningAnalytics.generateRecommendations(playerId);
            this.learningAnalytics.recommendations.set(playerId, recommendations);
        }
    }

    dispose() {
        console.log('🤖 Disposing AI Companion System');
        
        // Stop speech recognition
        if (this.speechRecognition) {
            this.speechRecognition.stop();
        }
        
        // Stop speech synthesis
        if (this.voiceSynthesis) {
            speechSynthesis.cancel();
        }
        
        // Clear data
        this.knowledgeBase.clear();
        this.conversationHistory = [];
        this.learningAnalytics.playerProgress.clear();
        this.learningAnalytics.learningPatterns.clear();
    }
}