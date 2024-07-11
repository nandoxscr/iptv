// src/components/ChannelList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePlaylistContext } from '../context/PlaylistContext';
import { Box, List, ListItem, ListItemText, Typography, Button } from '@mui/material';
import { parse } from 'iptv-playlist-parser';

const ChannelList = () => {
  const { playlists, loadedPlaylists } = usePlaylistContext();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [categorizedChannels, setCategorizedChannels] = useState({
    live: [],
    series: [],
    movie: [],
  });

  const fetchSelectedPlaylist = async () => {
    if (loadedPlaylists) {
      const selected = playlists.find(playlist => playlist.isSelected);
      if (selected && selected.url) {
        try {
          const response = await axios.get(selected.url);
          const data = response.data;
          const result = parse(data);
          categorizeChannels(result.items);
          setSelectedPlaylist(result);
          // console.log('Playlist:', data);
          console.log('Parsed playlist:', result);
        } catch (error) {
          console.error('Error fetching playlist:', error);
        }
      }
    }
  };

  const categorizeChannels = (channels) => {
    const live = [];
    const series = [];
    const movie = [];
    channels.forEach(channel => {
      if (channel.url) {
        if (channel.url.includes('series')) {
          series.push(channel);
        } else if (channel.url.includes('movie')) {
          movie.push(channel);
        } else {
          live.push(channel);
        }
      }
    });
    setCategorizedChannels({ live, series, movie });
    console.log('Live channels:', live);
    console.log('Series:', series);
    console.log('Movies:', movie);
  };

  return (
    <Box>
      <Typography variant="h6">Select Category</Typography>
      <Button variant="contained" color="primary" onClick={fetchSelectedPlaylist}>
        Fetch Playlist
      </Button>
      {!loadedPlaylists && <div>Loading...</div>}
      {loadedPlaylists && !selectedPlaylist && <div>No playlist selected</div>}
      {selectedPlaylist && (
        <>
          <Typography variant="h6">Live Channels</Typography>
          <List>
            {categorizedChannels.live.map((channel, index) => (
              <ListItem key={index}>
                <ListItemText primary={channel.name} secondary={channel.url} />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6">Series</Typography>
          <List>
            {categorizedChannels.series.map((channel, index) => (
              <ListItem key={index}>
                <ListItemText primary={channel.name} secondary={channel.url} />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6">Movies</Typography>
          <List>
            {categorizedChannels.movie.map((channel, index) => (
              <ListItem key={index}>
                <ListItemText primary={channel.name} secondary={channel.url} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default ChannelList;