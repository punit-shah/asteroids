import React, { useState, useEffect } from 'react';
import Game from './Game';
import './App.css';

const App = () => {
  const [playing, setPlaying] = useState(false);

  const onKeyDown = event => {
    if (event.key === ' ') {
      event.preventDefault();
      setPlaying(true);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);

    return function cleanup() {
      window.removeEventListener('keydown', onKeyDown);
    };
  });

  return (
    <div className="App">
      <Game playing={playing} setPlaying={setPlaying} />
    </div>
  );
};

export default App;
