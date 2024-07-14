// src/components/VideoControls.js

import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

const VideoControls = ({ onPlay, onPause, onNext, onPrevious, isPlaying }) => {
  const [playing, setPlaying] = useState(isPlaying);

  useEffect(() => {
    setPlaying(isPlaying);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (playing) {
      onPause();
    } else {
      onPlay();
    }
    setPlaying(!playing);
  };

  return (
    <Box display="flex" justifyContent="center" marginTop="10px">
      <IconButton onClick={handlePlayPause}>
        {playing ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>
      <IconButton onClick={onPrevious}>
        <SkipPreviousIcon />
      </IconButton>
      <IconButton onClick={onNext}>
        <SkipNextIcon />
      </IconButton>
    </Box>
  );
};

export default VideoControls;