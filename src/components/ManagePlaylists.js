import React, { useState } from 'react';
import { usePlaylistContext } from '../context/PlaylistContext';
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { v4 as uuidv4 } from 'uuid';

const ManagePlaylists = () => {
  const { playlists, addPlaylist, deletePlaylist } = usePlaylistContext();
  const [playlistName, setPlaylistName] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');

  const handleAddPlaylist = () => {
    const newPlaylist = {
      id: uuidv4(),
      name: playlistName,
      url: playlistUrl
    };
    addPlaylist(newPlaylist);
    setPlaylistName('');
    setPlaylistUrl('');
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Playlist Name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Playlist URL"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button fullWidth onClick={handleAddPlaylist} variant="contained" color="primary">
            Add Playlist
          </Button>
        </Grid>
      </Grid>
      <List sx={{ marginTop: '20px' }}>
        {playlists.map((playlist) => (
          <ListItem key={playlist.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={playlist.name} />
            <Box>
              <IconButton onClick={() => deletePlaylist(playlist.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton>
                <EditIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ManagePlaylists;