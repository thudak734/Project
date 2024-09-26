class Planet {
    constructor(x, y) {
        // Set the position of the planet
        this.x = x;  // X-coordinate passed from the game world
        this.y = y;  // Y-coordinate passed from the game world

        // Random size (between 20 and 100)
        this.radius = Math.random() * 80 + 20;

        // Random color for the planet
        this.color = this.getRandomColor();

        // Optionally generate rings (25% chance)
        this.hasRings = Math.random() < 0.25;

        // If the planet has rings, set ring size, color, and orientation
        if (this.hasRings) {
            this.ringColor = 'rgba(200, 200, 200, 0.5)';  // Semi-transparent gray
            this.ringWidth = this.radius * 0.3;  // Ring size relative to the planet's radius
            this.ringAngle = Math.random() * Math.PI * 2;  // Random angle for ring rotation
        }

        // **Add width and height for viewport culling**
        this.width = this.radius * 2;
        this.height = this.radius * 2;
    }

    // Helper method to generate a random color for the planet
    getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Method to draw the planet and its rings
    draw(ctx, cameraX, cameraY) {
        // Save the current context state
        ctx.save();

        // Translate the context to the planet's position (adjusted by camera)
        ctx.translate(this.x - cameraX, this.y - cameraY);

        // Draw the rings if the planet has them
        if (this.hasRings) {
            // Rotate the canvas by the random ring angle
            ctx.save();
            ctx.rotate(this.ringAngle);

            // Draw the back half of the ring (behind the planet)
            ctx.beginPath();
            ctx.ellipse(0, 0, this.radius + this.ringWidth, this.radius * 0.5, 0, Math.PI, Math.PI * 2);
            ctx.strokeStyle = this.ringColor;
            ctx.lineWidth = this.ringWidth;
            ctx.stroke();
            ctx.restore();
        }

        // Draw the planet
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw the front half of the ring (in front of the planet)
        if (this.hasRings) {
            ctx.save();
            ctx.rotate(this.ringAngle);
            ctx.beginPath();
            ctx.ellipse(0, 0, this.radius + this.ringWidth, this.radius * 0.5, 0, 0, Math.PI);
            ctx.strokeStyle = this.ringColor;
            ctx.lineWidth = this.ringWidth;
            ctx.stroke();
            ctx.restore();
        }

        // Restore the original context state
        ctx.restore();
    }
}

export default Planet;
