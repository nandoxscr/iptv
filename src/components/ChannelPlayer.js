// src/components/ChannelList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePlaylistContext } from '../context/PlaylistContext';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { parse } from 'iptv-playlist-parser';
import { addPlaylistToDB, getPlaylistsFromDB } from '../services/db';

const ChannelList = () => {
  const { playlists, loadedPlaylists } = usePlaylistContext();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [categorizedChannels, setCategorizedChannels] = useState({
    live: [],
    series: [],
    movie: [],
  });

  useEffect(() => {
    const fetchAndStorePlaylist = async () => {
      if (loadedPlaylists) {
        const selected = playlists.find(playlist => playlist.isSelected);
        if (selected && selected.url) {
          try {
            const response = await axios.get(selected.url);
            const data = response.data;
            const result = parse(data);

            // Add timestamp to the result
            const playlistWithTimestamp = {
              ...result,
              timestamp: new Date().toISOString(),
            };

            // Store the playlist in IndexedDB
            await addPlaylistToDB(playlistWithTimestamp);

            // Categorize and set the state
            categorizeChannels(result.items);
            setSelectedPlaylist(result);
            console.log('Playlist:', data);
            console.log('Parsed playlist:', result);
          } catch (error) {
            console.error('Error fetching playlist:', error);
          }
        }
      }
    };

    // Fetch and store playlist on mount
    fetchAndStorePlaylist();
  }, [playlists, loadedPlaylists]);

  useEffect(() => {
    const loadPlaylistFromDB = async () => {
      const storedPlaylists = await getPlaylistsFromDB();
      if (storedPlaylists.length > 0) {
        const latestPlaylist = storedPlaylists.reduce((prev, current) => (prev.timestamp > current.timestamp ? prev : current));
        categorizeChannels(latestPlaylist.items);
        setSelectedPlaylist(latestPlaylist);
        console.log('Loaded playlist from DB:', latestPlaylist);
      }
    };

    // Load playlist from IndexedDB on mount
    loadPlaylistFromDB();
  }, []);

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

  if (!loadedPlaylists) {
    return <div>Loading...</div>;
  }

  if (!selectedPlaylist) {
    return <div>No playlist selected</div>;
  }

  return (
    <Box>
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
    </Box>
  );
};

export default ChannelList;