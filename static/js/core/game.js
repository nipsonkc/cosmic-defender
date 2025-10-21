// Main Game Controller (LIGHTWEIGHT - calls Python backend)
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.input = new InputHandler();
        this.particles = new ParticleSystem();
        
        this.sessionId = null;
        this.running = false;
        this.paused = false;
        this.level = 1;
        this.levelConfig = null;
        
        this.player = new PlayerEntity(
            this.canvas.width / 2 - 20,
            this.canvas.height - 90
        );
        
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.powerups = [];
        this.boss = null;
        
        this.gameState = null;
        this.spacePressed = false;
    }

    async start(level) {
        try {
            this.level = level;
            
            // Call Python backend to start game
            const response = await API.startGame(level);
            
            this.sessionId = response.sessionId;
            this.gameState = response.gameState;
            this.levelConfig = response.levelConfig;
            
            // Apply theme
            this.renderer.applyTheme(this.levelConfig.theme);
            
            // Reset game objects
            this.reset();
            
            // Spawn wave from backend
            await this.loadWave(response.waveConfig);
            
            // Start game loop
            this.running = true;
            this.paused = false;
            audio.startMusic();
            
            // Update UI
            HUD.update(this.gameState);
            
            this.gameLoop();
            
        } catch (error) {
            console.error('Failed to start game:', error);
            alert('Failed to start game. Please try again.');
        }
    }

    reset() {
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.powerups = [];
        this.boss = null;
        this.particles.clear();
        
        this.player.reset(
            this.canvas.width / 2 - 20,
            this.canvas.height - 90
        );
    }

    async loadWave(waveConfig) {
        this.enemies = [];
        this.boss = null;
        
        if (waveConfig.isBossWave && waveConfig.boss) {
            // Show boss warning
            const bossWarning = document.getElementById('bossWarning');
            bossWarning.classList.add('active');
            audio.bossWarning();
            
            setTimeout(() => {
                bossWarning.classList.remove('active');
                this.boss = new BossEntity(waveConfig.boss);
            }, 2000);
        } else {
            // Spawn regular enemies
            waveConfig.enemies.forEach(enemyData => {
                this.enemies.push(new EnemyEntity(enemyData));
            });
        }
    }

    async nextWave() {
        try {
            const response = await API.nextWave(this.sessionId);
            this.gameState = response.gameState;
            
            HUD.update(this.gameState);
            
            await this.loadWave(response.waveConfig);
            
        } catch (error) {
            console.error('Failed to load next wave:', error);
        }
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
        if (this.sessionId) {
            API.endSession(this.sessionId);
        }
    }

    async shoot() {
        if (!this.player.canShoot()) return;
        
        audio.shoot();
        const newBullets = this.player.createBullets();
        this.bullets.push(...newBullets);
        
        // Notify backend
        try {
            await API.shotFired(this.sessionId);
        } catch (error) {
            console.error('Failed to record shot:', error);
        }
    }

    updatePlayer() {
        this.player.update(this.input.keys, this.canvas.width, this.canvas.height, this.particles);
        this.player.draw(this.renderer.ctx);
    }

    updateBullets() {
        for (const bullet of this.bullets) {
            bullet.y += bullet.vy;
            bullet.x += bullet.vx;
            this.renderer.drawBullet(bullet);
            this.particles.trail(bullet.x + bullet.width / 2, bullet.y + bullet.height, '#ffaa00', 1);
        }
        
        this.bullets = this.bullets.filter(b => 
            b.y > -20 && b.x > -20 && b.x < this.canvas.width + 20
        );
    }

    updateEnemyBullets() {
        for (const bullet of this.enemyBullets) {
            bullet.y += bullet.vy;
            bullet.x += bullet.vx;
            this.renderer.drawEnemyBullet(bullet);
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
            
            enemy.draw(this.renderer.ctx);
        }
        
        if (shouldMoveDown) {
            this.enemies.forEach(e => e.moveDown());
        }
    }

    async updateBoss() {
        if (!this.boss) return;
        
        this.boss.update();
        
        if (this.boss.shouldMoveDown(this.canvas.width)) {
            this.boss.moveDown();
        }
        
        // Get attack pattern from backend
        try {
            const response = await API.updateBossPhase(
                this.sessionId,
                this.boss.health,
                this.boss.maxHealth,
                this.boss.shootTimer
            );
            
            if (response.phase !== this.boss.phase) {
                this.boss.updatePhase(response.phase);
            }
            
            // Spawn boss bullets
            response.attackPattern.forEach(attack => {
                this.enemyBullets.push({
                    x: this.boss.x + attack.offsetX,
                    y: this.boss.y + attack.offsetY,
                    vx: attack.vx,
                    vy: attack.vy,
                    width: attack.width,
                    height: attack.height
                });
            });
            
        } catch (error) {
            // Fallback to simple attack if API fails
            if (this.boss.shootTimer % 40 === 0) {
                this.enemyBullets.push({
                    x: this.boss.x + this.boss.width / 2 - 3,
                    y: this.boss.y + this.boss.height,
                    vx: 0,
                    vy: 6,
                    width: 6,
                    height: 14
                });
            }
        }
        
        this.boss.draw(this.renderer.ctx);
        this.boss.drawHealthBar(this.renderer.ctx, this.canvas.width);
    }

    updatePowerups() {
        for (const powerup of this.powerups) {
            powerup.update();
            powerup.draw(this.renderer.ctx);
            
            if (powerup.collidesWith(this.player)) {
                this.collectPowerup(powerup);
            }
        }
        
        this.powerups = this.powerups.filter(p => !p.isOffScreen(this.canvas.height));
    }

    async collectPowerup(powerup) {
        try {
            const response = await API.powerupCollected(this.sessionId, powerup.type);
            
            this.gameState = response.gameState;
            audio.powerup();
            
            // Apply visual effect
            this.player.setPowerup(powerup.type, true);
            
            HUD.update(this.gameState);
            
            this.powerups = this.powerups.filter(p => p !== powerup);
            
        } catch (error) {
            console.error('Failed to collect powerup:', error);
        }
    }

    async checkCollisions() {
        // Player bullets vs enemies
        for (const bullet of this.bullets) {
            for (const enemy of this.enemies) {
                if (Helpers.collision(bullet, enemy)) {
                    bullet.y = -9999;
                    
                    if (enemy.takeDamage()) {
                        // Enemy killed
                        try {
                            const response = await API.enemyKilled(
                                this.sessionId,
                                enemy.type,
                                enemy.x + enemy.width / 2,
                                enemy.y + enemy.height / 2
                            );
                            
                            this.gameState = response.gameState;
                            audio.explosion();
                            
                            this.particles.burst(
                                enemy.x + enemy.width / 2,
                                enemy.y + enemy.height / 2,
                                enemy.color,
                                25
                            );
                            
                            // Spawn powerup if backend says so
                            if (response.powerupDrop) {
                                this.powerups.push(new PowerupEntity(response.powerupDrop));
                            }
                            
                            this.enemies = this.enemies.filter(e => e !== enemy);
                            HUD.update(this.gameState);
                            
                        } catch (error) {
                            console.error('Failed to record enemy kill:', error);
                            this.enemies = this.enemies.filter(e => e !== enemy);
                        }
                    } else {
                        audio.hit();
                    }
                    break;
                }
            }
        }
        
        // Player bullets vs boss
        if (this.boss) {
            for (const bullet of this.bullets) {
                if (Helpers.collision(bullet, this.boss)) {
                    bullet.y = -9999;
                    
                    if (this.boss.takeDamage()) {
                        // Boss killed
                        try {
                            const response = await API.bossKilled(this.sessionId);
                            this.gameState = response.gameState;
                            
                            audio.explosion();
                            this.particles.burst(
                                this.boss.x + this.boss.width / 2,
                                this.boss.y + this.boss.height / 2,
                                this.boss.color,
                                50
                            );
                            
                            this.boss = null;
                            HUD.update(this.gameState);
                            
                            setTimeout(() => this.nextWave(), 2000);
                            
                        } catch (error) {
                            console.error('Failed to record boss kill:', error);
                        }
                    } else {
                        audio.hit();
                    }
                    break;
                }
            }
        }
        
        // Enemy bullets vs player
        for (const bullet of this.enemyBullets) {
            if (Helpers.collision(bullet, this.player)) {
                bullet.y = 9999;
                
                if (this.player.shield) {
                    this.player.shield = false;
                    this.player.setPowerup('SHIELD', false);
                    audio.hit();
                } else {
                    try {
                        const response = await API.playerHit(this.sessionId);
                        this.gameState = response.gameState;
                        
                        audio.explosion();
                        this.particles.burst(
                            this.player.x + this.player.width / 2,
                            this.player.y + this.player.height / 2,
                            '#00ff88',
                            35
                        );
                        
                        HUD.update(this.gameState);
                        
                        if (response.gameOver) {
                            this.gameOver();
                            return;
                        }
                        
                    } catch (error) {
                        console.error('Failed to record player hit:', error);
                    }
                }
            }
        }
        
        // Check if enemies reached player
        for (const enemy of this.enemies) {
            if (enemy.y + enemy.height >= this.player.y) {
                this.gameOver();
                return;
            }
        }
    }

    async updatePowerupTimer() {
        if (this.gameState && this.gameState.activePowerup) {
            try {
                const response = await API.updatePowerup(this.sessionId);
                const oldPowerup = this.gameState.activePowerup;
                this.gameState = response.gameState;
                
                // If powerup expired, remove visual effect
                if (oldPowerup && !this.gameState.activePowerup) {
                    this.player.setPowerup(oldPowerup, false);
                }
                
                HUD.update(this.gameState);
                
            } catch (error) {
                console.error('Failed to update powerup timer:', error);
            }
        }
    }

    async gameOver() {
        this.running = false;
        audio.stopMusic();
        audio.explosion();
        
        try {
            const response = await API.getStats(this.sessionId);
            GameOverUI.show(response.stats);
            
        } catch (error) {
            console.error('Failed to get stats:', error);
        }
    }

    gameLoop() {
        if (!this.running) return;
        
        if (!this.paused) {
            this.renderer.clear();
            
            // Handle shooting
            if (this.input.isPressed(' ')) {
                if (!this.spacePressed) {
                    this.shoot();
                    this.spacePressed = true;
                }
            } else {
                this.spacePressed = false;
            }
            
            // Handle pause
            if (this.input.isPressed('p') || this.input.isPressed('P')) {
                if (!this.pPressed) {
                    this.togglePause();
                    this.pPressed = true;
                }
            } else {
                this.pPressed = false;
            }
            
            // Update everything
            this.updatePlayer();
            this.updateBullets();
            this.updateEnemyBullets();
            this.updateEnemies();
            this.updateBoss();
            this.updatePowerups();
            this.particles.update();
            this.particles.draw(this.renderer.ctx);
            
            // Check collisions
            this.checkCollisions();
            
            // Update powerup timer (every 60 frames)
            if (Math.floor(Date.now() / 16) % 60 === 0) {
                this.updatePowerupTimer();
            }
            
            // Check wave completion
            if (!this.boss && this.enemies.length === 0) {
                this.nextWave();
            }
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Global game instance
let game = null;