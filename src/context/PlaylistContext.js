// src/context/PlaylistContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPlaylistsFromDB } from '../services/db';

const PlaylistContext = createContext();

export const usePlaylistContext = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loadedPlaylists, setLoadedPlaylists] = useState(false);

  useEffect(() => {
    const loadPlaylists = async () => {
      const playlistsFromDB = await getPlaylistsFromDB();
      setPlaylists(playlistsFromDB);
      setLoadedPlaylists(true);
      console.log('Loaded playlists:', playlistsFromDB);
    };
    loadPlaylists();
  }, []);

  return (
    <PlaylistContext.Provider value={{ playlists, loadedPlaylists }}>
      {children}
    </PlaylistContext.Provider>
  );
};