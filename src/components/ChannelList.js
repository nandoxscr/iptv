// src/components/ChannelList.js

import React, { useEffect } from 'react';
import { usePlaylistContext } from '../context/PlaylistContext';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import parser from 'iptv-playlist-parser';

const ChannelList = () => {
  const { playlists } = usePlaylistContext();

  useEffect(() => {
    if (playlists.length > 0) {
      console.log('Playlists:', playlists);

      playlists.forEach(playlist => {
        if (playlist.url) {
          fetch(playlist.url)
            .then(response => response.text())
            .then(data => {
              const result = parser.parse(data);
              console.log('Parsed playlist:', result);
            })
            .catch(error => console.error('Error fetching playlist:', error));
        }
      });
    }
  }, [playlists]);

  if (!playlists.length) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <List>
        {playlists.map((playlist, index) => (
          <ListItem key={index}>
            <ListItemText primary={playlist.name} secondary={playlist.url} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChannelList;