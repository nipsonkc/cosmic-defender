// Player Class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 8;
        this.shootCooldown = 0;
        this.shield = false;
        this.rapidFire = false;
        this.spreadShot = false;
        this.trailTimer = 0;
    }

    update(keys, canvasWidth, canvasHeight, particles) {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < canvasWidth - this.width) {
            this.x += this.speed;
        }
        if (keys['ArrowUp'] && this.y > canvasHeight / 2) {
            this.y -= this.speed;
        }
        if (keys['ArrowDown'] && this.y < canvasHeight - this.height) {
            this.y += this.speed;
        }

        this.trailTimer++;
        if (this.trailTimer % 2 === 0) {
            particles.trail(
                this.x + this.width / 2,
                this.y + this.height,
                '#ff6600',
                2
            );
        }

        if (this.shootCooldown > 0) this.shootCooldown--;
    }

    draw(ctx) {
        ctx.save();

        if (this.shield) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00ffff';
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 35, 0, Math.PI * 2);
            ctx.stroke();
        }

        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        gradient.addColorStop(0, '#00ff88');
        gradient.addColorStop(1, '#00aa55');
        
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ff88';
        
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 3, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff4400';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff4400';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    shoot() {
        if (this.shootCooldown > 0) return [];

        audio.shoot();
        const bullets = [];
        const centerX = this.x + this.width / 2 - 2;

        if (this.spreadShot) {
            bullets.push(
                { x: centerX, y: this.y, vx: -2.5, vy: -10, width: 4, height: 14 },
                { x: centerX, y: this.y, vx: 0, vy: -11, width: 4, height: 14 },
                { x: centerX, y: this.y, vx: 2.5, vy: -10, width: 4, height: 14 }
            );
            this.shootCooldown = this.rapidFire ? 8 : 14;
        } else if (this.rapidFire) {
            bullets.push({ x: centerX, y: this.y, vx: 0, vy: -11, width: 4, height: 14 });
            this.shootCooldown = 6;
        } else {
            bullets.push({ x: centerX, y: this.y, vx: 0, vy: -10, width: 4, height: 14 });
            this.shootCooldown = 14;
        }

        return bullets;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.shootCooldown = 0;
        this.shield = false;
        this.rapidFire = false;
        this.spreadShot = false;
    }
}