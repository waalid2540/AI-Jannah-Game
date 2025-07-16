// AI Jannah Game - Enterprise Main Entry Point
import { GameCore } from './core/GameCore.js';
import { GameplayManager } from './game/GameplayManager.js';

class AIJannahGame {
    constructor() {
        this.gameCore = null;
        this.gameplayManager = null;
        this.isLoaded = false;
        this.version = '1.0.0-enterprise';
        this.buildDate = new Date().toISOString();
        this.isProduction = process.env.NODE_ENV === 'production';
        
        // Performance monitoring
        this.performanceMetrics = {
            initStartTime: 0,
            initEndTime: 0,
            loadTime: 0,
            memoryUsage: 0,
            renderingPerformance: 0
        };
        
        // Error tracking
        this.errorTracker = {
            errors: [],
            warnings: [],
            maxErrors: 100,
            
            logError: (error, context = '') => {
                const errorData = {
                    message: error.message,
                    stack: error.stack,
                    context,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                };
                
                this.errorTracker.errors.push(errorData);
                
                if (this.errorTracker.errors.length > this.errorTracker.maxErrors) {
                    this.errorTracker.errors.shift();
                }
                
                console.error('🚨 Game Error:', errorData);
                
                // Send to analytics in production
                if (this.isProduction) {
                    this.sendErrorToAnalytics(errorData);
                }
            }
        };
    }

    async init() {
        try {
            this.performanceMetrics.initStartTime = performance.now();
            
            console.log(`🚀 Initializing AI Jannah Enterprise Game v${this.version}`);
            console.log(`📅 Build Date: ${this.buildDate}`);
            console.log(`🔧 Environment: ${this.isProduction ? 'Production' : 'Development'}`);
            
            // Show loading screen with enterprise branding
            this.showEnterpriseLoadingScreen();
            
            // Initialize enterprise game core
            await this.initializeGameCore();
            
            // Setup advanced error handling
            this.setupErrorHandling();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Load game data and start
            await this.startGame();
            
            // Hide loading screen and show game
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 6000); // Wait for loading animation to complete
            
            this.performanceMetrics.initEndTime = performance.now();
            this.performanceMetrics.loadTime = this.performanceMetrics.initEndTime - this.performanceMetrics.initStartTime;
            
            console.log(`✅ AI Jannah Enterprise Game Initialized Successfully in ${this.performanceMetrics.loadTime.toFixed(2)}ms`);
            
        } catch (error) {
            this.errorTracker.logError(error, 'Game Initialization');
            this.showErrorScreen(error);
        }
    }

    async initializeGameCore() {
        console.log('🎮 Initializing Enterprise Game Core');
        
        // Initialize the advanced game core
        this.gameCore = new GameCore();
        await this.gameCore.initialize();
        
        console.log('✅ Enterprise Game Core Initialized');
    }

    async startGame() {
        console.log('🌟 Starting AI Jannah Game');
        
        // Initialize gameplay manager
        this.gameplayManager = new GameplayManager();
        await this.gameplayManager.init();
        
        // The GameCore handles all game logic, networking, AI, etc.
        // The GameplayManager handles the actual game mechanics
        
        this.isLoaded = true;
        console.log('✅ Game Started Successfully');
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.errorTracker.logError(event.error, 'Global Error Handler');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.errorTracker.logError(new Error(event.reason), 'Unhandled Promise Rejection');
        });

        // Performance issues handler
        if ('performance' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 1000) { // Slow operations
                        console.warn(`🐌 Slow operation detected: ${entry.name} took ${entry.duration}ms`);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure', 'navigation'] });
        }
    }

    setupPerformanceMonitoring() {
        // Memory usage monitoring
        if ('memory' in performance) {
            setInterval(() => {
                this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
                
                // Log memory usage if it's getting high
                if (this.performanceMetrics.memoryUsage > 100) {
                    console.warn(`🔥 High memory usage: ${this.performanceMetrics.memoryUsage.toFixed(2)}MB`);
                }
            }, 5000);
        }

        // FPS monitoring
        let lastTime = performance.now();
        let frameCount = 0;
        
        const measureFPS = () => {
            frameCount++;
            const now = performance.now();
            
            if (now - lastTime >= 1000) {
                this.performanceMetrics.renderingPerformance = frameCount;
                frameCount = 0;
                lastTime = now;
                
                // Log FPS if it's getting low
                if (this.performanceMetrics.renderingPerformance < 30) {
                    console.warn(`🎯 Low FPS detected: ${this.performanceMetrics.renderingPerformance}fps`);
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        measureFPS();
    }

    showEnterpriseLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const progressBar = document.querySelector('.loading-progress');
        
        // Update loading screen with enterprise branding
        const loadingContent = document.querySelector('.loading-content');
        loadingContent.innerHTML = `
            <div class="enterprise-logo">
                <div class="islamic-pattern"></div>
                <h1>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</h1>
                <h2>AI Jannah Enterprise</h2>
                <p>Advanced Islamic Educational Gaming Platform</p>
                <div class="version-info">
                    <span>Version ${this.version}</span>
                    <span>Enterprise Edition</span>
                </div>
            </div>
            <div class="loading-progress-container">
                <div class="loading-progress"></div>
                <div class="loading-status">Initializing enterprise systems...</div>
            </div>
            <div class="loading-features">
                <div class="feature">✨ Advanced AI Companion</div>
                <div class="feature">🌍 Real-time Multiplayer</div>
                <div class="feature">📚 Comprehensive Islamic Library</div>
                <div class="feature">🎮 3D Immersive Graphics</div>
                <div class="feature">🔐 Enterprise Security</div>
            </div>
        `;
        
        // Advanced loading progress simulation
        const loadingSteps = [
            { name: 'Initializing Core Systems', duration: 800 },
            { name: 'Loading Islamic Content Database', duration: 1200 },
            { name: 'Connecting to Network', duration: 600 },
            { name: 'Initializing AI Companion', duration: 900 },
            { name: 'Loading 3D Graphics Engine', duration: 1500 },
            { name: 'Setting up Audio Systems', duration: 400 },
            { name: 'Finalizing Setup', duration: 500 }
        ];
        
        let currentStep = 0;
        let progress = 0;
        const statusElement = document.querySelector('.loading-status');
        
        const updateProgress = () => {
            if (currentStep >= loadingSteps.length) {
                progress = 100;
                statusElement.textContent = 'Ready! Launching AI Jannah...';
                progressBar.style.width = '100%';
                return;
            }
            
            const step = loadingSteps[currentStep];
            statusElement.textContent = step.name;
            
            const stepProgress = (currentStep / loadingSteps.length) * 100;
            progress = Math.min(stepProgress + (Math.random() * 10), (currentStep + 1) * (100 / loadingSteps.length));
            
            progressBar.style.width = `${progress}%`;
            
            setTimeout(() => {
                currentStep++;
                updateProgress();
            }, step.duration);
        };
        
        updateProgress();
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

    sendErrorToAnalytics(errorData) {
        // Mock analytics error reporting
        console.log('📊 Sending error to analytics:', errorData);
        
        // In production, this would send to your analytics service
        try {
            if (typeof fetch !== 'undefined') {
                fetch('/api/analytics/error', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(errorData)
                }).catch(err => {
                    console.warn('Failed to send error to analytics:', err);
                });
            }
        } catch (e) {
            console.warn('Analytics error reporting failed:', e);
        }
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
    
    // Global functions for UI interactions
    window.startLearning = () => {
        console.log('🌱 Starting learning journey...');
        document.querySelector('[data-panel="noor"]').click();
    };
    
    window.exploreGarden = () => {
        console.log('🌿 Exploring garden...');
        document.querySelector('[data-panel="garden"]').click();
    };
});