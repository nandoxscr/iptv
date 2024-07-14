// src/components/ChannelPlayer.js

import React, { useState, useEffect, useRef } from 'react';
import { Box, List, ListItem, ListItemText, Typography, TextField } from '@mui/material';
import VideoPlayer from './VideoPlayer';
import VideoControls from './VideoControls';
import { getChannelsFromDB } from '../services/db';
import './ChannelPlayer.css'; // Ensure you create this CSS file

const ChannelPlayer = () => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [currentChannelIndex, setCurrentChannelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [url, setUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchChannels = async () => {
      console.log('Fetching channels from DB...');
      const channelsFromDB = await getChannelsFromDB();
      console.log('Channels fetched:', channelsFromDB);
      setChannels(channelsFromDB);
      setFilteredChannels(channelsFromDB);
      setUrl(channelsFromDB[0]?.url || '');
      setLoading(false);
    };
    fetchChannels();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    console.log('Search term:', term);
    setSearchTerm(term);
    const filtered = channels.filter(channel =>
      channel.name.toLowerCase().includes(term)
    );
    console.log('Filtered channels:', filtered);
    setFilteredChannels(filtered);
  };

  const handleNext = () => {
    const newIndex = (currentChannelIndex + 1) % filteredChannels.length;
    console.log('Next channel index:', newIndex);
    changeChannel(newIndex);
  };

  const handlePrevious = () => {
    const newIndex = (currentChannelIndex - 1 + filteredChannels.length) % filteredChannels.length;
    console.log('Previous channel index:', newIndex);
    changeChannel(newIndex);
  };

  const handleChannelClick = (index) => {
    console.log('Channel clicked, index:', index);
    changeChannel(index);
  };

  const changeChannel = (index) => {
    console.log('Changing channel to index:', index);
    setCurrentChannelIndex(index);
    setLoading(true);
    setTimeout(() => {
      setUrl(filteredChannels[index].url);
      setLoading(false);
    }, 500); // Delay of 500ms before setting the new URL
  };

  const handlePlay = () => {
    console.log('Play button clicked');
    if (playerRef.current) {
      playerRef.current.play();
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    console.log('Pause button clicked');
    if (playerRef.current) {
      playerRef.current.pause();
    }
    setIsPlaying(false);
  };

  const handlePlayerReady = (playerInstance) => {
    console.log('Player ready');
    playerRef.current = playerInstance;
    setIsPlaying(!playerInstance.paused());
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
          <div style={{ width: '100%', height: '500px', backgroundColor: '#f0f0f0' }}>Loading...</div>
        ) : (
          <VideoPlayer url={url} ref={playerRef} onReady={handlePlayerReady} />
        )}
        <VideoControls
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isPlaying={isPlaying}
        />
      </Box>
    </Box>
  );
};

export default ChannelPlayer;