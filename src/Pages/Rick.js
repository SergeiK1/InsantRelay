import React, { useState } from 'react';
import '../Css/Rick.css';

const Rick = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleImageClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="rick-container">
      <div className="slogan">
        <div className="slogan-line">Your friends favorite</div>
        <div className="slogan-line">possession, now yours!</div>
      </div>
      <div className={`image-container ${isFlipped ? 'large' : ''}`}>
        <div 
          className={`flip-card ${isFlipped ? 'flipped' : ''}`}
          onClick={handleImageClick}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <img 
                src="/insantrelay.PNG" 
                alt="Instant Relay Logo" 
                className="flip-image"
              />
            </div>
            <div className="flip-card-back">
              <img 
                src="/Team.JPG" 
                alt="Team" 
                className="flip-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rick;