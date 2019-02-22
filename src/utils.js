import Particle from './particle';

const calculateMagnitude = vector => {
  const { x, y } = vector;
  const xSquared = x ** 2;
  const ySquared = y ** 2;

  return Math.sqrt(xSquared + ySquared);
};

const limitMagnitude = (vector, limit) => {
  const { x, y } = vector;
  const magnitude = calculateMagnitude(vector);

  if (magnitude > limit) {
    const ratio = limit / magnitude;
    const limited = {
      x: x * ratio,
      y: y * ratio,
    };

    return limited;
  }
  return vector;
};

const degreesToRadians = degrees => (degrees * Math.PI) / 180;

const rotatePoint = (point, angle) => {
  const { x, y } = point;
  const angleRadians = degreesToRadians(angle);

  // x' = xcosθ − ysinθ
  // y' = ycosθ + xsinθ
  return {
    x: x * Math.cos(angleRadians) - y * Math.sin(angleRadians),
    y: y * Math.cos(angleRadians) + x * Math.sin(angleRadians),
  };
};

const calculateVector = (magnitude, direction) => {
  const directionRadians = degreesToRadians(direction);
  const x = magnitude * Math.cos(directionRadians);
  const y = magnitude * Math.sin(directionRadians);

  return { x, y };
};

const getRandomNum = (min, max) => Math.random() * (max - min) + min;

const createExplosion = ({ numParticles, position, radius, add }) => {
  [...Array(numParticles)].forEach(() => {
    const particle = new Particle({
      position: {
        x: position.x + getRandomNum(-radius / 4, radius / 4),
        y: position.y + getRandomNum(-radius / 4, radius / 4),
      },
      velocity: {
        x: getRandomNum(-1.5, 1.5),
        y: getRandomNum(-1.5, 1.5),
      },
      radius: getRandomNum(1, 3),
      timeToLive: getRandomNum(20, 60),
    });

    add(particle).to('particles');
  });
};

export {
  calculateMagnitude,
  limitMagnitude,
  degreesToRadians,
  rotatePoint,
  calculateVector,
  getRandomNum,
  createExplosion,
};
