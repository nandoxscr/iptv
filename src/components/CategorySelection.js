// src/components/CategorySelection.js
import React from 'react';

const CategorySelection = ({ onSelectCategory }) => {
  const handleCategorySelect = (category) => {
    onSelectCategory(category);
  };

  return (
    <div>
      <button onClick={() => handleCategorySelect('LIVE')}>LIVE</button>
      <button onClick={() => handleCategorySelect('MOVIES')}>MOVIES</button>
      <button onClick={() => handleCategorySelect('SERIES')}>SERIES</button>
    </div>
  );
};

export default CategorySelection;