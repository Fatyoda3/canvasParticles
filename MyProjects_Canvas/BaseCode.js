const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);

gradient.addColorStop(0, "purple")
gradient.addColorStop(0.5, "white")
gradient.addColorStop(1, "pink")


ctx.strokeStyle = "white";
ctx.fillStyle = gradient;

ctx.lineWidth = 2;
class Particle {

    constructor(effect) {
   

        this.effect = effect;
        this.radius = Math.floor(Math.random() * 20) + 10;
        this.context = this.effect.ctx;

        this.x = Math.floor(Math.random() * (this.effect.width - this.radius * 2)) + this.radius;
        this.y = Math.floor(Math.random() * (this.effect.height - this.radius * 2)) + this.radius;

        this.velocityX = Math.ceil(Math.random() * 2);
        this.velocityY = Math.ceil(Math.random() * 2);

        this.pushX = 0;
        this.pushY = 0;

        this.friction = 0.7;
    }

    draw() {

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 360);
        this.context.fill();

    }

    update() {


        this.x += (this.pushX *= this.friction) + this.velocityX;
        this.y += (this.pushY *= this.friction) + this.velocityY;

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


            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;

            const Distance = Math.hypot(dx, dy);

            const force = (this.effect.mouse.radius / Distance);

            if (Distance < this.effect.mouse.radius) {
                const angle = Math.atan2(dy, dx);


                this.pushX += Math.cos(angle) * force;
                this.pushY += Math.sin(angle) * force;

            }
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
        this.particleCount = 10;

        this.mouse = {
            radius: 100,
            x: null,
            y: null,
            pressed: false,
        }

        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        })

        window.addEventListener('mousemove', (e) => {

            if (this.mouse.pressed) {
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
        })



        window.addEventListener('mouseup', e =>
            this.mouse.pressed = false

        )


        this.createParticles();
        window.addEventListener('resize', (e) => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
        })



    }

    resize(width, height) {
        this.canvas.height = height;
        this.canvas.width = width;
        this.height = height;
        this.width = width;
        this.ctx.lineWidth = 2
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);

        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.5, 'orange');
        gradient.addColorStop(1, 'purple');
        this.ctx.fillStyle = gradient;

        this.ctx.strokeStyle = "#ffffff";

        this.ParticleArr.forEach(p => p.reset())
    }

    createParticles() {
        for (let index = 0; index < this.particleCount; index++)

            this.ParticleArr.push(new Particle(this));


    }

    handleParticles() {

        this.connectParticles();
        this.ParticleArr.forEach(p => {

            p.draw();

            p.update();

        })
    }

    connectParticles() {
        for (let a = 0; a < this.particleCount; a++) {
            for (let b = a; b < this.particleCount; b++) {

                let dx = this.ParticleArr[a].x - this.ParticleArr[b].x;
                let dy = this.ParticleArr[a].y - this.ParticleArr[b].y;
                let distance = Math.hypot(dx, dy);


                if (distance < 200) {
                    this.ctx.save();

                    let opacity = 1 - (distance / 200);

                    this.ctx.globalAlpha = opacity;

                    this.ctx.beginPath();

                    this.ctx.moveTo(this.ParticleArr[a].x, this.ParticleArr[a].y);

                    this.ctx.lineTo(this.ParticleArr[b].x, this.ParticleArr[b].y);

                    this.ctx.stroke();

                    this.ctx.restore();
                }

            }
        }

    }

}

const effect = new Effect(canvas, ctx);

function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    effect.handleParticles();
    requestAnimationFrame(animate);
}

animate();