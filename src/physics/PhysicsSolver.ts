import { Properties } from "../core/Properties.js";
import { RigidBody } from "../objects/RigidBody.js";
import { MathHelper } from "../util/MathHelper.js";
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

        // 1. Correção Posicional Geométrica (Afastamento)
        const direction = new Point(movB.position.x - movA.position.x, movB.position.y - movA.position.y);
        let normal = collision.normal.clone();
        if (PhysicsSolver.dotProduct(direction, normal) < 0) {
            normal.scale(-1);
        }

        // =================================================================
        // Cálculo Dinâmico do Ponto de Contato Múltiplo (Manifold). Isso descobre onde é o apoio ANTES de afastá-los
        // =================================================================
        let contactPoint = new Point(0, 0);
        const isPolyA = !!bodyA.shape.vertices;
        const isPolyB = !!bodyB.shape.vertices;

        if (isPolyA && isPolyB) {
            let contacts: Point[] = [];

            // 1. Acha quais vértices da Caixa entraram no Chão
            for (const v of bodyA.shape.vertices) {
                if (PhysicsSolver.pointInPolygon(v, bodyB.shape.vertices)) contacts.push(v);
            }
            // 2. Acha quais quinas do Chão entraram na Caixa (Essencial para tombar da borda!)
            for (const v of bodyB.shape.vertices) {
                if (PhysicsSolver.pointInPolygon(v, bodyA.shape.vertices)) contacts.push(v);
            }

            if (contacts.length > 0) {
                // Se achou sobreposição cruzada, o ponto de alavanca é a média exata deles
                let cx = 0, cy = 0;
                for (const c of contacts) { cx += c.x; cy += c.y; }
                contactPoint = new Point(cx / contacts.length, cy / contacts.length);
            } else {
                // FALLBACK: Se está repousando perfeitamente plano e a penetração é microscópica,
                // tiramos a média de TODA a face de apoio (evita o viés de vértice único).
                let maxDistA = -Infinity;
                let supportsA: Point[] = [];
                for (const v of bodyA.shape.vertices) {
                    const proj = PhysicsSolver.dotProduct(v, normal);
                    if (proj > maxDistA + 0.05) { maxDistA = proj; supportsA = [v.clone()]; }
                    else if (Math.abs(proj - maxDistA) <= 0.05) { supportsA.push(v.clone()); }
                }
                let cx = 0, cy = 0;
                for (const c of supportsA) { cx += c.x; cy += c.y; }
                contactPoint = new Point(cx / supportsA.length, cy / supportsA.length);
            }
        } else if (!isPolyA && isPolyB) {
            const radius = PhysicsSolver.getShapeRadius(bodyA.shape);
            contactPoint = new Point(movA.position.x + normal.x * radius, movA.position.y + normal.y * radius);
        } else if (isPolyA && !isPolyB) {
            const radius = PhysicsSolver.getShapeRadius(bodyB.shape);
            contactPoint = new Point(movB.position.x - normal.x * radius, movB.position.y - normal.y * radius);
        } else {
            const radius = PhysicsSolver.getShapeRadius(bodyA.shape);
            contactPoint = new Point(movA.position.x + normal.x * radius, movA.position.y + normal.y * radius);
        }

        // =================================================================
        // Braços de alavanca (rA e rB) apontando pro local real balanceado
        // =================================================================
        const rA = new Point(contactPoint.x - movA.position.x, contactPoint.y - movA.position.y);
        const rB = new Point(contactPoint.x - movB.position.x, contactPoint.y - movB.position.y);

        // =================================================================
        // Correção Posicional Geométrica (Afastamento contra afundamento)
        // =================================================================
        const invMassA = movA.mass === Infinity ? 0 : 1 / movA.mass;
        const invMassB = movB.mass === Infinity ? 0 : 1 / movB.mass;
        const totalInvMass = invMassA + invMassB;

        if (totalInvMass === 0) return;

        const percent = Properties.positionalCorrectionPercent;
        const slop = Properties.positionalCorrectionSlop;
        const correctionMagnitude = Math.max(collision.depth - slop, 0) / totalInvMass * percent;

        const correctionVector = normal.clone();
        correctionVector.scale(correctionMagnitude);

        if (movA.mass !== Infinity) movA.position.sub(correctionVector.clone().scale(invMassA));
        if (movB.mass !== Infinity) movB.position.add(correctionVector.clone().scale(invMassB));

        // =================================================================
        // CORREÇÃO 2: Graus para Radianos (Impede o objeto de decolar sozinho)
        // =================================================================
        const radA = movA.velRotation * (MathHelper._PI180);
        const radB = movB.velRotation * (MathHelper._PI180);

        // Agora a velocidade tangencial calculada é a real do mundo físico
        const vContactA = new Point(movA.velocity.x - radA * rA.y, movA.velocity.y + radA * rA.x);
        const vContactB = new Point(movB.velocity.x - radB * rB.y, movB.velocity.y + radB * rB.x);

        const relativeVelocity = new Point(vContactB.x - vContactA.x, vContactB.y - vContactA.y);
        const velAlongNormal = PhysicsSolver.dotProduct(relativeVelocity, normal);

        if (velAlongNormal > 0) return;

        // =================================================================
        // CORREÇÃO: Restituição Dinâmica (Substitui a antiga trava de return)
        // =================================================================
        let restitution = Math.max(movA.restitution, movB.restitution);

        // Se a batida for muito fraca (gravidade de 1 frame), é contato de repouso.
        // Zeramos a restituição para ele não ficar tremendo, mas DEIXAMOS o código
        // continuar para que a quina do chão gere o torque que faz o objeto tombar!
        if (Math.abs(velAlongNormal) < 5.0) {
            restitution = 0;
        }
        // =================================================================

        const sizeA = PhysicsSolver.getShapeRadius(bodyA.shape) * 2;
        const sizeB = PhysicsSolver.getShapeRadius(bodyB.shape) * 2;

        const inertiaA = (movA.mass === Infinity || movA.fixedRotation) ? Infinity : (movA.mass * (sizeA * sizeA + sizeA * sizeA)) / 12;
        const inertiaB = (movB.mass === Infinity || movB.fixedRotation) ? Infinity : (movB.mass * (sizeB * sizeB + sizeB * sizeB)) / 12;

        const invInertiaA = inertiaA === Infinity ? 0 : 1 / inertiaA;
        const invInertiaB = inertiaB === Infinity ? 0 : 1 / inertiaB;

        const rACrossN = rA.x * normal.y - rA.y * normal.x;
        const rBCrossN = rB.x * normal.y - rB.y * normal.x;

        // =================================================================
        // CORREÇÃO 3: Divisor com a Inércia correta restaurada!
        // =================================================================
        const angularComponentA = rACrossN * rACrossN * invInertiaA;
        const angularComponentB = rBCrossN * rBCrossN * invInertiaB;

        let impulseScalar = -(1 + restitution) * velAlongNormal;
        impulseScalar /= (totalInvMass + angularComponentA + angularComponentB);

        const impulseVector = normal.clone();
        impulseVector.scale(impulseScalar);

        // Aplica o pulo (linear)
        if (movA.mass !== Infinity) movA.velocity.sub(impulseVector.clone().scale(invMassA));
        if (movB.mass !== Infinity) movB.velocity.add(impulseVector.clone().scale(invMassB));

        // ─────────────────────────────────────────────────────────────
        // CRÍTICO PARA PILHAS: Atualiza a geometria AGORA para a próxima iteração ler o dado certo!
        // ─────────────────────────────────────────────────────────────
        if (bodyA.shape && typeof bodyA.shape.updateVertices === "function") {
            bodyA.shape.position = movA.position; // Garante sincronia
            bodyA.shape.updateVertices();
        }
        if (bodyB.shape && typeof bodyB.shape.updateVertices === "function") {
            bodyB.shape.position = movB.position; // Garante sincronia
            bodyB.shape.updateVertices();
        }

        // =================================================================
        // SENSIBILIDADE ROTACIONAL (ANGULAR DEADZONE)
        // =================================================================
        // Se a força do impacto tentar girar o objeto menos que isso (em graus) 
        // durante um repouso, nós ignoramos e travamos o quadrado.
        const ROTATION_SENSITIVITY = Properties.rotationSensitivity;

        // Define se é apenas a gravidade empurrando (repouso) ou uma batida real
        const isResting = Math.abs(velAlongNormal) < 5.0;

        // 1. Aplica o torque da Força Normal (Pulo/Afastamento)
        if (movA.mass !== Infinity) {
            const torqueA = (-rACrossN * impulseScalar * invInertiaA) * (MathHelper._180PI);
            if (Math.abs(torqueA) > ROTATION_SENSITIVITY || !isResting) {
                movA.velRotation += torqueA;
            } else {
                movA.velRotation = 0; // Mata o micro-balanço
            }
        }

        if (movB.mass !== Infinity) {
            const torqueB = (rBCrossN * impulseScalar * invInertiaB) * (MathHelper._180PI);
            if (Math.abs(torqueB) > ROTATION_SENSITIVITY || !isResting) {
                movB.velRotation += torqueB;
            } else {
                movB.velRotation = 0; // Mata o micro-balanço
            }
        }

        // =================================================================
        // SEGREDO 2: ATRITO DE COULOMB (Impulso Tangencial)
        // =================================================================
        // ... (Recálculo da velocidade tangencial continua igual ao anterior) ...
        const radA_after = movA.velRotation * (MathHelper._PI180);
        const radB_after = movB.velRotation * (MathHelper._PI180);

        const vContactA_after = new Point(movA.velocity.x - radA_after * rA.y, movA.velocity.y + radA_after * rA.x);
        const vContactB_after = new Point(movB.velocity.x - radB_after * rB.y, movB.velocity.y + radB_after * rB.x);
        const relVelAfter = new Point(vContactB_after.x - vContactA_after.x, vContactB_after.y - vContactA_after.y);

        let tangent = new Point(-normal.y, normal.x);
        let velAlongTangent = PhysicsSolver.dotProduct(relVelAfter, tangent);

        if (Math.abs(velAlongTangent) > 0.001) {
            if (velAlongTangent < 0) {
                tangent.scale(-1);
                velAlongTangent = -velAlongTangent;
            }

            const rACrossT = rA.x * tangent.y - rA.y * tangent.x;
            const rBCrossT = rB.x * tangent.y - rB.y * tangent.x;

            const angularComponentAT = rACrossT * rACrossT * invInertiaA;
            const angularComponentBT = rBCrossT * rBCrossT * invInertiaB;

            let tangentScalar = -velAlongTangent / (totalInvMass + angularComponentAT + angularComponentBT);

            // Mistura de Atrito
            const mu = Math.sqrt((movA.friction ?? 0.5) * (movB.friction ?? 0.5));
            const maxFriction = impulseScalar * mu;

            if (tangentScalar < -maxFriction) tangentScalar = -maxFriction;
            else if (tangentScalar > maxFriction) tangentScalar = maxFriction;

            const frictionVector = tangent.clone();
            frictionVector.scale(tangentScalar);

            if (movA.mass !== Infinity) movA.velocity.sub(frictionVector.clone().scale(invMassA));
            if (movB.mass !== Infinity) movB.velocity.add(frictionVector.clone().scale(invMassB));

            if (Math.abs(velAlongTangent) < Properties.frictionSensibility) {
                if (movA.mass !== Infinity) movA.velocity.x = 0;
                if (movB.mass !== Infinity) movB.velocity.x = 0;
            }

            // 2. Aplica o torque do Atrito com a mesma Sensibilidade
            if (movA.mass !== Infinity) {
                const frictionTorqueA = (-rACrossT * tangentScalar * invInertiaA) * (MathHelper._180PI);
                if (Math.abs(frictionTorqueA) > ROTATION_SENSITIVITY || !isResting) movA.velRotation += frictionTorqueA;
            }
            if (movB.mass !== Infinity) {
                const frictionTorqueB = (rBCrossT * tangentScalar * invInertiaB) * (MathHelper._180PI);
                if (Math.abs(frictionTorqueB) > ROTATION_SENSITIVITY || !isResting) movB.velRotation += frictionTorqueB;
            }
        }
    }

    /**
     * Verifica se um ponto está dentro de um polígono irregular.
     */
    private static pointInPolygon(pt: Point, vertices: Point[]): boolean {
        let inside = false;
        for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            const vi = vertices[i], vj = vertices[j];
            const intersect = ((vi.y > pt.y) !== (vj.y > pt.y))
                && (pt.x < (vj.x - vi.x) * (pt.y - vi.y) / (vj.y - vi.y) + vi.x);
            if (intersect) inside = !inside;
        }
        return inside;
    }
}