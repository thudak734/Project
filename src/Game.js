import Ship from './components/Ship.js';
import Asteroid from './components/Asteroid.js';
import Blackhole from './components/Blackhole.js';
import Star from './components/Star.js';  // Import the Star class
import Planet from './components/Planet.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.keys = {};

        this.worldWidth = 5000;  // Define a large world
        this.worldHeight = 5000;
        this.camera = { x: 0, y: 0 };  // Camera position

        // Generate stars, asteroids, etc.
        this.numStars = 400;
        this.numPlanets = 100;

        this.stars = [];
        this.planets = [];

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        this.ship = new Ship();  // Initialize the ship
        this.objects = [
            new Asteroid(200, 200, 50, 50),
            new Blackhole(700, 300, 60, 20)  // Black hole with mass and radius
        ];

        this.setupControls();
        this.generateStars();
        this.generatePlanets();
        this.startGameLoop();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.generateStars();
    }

    generateStars() {
        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push(new Star(this.worldWidth, this.worldHeight));
        }
    }

    // Generate random planets across the large world
    generatePlanets() {
        // Generate planets over a large area
        this.planets = [];
        for (let i = 0; i < this.numPlanets; i++) {
            const planetX = Math.random() * this.worldWidth;
            const planetY = Math.random() * this.worldHeight;
            this.planets.push(new Planet(planetX, planetY));
        }
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    // Utility method to check if an object is in the viewport
    isInViewport(obj) {
        const objLeft = obj.x - obj.width / 2;
        const objRight = obj.x + obj.width / 2;
        const objTop = obj.y - obj.height / 2;
        const objBottom = obj.y + obj.height / 2;
    
        const viewLeft = this.camera.x;
        const viewRight = this.camera.x + this.canvas.width;
        const viewTop = this.camera.y;
        const viewBottom = this.camera.y + this.canvas.height;
    
        return (
            objRight > viewLeft &&
            objLeft < viewRight &&
            objBottom > viewTop &&
            objTop < viewBottom
        );
    }
    update() {
        // Rotate the ship with left/right keys
        if (this.keys['ArrowRight']) {
            this.ship.move('rotateRight');
        }
        if (this.keys['ArrowLeft']) {
            this.ship.move('rotateLeft');
        }

        // Move forward/backward with up/down keys
        if (this.keys['ArrowUp']) {
            this.ship.move('forward');
        }
        if (this.keys['ArrowDown']) {
            this.ship.move('backward');
        }

        // Move the camera to follow the ship with boundary checks
        this.camera.x = Math.min(Math.max(this.ship.x - this.canvas.width / 2, 0), this.worldWidth - this.canvas.width);
        this.camera.y = Math.min(Math.max(this.ship.y - this.canvas.height / 2, 0), this.worldHeight - this.canvas.height);

        // Apply gravity from black holes
        this.objects.forEach(object => {
            if (object instanceof Blackhole) {
                this.ship.applyGravity(object);
            }
        });

        // Update the ship's position and apply friction, etc.
        this.ship.update(this.objects);

        // **Removed DOM updates for HUD**
        // We no longer need to update the DOM elements since we're drawing the HUD on the canvas
    }

    renderHUD() {
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';

        // **Moved percentage calculations here**
        const fuelPercentage = (this.ship.fuel / this.ship.maxFuel) * 100;
        const shieldsPercentage = (this.ship.shields / this.ship.maxShields) * 100;
        const healthPercentage = (this.ship.health / this.ship.maxHealth) * 100;

        this.ctx.fillText(`Fuel: ${fuelPercentage.toFixed(0)}%`, 10, 20);
        this.ctx.fillText(`Shields: ${shieldsPercentage.toFixed(0)}%`, 10, 40);
        this.ctx.fillText(`Health: ${healthPercentage.toFixed(0)}%`, 10, 60);
        this.ctx.restore();
    }

    render() {
        // Clear the screen
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the stars with parallax effect
        this.stars.forEach(star => {
            star.draw(this.ctx, this.camera.x, this.camera.y);  // Pass camera position for parallax
        });

        // **Implement viewport culling for planets**
        // Draw the planets that are in the viewport
        this.planets.forEach(planet => {
            if (this.isInViewport(planet)) {
                planet.draw(this.ctx, this.camera.x, this.camera.y);  // Draw each planet
            }
        });

        // **Implement viewport culling for objects**
        // Draw objects (e.g., asteroids, black holes)
        this.objects.forEach(object => {
            if (this.isInViewport(object)) {
                this.ctx.save();
                this.ctx.translate(-this.camera.x, -this.camera.y);  // Adjust object positions based on camera
                object.draw(this.ctx);
                this.ctx.restore();
            }
        });

        // Draw the ship (adjusted by camera position)
        this.ctx.save();
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.ship.draw(this.ctx);
        this.ctx.restore();

        // Call renderHUD at the end of your render method
        this.renderHUD();
    }

    startGameLoop() {
        const gameLoop = () => {
            this.update();
            this.render();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

export default Game;
