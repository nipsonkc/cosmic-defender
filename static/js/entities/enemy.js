// Enemy Entity (Rendering Only)
class EnemyEntity {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.type = data.type;
        this.config = data.config;
        this.width = this.config.size;
        this.height = this.config.size;
        this.health = this.config.health;
        this.maxHealth = this.config.health;
        this.speed = this.config.speed;
        this.color = this.config.color;
        this.shootChance = this.config.shootChance;
        this.direction = 1;
        this.animationFrame = 0;
    }

    update() {
        this.x += this.speed * this.direction;
        this.animationFrame = (this.animationFrame + 0.1) % (Math.PI * 2);
    }

    draw(ctx) {
        ctx.save();
        
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 5;
        const eyeOffset = Math.sin(this.animationFrame) * 2;
        ctx.fillRect(this.x + 8, this.y + 10 + eyeOffset, 8, 8);
        ctx.fillRect(this.x + 20, this.y + 10 + eyeOffset, 8, 8);
        
        if (this.maxHealth > 1) {
            const barWidth = this.width;
            const barHeight = 4;
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#222';
            ctx.fillRect(this.x, this.y - 8, barWidth, barHeight);
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(this.x, this.y - 8, barWidth * (this.health / this.maxHealth), barHeight);
        }
        
        ctx.restore();
    }

    shouldShoot() {
        return Math.random() < this.shootChance;
    }

    createBullet() {
        return {
            x: this.x + this.width / 2 - 2,
            y: this.y + this.height,
            vx: 0,
            vy: 4.5,
            width: 4,
            height: 10
        };
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
        this.y += 18;
    }
}