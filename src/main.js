// AI Jannah Game - Main Entry Point
import { GameEngine } from './engine/GameEngine.js';
import { UIManager } from './managers/UIManager.js';
import { AudioManager } from './managers/AudioManager.js';
import { SaveManager } from './managers/SaveManager.js';

class AIJannahGame {
    constructor() {
        this.gameEngine = null;
        this.uiManager = null;
        this.audioManager = null;
        this.saveManager = null;
        this.isLoaded = false;
    }

    async init() {
        try {
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize core systems
            await this.initializeManagers();
            
            // Load game data
            await this.loadGameData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Hide loading screen and show game
            this.hideLoadingScreen();
            
            console.log('🌟 AI Jannah Game Initialized Successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize AI Jannah Game:', error);
            this.showErrorScreen(error);
        }
    }

    async initializeManagers() {
        // Initialize Audio Manager
        this.audioManager = new AudioManager();
        await this.audioManager.init();

        // Initialize Save Manager
        this.saveManager = new SaveManager();
        await this.saveManager.init();

        // Initialize UI Manager
        this.uiManager = new UIManager();
        await this.uiManager.init();

        // Initialize Game Engine
        this.gameEngine = new GameEngine(this.uiManager, this.audioManager, this.saveManager);
        await this.gameEngine.init();
    }

    async loadGameData() {
        // Load player data
        const playerData = await this.saveManager.loadPlayerData();
        if (playerData) {
            this.gameEngine.loadPlayerData(playerData);
        }

        // Load Islamic content data
        await this.gameEngine.loadIslamicContent();
        
        // Start game loop
        this.gameEngine.start();
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveManager.savePlayerData(this.gameEngine.getPlayerData());
        });

        window.addEventListener('resize', () => {
            this.gameEngine.handleResize();
        });

        // Visibility change for prayer reminders
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.gameEngine.pause();
            } else {
                this.gameEngine.resume();
            }
        });
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.querySelector('.loading-progress');
        
        // Animate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = `${progress}%`;
        }, 200);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                gameContainer.style.display = 'grid';
                gameContainer.classList.add('fade-in');
                this.isLoaded = true;
            }, 500);
        }, 1000);
    }

    showErrorScreen(error) {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingContent = document.querySelector('.loading-content');
        
        loadingContent.innerHTML = `
            <div class="error-content">
                <h2>❌ Loading Error</h2>
                <p>We encountered an issue loading AI Jannah. Please refresh the page.</p>
                <p class="error-details">${error.message}</p>
                <button onclick="window.location.reload()" class="retry-btn">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Islamic time-based greetings
function getIslamicGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير'; // Good morning
    if (hour < 17) return 'نهارك سعيد'; // Good afternoon  
    return 'مساء الخير'; // Good evening
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🕌 بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم');
    console.log('🌟 Welcome to AI Jannah - Your Journey to Paradise');
    console.log(`✨ ${getIslamicGreeting()}`);
    
    const game = new AIJannahGame();
    game.init();
    
    // Make game globally accessible for debugging
    window.AIJannah = game;
});