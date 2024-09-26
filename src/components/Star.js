class Star {
    constructor(canvasWidth, canvasHeight) {
        // Randomly generate star position
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;

        // Randomly generate star size and brightness
        this.size = Math.random() * 2 + 1;  // Star size between 1 and 3
        this.brightness = Math.random() * 0.8 + 0.2;  // Brightness between 0.2 and 1
        // Adjusting the Effect:
        // Star Speed: If you want the stars to move even slower, reduce the parallaxFactor range in the Star class. For example, use Math.random() * 0.1 + 0.05 to make stars move more slowly.
        // Star Density: If you want more or fewer stars, adjust the this.numStars value in Game.js.
        // Parallax factor: how slowly the star moves relative to the ship
        this.parallaxFactor = Math.random() * 0.2 + 0.1;  // Parallax between 0.1 and 0.3
    }

    // Method to draw the star on the canvas, adjusted by parallax
    draw(ctx, cameraX, cameraY) {
        ctx.beginPath();

        // Move the star based on the camera's position and the parallax factor
        const parallaxX = this.x - cameraX * this.parallaxFactor;
        const parallaxY = this.y - cameraY * this.parallaxFactor;

        // Draw the star
        ctx.arc(parallaxX, parallaxY, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`;  // White with varying opacity
        ctx.fill();
    }
}

export default Star;
