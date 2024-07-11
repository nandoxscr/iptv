// src/components/ManagePlaylists.js

import React, { useState, useEffect } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { addPlaylistToDB, getPlaylistsFromDB, deletePlaylistFromDB, updatePlaylistInDB } from '../services/db';

function ManagePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Fetch playlists from the database on component mount
  useEffect(() => {
    const fetchPlaylists = async () => {
      const dbPlaylists = await getPlaylistsFromDB();
      setPlaylists(dbPlaylists);
      const selected = dbPlaylists.find(p => p.isSelected);
      if (selected) {
        setSelectedPlaylist(dbPlaylists.indexOf(selected));
      }
    };
    fetchPlaylists();
  }, []);

  // Add a new playlist to the database and update state
  const addPlaylist = async () => {
    const newPlaylist = { name: playlistName, url: playlistUrl, isSelected: false };
    const id = await addPlaylistToDB(newPlaylist);
    newPlaylist.id = id;  // Ensure the new playlist has an id
    setPlaylists([...playlists, newPlaylist]);
    setPlaylistName('');
    setPlaylistUrl('');
  };

  // Handle checkbox change to select a playlist
  const handleCheckboxChange = async (index) => {
    const updatedPlaylists = playlists.map((playlist, i) => ({
      ...playlist,
      isSelected: i === index,
    }));
    setPlaylists(updatedPlaylists);
    setSelectedPlaylist(index);
    await Promise.all(updatedPlaylists.map(p => updatePlaylistInDB(p.id, p)));
  };

  // Save the selected playlist to the database and confirm
  const saveToDatabase = async () => {
    if (selectedPlaylist !== null) {
      const selected = playlists[selectedPlaylist];
      try {
        await updatePlaylistInDB(selected.id, selected);
        console.log('Playlist saved successfully');
        const dbPlaylists = await getPlaylistsFromDB();
        const updatedPlaylist = dbPlaylists.find(p => p.id === selected.id);
        console.log('Updated playlist from DB:', updatedPlaylist);
      } catch (error) {
        console.error('Error saving playlist:', error);
      }
    }
  };

  // Delete a playlist from the database and update state
  const handleDelete = async (id) => {
    await deletePlaylistFromDB(id);
    setPlaylists(playlists.filter((playlist) => playlist.id !== id));
  };

  // Edit a playlist by populating input fields and selecting it
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
        <IconButton color="secondary" onClick={saveToDatabase}>
          <SaveIcon />
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
                    checked={selectedPlaylist === index}
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