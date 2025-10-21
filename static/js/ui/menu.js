// Menu UI Manager
class MenuUI {
    static init() {
        this.setupEventListeners();
        this.loadLevels();
    }

    static setupEventListeners() {
        // Main menu buttons
        document.getElementById('btnStart').onclick = () => {
            this.showLevelSelect();
        };

        document.getElementById('btnLevels').onclick = () => {
            this.showLevelSelect();
        };

        document.getElementById('btnHelp').onclick = () => {
            this.showHelp();
        };

        // Level select
        document.getElementById('btnBackFromLevel').onclick = () => {
            this.showMainMenu();
        };

        // Help screen
        document.getElementById('btnBackFromHelp').onclick = () => {
            this.showMainMenu();
        };
    }

    static async loadLevels() {
        try {
            const response = await API.getLevels();
            const levels = response.levels;

            // Populate level cards
            document.querySelectorAll('.level-card').forEach(card => {
                const levelNum = parseInt(card.dataset.level);
                const levelData = levels[levelNum];

                if (levelData) {
                    const nameEl = card.querySelector('h3');
                    const descEl = card.querySelector('p');

                    if (nameEl) nameEl.textContent = levelData.name;
                    if (descEl) descEl.textContent = levelData.description;
                }

                card.onclick = () => this.startGame(levelNum);
            });

        } catch (error) {
            console.error('Failed to load levels:', error);
        }
    }

    static showMainMenu() {
        this.hideAllScreens();
        document.getElementById('mainMenu').classList.add('active');
    }

    static showLevelSelect() {
        this.hideAllScreens();
        document.getElementById('levelSelect').classList.add('active');
    }

    static showHelp() {
        this.hideAllScreens();
        document.getElementById('helpScreen').classList.add('active');
    }

    static showGame() {
        this.hideAllScreens();
        document.getElementById('gameScreen').classList.add('active');
    }

    static hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    static async startGame(level) {
        this.showGame();
        
        if (!game) {
            game = new Game();
        }
        
        await game.start(level);
    }
}