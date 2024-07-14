// src/components/CategorySelection.js
import React from 'react';
import { Button } from '@mui/material';

const CategorySelection = ({ onSelectCategory }) => {
  const handleCategorySelect = (category) => {
    onSelectCategory(category);
  };

  return (
    <div>
      <Button onClick={() => handleCategorySelect('LIVE')}>LIVE</Button>
      <Button onClick={() => handleCategorySelect('MOVIES')}>MOVIES</Button>
      <Button onClick={() => handleCategorySelect('SERIES')}>SERIES</Button>
    </div>
  );
};

export default CategorySelection;