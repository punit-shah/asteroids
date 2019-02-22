import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Ship from './ship';
import Asteroid from './asteroid';
import { getRandomNum, calculateMagnitude } from './utils';
import colours from './colours';
import './Game.css';

const collision = (object1, object2) => {
  const distanceVector = {
    x: object1.position.x - object2.position.x,
    y: object1.position.y - object2.position.y,
  };
  const distance = calculateMagnitude(distanceVector);
  const radiusSum = object1.radius + object2.radius;

  if (distance < radiusSum) {
    return true;
  }
  return false;
};

class Game extends Component {
  constructor() {
    super();

    this.state = {
      keys: { up: false, down: false, left: false, right: false, space: false },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
      },
      score: 0,
      gameOver: false,
      context: undefined,
    };

    this.groups = {
      playerShip: [],
      bullets: [],
      asteroids: [],
      particles: [],
    };

    this.canvasRef = createRef();
  }

  componentDidMount() {
    const context = this.canvasRef.current.getContext('2d');
    const {
      viewport: { pixelRatio },
    } = this.state;

    context.scale(pixelRatio, pixelRatio);
    // this.state.context = context;
    this.setState({ context });

    this.createShip();
    // this.updateGroup(this.groups.playerShip);

    this.addEventListeners();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.playing && this.props.playing) {
      this.startGame();
    }
  }

  onResize() {
    const { context } = this.state;
    const pixelRatio = window.devicePixelRatio || 1;

    this.setState({
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight - 43,
        pixelRatio,
      },
    });

    context.scale(pixelRatio, pixelRatio);
  }

  onKeyDown(event) {
    this.onKeyChange(true, event);
  }

  onKeyUp(event) {
    this.onKeyChange(false, event);
  }

  onKeyChange(isBeingPressed, event) {
    const { keys } = this.state;
    const { keyCode } = event;

    const keyCodes = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      32: 'space',
    };

    if (Object.keys(keyCodes).includes(String(keyCode))) {
      event.preventDefault();
    }

    if (keyCodes[keyCode]) {
      keys[keyCodes[keyCode]] = isBeingPressed;
    }

    this.setState({ keys });
  }

  addEventListeners() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  startGame() {
    if (this.requestId) cancelAnimationFrame(this.requestId);
    this.clearAllGroups();
    this.createShip();
    this.createInitialAsteroids(4);
    this.setState({
      score: 0,
      gameOver: false,
    });
    this.requestId = requestAnimationFrame(this.update.bind(this));
  }

  endGame() {
    const { setPlaying } = this.props;
    setPlaying(false);
    this.setState({ gameOver: true });
  }

  createShip() {
    const {
      viewport: { width, height },
    } = this.state;

    const position = {
      x: width / 2,
      y: height - 200,
    };

    const ship = new Ship({
      position,
      add: this.add.bind(this),
      die: this.endGame.bind(this),
    });

    this.add(ship).to('playerShip');
  }

  createAsteroid() {
    const {
      viewport: { width, height },
    } = this.state;

    const position = {
      x: getRandomNum(0, width),
      y: getRandomNum(0, height),
    };
    const radius = getRandomNum(80, 100);

    return new Asteroid({
      position,
      radius,
      add: this.add.bind(this),
      addToScore: this.addToScore.bind(this),
    });
  }

  createInitialAsteroids(numOfAsteroids) {
    const addNewAsteroid = () => {
      const asteroid = this.createAsteroid();
      if (collision(this.groups.playerShip[0], asteroid)) {
        addNewAsteroid();
      } else {
        this.add(asteroid).to('asteroids');
      }
    };

    [...Array(numOfAsteroids)].forEach(addNewAsteroid);
  }

  add(object) {
    return {
      to: groupName => {
        this.groups[groupName].push(object);
      },
    };
  }

  addToScore(value) {
    if (this.groups.playerShip.length > 0) {
      this.setState(prevState => ({
        score: prevState.score + value,
      }));
    }
  }

  updateAllObjects() {
    Object.keys(this.groups).forEach(groupName => {
      this.updateGroup(this.groups[groupName]);
    });
  }

  clearAllGroups() {
    Object.keys(this.groups).forEach(groupName => {
      this.groups[groupName].length = 0;
    });
  }

  updateGroup(group) {
    group.forEach((object, index) => {
      this.checkCollisions(object);

      if (object.markedForDeletion) {
        group.splice(index, 1);
      } else {
        object.update(this.state);
      }
    });
  }

  checkCollisions(object) {
    if (object.collidesWith && object.collidesWith.length) {
      object.collidesWith.forEach(groupName => {
        this.groups[groupName].forEach(object2 => {
          if (collision(object, object2)) {
            object.delete();
            object2.delete();
          }
        });
      });
    }
  }

  update() {
    const {
      context,
      viewport: { width, height },
    } = this.state;

    context.fillStyle = colours.bg;
    context.fillRect(0, 0, width, height);

    this.updateAllObjects();

    this.requestId = requestAnimationFrame(this.update.bind(this));
  }

  render() {
    const {
      viewport: { width, height, pixelRatio },
      score,
      gameOver,
    } = this.state;
    const { playing } = this.props;

    return (
      <div className="Game">
        {(playing || gameOver) && <div className="Game-score">{score}</div>}
        {gameOver && (
          <div className="Game-message">Press space to play again.</div>
        )}
        <canvas
          className="Game-canvas"
          ref={this.canvasRef}
          width={width * pixelRatio}
          height={height * pixelRatio}
        />
      </div>
    );
  }
}

Game.propTypes = {
  playing: PropTypes.bool.isRequired,
  setPlaying: PropTypes.func.isRequired,
};

export default Game;
