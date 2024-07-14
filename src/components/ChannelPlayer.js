// src/components/ChannelPlayer.js

import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemText, Typography, TextField } from '@mui/material';
import VideoPlayer from './VideoPlayer';
import { getChannelsFromDB } from '../services/db';
import './ChannelPlayer.css'; // Ensure you create this CSS file

const ChannelPlayer = () => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchChannels = async () => {
      const channelsFromDB = await getChannelsFromDB();
      setChannels(channelsFromDB);
      setFilteredChannels(channelsFromDB);
      setUrl(channelsFromDB[0]?.url || '');
      setLoading(false);
    };
    fetchChannels();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = channels.filter(channel =>
      channel.name.toLowerCase().includes(term)
    );
    setFilteredChannels(filtered);
  };

  const handleNext = () => {
    const newIndex = (currentChannelIndex + 1) % filteredChannels.length;
    changeChannel(newIndex);
  };

  const handlePrevious = () => {
    const newIndex = (currentChannelIndex - 1 + filteredChannels.length) % filteredChannels.length;
    changeChannel(newIndex);
  };

  const handleChannelClick = (index) => {
    changeChannel(index);
  };

  const changeChannel = (index) => {
    setCurrentChannelIndex(index);
    setLoading(true);
    setTimeout(() => {
      setUrl(filteredChannels[index].url);
      setLoading(false);
    }, 500); // Delay of 500ms before setting the new URL
  };

  return (
    <Box display="flex" height="100vh">
      <Box className="channel-list" width="300px" overflow="auto" borderRight="1px solid #ddd">
        <TextField
          label="Search Channels"
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <List>
          {filteredChannels.map((channel, index) => (
            <ListItem button key={index} onClick={() => handleChannelClick(index)}>
              <ListItemText primary={channel.name} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box flex={1} padding="20px" display="flex" flexDirection="column">
        <Typography variant="h4" gutterBottom>Channel Player</Typography>
        {loading ? (
          <div>Loading...</div> // Show loading state
        ) : (
          <VideoPlayer
            url={url}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </Box>
    </Box>
  );
};

export default ChannelPlayer;