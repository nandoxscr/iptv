// src/components/VideoPlayer.js

import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

const VideoPlayer = ({ url, onNext, onPrevious }) => {
  const videoNode = useRef(null);
  const player = useRef(null);

  useEffect(() => {
    if (player.current) {
      player.current.dispose();
    }
    player.current = videojs(videoNode.current, {
      controls: true,
      autoplay: true,
      preload: 'auto',
      techOrder: ['html5'],
    });

    player.current.src({ type: 'application/x-mpegURL', src: url });

    player.current.on('error', () => {
      console.error('VideoJS encountered an error with the stream.');
    });

    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, [url]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" className="channel-player">
      <div data-vjs-player>
        <video ref={videoNode} className="video-js vjs-default-skin" width="100%" height="500px" />
      </div>
      <Box display="flex" justifyContent="center" marginTop="10px">
        <IconButton onClick={() => player.current.play()}>
          <PlayArrowIcon />
        </IconButton>
        <IconButton onClick={() => player.current.pause()}>
          <PauseIcon />
        </IconButton>
        <IconButton onClick={onPrevious}>
          <SkipPreviousIcon />
        </IconButton>
        <IconButton onClick={onNext}>
          <SkipNextIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default VideoPlayer;