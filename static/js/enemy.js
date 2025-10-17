// Enemy Class
class Enemy {
    constructor(x, y, type, wave) {
        this.x = x;
        this.y = y;
        this.width = 36;
        this.height = 36;
        this.type = type;
        this.direction = 1;
        this.shootTimer = Math.random() * 100;
        this.animationFrame = 0;
        
        const types = {
            BASIC: { color: '#4169e1', hp: 1, speed: 1.0, score: 10, shootChance: 0.004 },
            FAST: { color: '#ffa500', hp: 1, speed: 2.4, score: 20, shootChance: 0.008 },
            TANK: { color: '#9400d3', hp: 3, speed: 0.7, score: 30, shootChance: 0.006 },
            SHOOTER: { color: '#ff1493', hp: 2, speed: 1.2, score: 25, shootChance: 0.018 }
        };
        
        const config = types[type];
        this.color = config.color;
        this.health = config.hp;
        this.maxHealth = config.hp;
        this.speed = config.speed * (1 + wave * 0.1);
        this.score = config.score;
        this.shootChance = config.shootChance;
    }

    update() {
        this.x += this.speed * this.direction;
        this.shootTimer++;
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