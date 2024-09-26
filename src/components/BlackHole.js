class BlackHole {
    constructor(x, y, mass, radius, eventHorizonColor = 'rgba(255, 255, 0, 0.8)') {
        this.x = x;  // Position of the black hole
        this.y = y;
        this.mass = mass;  // Mass of the black hole (controls gravitational strength)
        this.radius = radius;  // Visual radius (can be adjusted)
        this.eventHorizonColor = eventHorizonColor;  // Glowing color for the event horizon
        this.pulseOffset = 0;  // Offset value to control the pulsing effect

        // **Add width and height for viewport culling**
        this.width = this.radius * 2.5 * 2;  // Considering the gradient
        this.height = this.radius * 2.5 * 2;
    }

    // Draw the black hole on the canvas
    draw(ctx) {
        // Draw the black center of the black hole
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'black';  // Black hole center
        ctx.fill();

        // Create radial gradient for light distortion (gravitational lensing effect)
        const gradient = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.radius * 2.5);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');  // Fully transparent at the center
        gradient.addColorStop(0.7, this.eventHorizonColor);  // Glowing yellow at the edge of the event horizon
        gradient.addColorStop(1, 'transparent');  // Completely transparent farther away

        // Apply the gradient around the black hole for the glowing effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Calculate the pulsing effect for the gravity pull circle
        const maxPullRadius = this.radius * 3;  // The gravitational pull radius (same as in Ship.js)
        const pulseSize = 10 * Math.sin(this.pulseOffset);  // Create a sine wave for the pulsing effect
        const pulsingRadius = maxPullRadius + pulseSize;  // Adjust the radius to pulse

        // Draw the pulsing circle representing the gravitational pull
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulsingRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';  // A semi-transparent white outline for the pulsing circle
        ctx.lineWidth = 2;
        ctx.stroke();

        // Update the pulse offset for animation
        this.pulseOffset += 0.02;  // Speed of the pulsing effect
    }

    // Static method to create black holes with different classes
    static createBlackHole(x, y, type = 'stellar') {
        let mass, radius, eventHorizonColor;

        // Define different types of black holes
        switch (type) {
            case 'stellar':
                mass = 10;  // Example: mass in solar masses
                radius = 30;  // Example: visual size
                eventHorizonColor = 'rgba(255, 255, 0, 0.8)';  // Yellow
                break;
            case 'intermediate':
                mass = 100;  // Example: larger mass
                radius = 50;  // Larger radius
                eventHorizonColor = 'rgba(255, 215, 0, 0.8)';  // Golden-yellow
                break;
            case 'supermassive':
                mass = 1000000;  // Supermassive black hole mass
                radius = 150;  // Much larger radius
                eventHorizonColor = 'rgba(255, 165, 0, 0.8)';  // More orange event horizon
                break;
            default:
                mass = 10;  // Default to stellar class
                radius = 30;
                eventHorizonColor = 'rgba(255, 255, 0, 0.8)';
        }

        return new BlackHole(x, y, mass, radius, eventHorizonColor);
    }
}

export default BlackHole;
