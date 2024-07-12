// src/components/ManagePlaylists.js

import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { addPlaylistToDB, getPlaylistsFromDB, deletePlaylistFromDB, updatePlaylistInDB, addChannelsToDB, clearChannelsFromDB } from '../services/db';
import axios from 'axios';
import { parse } from 'iptv-playlist-parser';

function ManagePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const dbPlaylists = await getPlaylistsFromDB();
      setPlaylists(dbPlaylists);
    };
    fetchPlaylists();
  }, []);

  const addPlaylist = async () => {
    const newPlaylist = { name: playlistName, url: playlistUrl, isSelected: false };
    await addPlaylistToDB(newPlaylist);
    setPlaylists([...playlists, newPlaylist]);
    setPlaylistName('');
    setPlaylistUrl('');
  };

  const handleCheckboxChange = async (index) => {
    const updatedPlaylists = playlists.map((playlist, i) => ({
      ...playlist,
      isSelected: i === index,
    }));
    setPlaylists(updatedPlaylists);
    setSelectedPlaylist(updatedPlaylists[index]);
    
    const selected = updatedPlaylists[index];
    if (selected && selected.url) {
      try {
        await clearChannelsFromDB();  // Clear existing channels

        const response = await axios.get(selected.url);
        const data = response.data;
        const result = parse(data);

        const channels = categorizeChannels(result.items);
        
        // Flattening the channels object to store all channels in the DB with group information
        const allChannels = [
          ...channels.live.map(channel => ({ ...channel, group: 'live' })),
          ...channels.series.map(channel => ({ ...channel, group: 'series' })),
          ...channels.movie.map(channel => ({ ...channel, group: 'movie' })),
        ];
        await addChannelsToDB(allChannels);

        await updatePlaylistInDB(selected.id, { ...selected, isSelected: true });

        console.log('Fetched and stored channels:', channels);
        console.log('Live channels:', channels.live);
        console.log('Series:', channels.series);
        console.log('Movies:', channels.movie);
      } catch (error) {
        console.error('Error fetching playlist:', error);
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
    return { live, series, movie };
  };

  const handleDelete = async (id) => {
    await deletePlaylistFromDB(id);
    setPlaylists(playlists.filter((playlist) => playlist.id !== id));
  };

  const handleEdit = (index) => {
    const playlist = playlists[index];
    setPlaylistName(playlist.name);
    setPlaylistUrl(playlist.url);
    setSelectedPlaylist(index);
  };

  return (
    <div>
      <div style={{ display: 'flex', margin: '20px' }}>
        <TextField
          label="Playlist Name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <TextField
          label="Playlist URL"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <IconButton color="primary" onClick={addPlaylist}>
          <AddIcon />
        </IconButton>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Playlist Name</TableCell>
              <TableCell>Playlist URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playlists.map((playlist, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox
                    checked={playlist.isSelected}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </TableCell>
                <TableCell>{playlist.name}</TableCell>
                <TableCell>{playlist.url}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(playlist.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ManagePlaylists;