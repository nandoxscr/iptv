import React from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = ({ onSelectCategory }) => {
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    onSelectCategory(category);
    navigate('/channels');
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Select a Category
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Button fullWidth variant="contained" color="primary" onClick={() => handleCategorySelect('Live')}>
            Live
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button fullWidth variant="contained" color="primary" onClick={() => handleCategorySelect('Series')}>
            Series
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button fullWidth variant="contained" color="primary" onClick={() => handleCategorySelect('Movies')}>
            Movies
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;