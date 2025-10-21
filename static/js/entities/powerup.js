// Powerup Entity (Rendering Only)
class PowerupEntity {
    constructor(data) {
        this.x = data.x;
        this.y = data.y;
        this.type = data.type;
        this.config = data.config;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.rotation = 0;
        this.pulse = 0;
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
        return Helpers.collision(this, player);
    }

    isOffScreen(canvasHeight) {
        return this.y > canvasHeight + 40;
    }
}