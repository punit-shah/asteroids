import colours from './colours';

class Particle {
  constructor({ position, velocity, radius, timeToLive }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.timeToLive = timeToLive;
    this.inertia = 0.98;
    this.markedForDeletion = false;
  }

  delete() {
    this.markedForDeletion = true;
  }

  update(state) {
    const { context } = state;

    this.updateVelocity();
    this.updatePosition();
    this.updateSize();
    this.updateTimeToLive();

    this.draw(context);
  }

  draw(context) {
    context.save();
    context.translate(this.position.x, this.position.y);
    context.fillStyle = colours.fg;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.restore();
  }

  updateVelocity() {
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;
  }

  updatePosition() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  updateSize() {
    if (this.radius > 0.1) {
      this.radius -= 0.1;
    } else {
      this.radius = 0.1;
    }
  }

  updateTimeToLive() {
    if (this.timeToLive <= 0) {
      this.delete();
    } else {
      this.timeToLive -= 1;
    }
  }
}

export default Particle;
