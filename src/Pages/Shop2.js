import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/Shop2.css';

function Shop2() {
  // Generate array of "InsantRelay" words for background
  const backgroundWords = Array(200).fill('InsantRelay');
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();

  const handleImageClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    if (newClickCount === 3) {
      navigate('/terminal');
    }
    
    // Reset click count after 2 seconds if not reached 3 clicks
    setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  return (
    <div className="shop-page">
      <div className="background-text">
        {backgroundWords.map((word, index) => (
          <span key={index} className="background-word">
            {word}
          </span>
        ))}
      </div>
      <div className="shop-header">
        <Link to="/" className="shop-title-link">
          <h1 className="shop-title">Shop</h1>
        </Link>
      </div>
      <div className="shop-content">
        <img 
          src="/images/shirt.png" 
          alt="Shirt" 
          className="shop-product-image"
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}

export default Shop2;