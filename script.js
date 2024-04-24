


class Particle {

    constructor(effect) {


        this.effect = effect;
        this.radius = Math.floor(Math.random() * 20) + 10;
        this.buffer = this.radius * 2
        this.context = this.effect.ctx;

        this.x = Math.floor(Math.random() * (this.effect.width - this.radius * 2)) + this.radius;
        this.y = Math.floor(Math.random() * (this.effect.height - this.radius * 2)) + this.radius;

        this.velocityX = Math.random() * 0.1 + 0.1;
        this.velocityY = Math.random() * 0.1 + 0.1;

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

        if (this.x < this.buffer) {

            this.x = this.buffer;
            this.velocityX *= -1;
        }
        else if (this.x > this.effect.width - this.buffer) {
            this.x = this.effect.width - this.buffer;
            this.velocityX *= -1;

        }

        if (this.y < this.buffer) {
            this.y = this.buffer;
            this.velocityY *= -1;
        }
        else if (this.y > this.effect.height - this.buffer) {
            this.y = this.effect.height - this.buffer;
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
        this.particleCount = 50;

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



        window.addEventListener('mouseup', () =>
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
        this.ctx.fillStyle = "purple";
        this.height = height;
        this.width = width;
        this.ParticleArr.forEach(p => p.reset())
    }

    createParticles() {
        for (let index = 0; index < this.particleCount; index++)

            this.ParticleArr.push(new Particle(this));


    }

    handleParticles() {

        this.ParticleArr.forEach(p => {

            p.draw();

            p.update();

        })
    }



}


window.addEventListener('load', () => {
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const effect = new Effect(canvas, ctx);
    ctx.fillStyle = "white";
    function animate() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        effect.handleParticles();
        requestAnimationFrame(animate);
    }
    
    animate();

})