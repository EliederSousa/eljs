import { Properties } from "../core/Properties.js";
import { RigidBody } from "../objects/RigidBody.js";
import { Point } from "./Point.js";

export class PhysicsSolver {

    static applyForces(obj: RigidBody): void {
        if (obj.movableObject && obj.movableObject.mass !== Infinity) {
            obj.movableObject.acceleration.add(new Point(Properties.wind, Properties.gravity));
        }
    }

    static solveColisions(objectList: RigidBody[]): void {
        const bodies = objectList.filter(obj => obj && obj.shape && obj.movableObject);

        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                const bodyA = bodies[i];
                const bodyB = bodies[j];

                if (bodyA.movableObject.mass === Infinity && bodyB.movableObject.mass === Infinity) {
                    continue;
                }

                // 1. Broadphase via Bounding Circles
                const distSq = PhysicsSolver.getDistanceSq(bodyA.shape.position, bodyB.shape.position);
                const radiusA = PhysicsSolver.getShapeRadius(bodyA.shape);
                const radiusB = PhysicsSolver.getShapeRadius(bodyB.shape);
                const maxDist = radiusA + radiusB;

                if (distSq > maxDist * maxDist) {
                    continue;
                }

                // 2. Narrowphase
                let collisionInfo = null;
                const typeA = bodyA.shape.constructor.name;
                const typeB = bodyB.shape.constructor.name;

                if (typeA === "CircleObject" && typeB === "CircleObject") {
                    collisionInfo = PhysicsSolver.checkCircleToCircle(bodyA.shape, bodyB.shape);
                }
                else if (typeA === "CircleObject") {
                    collisionInfo = PhysicsSolver.checkCircleToPolygon(bodyA.shape, bodyB.shape.vertices);
                }
                else if (typeB === "CircleObject") {
                    collisionInfo = PhysicsSolver.checkCircleToPolygon(bodyB.shape, bodyA.shape.vertices);
                    if (collisionInfo) {
                        collisionInfo.normal.scale(-1);
                    }
                }
                else {
                    collisionInfo = PhysicsSolver.checkPolygonToPolygon(bodyA.shape.vertices, bodyB.shape.vertices);
                }

                if (collisionInfo) {
                    PhysicsSolver.resolveCollision(bodyA, bodyB, collisionInfo);
                }
            }
        }
    }

    private static getDistanceSq(p1: Point, p2: Point): number {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return dx * dx + dy * dy;
    }

    private static getShapeRadius(shape: any): number {
        // Garante a leitura independente de onde o raio foi injetado na subclasse
        if (shape.radius !== undefined) return shape.radius;
        if (shape.size !== undefined) return shape.size * 0.707;
        if (shape.width && shape.height) {
            return Math.sqrt(shape.width * shape.width + shape.height * shape.height) / 2;
        }
        if (shape.to) {
            const dx = shape.to.x - shape.position.x;
            const dy = shape.to.y - shape.position.y;
            return Math.sqrt(dx * dx + dy * dy) / 2;
        }
        return 0;
    }

    private static dotProduct(p1: Point, p2: Point): number {
        return p1.x * p2.x + p1.y * p2.y;
    }

    private static getNormals(vertices: Point[]): Point[] {
        const normals: Point[] = [];
        const len = vertices.length === 2 ? 1 : vertices.length;
        for (let i = 0; i < len; i++) {
            const p1 = vertices[i];
            const p2 = vertices[(i + 1) % vertices.length];
            const edge = new Point(p2.x - p1.x, p2.y - p1.y);
            // Usa o método funcional .normal() do seu Point.ts
            const normal = new Point(-edge.y, edge.x).normal();
            normals.push(normal);
        }
        return normals;
    }

    private static checkCircleToCircle(cA: any, cB: any): { normal: Point, depth: number } | null {
        const dx = cB.position.x - cA.position.x;
        const dy = cB.position.y - cA.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radiusSum = cA.radius + cB.radius;

        if (distance >= radiusSum) return null;

        const normal = distance === 0 ? new Point(1, 0) : new Point(dx / distance, dy / distance);
        return { normal, depth: radiusSum - distance };
    }

    private static checkCircleToPolygon(circle: any, vertices: Point[]): { normal: Point, depth: number } | null {
        let minDepth = Infinity;
        let collisionNormal = new Point(0, 0);

        let closestVertex = vertices[0];
        let minDistSq = PhysicsSolver.getDistanceSq(circle.position, closestVertex);

        for (let i = 1; i < vertices.length; i++) {
            const distSq = PhysicsSolver.getDistanceSq(circle.position, vertices[i]);
            if (distSq < minDistSq) {
                minDistSq = distSq;
                closestVertex = vertices[i];
            }
        }

        // Modificado para usar seu método .normal() funcional
        let axisCircle = new Point(closestVertex.x - circle.position.x, closestVertex.y - circle.position.y).normal();
        const axes = [...PhysicsSolver.getNormals(vertices), axisCircle];

        for (const axis of axes) {
            let minP = Infinity, maxP = -Infinity;
            for (const v of vertices) {
                const proj = PhysicsSolver.dotProduct(v, axis);
                if (proj < minP) minP = proj;
                if (proj > maxP) maxP = proj;
            }

            // CORRIGIDO: Usa o dotProduct estático para consistência e precisão total
            const centerProj = PhysicsSolver.dotProduct(circle.position, axis);
            const minC = centerProj - circle.radius;
            const maxC = centerProj + circle.radius;

            if (maxP < minC || maxC < minP) return null;

            const depth = Math.min(maxP, maxC) - Math.max(minP, minC);
            if (depth < minDepth) {
                minDepth = depth;
                collisionNormal = axis;
            }
        }

        return { normal: collisionNormal, depth: minDepth };
    }

    private static checkPolygonToPolygon(verticesA: Point[], verticesB: Point[]): { normal: Point, depth: number } | null {
        let minDepth = Infinity;
        let collisionNormal = new Point(0, 0);

        const edges = [
            ...PhysicsSolver.getNormals(verticesA),
            ...PhysicsSolver.getNormals(verticesB)
        ];

        for (const axis of edges) {
            let minA = Infinity, maxA = -Infinity;
            for (const v of verticesA) {
                const p = PhysicsSolver.dotProduct(v, axis);
                if (p < minA) minA = p;
                if (p > maxA) maxA = p;
            }

            let minB = Infinity, maxB = -Infinity;
            for (const v of verticesB) {
                const p = PhysicsSolver.dotProduct(v, axis);
                if (p < minB) minB = p;
                if (p > maxB) maxB = p;
            }

            if (maxA < minB || maxB < minA) return null;

            const depth = Math.min(maxA, maxB) - Math.max(minA, minB);
            if (depth < minDepth) {
                minDepth = depth;
                collisionNormal = axis;
            }
        }

        return { normal: collisionNormal, depth: minDepth };
    }

    private static resolveCollision(bodyA: RigidBody, bodyB: RigidBody, collision: { normal: Point, depth: number }): void {
        const movA = bodyA.movableObject;
        const movB = bodyB.movableObject;

        const centerA = bodyA.shape.getCenter();
        const centerB = bodyB.shape.getCenter();
        const direction = new Point(centerB.x - centerA.x, centerB.y - centerA.y);
        let normal = collision.normal.clone();
        if (PhysicsSolver.dotProduct(direction, normal) < 0) {
            normal.scale(-1);
        }

        const invMassA = movA.mass === Infinity ? 0 : 1 / movA.mass;
        const invMassB = movB.mass === Infinity ? 0 : 1 / movB.mass;
        const totalInvMass = invMassA + invMassB;

        if (totalInvMass === 0) return; // Ambos são estáticos, impede divisão por zero

        const percent = 0.95;
        const slop = 0.01;
        const correctionMagnitude = Math.max(collision.depth - slop, 0) / totalInvMass * percent;

        const correctionVector = normal.clone();
        correctionVector.scale(correctionMagnitude);

        if (movA.mass !== Infinity) movA.position.sub(correctionVector.clone().scale(invMassA));
        if (movB.mass !== Infinity) movB.position.add(correctionVector.clone().scale(invMassB));

        const contactPoint = new Point(
            (centerA.x + centerB.x) / 2,
            (centerA.y + centerB.y) / 2
        );

        const rA = new Point(contactPoint.x - centerA.x, contactPoint.y - centerA.y);
        const rB = new Point(contactPoint.x - centerB.x, contactPoint.y - centerB.y);

        const vContactA = new Point(movA.velocity.x - movA.velRotation * rA.y, movA.velocity.y + movA.velRotation * rA.x);
        const vContactB = new Point(movB.velocity.x - movB.velRotation * rB.y, movB.velocity.y + movB.velRotation * rB.x);

        const relativeVelocity = new Point(vContactB.x - vContactA.x, vContactB.y - vContactA.y);
        const velAlongNormal = PhysicsSolver.dotProduct(relativeVelocity, normal);

        if (velAlongNormal > 0) return;

        const restitution = 0.4; // Ajustado levemente para um quique mais suave e realista

        const sizeA = PhysicsSolver.getShapeRadius(bodyA.shape) * 2;
        const sizeB = PhysicsSolver.getShapeRadius(bodyB.shape) * 2;
        const inertiaA = movA.mass === Infinity ? Infinity : (movA.mass * (sizeA * sizeA + sizeA * sizeA)) / 12;
        const inertiaB = movB.mass === Infinity ? Infinity : (movB.mass * (sizeB * sizeB + sizeB * sizeB)) / 12;

        const invInertiaA = inertiaA === Infinity ? 0 : 1 / inertiaA;
        const invInertiaB = inertiaB === Infinity ? 0 : 1 / inertiaB;

        const rACrossN = rA.x * normal.y - rA.y * normal.x;
        const rBCrossN = rB.x * normal.y - rB.y * normal.x;

        let impulseScalar = -(1 + restitution) * velAlongNormal;
        impulseScalar /= totalInvMass;

        const impulseVector = normal.clone();
        impulseVector.scale(impulseScalar);

        if (movA.mass !== Infinity) movA.velocity.sub(impulseVector.clone().scale(invMassA));
        if (movB.mass !== Infinity) movB.velocity.add(impulseVector.clone().scale(invMassB));
    }
}