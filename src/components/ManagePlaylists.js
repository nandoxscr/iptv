import React, { useState } from 'react';
import { usePlaylistContext } from '../context/PlaylistContext';
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid to generate unique ids

const ManagePlaylists = () => {
  const { playlists, addPlaylist, deletePlaylist } = usePlaylistContext();
  const [playlistName, setPlaylistName] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');

  const handleAddPlaylist = () => {
    const newPlaylist = {
      id: uuidv4(), // Generate a unique id for each playlist
      name: playlistName,
      url: playlistUrl
    };
    addPlaylist(newPlaylist);
    setPlaylistName('');
    setPlaylistUrl('');
  };

  return (
    <Box>
      <TextField
        label="Playlist Name"
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />
      <TextField
        label="Playlist URL"
        value={playlistUrl}
        onChange={(e) => setPlaylistUrl(e.target.value)}
      />
      <Button onClick={handleAddPlaylist} variant="contained" color="primary">
        Add Playlist
      </Button>
      <List>
        {playlists.map((playlist) => (
          <ListItem key={playlist.id}>
            <ListItemText primary={playlist.name} />
            <IconButton onClick={() => deletePlaylist(playlist.id)}>
              <DeleteIcon />
            </IconButton>
            <IconButton>
              <EditIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ManagePlaylists;