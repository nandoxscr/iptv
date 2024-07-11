// src/components/Home.js
import React from 'react';
import CategorySelection from './CategorySelection';
import {Typography} from '@mui/material';
import { Block } from '@mui/icons-material';

const Home = ({ onSelectCategory }) => {
  return (
    <div style={{  display: Block, margin: '20px' }}>
      <Typography variant='h4' >Select Category</Typography>
      <CategorySelection onSelectCategory={onSelectCategory} />
    </div>
  );
};

export default Home;