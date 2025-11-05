import { Properties } from "../core/Properties.js";
import { Point } from "../physics/Point.js";
import { Color } from "../util/Color.js";
import { Item } from "./Item.js";
import { LineObject } from "./Line.js";

export class MovableObject extends Item {
    constructor(position, conf = {}) {
        super({ type: "MovableObject" });
        this.shape = conf.shape;
        this.mass = conf.mass || 1;
        this.position = position.clone();
        this.velocity = conf.velocity.clone() || new Point(0, 0);
        this.acceleration = conf.acceleration && typeof conf.acceleration.clone === "function"
            ? conf.acceleration.clone() :
            new Point(0, 0);
        this.maxVelocity = conf.maxVelocity || Properties.maxVelocity;
        this.rotation = conf.rotation || 0;
        this.velRotation = conf.velRotation || 0;
        this.rotationDecay = conf.rotationDecay || .985;
        this.velocityLineColor = new Color(.18, .8, .4, .8);
        this.accelerationLineColor = new Color(1, .32, .32, .8);
        this.cloneData = conf;

        this.velocityShape = new LineObject(this.position, {
            to: this.position,
            lineColor: this.velocityLineColor,
            lineWidth: 1
        });

        this.accelerationShape = new LineObject(this.position, {
            to: this.position,
            lineColor: this.accelerationLineColor,
            lineWidth: 2
        });
    }

    clone(position) {
        return new MovableObject(position.clone(), this.cloneData);
    }


    applyForce(F) {
        let force = F.clone();
        force.scale(1 / this.mass);
        // 2ª Lei de Newton.
        this.acceleration.add(force);
    };

    /**
     *  Rotina de movimentação de um objeto
     *  Calculando forças. Para calcular uma força, precisamos conhecer a 2ª Lei de Newton.
     *  +-----------------+
     *  +     F = m*a     +
     *  +-----------------+
     *  Preciso conhecer a aceleração do meu objeto. Para isto, vamos precisar aplicar uma força F, e conhecer a massa m dele.
     *  a = F/m;
     *  Digamos que a masssa é igual a "1". Logo, a aceleração será igual a força aplicada sobre o objeto.
     *  Fazemos isso chamando a função "applyForce" contida no objeto.
     *  Após conhecer a aceleração, devemos aplicar essa aceleração sobre a velocidade do objeto, somando.
     *  Por fim, devemos somar a velocidade do objeto em sua posição.   
     **/
    update(ENV) {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxVelocity);
        this.position.add(this.velocity);
        if (Properties.circularScreen) {
            if (this.position.x > ENV.screen.width) this.position.sub(new Point(ENV.screen.width, 0));
            if (this.position.y > ENV.screen.height) this.position.sub(new Point(0, ENV.screen.height));
            if (this.position.x < 0) this.position.add(new Point(ENV.screen.width, 0));
            if (this.position.y < 0) this.position.add(new Point(0, ENV.screen.height));
        }

        this.shape.position = this.position;
        this.shape.rotation = this.rotation;

        if (Math.abs(this.velRotation) > 0.001) {
            this.rotation += this.velRotation;
            this.velRotation *= this.rotationDecay;
        }

        if (Properties.velocityLine) {
            let velocityVec = this.velocity.clone();
            velocityVec.scale(10);
            velocityVec.add(this.position);
            this.velocityShape.position = this.position;
            this.velocityShape.to = velocityVec;

            let accelerationVec = this.acceleration.clone();
            accelerationVec.scale(100);
            accelerationVec.add(this.position);
            this.accelerationShape.position = this.shape.getCenter();
            this.accelerationShape.to = accelerationVec;
        }

        this.acceleration.scale(0);
    };

    draw(canvas_context) {
        this.shape.draw(canvas_context);
        this.velocityShape.draw(canvas_context);
        this.accelerationShape.draw(canvas_context);
    }

    debug() {
        console.log("------ DEBUG -------");
        console.log("Position " + this.position.x + ',' + this.position.y);
        console.log("Velocity " + this.velocity.x + ',' + this.velocity.y);
        console.log("Acceleration " + this.acceleration.x + ',' + this.acceleration.y);
        console.log("--------------------");
    };
}