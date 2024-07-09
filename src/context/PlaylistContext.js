import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getPlaylistsFromDB, addPlaylistToDB, deletePlaylistFromDB, updatePlaylistInDB } from '../utils/db';

const PlaylistContext = createContext();

export const usePlaylistContext = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [activeChannelIndex, setActiveChannelIndex] = useState(0);

  useEffect(() => {
    const loadPlaylists = async () => {
      const playlistsFromDB = await getPlaylistsFromDB();
      setPlaylists(playlistsFromDB);
    };
    loadPlaylists();
  }, []);

  const addPlaylist = async (playlist) => {
    const newPlaylist = { ...playlist, id: uuidv4() };
    setPlaylists([...playlists, newPlaylist]);
    await addPlaylistToDB(newPlaylist);
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
    <PlaylistContext.Provider value={{ playlists, activeChannelIndex, setActiveChannelIndex, addPlaylist, deletePlaylist, updatePlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};