// Imports
import { World } from "./objects/World.js";
import { CircleObject } from "./objects/Circle.js";
import { SquareObject } from "./objects/Square.js";
import { RigidBody } from "./objects/RigidBody.js";
import { MovableObject } from "./objects/MovableObject.js";
import { Point } from "./physics/Point.js";
import { Color } from "./util/Color.js";

// Create the world (manages screen and camera)
let world = new World();
// Set background color to black
world.screen.setBackgroundColor(Color.fromName("black"));

// Keep our own list of RigidBody objects (World.#objects is private)
let bodies = [];
// Store half-height of each shape for collision
let halfHeights = [];

// Create 100 circles spaced horizontally, wrapped in RigidBody with slow rightward velocity
for (let i = 0; i < 100; i++) {
    let c = new CircleObject(new Point(100 + i * 10, 100 + i * 10), {
        radius: 5,
        useVertices: false,
        numvertices: 20,
    });
    let body = new RigidBody(c, new MovableObject(c.position, c, {
        velocity: new Point(0.5, 0),
    }));
    bodies.push(body);
    halfHeights.push(c.radius);
}

// Create 4 blue squares at random positions, also moving right
for (let i = 0; i < 4; i++) {
    let sq = new SquareObject(new Point(Math.random() * world.screen.width, Math.random() * world.screen.height), {
        size: 30,
        color: new Color(0, 0, 1, 1),
        drawMode: "CENTER",
    });
    let body = new RigidBody(sq, new MovableObject(sq.position, sq, {
        velocity: new Point(0.5, 0),
    }));
    bodies.push(body);
    halfHeights.push(sq.size / 2);
}

// Explosion state
let explosionCenter = null;
let explosionTimer = 0;

// Particle system
let particles = [];

function spawnExplosionParticles(center) {
    let count = 60;
    for (let i = 0; i < count; i++) {
        let angle = (360 / count) * i + Math.random() * 10;
        let speed = 3 + Math.random() * 5;
        let vel = new Point(angle, "angle");
        vel.scale(speed);

        let c = new CircleObject(center.clone(), {
            radius: 2 + Math.random() * 2,
            useVertices: false,
            numvertices: 8,
            color: new Color(
                1,
                0.5 + Math.random() * 0.5,
                Math.random() * 0.3,
                1
            ),
        });
        let body = new RigidBody(c, new MovableObject(c.position, c, {
            velocity: vel,
        }));
        particles.push({
            body,
            born: performance.now(),
            lifetime: 800 + Math.random() * 600,
        });
    }
}

// Listen for clicks on the canvas
world.screen.canvas.addEventListener("click", (e) => {
    explosionCenter = new Point(e.offsetX, e.offsetY);
    explosionTimer = 1;
    spawnExplosionParticles(explosionCenter);
});

// Custom game loop with gravity, bottom bouncing, and explosion effect
function loop() {
    world.screen.draw();

    for (let i = 0; i < bodies.length; i++) {
        let body = bodies[i];
        let halfHeight = halfHeights[i];

        // Apply explosion force if active
        if (explosionCenter) {
            let pos = body.movableObject.position;
            let dir = new Point(pos.x - explosionCenter.x, pos.y - explosionCenter.y);
            let dist = dir.size();
            let radius = 250;
            if (dist < radius && dist > 0) {
                let force = (1 - dist / radius) * 15;
                dir = dir.normal();
                body.applyForce(new Point(dir.x * force, dir.y * force));
            }
        }

        // Apply gravity
        body.applyForce(new Point(0, 0.2));
        // Update physics (velocity, position)
        body.update();

        // Bounce off bottom
        if (body.movableObject.position.y + halfHeight > world.screen.height) {
            body.movableObject.position.y = world.screen.height - halfHeight;
            body.movableObject.velocity.y *= -0.7;
        }

        // Wrap around horizontally
        if (body.movableObject.position.x > world.screen.width) {
            body.movableObject.position.x = 0;
        }

        // Draw the shape through the camera
        world.screen.drawItem(body.shape, world.camera);
    }

    // Update and draw particles
    let now = performance.now();
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        let age = now - p.born;
        let life = p.lifetime;

        // Remove dead particles
        if (age >= life) {
            particles.splice(i, 1);
            continue;
        }

        // Fade out
        let alpha = 1 - age / life;
        p.body.shape.color = new Color(
            p.body.shape.color.red,
            p.body.shape.color.green,
            p.body.shape.color.blue,
            alpha,
        );

        // Apply gravity with less effect
        p.body.applyForce(new Point(0, 0.05));
        p.body.update();

        world.screen.drawItem(p.body.shape, world.camera);
    }

    // Clear explosion after one frame
    if (explosionTimer > 0) {
        explosionTimer--;
        if (explosionTimer === 0) explosionCenter = null;
    }

    requestAnimationFrame(loop);
}

loop();
