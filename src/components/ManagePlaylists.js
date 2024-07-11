import React, { useState, useEffect } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Checkbox } from '@mui/material';
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

  useEffect(() => {
    const fetchPlaylists = async () => {
      const dbPlaylists = await getPlaylistsFromDB();
      setPlaylists(dbPlaylists);
    };
    fetchPlaylists();
  }, []);

  const addPlaylist = async () => {
    const newPlaylist = { name: playlistName, url: playlistUrl };
    await addPlaylistToDB(newPlaylist);
    setPlaylists([...playlists, newPlaylist]);
    setPlaylistName('');
    setPlaylistUrl('');
  };

  const handleCheckboxChange = (index) => {
    setSelectedPlaylist(index);
  };

  const saveToDatabase = async () => {
    if (selectedPlaylist !== null) {
      const selected = playlists[selectedPlaylist];
      try {
        await updatePlaylistInDB(selected.id, selected); // Using updatePlaylistInDB from db.js
        console.log('Playlist saved successfully');
      } catch (error) {
        console.error('Error saving playlist:', error);
      }
    }
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