// src/components/ChannelList.js

import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Typography, Button, ButtonGroup, Pagination } from '@mui/material';
import { getChannelsFromDB } from '../services/db';

const ChannelList = () => {
  const [categorizedChannels, setCategorizedChannels] = useState({
    live: [],
    series: [],
    movie: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('live');
  const [currentPage, setCurrentPage] = useState(1);
  const [channelsPerPage] = useState(10);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channels = await getChannelsFromDB();
        categorizeChannels(channels);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching channels from DB:', error);
        setLoading(false);
      }
    };

    const categorizeChannels = (channels) => {
      const live = [];
      const series = [];
      const movie = [];
      channels.forEach(channel => {
        if (channel.group) {
          if (channel.group === 'live') {
            live.push(channel);
          } else if (channel.group === 'series') {
            series.push(channel);
          } else if (channel.group === 'movie') {
            movie.push(channel);
          }
        }
      });
      setCategorizedChannels({ live, series, movie });
    };

    fetchChannels();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getCurrentPageChannels = () => {
    const startIndex = (currentPage - 1) * channelsPerPage;
    const endIndex = startIndex + channelsPerPage;
    return categorizedChannels[selectedCategory].slice(startIndex, endIndex);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const channelsToDisplay = getCurrentPageChannels();
  const totalChannels = categorizedChannels[selectedCategory].length;
  const totalPages = Math.ceil(totalChannels / channelsPerPage);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Select Category</Typography>
      <ButtonGroup variant="contained" color="primary" aria-label="outlined primary button group">
        <Button onClick={() => handleCategoryChange('live')}>Live</Button>
        <Button onClick={() => handleCategoryChange('series')}>Series</Button>
        <Button onClick={() => handleCategoryChange('movie')}>Movies</Button>
      </ButtonGroup>
      
      <Typography variant="h6" gutterBottom>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Channels</Typography>
      <List>
        {channelsToDisplay.map((channel, index) => (
          <ListItem key={index}>
            <ListItemText primary={channel.name} secondary={channel.url} />
          </ListItem>
        ))}
      </List>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
      />
    </Box>
  );
};

export default ChannelList;