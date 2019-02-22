import Bullet from './bullet';
import Particle from './particle';
import {
  createExplosion,
  degreesToRadians,
  limitMagnitude,
  rotatePoint,
  calculateMagnitude,
  getRandomNum,
  calculateVector,
} from './utils';
import colours from './colours';

class Ship {
  constructor({ position, add, die }) {
    this.position = position || { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.direction = 270;
    this.acceleration = 0.5;
    this.rotationSpeed = 5;
    this.radius = 26;
    this.inertia = 0.98;
    this.add = add;
    this.die = die;
    this.markedForDeletion = false;
    this.collidesWith = ['asteroids'];
  }

  delete() {
    createExplosion({
      numParticles: 40,
      position: this.position,
      radius: this.radius,
      add: this.add,
    });

    this.markedForDeletion = true;
    this.die();
  }

  update(state) {
    const { context, keys, viewport } = state;

    this.updateVelocity(keys);
    this.updateDirection(keys);
    this.updatePosition(viewport);
    if (keys.space) {
      this.shoot();
    }
    if (keys.up) {
      this.rocketThrust();
    }

    this.draw(context);
  }

  draw(context) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(degreesToRadians(this.direction));
    context.strokeStyle = colours.fg;
    context.fillStyle = colours.fg;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(15, 0);
    context.lineTo(-15, -12);
    context.lineTo(-10, -10);
    context.lineTo(-10, 10);
    context.lineTo(-15, 12);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }

  updateVelocity(keys) {
    if (keys.up) {
      this.velocity.x +=
        Math.cos(degreesToRadians(this.direction)) * this.acceleration;
      this.velocity.y +=
        Math.sin(degreesToRadians(this.direction)) * this.acceleration;
    }
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    this.velocity = limitMagnitude(this.velocity, 10);
  }

  updateDirection(keys) {
    if (keys.left) {
      this.direction -= this.rotationSpeed;
    }
    if (keys.right) {
      this.direction += this.rotationSpeed;
    }
    if (this.direction >= 360) {
      this.direction -= 360;
    }
    if (this.direction < 0) {
      this.direction += 360;
    }
  }

  updatePosition(viewport) {
    const { width, height } = viewport;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }

    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  shoot() {
    const fireInterval = 250;
    const canShoot =
      Date.now() - this.lastBullet > fireInterval || !this.lastBullet;

    if (canShoot) {
      const pointRotation = rotatePoint({ x: 15, y: 0 }, this.direction);
      const bulletPosition = {
        x: this.position.x + pointRotation.x,
        y: this.position.y + pointRotation.y,
      };
      const shipSpeed = calculateMagnitude(this.velocity);

      const bullet = new Bullet({
        position: bulletPosition,
        direction: this.direction,
        shipSpeed,
      });

      this.add(bullet).to('bullets');
      this.lastBullet = Date.now();
    }
  }

  rocketThrust() {
    const pointRotation = rotatePoint({ x: -10, y: 0 }, this.direction);
    const particlePosition = {
      x: this.position.x + pointRotation.x + getRandomNum(-3, 3),
      y: this.position.y + pointRotation.y + getRandomNum(-3, 3),
    };
    const particleDirection =
      this.direction + 180 >= 360 ? this.direction + 180 : this.direction - 180;
    const particleVelocity = calculateVector(
      getRandomNum(3, 5),
      particleDirection
    );

    const particle = new Particle({
      position: particlePosition,
      velocity: particleVelocity,
      radius: getRandomNum(1, 3),
      timeToLive: getRandomNum(20, 40),
    });

    this.add(particle).to('particles');
  }
}

export default Ship;
