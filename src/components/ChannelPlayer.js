import React, { useState, useRef } from 'react';
import { usePlaylistContext } from '../context/PlaylistContext';
import { Box, Typography, Button } from '@mui/material';
import ReactPlayer from 'react-player';

function ChannelPlayer() {
  const { playlists, activeChannelIndex, setActiveChannelIndex } = usePlaylistContext();
  const [playing, setPlaying] = useState(true);
  const playerRef = useRef(null);

  const channels = playlists.length > 0 ? playlists[0].items : [];
  const channel = channels ? channels[activeChannelIndex] : null;

  const handlePause = () => {
    setPlaying(false);
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handleStop = () => {
    setPlaying(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
    }
  };

  const handleNext = () => {
    if (channels && activeChannelIndex < channels.length - 1) {
      setActiveChannelIndex(activeChannelIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (channels && activeChannelIndex > 0) {
      setActiveChannelIndex(activeChannelIndex - 1);
    }
  };

  if (!channel) {
    return <Typography variant="h6">No channel selected</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6">Now Playing: {channel.name}</Typography>
      <ReactPlayer
        ref={playerRef}
        url={channel.url}
        playing={playing}
        controls={true}
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handlePrevious}>Previous</Button>
        <Button variant="contained" color="primary" onClick={handlePause}>Pause</Button>
        <Button variant="contained" color="primary" onClick={handlePlay}>Play</Button>
        <Button variant="contained" color="primary" onClick={handleStop}>Stop</Button>
        <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
      </Box>
    </Box>
  );
}

export default ChannelPlayer;