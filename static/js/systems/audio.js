// Audio System
class AudioSystem {
    constructor() {
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.enabled = true;
        this.musicTimer = null;
        this.masterVolume = 0.3;
    }

    play(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.enabled) return;
        
        try {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.connect(gain);
            gain.connect(this.context.destination);
            
            osc.type = type;
            osc.frequency.value = frequency;
            
            const vol = volume * this.masterVolume;
            gain.gain.setValueAtTime(vol, this.context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
            
            osc.start(this.context.currentTime);
            osc.stop(this.context.currentTime + duration);
        } catch (e) {
            console.error('Audio error:', e);
        }
    }

    shoot() {
        this.play(880, 0.08, 'square', 0.15);
    }

    hit() {
        this.play(320, 0.12, 'sawtooth', 0.25);
    }

    explosion() {
        this.play(85, 0.3, 'sawtooth', 0.35);
        setTimeout(() => this.play(60, 0.2, 'sawtooth', 0.3), 50);
    }

    powerup() {
        this.play(650, 0.1, 'sine', 0.25);
        setTimeout(() => this.play(850, 0.1, 'sine', 0.25), 80);
        setTimeout(() => this.play(1050, 0.15, 'sine', 0.25), 150);
    }

    bossWarning() {
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.play(220, 0.25, 'square', 0.4);
            }, i * 250);
        }
    }

    startMusic() {
        if (this.musicTimer) return;
        
        const melodies = [
            [523, 587, 659, 698, 784, 880, 988, 1047],
            [440, 494, 523, 587, 659, 698, 784, 880],
            [392, 440, 494, 523, 587, 659, 698, 784]
        ];
        
        let melody = Helpers.randomChoice(melodies);
        let index = 0;
        
        this.musicTimer = setInterval(() => {
            if (this.enabled) {
                this.play(melody[index], 0.3, 'sine', 0.04);
                index = (index + 1) % melody.length;
            }
        }, 750);
    }

    stopMusic() {
        if (this.musicTimer) {
            clearInterval(this.musicTimer);
            this.musicTimer = null;
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopMusic();
        }
        return this.enabled;
    }
}

const audio = new AudioSystem();