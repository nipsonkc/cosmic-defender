// HUD (Heads-Up Display) Manager
class HUD {
    static update(gameState) {
        document.getElementById('scoreDisplay').textContent = Helpers.formatNumber(gameState.score);
        document.getElementById('livesDisplay').textContent = gameState.lives;
        document.getElementById('levelIndicator').textContent = `LEVEL ${gameState.level}`;
        document.getElementById('waveIndicator').textContent = `WAVE ${gameState.wave}`;
        
        const powerupName = gameState.activePowerup || 'NONE';
        document.getElementById('activePowerup').textContent = powerupName;
    }

    static init() {
        // Game control buttons
        document.getElementById('btnPause').onclick = () => {
            if (game) game.togglePause();
        };

        document.getElementById('btnSound').onclick = () => {
            const btn = document.getElementById('btnSound');
            const enabled = audio.toggle();
            btn.textContent = enabled ? '🔊 SOUND' : '🔇 MUTED';
        };

        document.getElementById('btnQuit').onclick = () => {
            if (confirm('Are you sure you want to quit?')) {
                if (game) game.quit();
                MenuUI.showMainMenu();
            }
        };
    }
}