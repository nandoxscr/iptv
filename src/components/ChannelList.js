// src/components/ChannelList.js

import React, { useEffect, useState } from 'react';
import { usePlaylistContext } from '../context/PlaylistContext';
import { Box, List, ListItem, ListItemText } from '@mui/material';
import parser from 'iptv-playlist-parser';

const ChannelList = () => {
  const { playlists, loadedPlaylists } = usePlaylistContext();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const fetchSelectedPlaylist = async () => {
      if (loadedPlaylists) {
        console.log('Playlists:', playlists);

        const selected = playlists.find(playlist => playlist.isSelected);
        if (selected && selected.url) {
          try {
            const response = await fetch(selected.url);
            const data = await response.text();
            const result = parser.parse(data);
            setSelectedPlaylist(result);
            console.log('Parsed playlist:', result);
          } catch (error) {
            console.error('Error fetching playlist:', error);
          }
        }
      }
    };

    fetchSelectedPlaylist();
  }, [playlists, loadedPlaylists]);

  if (!loadedPlaylists) {
    return <div>Loading...</div>;
  }

  if (!selectedPlaylist) {
    return <div>No playlist selected</div>;
  }

  return (
    <Box>
      <List>
        {selectedPlaylist.items.map((channel, index) => (
          <ListItem key={index}>
            <ListItemText primary={channel.name} secondary={channel.url} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ChannelList;