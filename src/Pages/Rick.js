import React, { useState } from 'react';
import '../Css/Rick.css';

const Rick = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleImageClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="rick-container">
      <h1 className="slogan">Your friends favorite possession, now yours!</h1>
      <div className="image-container">
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