// Boss Entity (Rendering Only)
class BossEntity {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.width = data.width;
        this.height = data.height;
        this.health = data.health;
        this.maxHealth = data.maxHealth;
        this.speed = data.speed;
        this.baseSpeed = data.baseSpeed;
        this.color = data.color;
        this.level = data.level;
        this.wave = data.wave;
        this.phase = data.phase;
        this.direction = 1;
        this.shootTimer = 0;
        this.animationFrame = 0;
    }

    update() {
        this.x += this.speed * this.direction;
        this.shootTimer++;
        this.animationFrame = (this.animationFrame + 0.05) % (Math.PI * 2);
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

    takeDamage() {
        this.health--;
        return this.health <= 0;
    }

    shouldMoveDown(canvasWidth) {
        return this.x <= 20 || this.x >= canvasWidth - this.width - 20;
    }

    moveDown() {
        this.direction *= -1;
        this.y += 10;
    }

    updatePhase(newPhase) {
        this.phase = newPhase;
    }
}