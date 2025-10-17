// Boss Class
class Boss {
    constructor(x, y, wave, level) {
        this.x = x;
        this.y = y;
        this.width = 220;
        this.height = 120;
        this.direction = 1;
        this.speed = 1.6;
        this.health = 60 + (wave * 18);
        this.maxHealth = this.health;
        this.shootTimer = 0;
        this.phase = 1;
        this.animationFrame = 0;
        this.level = level;
        
        const colors = ['#ff1493', '#ff6b35', '#9d00ff'];
        this.color = colors[level - 1] || colors[0];
    }

    update() {
        this.x += this.speed * this.direction;
        this.shootTimer++;
        this.animationFrame = (this.animationFrame + 0.05) % (Math.PI * 2);
        
        if (this.health < this.maxHealth * 0.33) {
            this.phase = 3;
            this.speed = 2.2;
        } else if (this.health < this.maxHealth * 0.66) {
            this.phase = 2;
            this.speed = 1.9;
        }
    }

    draw(ctx) {
        ctx.save();
        
        const pulse = Math.sin(this.animationFrame * 3) * 0.1 + 1;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 25 * pulse;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 15;
        const eyeGlow = Math.sin(this.animationFrame * 5);
        ctx.fillStyle = eyeGlow > 0 ? '#ff0000' : '#ffff00';
        ctx.beginPath();
        ctx.arc(this.x + this.width * 0.3, this.y + this.height * 0.4, 12, 0, Math.PI * 2);
        ctx.arc(this.x + this.width * 0.7, this.y + this.height * 0.4, 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height * 0.7, 20, 0, Math.PI);
        ctx.stroke();
        
        ctx.restore();
    }

    drawHealthBar(ctx, canvasWidth) {
        const barWidth = canvasWidth - 40;
        const barHeight = 12;
        const barX = 20;
        const barY = 20;
        
        ctx.save();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        const healthPercent = this.health / this.maxHealth;
        let healthColor = '#00ff00';
        if (healthPercent < 0.33) healthColor = '#ff0000';
        else if (healthPercent < 0.66) healthColor = '#ffaa00';
        
        ctx.fillStyle = healthColor;
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BOSS', canvasWidth / 2, barY + barHeight + 20);
        
        ctx.restore();
    }

    getAttackPattern() {
        const patterns = [];
        
        if (this.shootTimer % 40 === 0) {
            patterns.push({
                x: this.x + this.width / 2 - 2,
                y: this.y + this.height,
                vx: 0,
                vy: 6,
                width: 6,
                height: 14
            });
        }
        
        if (this.phase >= 2 && this.shootTimer % 60 === 0) {
            for (let i = -3; i <= 3; i++) {
                patterns.push({
                    x: this.x + this.width / 2 - 2,
                    y: this.y + this.height,
                    vx: i * 1.2,
                    vy: 5,
                    width: 5,
                    height: 12
                });
            }
        }
        
        if (this.phase >= 3 && this.shootTimer % 15 === 0) {
            const angle = this.shootTimer * 0.2;
            patterns.push({
                x: this.x + this.width / 2,
                y: this.y + this.height,
                vx: Math.cos(angle) * 3,
                vy: 4 + Math.sin(angle) * 2,
                width: 5,
                height: 12
            });
        }
        
        return patterns;
    }

    shouldMoveDown(canvasWidth) {
        return this.x <= 20 || this.x >= canvasWidth - this.width - 20;
    }

    moveDown() {
        this.direction *= -1;
        this.y += 10;
    }

    takeDamage() {
        this.health--;
        return this.health <= 0;
    }
}