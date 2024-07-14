// src/components/VideoPlayer.js

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Box } from '@mui/material';

const VideoPlayer = forwardRef(({ url }, ref) => {
  const videoNode = useRef(null);
  const player = useRef(null);

  useImperativeHandle(ref, () => ({
    play: () => {
      if (player.current) {
        player.current.play();
      }
    },
    pause: () => {
      if (player.current) {
        player.current.pause();
      }
    },
  }));

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
    </Box>
  );
});

export default VideoPlayer;