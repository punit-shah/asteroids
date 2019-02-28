import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './TitleScreen.css';

const getChildren = type => {
  switch (type) {
    case 'game-start':
      return (
        <Fragment>
          <h1 className="TitleScreen-title TitleScreen-game-start">Asteroids</h1>
          <p className="TitleScreen-message">Press space to play</p>
        </Fragment>
      );
    case 'game-over':
      return (
        <Fragment>
          <h1 className="TitleScreen-title TitleScreen-game-over">Game over</h1>
          <p className="TitleScreen-message">Press space to play again</p>
        </Fragment>
      );
    default:
      return null;
  }
}

const TitleScreen = ({ type }) => (
  <div className="TitleScreen">
    {getChildren(type)}
  </div>
);

TitleScreen.propTypes = {
  type: PropTypes.oneOf(['game-start', 'game-over']),
};

TitleScreen.defaultProps = {
  type: 'game-start',
}

export default TitleScreen;
