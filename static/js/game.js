// Main Game Class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.running = false;
        this.paused = false;
        this.level = 1;
        this.wave = 1;
        this.score = 0;
        this.lives = 3;
        this.enemiesKilled = 0;
        this.shotsFired = 0;
        this.shotsHit = 0;
        
        this.player = new Player(
            this.canvas.width / 2 - 20,
            this.canvas.height - 90
        );
        
        this.particles = new ParticleSystem();
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.powerups = [];
        this.boss = null;
        
        this.activePowerup = null;
        this.powerupTimer = 0;
        
        this.keys = {};
        this.setupControls();
    }
    
    setupControls() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === ' ') {
                e.preventDefault();
                if (this.running && !this.paused) {
                    this.shoot();
                }
            }
            
            if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    start(level = 1) {
        this.level = level;
        this.reset();
        this.running = true;
        this.paused = false;
        
        this.applyTheme();
        
        this.spawnWave();
        audio.startMusic();
        this.gameLoop();
    }
    
    restart() {
        this.reset();
        this.running = true;
        this.paused = false;
        this.spawnWave();
        audio.startMusic();
        this.gameLoop();
    }
    
    reset() {
        this.wave = 1;
        this.score = 0;
        this.lives = 3;
        this.enemiesKilled = 0;
        this.shotsFired = 0;
        this.shotsHit = 0;
        
        this.player.reset(
            this.canvas.width / 2 - 20,
            this.canvas.height - 90
        );
        
        this.particles.clear();
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.powerups = [];
        this.boss = null;
        
        this.activePowerup = null;
        this.powerupTimer = 0;
        
        this.updateUI();
    }
    
    applyTheme() {
        const theme = LEVELS[this.level].theme;
        this.canvas.style.background = theme.bgColor;
    }
    
    togglePause() {
        if (this.running) {
            this.paused = !this.paused;
            if (this.paused) {
                audio.stopMusic();
            } else {
                audio.startMusic();
            }
        }
    }
    
    quit() {
        this.running = false;
        audio.stopMusic();
    }
    
    spawnWave() {
        this.enemies = [];
        
        if (this.wave % 5 === 0) {
            uiManager.showBossWarning();
            setTimeout(() => {
                this.boss = new Boss(
                    this.canvas.width / 2 - 110,
                    60,
                    this.wave,
                    this.level
                );
            }, 2000);
            return;
        }
        
        const cols = Math.min(8, 5 + Math.floor(this.wave / 2));
        const rows = Math.min(5, 2 + Math.floor(this.wave / 2));
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const type = getEnemyTypeForLevel(this.level, this.wave);
                const enemy = new Enemy(
                    col * 90 + 60,
                    row * 60 + 50,
                    type,
                    this.wave
                );
                this.enemies.push(enemy);
            }
        }
    }
    
    shoot() {
        const newBullets = this.player.shoot();
        this.bullets.push(...newBullets);
        this.shotsFired += newBullets.length;
    }
    
    updateBullets() {
        for (const bullet of this.bullets) {
            bullet.y += bullet.vy;
            bullet.x += bullet.vx;
            
            this.ctx.fillStyle = '#ffff00';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#ffff00';
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            
            this.particles.trail(bullet.x + bullet.width / 2, bullet.y + bullet.height, '#ffaa00', 1);
        }
        
        this.bullets = this.bullets.filter(b => 
            b.y > -20 && b.x > -20 && b.x < this.canvas.width + 20
        );
        
        for (const bullet of this.enemyBullets) {
            bullet.y += bullet.vy;
            bullet.x += bullet.vx;
            
            this.ctx.fillStyle = '#ff0066';
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = '#ff0066';
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
        
        this.enemyBullets = this.enemyBullets.filter(b => 
            b.y < this.canvas.height + 20 && b.x > -20 && b.x < this.canvas.width + 20
        );
    }
    
    updateEnemies() {
        let shouldMoveDown = false;
        
        for (const enemy of this.enemies) {
            enemy.update();
            
            if (enemy.shouldMoveDown(this.canvas.width)) {
                shouldMoveDown = true;
            }
            
            if (enemy.shouldShoot()) {
                this.enemyBullets.push(enemy.createBullet());
            }
            
            enemy.draw(this.ctx);
        }
        
        if (shouldMoveDown) {
            this.enemies.forEach(e => e.moveDown());
        }
    }
    
    updateBoss() {
        if (!this.boss) return;
        
        this.boss.update();
        
        if (this.boss.shouldMoveDown(this.canvas.width)) {
            this.boss.moveDown();
        }
        
        const attacks = this.boss.getAttackPattern();
        this.enemyBullets.push(...attacks);
        
        this.boss.draw(this.ctx);
        this.boss.drawHealthBar(this.ctx, this.canvas.width);
    }
    
    updatePowerups() {
        for (const powerup of this.powerups) {
            powerup.update();
            powerup.draw(this.ctx);
            
            if (powerup.collidesWith(this.player)) {
                this.applyPowerup(powerup.type, powerup.config.duration);
                audio.powerup();
                this.powerups = this.powerups.filter(p => p !== powerup);
            }
        }
        
        this.powerups = this.powerups.filter(p => !p.isOffScreen(this.canvas.height));
    }
    
    applyPowerup(type, duration) {
        this.activePowerup = type;
        this.powerupTimer = duration;
        
        if (type === 'SHIELD') {
            this.player.shield = true;
        } else if (type === 'RAPID') {
            this.player.rapidFire = true;
        } else if (type === 'SPREAD') {
            this.player.spreadShot = true;
        } else if (type === 'HEALTH') {
            this.lives = Math.min(9, this.lives + 1);
            this.activePowerup = null;
        }
        
        this.updateUI();
    }
    
    clearPowerups() {
        this.player.shield = false;
        this.player.rapidFire = false;
        this.player.spreadShot = false;
        this.activePowerup = null;
        this.powerupTimer = 0;
        this.updateUI();
    }
    
    checkCollisions() {
        for (const bullet of this.bullets) {
            for (const enemy of this.enemies) {
                if (this.collision(bullet, enemy)) {
                    bullet.y = -9999;
                    
                    if (enemy.takeDamage()) {
                        this.score += enemy.score;
                        this.enemiesKilled++;
                        audio.explosion();
                        this.particles.burst(
                            enemy.x + enemy.width / 2,
                            enemy.y + enemy.height / 2,
                            enemy.color,
                            25
                        );
                        
                        const powerup = spawnPowerup(
                            enemy.x + enemy.width / 2,
                            enemy.y + enemy.height / 2
                        );
                        if (powerup) this.powerups.push(powerup);
                        
                        this.enemies = this.enemies.filter(e => e !== enemy);
                    } else {
                        audio.hit();
                    }
                    
                    this.shotsHit++;
                    break;
                }
            }
        }
        
        if (this.boss) {
            for (const bullet of this.bullets) {
                if (this.collision(bullet, this.boss)) {
                    bullet.y = -9999;
                    this.shotsHit++;
                    
                    if (this.boss.takeDamage()) {
                        this.score += 200;
                        this.enemiesKilled++;
                        audio.explosion();
                        this.particles.burst(
                            this.boss.x + this.boss.width / 2,
                            this.boss.y + this.boss.height / 2,
                            this.boss.color,
                            50
                        );
                        this.boss = null;
                        this.nextWave();
                    } else {
                        audio.hit();
                    }
                    break;
                }
            }
        }
        
        for (const bullet of this.enemyBullets) {
            if (this.collision(bullet, this.player)) {
                bullet.y = 9999;
                
                if (this.player.shield) {
                    this.player.shield = false;
                    this.clearPowerups();
                    audio.hit();
                } else {
                    this.lives--;
                    audio.explosion();
                    this.particles.burst(
                        this.player.x + this.player.width / 2,
                        this.player.y + this.player.height / 2,
                        '#00ff88',
                        35
                    );
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                }
                
                this.updateUI();
            }
        }
        
        for (const enemy of this.enemies) {
            if (enemy.y + enemy.height >= this.player.y) {
                this.lives = 0;
                this.gameOver();
                return;
            }
        }
    }
    
    collision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + (a.width || 0) > b.x &&
            a.y < b.y + b.height &&
            a.y + (a.height || 0) > b.y
        );
    }
    
    nextWave() {
        this.wave++;
        this.score += this.wave * 50;
        this.updateUI();
        setTimeout(() => this.spawnWave(), 2000);
    }
    
    updateUI() {
        uiManager.updateHUD(
            this.score,
            this.lives,
            this.level,
            this.wave,
            this.activePowerup
        );
    }
    
    gameOver() {
        this.running = false;
        audio.stopMusic();
        audio.explosion();
        
        const accuracy = this.shotsFired > 0 
            ? Math.round((this.shotsHit / this.shotsFired) * 100) 
            : 0;
        
        uiManager.showGameOver({
            score: this.score,
            level: this.level,
            wave: this.wave,
            kills: this.enemiesKilled,
            accuracy: accuracy
        });
    }
    
    async saveScore() {
        const playerName = document.getElementById('playerName').value.trim() || 'Anonymous';
        
        try {
            await fetch('/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player: playerName,
                    score: this.score,
                    level: this.level,
                    wave: this.wave
                })
            });
            
            uiManager.loadHighScores();
            document.getElementById('playerName').value = '';
        } catch (error) {
            console.error('Error saving score:', error);
            alert('Failed to save score. Please try again.');
        }
    }
    
    gameLoop() {
        if (!this.running) return;
        
        if (!this.paused) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.player.update(this.keys, this.canvas.width, this.canvas.height, this.particles);
            
            this.updateBullets();
            this.updateEnemies();
            this.updateBoss();
            this.updatePowerups();
            this.particles.update();
            
            this.checkCollisions();
            
            this.player.draw(this.ctx);
            this.particles.draw(this.ctx);
            
            if (this.powerupTimer > 0) {
                this.powerupTimer--;
                if (this.powerupTimer === 0) {
                    this.clearPowerups();
                }
            }
            
            if (!this.boss && this.enemies.length === 0) {
                this.nextWave();
            }
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

window.game = new Game();