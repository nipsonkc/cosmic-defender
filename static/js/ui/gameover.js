// Game Over UI Manager
class GameOverUI {
    static show(stats) {
        setTimeout(() => {
            MenuUI.hideAllScreens();
            document.getElementById('gameOverScreen').classList.add('active');

            // Display stats
            document.getElementById('finalScore').textContent = Helpers.formatNumber(stats.score);
            document.getElementById('finalLevel').textContent = stats.level;
            document.getElementById('finalWave').textContent = stats.wave;
            document.getElementById('finalKills').textContent = stats.enemiesKilled;
            document.getElementById('finalAccuracy').textContent = stats.accuracy + '%';

            // Store stats for saving
            this.currentStats = stats;

            // Load high scores
            this.loadHighScores();

        }, 1000);
    }

    static init() {
        document.getElementById('btnSaveScore').onclick = () => {
            this.saveScore();
        };

        document.getElementById('btnPlayAgain').onclick = () => {
            const level = this.currentStats ? this.currentStats.level : 1;
            MenuUI.hideAllScreens();
            MenuUI.showGame();
            if (game) {
                game.start(level);
            }
        };

        document.getElementById('btnMainMenu').onclick = () => {
            MenuUI.showMainMenu();
        };
    }

    static async saveScore() {
        const playerName = document.getElementById('playerName').value.trim() || 'Anonymous';

        if (!this.currentStats) {
            alert('No game stats available');
            return;
        }

        try {
            const scoreData = {
                player: playerName,
                score: this.currentStats.score,
                level: this.currentStats.level,
                levelName: this.currentStats.levelName,
                wave: this.currentStats.wave,
                accuracy: this.currentStats.accuracy,
                rating: this.currentStats.rating,
                enemiesKilled: this.currentStats.enemiesKilled
            };

            const response = await API.saveScore(scoreData);

            if (response.success) {
                alert(`Score saved! You ranked #${response.rank}`);
                document.getElementById('playerName').value = '';
                this.loadHighScores();
            }

        } catch (error) {
            console.error('Failed to save score:', error);
            alert('Failed to save score. Please try again.');
        }
    }

    static async loadHighScores() {
        try {
            const response = await API.getScores(10);
            const scores = response.scores;

            const html = scores.map((score, index) => `
                <div class="highscore-entry">
                    <div class="highscore-rank">${index + 1}</div>
                    <div class="highscore-info">
                        <div class="highscore-name">${score.player}</div>
                        <div class="highscore-details">
                            ${score.levelName} • Wave ${score.wave} • ${score.accuracy}% Accuracy • Rank ${score.rating}
                        </div>
                    </div>
                    <div class="highscore-score">${Helpers.formatNumber(score.score)}</div>
                </div>
            `).join('');

            const listEl = document.getElementById('highscoresList');
            listEl.innerHTML = html || '<p style="text-align: center; color: #6b7a99;">No high scores yet!</p>';

        } catch (error) {
            console.error('Failed to load high scores:', error);
            document.getElementById('highscoresList').innerHTML = 
                '<p style="text-align: center; color: #ff0080;">Failed to load scores</p>';
        }
    }
}