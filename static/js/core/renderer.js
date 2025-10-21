// Renderer
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBullet(bullet) {
        this.ctx.fillStyle = '#ffff00';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#ffff00';
        this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        this.ctx.shadowBlur = 0;
    }

    drawEnemyBullet(bullet) {
        this.ctx.fillStyle = '#ff0066';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#ff0066';
        this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        this.ctx.shadowBlur = 0;
    }

    applyTheme(theme) {
        this.canvas.style.background = theme.bgColor;
    }
}