import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPlaylistsFromDB, addPlaylistToDB, deletePlaylistFromDB, updatePlaylistInDB } from '../utils/db';

const PlaylistContext = createContext();

export const usePlaylistContext = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const loadPlaylists = async () => {
      const playlistsFromDB = await getPlaylistsFromDB();
      setPlaylists(playlistsFromDB);
    };
    loadPlaylists();
  }, []);

  const addPlaylist = async (playlist) => {
    setPlaylists([...playlists, playlist]);
    await addPlaylistToDB(playlist);
  };

  const deletePlaylist = async (id) => {
    setPlaylists(playlists.filter((playlist) => playlist.id !== id));
    await deletePlaylistFromDB(id);
  };

  const updatePlaylist = async (id, updatedPlaylist) => {
    setPlaylists(playlists.map((playlist) => (playlist.id === id ? updatedPlaylist : playlist)));
    await updatePlaylistInDB(id, updatedPlaylist);
  };

  return (
    <PlaylistContext.Provider value={{ playlists, addPlaylist, deletePlaylist, updatePlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};