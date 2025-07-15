import React from 'react';
import { Link } from 'react-router-dom';
import '../Css/Shop.css';

function Shop() {
  // Generate array of "InsantRelay" words for background
  const backgroundWords = Array(200).fill('InsantRelay');

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
        />
      </div>
    </div>
  );
}

export default Shop;