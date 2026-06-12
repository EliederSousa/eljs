import { Properties } from "../core/Properties";
import { Point } from "./Point";

/**
 * Static solver for physics forces and collision detection.
 *
 * Currently a stub — `applyForces` and `solveColisions` are no-ops
 * intended to be filled in with actual physics logic.
 */
export class PhysicsSolver {

    /**
     * Tests whether two objects are colliding.
     * @param obj1 - First object to test.
     * @param obj2 - Second object to test.
     * @returns `true` if a collision is detected.
     */
    static hitTest(obj1: any, obj2: any): boolean {
        return false;
    }

    /**
     * Applies global forces (gravity, wind, etc.) to all objects.
     * Called once per frame by `World.run()`.
     * @param objectList - Array of all scene objects to apply forces to.
     */
    static applyForces(objectList: any[]): void {
        // iterate over all objects and apply forces based on the settings of the world, and the object itself.
        objectList.forEach(element => {
            if (element.constructor.name === "RigidBody") {
                element.applyForce(new Point(0, Properties.gravity));
                element.applyForce(new Point(Properties.wind, 0));
            }
        });
    }

    /**
     * Resolves collisions between all objects.
     * Called once per frame by `World.run()` after `applyForces`.
     * @param objectList - Array of all scene objects to check and resolve collisions for.
     */
    static solveColisions(objectList: any[]): void {
        // iterate over all objects of a container and do hitTest checks on them.
    }
}
