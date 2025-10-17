// Powerup Class
class Powerup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.type = type;
        this.speed = 2;
        this.rotation = 0;
        this.pulse = 0;
        
        const types = {
            SHIELD: { color: '#00ffff', icon: '🛡️', duration: 540 },
            RAPID: { color: '#ffff00', icon: '⚡', duration: 720 },
            SPREAD: { color: '#ff00ff', icon: '💥', duration: 540 },
            HEALTH: { color: '#00ff60', icon: '❤️', duration: 0 }
        };
        
        this.config = types[type];
    }

    update() {
        this.y += this.speed;
        this.rotation += 0.08;
        this.pulse = (this.pulse + 0.1) % (Math.PI * 2);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const scale = 1 + Math.sin(this.pulse) * 0.15;
        ctx.scale(scale, scale);
        
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.config.color;
        
        ctx.fillStyle = this.config.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(this.config.icon, 0, 0);
        
        ctx.restore();
    }

    collidesWith(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }

    isOffScreen(canvasHeight) {
        return this.y > canvasHeight + 40;
    }
}

function spawnPowerup(x, y) {
    if (Math.random() < 0.28) {
        const types = ['SHIELD', 'RAPID', 'SPREAD', 'HEALTH'];
        const type = types[Math.floor(Math.random() * types.length)];
        return new Powerup(x, y, type);
    }
    return null;
}