const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gradient = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);

gradient.addColorStop(0, "pink");
gradient.addColorStop(0.5, "red");
gradient.addColorStop(1, "magenta");


ctx.strokeStyle = "black";
ctx.fillStyle = gradient;

ctx.lineWidth = 0.1;
class Particle {

    constructor(effect, index) {

        this.index = index;
        this.effect = effect;


        this.radius = 1 /* Math.floor(Math.random() * 10) + 10 */ ;
        this.MinRadius = this.radius ;
        this.MaxRadius = this.radius *25;
        this.context = this.effect.ctx;

        this.x = Math.floor(Math.random() * (this.effect.width - this.radius * 2)) + this.radius;
        this.y = Math.floor(Math.random() * (this.effect.height - this.radius * 2)) + this.radius;

        this.velocityX = (Math.random() * 0.1) + 0.1;
        this.velocityY = (Math.random() * 0.2) + 0.1;


    }

    draw() {


// this.context.globalAlpha = 0;
        this.context.beginPath();

        this.context.arc(this.x, this.y, this.radius, 0, 360);
        this.context.fill();//comment this line for transparent bubbles
        this.context.stroke();

        this.context.save();

        this.context.beginPath();

        this.context.fillStyle = 'white';

        this.context.globalAlpha = 0.4;

        this.context.arc(this.x - this.radius * 0.2, this.y - this.radius * 0.3, this.radius * 0.4, 0, 360);

        this.context.fill();

        this.context.restore();

    }

    update() {


        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.x < this.radius) {

            this.x = this.radius;
            this.velocityX *= -1;
        }
        else if (this.x > this.effect.width - this.radius) {
            this.x = this.effect.width - this.radius;
            this.velocityX *= -1;

        }

        if (this.y < this.radius) {
            this.y = this.radius;
            this.velocityY *= -1;
        }

        else if (this.y > this.effect.height - this.radius) {
            this.y = this.effect.height - this.radius;
            this.velocityY *= -1;

        }


        if (this.effect.mouse.pressed) {
            this.context.globalAlpha = 1;
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;

            const distance = Math.hypot(dx, dy);

            if (this.radius < this.MaxRadius && distance < this.effect.mouse.radius) {

                this.radius += 1;
            }


        }

        else if (!this.effect.mouse.pressed && this.radius > this.MinRadius) {
            this.radius -= 0.05;

        }

    }

    reset() {
        this.x = Math.random() * (this.effect.width - this.radius * 2) + this.radius;
        this.y = Math.random() * (this.effect.height - this.radius * 2) + this.radius;
    }

}


class Effect {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.ParticleArr = [];
        this.particleCount = 100;

        this.mouse = {
            radius: 25,
            x: this.canvas.width * 0.5,
            y: this.canvas.height * 0.5,
            pressed: false,
        }

        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;



        })

        window.addEventListener('mousemove', e => {

            if (this.mouse.pressed) {
                this.mouse.x = e.x;
                this.mouse.y = e.y;

            }
        })

        window.addEventListener('mouseup', () =>
            this.mouse.pressed = false

        )

        window.addEventListener('resize', e =>
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight)
        )
        this.createParticles();

    }


    resize(width, height) {
        this.canvas.height = height;
        this.canvas.width = width;
        this.height = height;
        this.width = width;
        this.ctx.lineWidth = 0.1
        gradient = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);

        gradient.addColorStop(0, "pink");
        gradient.addColorStop(0.5, "red");
        gradient.addColorStop(1, "magenta");
        this.ctx.fillStyle = gradient;
        this.ctx.strokeStyle = "black";

        this.ParticleArr.forEach(p => p.reset())
    }

    createParticles() {
        for (let index = 0; index < this.particleCount; index++)

            this.ParticleArr.push(new Particle(this, index));


    }

    handleParticles() {
        this.ParticleArr.forEach(p => {
            p.draw();
            p.update();
        })

    }




}

const effect = new Effect(canvas, ctx);

function animate() {

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    effect.handleParticles();

    requestAnimationFrame(animate);
}

animate();





