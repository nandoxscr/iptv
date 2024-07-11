import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

function ManagePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');

  const addPlaylist = () => {
    setPlaylists([...playlists, { name: playlistName, url: playlistUrl }]);
    setPlaylistName('');
    setPlaylistUrl('');
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
        <Button variant="contained" color="primary" onClick={addPlaylist}>
          Add Playlist
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Playlist Name</TableCell>
              <TableCell>Playlist URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {playlists.map((playlist, index) => (
              <TableRow key={index}>
                <TableCell>{playlist.name}</TableCell>
                <TableCell>{playlist.url}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary">
                    Edit
                  </Button>
                  <Button variant="contained" color="error">
                    Delete
                  </Button>
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