class Asteroid {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

    }

    draw(ctx) {
        // Draw the asteroid (you can replace this with an actual image)
        ctx.fillStyle = 'gray';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default Asteroid;