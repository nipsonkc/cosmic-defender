// Particle System
class Particle {
    constructor(x, y, color, velocity = null) {
        this.x = x;
        this.y = y;
        this.vx = velocity ? velocity.x : (Math.random() - 0.5) * 8;
        this.vy = velocity ? velocity.y : (Math.random() - 0.5) * 8;
        this.size = Math.random() * 4 + 2;
        this.color = color;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.015;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15;
        this.life -= this.decay;
        return this.life > 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    burst(x, y, color, count = 25) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }

    trail(x, y, color, count = 3) {
        for (let i = 0; i < count; i++) {
            const p = new Particle(x, y, color);
            p.vx = (Math.random() - 0.5) * 2;
            p.vy = Math.random() * 3 + 1;
            p.size = Math.random() * 2 + 1;
            this.particles.push(p);
        }
    }

    update() {
        this.particles = this.particles.filter(p => p.update());
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }

    clear() {
        this.particles = [];
    }
}