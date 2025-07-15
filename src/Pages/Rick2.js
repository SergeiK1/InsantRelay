import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Css/Rick2.css';

const Rick2 = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleImageClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`rick-container ${isFlipped ? 'scrollable' : ''}`}>
      <div className="slogan">
        <div className="slogan-line">Your friends favorite</div>
        <div className="slogan-line">
          <Link to="/shop" className="possession-link">possession</Link>, now yours!
        </div>
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
                src="/images/Team2.png" 
                alt="Team" 
                className="flip-image"
              />
            </div>
          </div>
        </div>
      </div>
      {isFlipped && (
         <div className="scroll-content">
           <div className="spacer"></div>
           <div className="bottom-section">
             <div className="scroll-spacer"></div>
             <Link to="/shop2" className="secret-button">
                dont click
              </Link>
           </div>
         </div>
       )}
    </div>
  );
};

export default Rick2;