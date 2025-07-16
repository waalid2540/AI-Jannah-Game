// Islamic Garden - Core game visualization and mechanics
export class IslamicGarden {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.plants = [];
        this.gardenSize = 3; // 3x3 grid
        this.isInitialized = false;
    }

    async init() {
        console.log('🌱 Initializing Islamic Garden...');
        this.setupCanvas();
        this.createGardenGrid();
        this.isInitialized = true;
        return Promise.resolve();
    }

    setupCanvas() {
        this.canvas.innerHTML = `
            <div class="garden-grid" id="garden-grid">
                <!-- Garden plots will be generated here -->
            </div>
            <div class="garden-ui">
                <div class="season-indicator">🌸 Spring</div>
                <div class="weather-indicator">☀️ Sunny</div>
            </div>
        `;
    }

    createGardenGrid() {
        const grid = document.getElementById('garden-grid');
        grid.innerHTML = '';
        
        for (let i = 0; i < this.gardenSize * this.gardenSize; i++) {
            const plot = document.createElement('div');
            plot.className = 'garden-plot';
            plot.dataset.plotId = i;
            plot.innerHTML = `
                <div class="plot-soil"></div>
                <div class="plot-plant"></div>
                <div class="plot-overlay">
                    <span class="plot-number">${i + 1}</span>
                </div>
            `;
            
            plot.addEventListener('click', () => this.selectPlot(i));
            grid.appendChild(plot);
        }
        
        // Add CSS for garden
        this.addGardenStyles();
    }

    addGardenStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .garden-grid {
                display: grid;
                grid-template-columns: repeat(${this.gardenSize}, 1fr);
                gap: 10px;
                padding: 20px;
                height: 100%;
            }
            
            .garden-plot {
                background: linear-gradient(45deg, #8B4513, #A0522D);
                border: 2px solid #654321;
                border-radius: 8px;
                position: relative;
                cursor: pointer;
                transition: all 0.3s ease;
                min-height: 80px;
            }
            
            .garden-plot:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            
            .plot-soil {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 20px;
                background: #8B4513;
                border-radius: 0 0 6px 6px;
            }
            
            .plot-plant {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 2rem;
                z-index: 2;
            }
            
            .plot-overlay {
                position: absolute;
                top: 5px;
                right: 5px;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 0.8rem;
            }
            
            .garden-ui {
                position: absolute;
                top: 10px;
                left: 10px;
                display: flex;
                gap: 15px;
            }
            
            .season-indicator, .weather-indicator {
                background: rgba(255,255,255,0.9);
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            
            .plot-growing {
                background: linear-gradient(45deg, #228B22, #32CD32) !important;
            }
            
            .plot-ready {
                background: linear-gradient(45deg, #FFD700, #FFA500) !important;
                animation: pulse 2s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }

    selectPlot(plotId) {
        const plot = document.querySelector(`[data-plot-id="${plotId}"]`);
        document.querySelectorAll('.garden-plot').forEach(p => p.classList.remove('selected'));
        plot.classList.add('selected');
        
        console.log(`🌱 Plot ${plotId + 1} selected`);
    }

    plantSeed(seed) {
        const emptyPlot = this.findEmptyPlot();
        if (emptyPlot === -1) return false;
        
        const plant = {
            id: Date.now(),
            seedId: seed.id,
            plotId: emptyPlot,
            plantedAt: Date.now(),
            growthTime: seed.growthTime,
            isReady: false,
            hasanatReward: seed.hasanatReward,
            knowledgeReward: seed.knowledgeReward
        };
        
        this.plants.push(plant);
        this.updatePlotVisual(emptyPlot, '🌱', 'growing');
        
        // Start growth timer
        setTimeout(() => {
            this.maturePlant(plant.id);
        }, seed.growthTime);
        
        return true;
    }

    findEmptyPlot() {
        for (let i = 0; i < this.gardenSize * this.gardenSize; i++) {
            const hasPlant = this.plants.some(plant => plant.plotId === i);
            if (!hasPlant) return i;
        }
        return -1;
    }

    updatePlotVisual(plotId, emoji, status) {
        const plot = document.querySelector(`[data-plot-id="${plotId}"]`);
        if (plot) {
            const plantEl = plot.querySelector('.plot-plant');
            plantEl.textContent = emoji;
            
            plot.classList.remove('plot-growing', 'plot-ready');
            if (status) plot.classList.add(`plot-${status}`);
        }
    }

    maturePlant(plantId) {
        const plant = this.plants.find(p => p.id === plantId);
        if (plant) {
            plant.isReady = true;
            this.updatePlotVisual(plant.plotId, '🌿', 'ready');
            console.log(`🌿 Plant matured in plot ${plant.plotId + 1}`);
        }
    }

    waterAllPlants() {
        let wateredCount = 0;
        this.plants.forEach(plant => {
            if (!plant.isReady) {
                wateredCount++;
                // Reduce growth time by 10%
                plant.growthTime *= 0.9;
            }
        });
        return wateredCount;
    }

    harvestReadyPlants() {
        const readyPlants = this.plants.filter(plant => plant.isReady);
        const harvestResults = [];
        
        readyPlants.forEach(plant => {
            harvestResults.push({
                hasanatReward: plant.hasanatReward,
                knowledgeReward: plant.knowledgeReward
            });
            
            // Clear plot
            this.updatePlotVisual(plant.plotId, '', '');
            
            // Remove from plants array
            const index = this.plants.indexOf(plant);
            this.plants.splice(index, 1);
        });
        
        return harvestResults;
    }

    expand() {
        this.gardenSize++;
        this.createGardenGrid();
        console.log(`🏗️ Garden expanded to ${this.gardenSize}x${this.gardenSize}`);
    }

    getExpansionCost() {
        return this.gardenSize * 50;
    }

    getStats() {
        return {
            plantsGrowing: this.plants.filter(p => !p.isReady).length,
            knowledgeTrees: this.plants.filter(p => p.isReady).length,
            totalPlots: this.gardenSize * this.gardenSize,
            occupiedPlots: this.plants.length
        };
    }

    update(deltaTime) {
        // Update plant growth, visual effects, etc.
    }

    handleResize() {
        // Handle canvas resize
        console.log('🔄 Garden canvas resized');
    }
}