import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ManagePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const addPlaylist = () => {
    setPlaylists([...playlists, { name: playlistName, url: playlistUrl }]);
    setPlaylistName('');
    setPlaylistUrl('');
  };

  const handleCheckboxChange = (index) => {
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
        <Button variant="contained" color="primary" onClick={addPlaylist}>
          Add Playlist
        </Button>
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
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
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