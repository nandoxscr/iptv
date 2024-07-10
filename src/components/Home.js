// src/components/Home.js
import React from 'react';
import CategorySelection from './CategorySelection';

const Home = ({ onSelectCategory }) => {
  return (
    <div>
      <h2>Select Category</h2>
      <CategorySelection onSelectCategory={onSelectCategory} />
    </div>
  );
};

export default Home;