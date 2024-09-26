class Ship {
    constructor() {
        this.x = 400;
        this.y = 300;
        this.width = 40;
        this.height = 40;

        this.health = 100;
        this.maxHealth = 100;

        this.shields = 100;
        this.maxShields = 100;

        this.fuel = 100;
        this.maxFuel = 100;

        this.angle = 0;  // Start with the ship facing upwards
        this.image = new Image();
        this.image.src = './assets/images/spaceship.png';

        this.speed = 0.05;  // Adjust this for forward/backward movement
        this.rotationSpeed = 0.05;  // Speed of rotation

        this.vx = 0;  // Velocity for x and y directions
        this.vy = 0;

        this.friction = 0.99;  // Friction to slow the ship down over time
        this.spin = 0; //additional rotation from spinning
        this.mass = 10;  // Mass of the ship (affects gravitational pull)
    }

    // Collision detection method (AABB - Axis-Aligned Bounding Box)
    checkCollision(object) {
        return (
            this.x < object.x + object.width &&
            this.x + this.width > object.x &&
            this.y < object.y + object.height &&
            this.y + this.height > object.y
        );
    }

    // Bounce and spin the ship when it collides with an object
    bounce(object) {
        // Reverse the velocity to simulate a bounce
        this.vx = -this.vx * 0.8;  // Reduce velocity slightly after bounce
        this.vy = -this.vy * 0.8;  // Same for the y-axis

        // Add random spin to simulate the ship spinning after collision
        this.spin = (Math.random() - 0.5) * 0.2;  // Random spin within a range 
    }

    // Move method for thrusters and rotation
    move(direction) {
        if (direction === 'rotateRight') {
            this.angle += this.rotationSpeed;  // Rotate clockwise
        } else if (direction === 'rotateLeft') {
            this.angle -= this.rotationSpeed;  // Rotate counterclockwise
        } else if (direction === 'forward') {
            // Move forward based on the current angle
            this.vx -= this.speed * Math.cos(this.angle + Math.PI / 2);
            this.vy -= this.speed * Math.sin(this.angle + Math.PI / 2);
        } else if (direction === 'backward') {
            // Move backward based on the current angle
            this.vx += this.speed * Math.cos(this.angle + Math.PI / 2);
            this.vy += this.speed * Math.sin(this.angle + Math.PI / 2);
        }
    }

    // Apply gravity from a black hole
    applyGravity(blackHole) {
        const G = 0.1;  // Gravitational constant (adjust for strength)

        // Calculate max pull radius based on the visual radius of the black hole
        const maxPullRadius = blackHole.radius * 5;  // You can adjust the multiplier for desired range

        // Calculate distance between ship and the center of the black hole
        const dx = blackHole.x - (this.x + this.width / 2);  // Distance on x-axis from the center
        const dy = blackHole.y - (this.y + this.height / 2); // Distance on y-axis from the center
        const distance = Math.sqrt(dx * dx + dy * dy);  // Euclidean distance

        // Only apply gravity if within the pull radius
        if (distance < maxPullRadius) {
            // Calculate gravitational force magnitude
            const force = (G * this.mass * blackHole.mass) / (distance * distance);

            // Normalize the direction to get the acceleration components
            const ax = (force * dx) / distance;
            const ay = (force * dy) / distance;

            // Apply acceleration to velocity
            this.vx += ax;
            this.vy += ay;

            // Limit the ship's velocity to avoid it shooting off the screen
            const maxVelocity = 5;  // Set a maximum speed limit
            const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (currentSpeed > maxVelocity) {
                const scalingFactor = maxVelocity / currentSpeed;
                this.vx *= scalingFactor;
                this.vy *= scalingFactor;
            }

            // Apply additional damping as the ship approaches the black hole's center
            const dampingDistance = 20;  // Set a distance near the center where damping starts
            if (distance < dampingDistance) {
                const dampingFactor = 0.9;  // Dampen the velocity as the ship gets very close
                this.vx *= dampingFactor;
                this.vy *= dampingFactor;
            }
        }
    }


    update(objects) {
        // Ensure that objects is iterable (check if it's an array)
        if (Array.isArray(objects)) {
            objects.forEach(object => {
                // Check for collision with each object
                if (this.checkCollision(object)) {
                    console.log("Collision detected!");
                    this.takeDamage(10);  // Example: take damage when a collision occurs
                    this.bounce(object);  // Bounce off the asteroid

                }
            });
        }

        // Apply velocity to the ship's position
        this.x += this.vx;
        this.y += this.vy;

        // Apply friction to slow down over time
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Apply spin to the ship's rotation angle
        this.angle += this.spin;

        // Slowly reduce the spin effect over time
        this.spin *= 0.95;  // Dampen the spin over time
    }

    // Draw method to render the rotated ship
    draw(ctx) {
        // Save the current canvas state
        ctx.save();

        // Move to the center of the ship, rotate, then draw the image
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);  // Translate to the ship's center
        ctx.rotate(this.angle);  // Adjust rotation so ship faces upwards

        // Draw the image with the ship centered
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

        // Restore the canvas state to avoid affecting other drawings
        ctx.restore();
    }

    takeDamage(amount) {
        if (this.shields > 0) {
            this.shields -= amount;
            if (this.shields < 0) this.shields = 0;
        } else {
            this.health -= amount;
        }
    }

    repair() {
        // Logic to repair ship health or shields
    }

    refuel(amount) {
        this.fuel += amount;
    }

    consumeFuel(amount) {
        this.fuel -= amount;
        if (this.fuel < 0) this.fuel = 0;
    }
}

export default Ship;