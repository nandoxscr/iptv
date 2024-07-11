import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPlaylistsFromDB } from '../utils/db';

const PlaylistContext = createContext();

export const usePlaylistContext = () => useContext(PlaylistContext);

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const loadPlaylists = async () => {
      const playlistsFromDB = await getPlaylistsFromDB();
      setPlaylists(playlistsFromDB);
      console.log('Loaded playlists:', playlistsFromDB);
    };
    loadPlaylists();
  }, []);

  return (
    <PlaylistContext.Provider value={{ playlists }}>
      {children}
    </PlaylistContext.Provider>
  );
};