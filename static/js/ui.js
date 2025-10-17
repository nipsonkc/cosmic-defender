// UI Management
class UIManager {
    constructor() {
        this.screens = {
            mainMenu: document.getElementById('mainMenu'),
            levelSelect: document.getElementById('levelSelect'),
            helpScreen: document.getElementById('helpScreen'),
            gameScreen: document.getElementById('gameScreen'),
            gameOverScreen: document.getElementById('gameOverScreen')
        };
        
        this.elements = {
            scoreDisplay: document.getElementById('scoreDisplay'),
            livesDisplay: document.getElementById('livesDisplay'),
            levelIndicator: document.getElementById('levelIndicator'),
            waveIndicator: document.getElementById('waveIndicator'),
            activePowerup: document.getElementById('activePowerup'),
            bossWarning: document.getElementById('bossWarning'),
            finalScore: document.getElementById('finalScore'),
            finalLevel: document.getElementById('finalLevel'),
            finalWave: document.getElementById('finalWave'),
            finalKills: document.getElementById('finalKills'),
            finalAccuracy: document.getElementById('finalAccuracy'),
            playerName: document.getElementById('playerName'),
            highscoresList: document.getElementById('highscoresList')
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('btnStart').onclick = () => {
            this.hideAllScreens();
            this.screens.levelSelect.classList.add('active');
        };
        
        document.getElementById('btnLevels').onclick = () => {
            this.hideAllScreens();
            this.screens.levelSelect.classList.add('active');
        };
        
        document.getElementById('btnHelp').onclick = () => {
            this.hideAllScreens();
            this.screens.helpScreen.classList.add('active');
        };
        
        document.querySelectorAll('.level-card').forEach(card => {
            card.onclick = () => {
                const level = parseInt(card.dataset.level);
                this.startGame(level);
            };
        });
        
        document.getElementById('btnBackFromLevel').onclick = () => {
            this.showMainMenu();
        };
        
        document.getElementById('btnBackFromHelp').onclick = () => {
            this.showMainMenu();
        };
        
        document.getElementById('btnPause').onclick = () => {
            if (window.game) window.game.togglePause();
        };
        
        document.getElementById('btnSound').onclick = () => {
            const btn = document.getElementById('btnSound');
            const enabled = audio.toggle();
            btn.textContent = enabled ? '🔊 SOUND' : '🔇 MUTED';
        };
        
        document.getElementById('btnQuit').onclick = () => {
            if (confirm('Are you sure you want to quit?')) {
                if (window.game) window.game.quit();
                this.showMainMenu();
            }
        };
        
        document.getElementById('btnSaveScore').onclick = () => {
            if (window.game) window.game.saveScore();
        };

        document.getElementById('btnPlayAgain').onclick = () => {
            if (window.game) {
                this.hideAllScreens();
                this.screens.gameScreen.classList.add('active');
                window.game.restart();
            }
        };
        
        document.getElementById('btnMainMenu').onclick = () => {
            this.showMainMenu();
        };
    }
    
    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
    }
    
    showMainMenu() {
        this.hideAllScreens();
        this.screens.mainMenu.classList.add('active');
        audio.stopMusic();
    }
    
    startGame(level) {
        this.hideAllScreens();
        this.screens.gameScreen.classList.add('active');
        
        if (window.game) {
            window.game.start(level);
        }
    }
    
    updateHUD(score, lives, level, wave, powerup) {
        this.elements.scoreDisplay.textContent = score;
        this.elements.livesDisplay.textContent = lives;
        this.elements.levelIndicator.textContent = `LEVEL ${level}`;
        this.elements.waveIndicator.textContent = `WAVE ${wave}`;
        this.elements.activePowerup.textContent = powerup || 'NONE';
    }
    
    showBossWarning() {
        this.elements.bossWarning.classList.add('active');
        audio.bossWarning();
        setTimeout(() => {
            this.elements.bossWarning.classList.remove('active');
        }, 2000);
    }
    
    showGameOver(stats) {
        setTimeout(() => {
            this.hideAllScreens();
            this.screens.gameOverScreen.classList.add('active');
            
            this.elements.finalScore.textContent = stats.score;
            this.elements.finalLevel.textContent = stats.level;
            this.elements.finalWave.textContent = stats.wave;
            this.elements.finalKills.textContent = stats.kills;
            this.elements.finalAccuracy.textContent = stats.accuracy + '%';
            
            this.loadHighScores();
        }, 1000);
    }
    
    async loadHighScores() {
        try {
            const response = await fetch('/api/scores');
            const scores = await response.json();
            
            const html = scores.map((score, index) => `
                <div class="highscore-entry">
                    <div class="highscore-rank">${index + 1}</div>
                    <div class="highscore-info">
                        <div class="highscore-name">${score.player}</div>
                        <div class="highscore-details">Level ${score.level} • Wave ${score.wave}</div>
                    </div>
                    <div class="highscore-score">${score.score}</div>
                </div>
            `).join('');
            
            this.elements.highscoresList.innerHTML = html || '<p style="text-align: center; color: #6b7a99;">No high scores yet!</p>';
        } catch (error) {
            console.error('Error loading high scores:', error);
            this.elements.highscoresList.innerHTML = '<p style="text-align: center; color: #ff0080;">Failed to load scores</p>';
        }
    }
}

const uiManager = new UIManager();