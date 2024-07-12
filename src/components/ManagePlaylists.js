import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Checkbox, CircularProgress, Snackbar, Alert } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { addPlaylistToDB, getPlaylistsFromDB, deletePlaylistFromDB, updatePlaylistInDB, addChannelsToDB, clearChannelsFromDB } from '../services/db';
import axios from 'axios';
import { parse } from 'iptv-playlist-parser';

function ManagePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchPlaylists = async () => {
      const dbPlaylists = await getPlaylistsFromDB();
      setPlaylists(dbPlaylists);

      const selected = dbPlaylists.find(playlist => playlist.isSelected);
      if (selected) {
        setSelectedPlaylist(selected);
      }
    };
    fetchPlaylists();
  }, []);

  const addPlaylist = async () => {
    const newPlaylist = { name: playlistName, url: playlistUrl, isSelected: false };
    await addPlaylistToDB(newPlaylist);
    const dbPlaylists = await getPlaylistsFromDB(); // Fetch updated playlists
    setPlaylists(dbPlaylists);
    setPlaylistName('');
    setPlaylistUrl('');
  };

  const handleCheckboxChange = async (index) => {
    const selectedPlaylistId = playlists[index].id;

    // Set all playlists to isSelected: false except the one selected
    const updatedPlaylists = playlists.map((playlist, i) => ({
      ...playlist,
      isSelected: i === index ? !playlist.isSelected : false,
    }));

    setPlaylists(updatedPlaylists);

    // Update each playlist in the database
    for (const playlist of updatedPlaylists) {
      await updatePlaylistInDB(playlist.id, playlist);
    }

    const selected = updatedPlaylists.find((playlist) => playlist.id === selectedPlaylistId && playlist.isSelected) || null;
    setSelectedPlaylist(selected);
  };

  const handleSave = async () => {
    if (!selectedPlaylist || !selectedPlaylist.url) return;

    setIsLoading(true);

    try {
      await clearChannelsFromDB();  // Clear existing channels

      const response = await axios.get(selectedPlaylist.url);
      const data = response.data;
      const result = parse(data);

      const channels = categorizeChannels(result.items);

      const allChannels = [
        ...channels.live.map(channel => ({ ...channel, group: 'live' })),
        ...channels.series.map(channel => ({ ...channel, group: 'series' })),
        ...channels.movie.map(channel => ({ ...channel, group: 'movie' })),
      ];
      await addChannelsToDB(allChannels);

      console.log('Selected Playlist ID:', selectedPlaylist.id);  // Add logging for debugging
      await updatePlaylistInDB(selectedPlaylist.id, { ...selectedPlaylist, isSelected: true });

      setNotification({
        open: true,
        message: `Loaded ${channels.live.length} live channels, ${channels.series.length} series, ${channels.movie.length} movies.`,
        severity: 'success',
      });
    } catch (error) {
      setNotification({
        open: true,
        message: 'Error fetching playlist',
        severity: 'error',
      });
      console.error('Error fetching playlist:', error);
    } finally {
      setIsLoading(false);
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
    const dbPlaylists = await getPlaylistsFromDB(); // Fetch updated playlists
    setPlaylists(dbPlaylists);
  };

  const handleEdit = (index) => {
    const playlist = playlists[index];
    setPlaylistName(playlist.name);
    setPlaylistUrl(playlist.url);
    setSelectedPlaylist(playlist);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
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
        <IconButton color="primary" onClick={handleSave}>
          <SaveIcon />
        </IconButton>
      </div>
      {isLoading && <CircularProgress />}
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
              <TableRow key={playlist.id}>
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
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ManagePlaylists;